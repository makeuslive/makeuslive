import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { buildDynamicFormSchema, type FormSubmission, type Form, type FormField } from '@/lib/form-schema'
import { getFormSubmissionEmailTemplate } from '@/lib/form-email-templates'
import { ObjectId } from 'mongodb'
import nodemailer from 'nodemailer'

interface RouteParams {
  params: Promise<{ id: string }>
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB per file
const MAX_TOTAL_SIZE = 25 * 1024 * 1024 // 25MB total
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.zip', '.rar', '.jpg', '.jpeg', '.png', '.gif']

/**
 * GET /api/forms/[id]/submissions - List submissions for a form (admin only)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const formsCollection = await getCollection('forms')

    // Find the form
    let form = null
    if (ObjectId.isValid(id)) {
      form = await formsCollection.findOne({ _id: new ObjectId(id) })
    }
    if (!form) {
      form = await formsCollection.findOne({ slug: id })
    }

    if (!form) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Get query params for pagination
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    // Fetch submissions
    const submissionsCollection = await getCollection('form_submissions')
    const [submissions, total] = await Promise.all([
      submissionsCollection
        .find({ formId: form._id })
        .sort({ 'metadata.submittedAt': -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      submissionsCollection.countDocuments({ formId: form._id }),
    ])

    return NextResponse.json({
      success: true,
      submissions: submissions.map(s => ({
        ...s,
        _id: s._id.toString(),
        formId: s.formId.toString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/forms/[id]/submissions - Submit form response (public)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const formsCollection = await getCollection('forms')

    // Find the form
    let form: Form | null = null
    if (ObjectId.isValid(id)) {
      form = await formsCollection.findOne({ _id: new ObjectId(id) }) as Form | null
    }
    if (!form) {
      form = await formsCollection.findOne({ slug: id }) as Form | null
    }

    if (!form) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Check if form is active
    if (!form.settings?.isActive) {
      return NextResponse.json(
        { success: false, error: 'This form is no longer accepting responses' },
        { status: 403 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const submissionData: Record<string, unknown> = {}
    const files: FormSubmission['files'] = []

    let totalFileSize = 0

    // Process each field
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Handle file upload
        if (value.size === 0) continue

        if (value.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { success: false, error: `File ${value.name} exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
            { status: 400 }
          )
        }

        totalFileSize += value.size
        if (totalFileSize > MAX_TOTAL_SIZE) {
          return NextResponse.json(
            { success: false, error: `Total file size exceeds ${MAX_TOTAL_SIZE / 1024 / 1024}MB limit` },
            { status: 400 }
          )
        }

        const ext = '.' + value.name.split('.').pop()?.toLowerCase()
        if (!ALLOWED_FILE_TYPES.includes(ext)) {
          return NextResponse.json(
            { success: false, error: `File type ${ext} is not allowed` },
            { status: 400 }
          )
        }

        // Convert to base64
        const arrayBuffer = await value.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')

        files.push({
          fieldId: key,
          filename: value.name,
          contentType: value.type,
          size: value.size,
          data: base64,
        })
      } else {
        // Handle regular field
        // Check if it's a multi-value field (checkbox)
        const existingValue = submissionData[key]
        if (existingValue !== undefined) {
          if (Array.isArray(existingValue)) {
            existingValue.push(value)
          } else {
            submissionData[key] = [existingValue, value]
          }
        } else {
          submissionData[key] = value
        }
      }
    }

    // Validate submission data against form schema
    const dynamicSchema = buildDynamicFormSchema(form.fields as FormField[])
    const validation = dynamicSchema.safeParse(submissionData)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.errors,
        },
        { status: 400 }
      )
    }

    // Create submission document
    const submission: Omit<FormSubmission, '_id'> = {
      formId: form._id as ObjectId,
      formSlug: form.slug,
      data: validation.data,
      files: files.length > 0 ? files : undefined,
      metadata: {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        submittedAt: new Date(),
      },
    }

    // Save to database
    const submissionsCollection = await getCollection('form_submissions')
    const result = await submissionsCollection.insertOne(submission)

    if (!result.acknowledged) {
      return NextResponse.json(
        { success: false, error: 'Failed to save submission' },
        { status: 500 }
      )
    }

    // Send email notifications (fire and forget)
    if (form.settings?.notifyEmails && form.settings.notifyEmails.length > 0) {
      void sendNotificationEmails(form, submission)
    }

    return NextResponse.json({
      success: true,
      message: form.settings?.successMessage || 'Thank you! Your response has been recorded.',
      redirectUrl: form.settings?.redirectUrl || undefined,
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}

/**
 * Send notification emails to admins
 */
async function sendNotificationEmails(form: Form, submission: Omit<FormSubmission, '_id'>) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured - skipping email sending')
    return
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    })

    const emailHtml = getFormSubmissionEmailTemplate({
      formTitle: form.title,
      formSlug: form.slug,
      submissionData: submission.data,
      submittedAt: submission.metadata.submittedAt.toLocaleString(),
      ip: submission.metadata.ip,
    })

    // Prepare file attachments
    const mailAttachments = submission.files?.map(file => ({
      filename: file.filename,
      content: Buffer.from(file.data, 'base64'),
      contentType: file.contentType,
    })) || []

    const defaultFrom = process.env.SMTP_FROM || '"MakeUsLive" <noreply@makeuslive.com>'

    // Send to all notify emails
    await Promise.allSettled(
      form.settings.notifyEmails.map(email =>
        transporter.sendMail({
          from: defaultFrom,
          to: email,
          subject: `New Submission: ${form.title}`,
          html: emailHtml,
          attachments: mailAttachments,
        })
      )
    )

    console.log('Form notification emails sent successfully')
  } catch (error) {
    console.error('Failed to send notification emails:', error)
  }
}

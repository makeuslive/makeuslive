import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { contactFormSchema } from '@/lib/validations'
import nodemailer from 'nodemailer'
import { getAdminEmailTemplate, getUserConfirmationEmailTemplate } from '@/lib/email-templates'

interface ContactSubmission {
  name: string
  email: string
  website?: string
  phone?: string
  message: string
  attachments: {
    filename: string
    contentType: string
    size: number
    data: string // Base64 encoded file data
  }[]
  agreedToTerms: boolean
  pillar?: string // Pillar routing tag (services, content, system)
  submittedAt: Date
  ipAddress?: string
  userAgent?: string
}

const MAX_TOTAL_ATTACHMENT_SIZE = 12 * 1024 * 1024 // 12MB total limit

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const website = formData.get('website') as string
    const phone = formData.get('phone') as string
    const message = formData.get('message') as string
    const agreedToTerms = formData.get('agreedToTerms') === 'true'
    const pillar = (formData.get('pillar') as string) || 'system'

    // Validate form data
    const validationResult = contactFormSchema.safeParse({
      name,
      email,
      website: website || undefined,
      phone: phone || undefined,
      message,
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    // Process file attachments
    const attachments: ContactSubmission['attachments'] = []
    const files = formData.getAll('attachments') as File[]
    
    const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0)
    
    if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Total attachment size exceeds the limit. Please upload less than ${(MAX_TOTAL_ATTACHMENT_SIZE / 1024 / 1024).toFixed(1)}MB total.` 
        },
        { status: 400 }
      )
    }

    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10)
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar').split(',')

    for (const file of files) {
      if (file.size === 0) continue

      if (file.size > maxFileSize) {
        return NextResponse.json({ success: false, error: `File ${file.name} exceeds maximum size` }, { status: 400 })
      }

      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!allowedTypes.includes(fileExtension)) {
        return NextResponse.json({ success: false, error: `File type ${fileExtension} is not allowed.` }, { status: 400 })
      }

      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')

      attachments.push({
        filename: file.name,
        contentType: file.type,
        size: file.size,
        data: base64,
      })
    }

    // Prepare submission document
    const submission: ContactSubmission = {
      name,
      email,
      website: website || undefined,
      phone: phone || undefined,
      message,
      attachments,
      agreedToTerms,
      pillar,
      submittedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    }

    // 1. Save to MongoDB (Critical Path - Blocking)
    let dbSaved = false
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI not configured')
      }
      const collection = await getCollection('contact_submissions')
      const result = await collection.insertOne(submission)
      dbSaved = result.acknowledged
    } catch (error) {
      console.error('Database save failed:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save submission. Please try again.' },
        { status: 500 }
      )
    }

    // 2. Schedule Background Tasks (Email & GA) - Fire and forget (non-blocking)
    // Using void to explicitly ignore the promise - these run in background
    void (async () => {
      try {
        // Send Emails
        await sendEmails(submission, dbSaved)
        
        // Track GA
        const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID
        const GA_API_SECRET = process.env.GA_API_SECRET
        if (GA_MEASUREMENT_ID && GA_API_SECRET) {
          await trackConversion(GA_MEASUREMENT_ID, GA_API_SECRET)
        }
      } catch (error) {
        console.error('Background task error:', error)
      }
    })()

    // 3. Return Success Immediately
    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received.',
    })

  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your request.' },
      { status: 500 }
    )
  }
}

async function sendEmails(submission: ContactSubmission, dbSaved: boolean) {
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

    // Skip verify() as it causes significant delay

    const mailAttachments = submission.attachments.map(att => ({
        filename: att.filename,
        content: Buffer.from(att.data, 'base64'),
        contentType: att.contentType,
    }))

    const defaultFrom = process.env.SMTP_FROM || '"MakeUsLive" <noreply@makeuslive.com>'

    const emailPromises = [
        // Admin Email
        transporter.sendMail({
            from: defaultFrom,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            replyTo: submission.email,
            subject: `New Inquiry: ${submission.name}`,
            html: getAdminEmailTemplate({
                name: submission.name,
                email: submission.email,
                phone: submission.phone,
                website: submission.website,
                message: submission.message,
                ip: submission.ipAddress || 'unknown',
                pillar: submission.pillar || 'general',
                dbSaved: dbSaved,
            }),
            attachments: mailAttachments,
        }),
        // User Confirmation
        transporter.sendMail({
            from: defaultFrom,
            to: submission.email,
            subject: `We've received your message - MakeUsLive`,
            html: getUserConfirmationEmailTemplate({
                name: submission.name,
                message: submission.message
            }),
        })
    ]

    await Promise.allSettled(emailPromises)
    console.log('Background emails processed')
  } catch (error) {
    console.error('Background email sending failed:', error)
  }
}

async function trackConversion(measurementId: string, apiSecret: string) {
    try {
        const clientId = 'backend-' + Math.random().toString(36).substring(7)
        await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
            method: 'POST',
            body: JSON.stringify({
                client_id: clientId,
                events: [{
                    name: 'generate_lead',
                    params: {
                        source: 'contact_form',
                        engagement_time_msec: '100',
                    }
                }]
            })
        })
    } catch (error) {
        console.error('GA event tracking failed:', error)
    }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Contact API is running. Use POST to submit a contact form.' },
    { status: 200 }
  )
}

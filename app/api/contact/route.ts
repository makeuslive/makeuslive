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
  submittedAt: Date
  ipAddress?: string
  userAgent?: string
}

const MAX_TOTAL_ATTACHMENT_SIZE = 12 * 1024 * 1024 // 12MB total limit (safe for 16MB Mongo doc)

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
    
    // Check total size to prevent MongoDB document size limit errors
    // MongoDB limit is 16MB. Base64 encoding adds ~33% overhead.
    // 12MB binary ~= 16MB base64. We use 12MB as a safe upper bound.
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

    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) // 10MB individual default
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar').split(',')

    for (const file of files) {
      if (file.size === 0) continue

      // Validate individual file size
      if (file.size > maxFileSize) {
        return NextResponse.json(
          { 
            success: false, 
            error: `File ${file.name} exceeds maximum size of ${maxFileSize / 1024 / 1024}MB` 
          },
          { status: 400 }
        )
      }

      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!allowedTypes.includes(fileExtension)) {
        return NextResponse.json(
          { 
            success: false, 
            error: `File type ${fileExtension} is not allowed.` 
          },
          { status: 400 }
        )
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
      email, // This is the user's email
      website: website || undefined,
      phone: phone || undefined,
      message,
      attachments,
      agreedToTerms,
      submittedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    }

    // 1. Save to MongoDB
    try {
      const collection = await getCollection('contact_submissions')
      const result = await collection.insertOne(submission)

      if (!result.acknowledged) {
        throw new Error('Failed to save submission to database')
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      // We continue to try sending email even if DB fails, or throw? 
      // safer to throw as we want to ensure data persistence
      throw new Error('Failed to save submission. Please try again later.')
    }

    // 2. Send Email Notifications (if configured)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          // GoDaddy/Outlook specific settings to prevent connection issues
          tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false, // Helps with some self-signed cert issues or strict firewalls
          },
        })

        // Verify connection configuration
        try {
          await transporter.verify()
          console.log('SMTP Connection established successfully')
        } catch (verifyError) {
          console.error('SMTP Connection Failed:', verifyError)
          // We don't throw here to ensure the DB save is still acknowledged
          // But we return this info allows debugging
        }

        // Format attachments for Nodemailer
        const mailAttachments = attachments.map(att => ({
          filename: att.filename,
          content: Buffer.from(att.data, 'base64'),
          contentType: att.contentType,
        }))

        const defaultFrom = process.env.SMTP_FROM || '"MakeUsLive" <noreply@makeuslive.com>'

        // Prepare email promises
        const emailPromises = []

        // 1. Email to Admin
        emailPromises.push(
          transporter.sendMail({
            from: defaultFrom,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER, // Send to admin
            replyTo: email, // Reply to the user
            subject: `New Inquiry: ${name}`,
            html: getAdminEmailTemplate({
              name,
              email,
              phone: phone || undefined,
              website: website || undefined,
              message,
              ip: submission.ipAddress || 'unknown'
            }),
            attachments: mailAttachments,
          })
        )

        // 2. Confirmation Email to User
        emailPromises.push(
          transporter.sendMail({
            from: defaultFrom,
            to: email, // Send to the user who submitted the form
            subject: `We've received your message - MakeUsLive`,
            html: getUserConfirmationEmailTemplate({
              name,
              message
            }),
          })
        )

        // Send all emails
        await Promise.allSettled(emailPromises)
        
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // We don't fail the request if email sending fails, as long as it's saved in DB
      }
    }

    // 3. Track Conversion in Google Analytics (Server-Side)
    // This ensures reliable tracking even if client-side scripts are blocked
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID
    const GA_API_SECRET = process.env.GA_API_SECRET

    if (GA_MEASUREMENT_ID && GA_API_SECRET) {
      try {
        // Generate a pseudo-random client ID if one wasn't provided in the request
        // In a real app, you might pass the client_id from the frontend cookie (_ga)
        const clientId = 'backend-' + Math.random().toString(36).substring(7)
        
        await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`, {
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
        console.log('Main GA Event Sent')
      } catch (gaError) {
        console.error('Failed to send GA event:', gaError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received.',
    })

  } catch (error) {
    console.error('Contact form submission error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred while processing your request. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Contact API is running. Use POST to submit a contact form.' },
    { status: 200 }
  )
}

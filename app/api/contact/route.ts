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
    const pillar = (formData.get('pillar') as string) || 'system' // Pillar routing tag

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
      pillar, // Pillar routing tag for CRM
      submittedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    }

    // 1. Save to MongoDB (non-blocking - we'll continue even if this fails)
    let dbSaved = false
    let dbError: Error | null = null
    
    try {
      // Check if MongoDB URI is configured
      if (!process.env.MONGODB_URI) {
        console.warn('MONGODB_URI environment variable is not set - skipping database save')
        dbError = new Error('MONGODB_URI not configured')
      } else {
        const collection = await getCollection('contact_submissions')
        const result = await collection.insertOne(submission)

        if (result.acknowledged) {
          dbSaved = true
          console.log('Contact submission saved to database successfully')
        } else {
          dbError = new Error('Database insert not acknowledged')
          console.warn('Database insert not acknowledged')
        }
      }
    } catch (error) {
      dbError = error instanceof Error ? error : new Error('Unknown database error')
      console.error('Database connection error:', {
        message: dbError.message,
        hasMongoUri: !!process.env.MONGODB_URI,
        errorType: dbError.constructor.name,
        stack: dbError.stack,
      })
      
      // Log but don't throw - we'll continue with email sending
      // This ensures the form submission doesn't fail completely if DB is down
    }

    // 2. Send Email Notifications (if configured)
    let emailSent = false
    let emailError: Error | null = null
    
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

        // Verify connection configuration (non-blocking)
        try {
          await transporter.verify()
          console.log('SMTP Connection established successfully')
        } catch (verifyError) {
          console.warn('SMTP Connection verification failed (continuing anyway):', verifyError)
          // Continue anyway - some SMTP servers don't support verify
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
              ip: submission.ipAddress || 'unknown',
              pillar: pillar || 'general',
              dbSaved: dbSaved, // Include DB status in email
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
        const results = await Promise.allSettled(emailPromises)
        const successCount = results.filter(r => r.status === 'fulfilled').length
        
        if (successCount > 0) {
          emailSent = true
          console.log(`Successfully sent ${successCount} of ${emailPromises.length} emails`)
        } else {
          emailError = new Error('All email sends failed')
          console.error('All email sends failed:', results.map(r => r.status === 'rejected' ? r.reason : null))
        }
        
      } catch (error) {
        emailError = error instanceof Error ? error : new Error('Unknown email error')
        console.error('Failed to send email notification:', emailError)
      }
    } else {
      console.warn('SMTP not configured - skipping email sending')
    }
    
    // 3. Determine response based on what succeeded
    // If either DB or email succeeded, return success
    // If both failed, return error
    if (!dbSaved && !emailSent) {
      // Both failed - return error
      const errorDetails = []
      if (dbError) errorDetails.push(`Database: ${dbError.message}`)
      if (emailError) errorDetails.push(`Email: ${emailError.message}`)
      
      console.error('Contact form submission failed completely:', {
        dbError: dbError?.message,
        emailError: emailError?.message,
      })
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unable to process your submission. Please try again or contact us directly at hello@makeuslive.com',
          details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
        },
        { status: 500 }
      )
    }
    
    // At least one succeeded - return success with warning if needed
    const warnings = []
    if (!dbSaved) warnings.push('Your submission was received but could not be saved to our database. We have your email and will respond.')
    if (!emailSent) warnings.push('Your submission was saved but confirmation emails could not be sent.')

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
      warnings: warnings.length > 0 ? warnings : undefined,
    })

  } catch (error) {
    // Enhanced error logging for debugging
    console.error('Contact form submission error:', error)
    
    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      })
    }

    // Provide more specific error messages based on error type
    let errorMessage = 'An error occurred while processing your request. Please try again later.'
    
    if (error instanceof Error) {
      // Check for common error types
      if (error.message.includes('MongoDB') || error.message.includes('database') || error.message.includes('connection')) {
        errorMessage = 'Database connection error. Please try again in a moment.'
      } else if (error.message.includes('validation') || error.message.includes('Validation')) {
        errorMessage = error.message
      } else if (error.message.includes('size') || error.message.includes('file')) {
        errorMessage = error.message
      } else {
        // For other errors, use the error message if it's safe to expose
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage 
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

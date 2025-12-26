import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { contactFormSchema } from '@/lib/validations'

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
    
    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) // 10MB default
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar').split(',')

    for (const file of files) {
      if (file.size === 0) continue

      // Validate file size
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
            error: `File type ${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}` 
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
      email,
      website: website || undefined,
      phone: phone || undefined,
      message,
      attachments,
      agreedToTerms,
      submittedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    }

    // Save to MongoDB
    const collection = await getCollection('contact_submissions')
    const result = await collection.insertOne(submission)

    if (!result.acknowledged) {
      throw new Error('Failed to save submission')
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received.',
      submissionId: result.insertedId.toString(),
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

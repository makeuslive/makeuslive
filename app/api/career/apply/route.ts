import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { formatStorageDate } from '@/lib/date-utils'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobId, name, email, phone, coverLetter, resumeUploaded } = body

    // Validate required fields
    if (!jobId || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save application to database
    const collection = await getCollection('career_applications')
    const application = {
      jobId,
      name,
      email,
      phone: phone || undefined,
      coverLetter: coverLetter || undefined,
      resumeUploaded: !!resumeUploaded,
      submittedAt: new Date(),
      timestamp: formatStorageDate(new Date()),
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        undefined,
    }

    await collection.insertOne(application)

    // Send acknowledgment email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@makeuslive.com',
        to: email,
        subject: 'Application Received - MakeUsLive',
        html: `
          <h2>Thank you for your application!</h2>
          <p>We've received your application for the position at MakeUsLive.</p>
          <p>We'll review your application and get back to you soon.</p>
          <p>Submitted at: ${new Date().toLocaleString()}</p>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send acknowledgment email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Career application error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}


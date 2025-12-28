import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { sendEmail } from '@/lib/email'

const COLLECTION_NAME = 'contact_submissions'

// GET - Fetch all contact submissions
export async function GET() {
  try {
    const collection = await getCollection(COLLECTION_NAME)
    const contacts = await collection.find({}).sort({ submittedAt: -1 }).toArray()
    
    const formatted = contacts.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      website: doc.website,
      message: doc.message,
      isRead: doc.isRead || false,
      createdAt: doc.submittedAt || doc.createdAt,
    }))
    
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

// POST - Send reply email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, to, name, subject, message, originalMessage } = body

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Send email using nodemailer
    const result = await sendEmail({
      to,
      subject: `Re: ${subject}`,
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <tr>
            <td align="center" style="padding-bottom: 30px;">
                <h1 style="color: #D4AF37; font-size: 28px; margin: 0; font-weight: bold;">MakeUsLive</h1>
            </td>
        </tr>
        <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a14 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <p style="color: rgba(255, 255, 255, 0.7); font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
                    Hi ${name || 'there'},
                </p>
                <div style="color: rgba(255, 255, 255, 0.7); font-size: 16px; line-height: 1.8; margin: 0 0 30px 0;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                ${originalMessage ? `
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <p style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your original message:</p>
                    <p style="color: rgba(255, 255, 255, 0.5); font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">${originalMessage}</p>
                </div>
                ` : ''}
            </td>
        </tr>
        <tr>
            <td align="center" style="padding-top: 30px;">
                <p style="color: rgba(255, 255, 255, 0.3); font-size: 12px; margin: 0;">
                    Reply to this email or reach us at team@makeuslive.com
                </p>
                <p style="color: rgba(255, 255, 255, 0.3); font-size: 12px; margin: 10px 0 0 0;">
                    © 2025 MakeUsLive • Bhopal, India
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
      `,
    })

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    // Mark as read and store reply
    if (id) {
      const collection = await getCollection(COLLECTION_NAME)
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { isRead: true },
          $push: { replies: { message, sentAt: new Date().toISOString() } as any }
        }
      )
    }

    return NextResponse.json({ message: 'Reply sent successfully' })
  } catch (error) {
    console.error('Error sending reply:', error)
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 })
  }
}

// PUT - Mark as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isRead } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing contact ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isRead } }
    )

    return NextResponse.json({ message: 'Contact updated successfully' })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

// DELETE - Remove contact
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing contact ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    await collection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: 'Contact deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}

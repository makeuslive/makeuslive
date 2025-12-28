import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { sendWelcomeEmail, sendEmail, emailTemplates } from '@/lib/email'

const COLLECTION_NAME = 'newsletter_subscribers'

// GET - Fetch all subscribers (admin)
export async function GET() {
  try {
    const collection = await getCollection(COLLECTION_NAME)
    const subscribers = await collection.find({}).sort({ subscribedAt: -1 }).toArray()
    
    const formatted = subscribers.map(doc => ({
      id: doc._id.toString(),
      email: doc.email,
      subscribedAt: doc.subscribedAt,
      isActive: doc.isActive !== false, // default true
    }))
    
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

// POST - Subscribe to newsletter (public) or broadcast newsletter (admin with action param)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, subject, content } = body

    // Handle broadcast action
    if (action === 'broadcast') {
      if (!subject || !content) {
        return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 })
      }

      // Get all active subscribers
      const collection = await getCollection(COLLECTION_NAME)
      const subscribers = await collection.find({ isActive: { $ne: false } }).toArray()
      const emails = subscribers.map(s => s.email)

      if (emails.length === 0) {
        return NextResponse.json({ error: 'No active subscribers' }, { status: 400 })
      }

      // Create email template
      const template = emailTemplates.newsletter({
        title: subject,
        preheader: content.substring(0, 100),
        body: content.replace(/\n/g, '<br>'),
        ctaText: body.ctaText,
        ctaUrl: body.ctaUrl,
      })

      // Send to all subscribers in batches
      const batchSize = 10
      let sent = 0
      let failed = 0

      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize)
        const promises = batch.map(to => 
          sendEmail({ to, subject: template.subject, html: template.html })
        )
        const results = await Promise.allSettled(promises)
        sent += results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length
        failed += results.filter(r => r.status === 'rejected' || !(r.value as any).success).length
        
        // Small delay between batches
        if (i + batchSize < emails.length) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }

      // Log broadcast in database
      const broadcastCollection = await getCollection('newsletter_broadcasts')
      await broadcastCollection.insertOne({
        subject,
        content,
        ctaText: body.ctaText,
        ctaUrl: body.ctaUrl,
        sentAt: new Date().toISOString(),
        totalRecipients: emails.length,
        sent,
        failed,
      })

      return NextResponse.json({ 
        message: 'Newsletter sent successfully',
        stats: { total: emails.length, sent, failed }
      })
    }

    // Handle regular subscription
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    
    // Check for duplicate
    const existing = await collection.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 })
    }

    await collection.insertOne({
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      isActive: true,
    })

    // Send welcome email (async, don't wait)
    sendWelcomeEmail(email.toLowerCase()).catch(err => console.error('Welcome email failed:', err))

    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 })
  }
}

// DELETE - Remove subscriber (admin)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing subscriber ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    await collection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: 'Subscriber removed successfully' })
  } catch (error) {
    console.error('Error removing subscriber:', error)
    return NextResponse.json({ error: 'Failed to remove subscriber' }, { status: 500 })
  }
}

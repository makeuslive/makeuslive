import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

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

// POST - Subscribe to newsletter (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

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

    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch (error) {
    console.error('Error subscribing:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
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

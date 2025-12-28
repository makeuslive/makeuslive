import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

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

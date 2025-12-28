import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'testimonials'

// GET - Fetch all testimonials
export async function GET() {
  try {
    const collection = await getCollection(COLLECTION_NAME)
    const testimonials = await collection.find({}).sort({ createdAt: -1 }).toArray()
    
    // Convert ObjectId to string for client
    const formatted = testimonials.map(doc => ({
      id: doc._id.toString(),
      author: doc.author,
      role: doc.role,
      company: doc.company,
      quote: doc.quote,
      rating: doc.rating,
      createdAt: doc.createdAt,
    }))
    
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { author, role, company, quote, rating } = body

    if (!author || !role || !quote) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    const result = await collection.insertOne({
      author,
      role,
      company: company || '',
      quote,
      rating: rating || 5,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ 
      id: result.insertedId.toString(),
      message: 'Testimonial created successfully' 
    })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}

// PUT - Update testimonial
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, author, role, company, quote, rating } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing testimonial ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          author, 
          role, 
          company, 
          quote, 
          rating,
          updatedAt: new Date().toISOString() 
        } 
      }
    )

    return NextResponse.json({ message: 'Testimonial updated successfully' })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

// DELETE - Remove testimonial
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing testimonial ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    await collection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}

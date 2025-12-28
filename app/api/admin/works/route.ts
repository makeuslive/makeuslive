import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'works'

// GET - Fetch all works
export async function GET() {
  try {
    const collection = await getCollection(COLLECTION_NAME)
    const works = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray()
    
    const formatted = works.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      category: doc.category,
      description: doc.description,
      image: doc.image,
      stats: doc.stats,
      tags: doc.tags,
      order: doc.order,
      createdAt: doc.createdAt,
    }))
    
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching works:', error)
    return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 })
  }
}

// POST - Create new work
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, category, description, image, stats, tags, order } = body

    if (!title || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    const result = await collection.insertOne({
      title,
      category,
      description: description || '',
      image: image || '',
      stats: stats || null,
      tags: tags || [],
      order: order || 0,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ 
      id: result.insertedId.toString(),
      message: 'Work created successfully' 
    })
  } catch (error) {
    console.error('Error creating work:', error)
    return NextResponse.json({ error: 'Failed to create work' }, { status: 500 })
  }
}

// PUT - Update work
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, category, description, image, stats, tags, order } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing work ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          title, 
          category, 
          description, 
          image, 
          stats, 
          tags, 
          order,
          updatedAt: new Date().toISOString() 
        } 
      }
    )

    return NextResponse.json({ message: 'Work updated successfully' })
  } catch (error) {
    console.error('Error updating work:', error)
    return NextResponse.json({ error: 'Failed to update work' }, { status: 500 })
  }
}

// DELETE - Remove work
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing work ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    await collection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: 'Work deleted successfully' })
  } catch (error) {
    console.error('Error deleting work:', error)
    return NextResponse.json({ error: 'Failed to delete work' }, { status: 500 })
  }
}

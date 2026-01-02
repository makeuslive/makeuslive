import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'jobs'

// GET - Fetch all jobs
export async function GET() {
  try {
    const collection = await getCollection(COLLECTION_NAME)
    const jobs = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray()
    
    const formatted = jobs.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      department: doc.department,
      location: doc.location,
      type: doc.type,
      description: doc.description,
      requirements: doc.requirements || [],
      salaryRange: doc.salaryRange,
      resumeRequired: doc.resumeRequired ?? true,
      portfolioRequired: doc.portfolioRequired ?? false,
      referenceWorkRequired: doc.referenceWorkRequired ?? false,
      status: doc.status || 'draft',
      order: doc.order ?? 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }))
    
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

// POST - Create new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      department, 
      location, 
      type, 
      description, 
      requirements, 
      salaryRange,
      resumeRequired,
      portfolioRequired,
      referenceWorkRequired,
      status,
      order 
    } = body

    if (!title || !department) {
      return NextResponse.json({ error: 'Title and department are required' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    const result = await collection.insertOne({
      title,
      department,
      location: location || 'Remote',
      type: type || 'Full-time',
      description: description || '',
      requirements: requirements || [],
      salaryRange: salaryRange || '',
      resumeRequired: resumeRequired ?? true,
      portfolioRequired: portfolioRequired ?? false,
      referenceWorkRequired: referenceWorkRequired ?? false,
      status: status || 'draft',
      order: order ?? 0,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ 
      id: result.insertedId.toString(),
      message: 'Job created successfully' 
    })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}

// PUT - Update job
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      id, 
      title, 
      department, 
      location, 
      type, 
      description, 
      requirements, 
      salaryRange,
      resumeRequired,
      portfolioRequired,
      referenceWorkRequired,
      status,
      order 
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing job ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          title, 
          department, 
          location, 
          type, 
          description, 
          requirements, 
          salaryRange,
          resumeRequired,
          portfolioRequired,
          referenceWorkRequired,
          status,
          order,
          updatedAt: new Date().toISOString() 
        } 
      }
    )

    return NextResponse.json({ message: 'Job updated successfully' })
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
  }
}

// DELETE - Remove job
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing job ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    await collection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}

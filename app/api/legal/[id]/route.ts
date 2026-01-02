import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET single legal page by ID
export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params
    const collection = await getCollection('legal_pages')
    
    let page
    if (ObjectId.isValid(id)) {
      page = await collection.findOne({ _id: new ObjectId(id) })
    } else {
      // Try to find by slug
      page = await collection.findOne({ slug: id })
    }
    
    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { ...page, id: page._id?.toString() } 
    })
  } catch (error) {
    console.error('Error fetching legal page:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch legal page' }, { status: 500 })
  }
}

// PUT update legal page
export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params
    const body = await request.json()
    const { title, content, effectiveDate, changeLog, metaTitle, metaDescription, status, lastUpdated } = body

    const collection = await getCollection('legal_pages')
    
    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    }

    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (effectiveDate !== undefined) updateData.effectiveDate = effectiveDate
    if (lastUpdated !== undefined) updateData.lastUpdated = lastUpdated
    if (changeLog !== undefined) updateData.changeLog = changeLog
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription
    if (status !== undefined) updateData.status = status

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      data: { ...result, id: result._id?.toString() } 
    })
  } catch (error) {
    console.error('Error updating legal page:', error)
    return NextResponse.json({ success: false, error: 'Failed to update legal page' }, { status: 500 })
  }
}

// DELETE legal page
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params
    const collection = await getCollection('legal_pages')
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Page deleted successfully' })
  } catch (error) {
    console.error('Error deleting legal page:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete legal page' }, { status: 500 })
  }
}

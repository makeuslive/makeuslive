import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export interface LegalPage {
  _id?: ObjectId
  id?: string
  slug: 'privacy-policy' | 'terms-of-service'
  title: string
  content: string // HTML or Markdown content
  effectiveDate: string
  lastUpdated: string
  changeLog: {
    date: string
    description: string
  }[]
  metaTitle: string
  metaDescription: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

// GET all legal pages or filter by slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    const collection = await getCollection('legal_pages')
    
    if (slug) {
      const page = await collection.findOne({ slug, status: 'published' })
      if (!page) {
        return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
      }
      return NextResponse.json({ 
        success: true, 
        data: { ...page, id: page._id?.toString() } 
      })
    }
    
    const pages = await collection.find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ 
      success: true, 
      data: pages.map(p => ({ ...p, id: p._id?.toString() })) 
    })
  } catch (error) {
    console.error('Error fetching legal pages:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch legal pages' }, { status: 500 })
  }
}

// POST create a new legal page
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { slug, title, content, effectiveDate, changeLog, metaTitle, metaDescription, status = 'draft' } = body

    if (!slug || !title || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const collection = await getCollection('legal_pages')
    
    // Check if page with this slug already exists
    const existing = await collection.findOne({ slug })
    if (existing) {
      return NextResponse.json({ success: false, error: 'A page with this slug already exists' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const newPage: Omit<LegalPage, '_id' | 'id'> = {
      slug,
      title,
      content,
      effectiveDate: effectiveDate || now,
      lastUpdated: now,
      changeLog: changeLog || [],
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || '',
      status,
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(newPage)
    
    return NextResponse.json({ 
      success: true, 
      data: { ...newPage, id: result.insertedId.toString() } 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating legal page:', error)
    return NextResponse.json({ success: false, error: 'Failed to create legal page' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'

const COLLECTION_NAME = 'works'

// GET - Fetch all works with CMS fields
export async function GET() {
  try {
    const collection = await getCollection(COLLECTION_NAME)
    const works = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray()
    
    const formatted = works.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug || doc.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      category: doc.category,
      description: doc.description,
      image: doc.image || '',
      
      // Stats
      stats: doc.stats || null,
      
      // Tags and styling
      tags: doc.tags || [],
      gradient: doc.gradient || 'from-gold/20 to-amber-500/10',
      
      // CMS Fields
      featured: doc.featured || false,
      status: doc.status || 'draft',
      order: doc.order || 0,
      
      // Client info
      client: doc.client || '',
      year: doc.year || new Date().getFullYear().toString(),
      
      // Case study content
      challenge: doc.challenge || '',
      solution: doc.solution || '',
      results: doc.results || '',
      testimonial: doc.testimonial || null,
      
      // Links
      liveUrl: doc.liveUrl || '',
      caseStudyUrl: doc.caseStudyUrl || '',
      
      // SEO
      seo: doc.seo || {
        metaTitle: doc.title,
        metaDescription: doc.description,
        noIndex: false,
      },
      
      // Timestamps
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      publishedAt: doc.publishedAt,
    }))
    
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching works:', error)
    return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 })
  }
}

// POST - Create new work/project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, slug, category, description, image, stats,
      tags, gradient, featured, status, order,
      client, year, challenge, solution, results, testimonial,
      liveUrl, caseStudyUrl, seo
    } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    
    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    // Check for duplicate slug
    const existing = await collection.findOne({ slug: finalSlug })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const now = new Date().toISOString()
    
    const result = await collection.insertOne({
      title,
      slug: finalSlug,
      category: category || 'Web Development',
      description: description || '',
      image: image || '',
      
      // Stats
      stats: stats || null,
      
      // Tags and styling
      tags: tags || [],
      gradient: gradient || 'from-gold/20 to-amber-500/10',
      
      // CMS Fields
      featured: featured || false,
      status: status || 'draft',
      order: order || 0,
      
      // Client info
      client: client || '',
      year: year || new Date().getFullYear().toString(),
      
      // Case study content
      challenge: challenge || '',
      solution: solution || '',
      results: results || '',
      testimonial: testimonial || null,
      
      // Links
      liveUrl: liveUrl || '',
      caseStudyUrl: caseStudyUrl || '',
      
      // SEO
      seo: seo || {
        metaTitle: title,
        metaDescription: description || '',
        noIndex: false,
      },
      
      // Timestamps
      createdAt: now,
      updatedAt: now,
      publishedAt: status === 'published' ? now : null,
    })

    // Revalidate the works cache
    revalidateTag('works', 'max')

    return NextResponse.json({ 
      id: result.insertedId.toString(),
      message: 'Work created successfully' 
    })
  } catch (error) {
    console.error('Error creating work:', error)
    return NextResponse.json({ error: 'Failed to create work' }, { status: 500 })
  }
}

// PUT - Update work/project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      id, title, slug, category, description, image, stats,
      tags, gradient, featured, status, order,
      client, year, challenge, solution, results, testimonial,
      liveUrl, caseStudyUrl, seo
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing work ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    
    const updateData: Record<string, unknown> = {
      title,
      slug,
      category,
      description,
      image,
      stats,
      tags,
      gradient,
      featured: featured ?? false,
      status,
      order: order ?? 0,
      client,
      year,
      challenge,
      solution,
      results,
      testimonial,
      liveUrl,
      caseStudyUrl,
      seo,
      updatedAt: new Date().toISOString(),
    }

    // Set publishedAt when changing to published
    if (status === 'published') {
      const existing = await collection.findOne({ _id: new ObjectId(id) })
      if (!existing?.publishedAt) {
        updateData.publishedAt = new Date().toISOString()
      }
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    // Revalidate the works cache
    revalidateTag('works', 'max')

    return NextResponse.json({ message: 'Work updated successfully' })
  } catch (error) {
    console.error('Error updating work:', error)
    return NextResponse.json({ error: 'Failed to update work' }, { status: 500 })
  }
}

// DELETE - Remove work/project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing work ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    await collection.deleteOne({ _id: new ObjectId(id) })

    // Revalidate the works cache
    revalidateTag('works', 'max')

    return NextResponse.json({ message: 'Work deleted successfully' })
  } catch (error) {
    console.error('Error deleting work:', error)
    return NextResponse.json({ error: 'Failed to delete work' }, { status: 500 })
  }
}

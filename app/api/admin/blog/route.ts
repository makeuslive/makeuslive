import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'blog_posts'

// GET - Fetch all blog posts
export async function GET() {
  try {
    const collection = await getCollection(COLLECTION_NAME)
    const posts = await collection.find({}).sort({ createdAt: -1 }).toArray()
    
    const formatted = posts.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      content: doc.content,
      category: doc.category,
      tags: doc.tags,
      featuredImage: doc.featuredImage,
      status: doc.status || 'draft',
      createdAt: doc.createdAt,
      publishedAt: doc.publishedAt,
    }))
    
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, category, tags, featuredImage, status } = body

    if (!title || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    
    // Check for duplicate slug
    const existing = await collection.findOne({ slug })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const result = await collection.insertOne({
      title,
      slug,
      excerpt: excerpt || '',
      content: content || '',
      category: category || 'General',
      tags: tags || [],
      featuredImage: featuredImage || '',
      status: status || 'draft',
      createdAt: new Date().toISOString(),
      publishedAt: status === 'published' ? new Date().toISOString() : null,
    })

    return NextResponse.json({ 
      id: result.insertedId.toString(),
      message: 'Post created successfully' 
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

// PUT - Update blog post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, slug, excerpt, content, category, tags, featuredImage, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    
    const updateData: Record<string, unknown> = {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      featuredImage,
      status,
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

    return NextResponse.json({ message: 'Post updated successfully' })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

// DELETE - Remove blog post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 })
    }

    const collection = await getCollection(COLLECTION_NAME)
    await collection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}

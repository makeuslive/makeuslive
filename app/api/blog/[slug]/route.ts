import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

/**
 * GET /api/blog/[slug]
 * Fetch a single blog post by slug
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      )
    }

    const collection = await getCollection('blog_posts')
    const post = await collection.findOne({ slug })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Only return published posts for public API (unless status query param is provided)
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status')
    
    if (!statusParam && post.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Format the post
    const formatted = {
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags || [],
      featuredImage: post.featuredImage,
      featured: post.featured || false,
      status: post.status,
      date: formatDate(post.publishedAt),
      publishedAt: post.publishedAt,
      readTime: calculateReadTime(post.content),
      gradient: getCategoryGradient(post.category),
      author: post.author || { name: 'MakeUsLive', role: 'Team' },
      seo: post.seo,
      views: post.views || 0,
      likes: post.likes || 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }

    // Optionally increment view count
    await collection.updateOne(
      { slug },
      { $inc: { views: 1 } }
    )

    return NextResponse.json({
      success: true,
      data: formatted,
    })
  } catch (error) {
    console.error('Fetch blog post error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// Helper functions
import { formatDisplayDate } from '@/lib/date-utils'

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return formatDisplayDate(date)
}

function calculateReadTime(content: string): string {
  if (!content) return '1 min'
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min`
}

function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    'AI & Technology': 'from-blue-500/20 to-purple-500/10',
    'Design': 'from-pink-500/20 to-rose-500/10',
    'Development': 'from-green-500/20 to-emerald-500/10',
    'UX Research': 'from-amber-500/20 to-yellow-500/10',
    'Animation': 'from-cyan-500/20 to-teal-500/10',
  }
  return gradients[category] || 'from-gold/20 to-amber-500/10'
}

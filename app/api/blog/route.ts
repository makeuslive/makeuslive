import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

/**
 * GET /api/blog
 * Query parameters:
 * - status: filter by status (published, draft, archived) - defaults to 'published'
 * - category: filter by category (AI & Technology, Design, Development, etc.)
 * - featured: filter featured posts (true/false)
 * - page: page number for pagination (default: 1)
 * - limit: posts per page (default: 9)
 * - search: search in title, excerpt, content
 * - sort: sort field (date, title) - defaults to 'date'
 * - order: sort order (asc, desc) - defaults to 'desc'
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const status = searchParams.get('status') || 'published'
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'date'
    const order = searchParams.get('order') || 'desc'
    
    // Build query filter
    const filter: any = {}
    
    // Status filter
    if (status && status !== 'all') {
      filter.status = status
    }
    
    // Category filter
    if (category && category !== 'All') {
      filter.category = category
    }
    
    // Featured filter
    if (featured !== null && featured !== undefined && featured !== '') {
      filter.featured = featured === 'true'
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ]
    }
    
    const collection = await getCollection('blog_posts')
    
    // Get total count for pagination
    const totalCount = await collection.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / limit)
    const skip = (page - 1) * limit
    
    // Determine sort field
    let sortField: any = { publishedAt: -1 }
    if (sort === 'title') {
      sortField = { title: order === 'asc' ? 1 : -1 }
    } else if (sort === 'date') {
      sortField = { publishedAt: order === 'asc' ? 1 : -1 }
    }
    
    // Fetch posts with pagination
    const posts = await collection
      .find(filter)
      .sort(sortField)
      .skip(skip)
      .limit(limit)
      .toArray()
    
    // Format for frontend
    const formatted = posts.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      content: doc.content,
      category: doc.category,
      tags: doc.tags || [],
      featuredImage: doc.featuredImage,
      featured: doc.featured || false,
      status: doc.status,
      date: formatDate(doc.publishedAt),
      publishedAt: doc.publishedAt,
      readTime: calculateReadTime(doc.content),
      gradient: getCategoryGradient(doc.category),
      author: doc.author || { name: 'MakeUsLive', role: 'Team' },
      seo: doc.seo,
      views: doc.views || 0,
      likes: doc.likes || 0,
    }))
    
    return NextResponse.json({
      success: true,
      data: {
        posts: formatted,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          limit,
        },
      },
    })
  } catch (error) {
    console.error('Fetch blog posts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
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

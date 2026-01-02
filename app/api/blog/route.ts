import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { getBlogPosts } from '@/lib/data/blog'

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
    
    const status = searchParams.get('status') || 'published'
    const category = searchParams.get('category') || undefined
    const featuredParam = searchParams.get('featured')
    const featured = featuredParam !== null ? featuredParam === 'true' : undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const search = searchParams.get('search') || undefined
    const sort = (searchParams.get('sort') as 'date' | 'title') || 'date'
    const order = (searchParams.get('order') as 'asc' | 'desc') || 'desc'
    
    // Use the shared cached function
    const result = await getBlogPosts({
      status,
      category,
      featured,
      page,
      limit,
      search,
      sort,
      order
    })
    
    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Fetch blog posts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}


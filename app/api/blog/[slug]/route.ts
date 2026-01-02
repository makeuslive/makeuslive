import { NextRequest, NextResponse } from 'next/server'
import { getBlogPostBySlug } from '@/lib/data/blog'

export const dynamic = 'force-dynamic'

/**
 * GET /api/blog/[slug]
 * Fetch a single blog post by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      )
    }

    const post = await getBlogPostBySlug(slug)

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

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error('Fetch blog post error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}


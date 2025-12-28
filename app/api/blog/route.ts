import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

// Public API - Get published blog posts
export async function GET() {
  try {
    const collection = await getCollection('blog_posts')
    const posts = await collection
      .find({ status: 'published' })
      .sort({ publishedAt: -1 })
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
      date: formatDate(doc.publishedAt),
      readTime: calculateReadTime(doc.content),
      gradient: getCategoryGradient(doc.category),
    }))
    
    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('Fetch blog posts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// Helper functions
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

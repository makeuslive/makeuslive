import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

/**
 * GET /api/blog/categories
 * Get all blog categories with post counts
 */
export async function GET() {
  try {
    const collection = await getCollection('blog_posts')
    
    // Aggregate to get category counts
    const categoryCounts = await collection
      .aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray()

    const categories = categoryCounts.map(cat => ({
      name: cat._id || 'Uncategorized',
      count: cat.count,
      gradient: getCategoryGradient(cat._id),
    }))

    // Add "All" category with total count
    const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0)
    const allCategories = [
      { name: 'All', count: totalCount, gradient: null },
      ...categories,
    ]

    return NextResponse.json({
      success: true,
      data: allCategories,
    })
  } catch (error) {
    console.error('Fetch categories error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
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

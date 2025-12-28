import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const collection = await getCollection('works')
    const works = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray()
    
    // Format for frontend
    const formatted = works.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      category: doc.category,
      description: doc.description,
      image: doc.image,
      stats: doc.stats,
      tags: doc.tags || [],
      gradient: doc.gradient || 'from-gold/20 to-amber-500/10',
    }))
    
    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('Fetch works error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch works' },
      { status: 500 }
    )
  }
}

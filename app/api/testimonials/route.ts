import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const collection = await getCollection('testimonials')
    const testimonials = await collection.find({}).sort({ createdAt: -1 }).toArray()
    
    // Format for frontend
    const formatted = testimonials.map(doc => ({
      id: doc._id.toString(),
      author: doc.author,
      role: doc.role,
      company: doc.company,
      quote: doc.quote,
      rating: doc.rating || 5,
    }))
    
    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('Fetch testimonials error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const collection = await getCollection('testimonials')
    const testimonials = await collection.find({}).toArray()
    
    return NextResponse.json({ success: true, data: testimonials })
  } catch (error) {
    console.error('Fetch testimonials error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

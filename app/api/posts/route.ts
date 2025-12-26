import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const collection = await getCollection('posts')
    const posts = await collection.find({}).sort({ date: -1 }).toArray()
    
    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    console.error('Fetch posts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

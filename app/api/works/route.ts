import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const collection = await getCollection('works')
    const works = await collection.find({}).toArray()
    
    return NextResponse.json({ success: true, data: works })
  } catch (error) {
    console.error('Fetch works error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch works' },
      { status: 500 }
    )
  }
}

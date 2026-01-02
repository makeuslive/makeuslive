import { NextResponse } from 'next/server'
import { getWorks } from '@/lib/data/work'

// Cache the response for 60 seconds (ISR-like behavior)
export const revalidate = 60
export const dynamic = 'force-dynamic'

export async function GET() {
  const startTime = Date.now()
  
  try {
    const works = await getWorks()
    
    const duration = Date.now() - startTime
    console.log(`Works API: Fetched ${works.length} works in ${duration}ms`)
    
    return NextResponse.json(
      { success: true, data: works },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`Fetch works error (${duration}ms):`, error)
    
    return NextResponse.json(
      { 
        success: true, 
        data: [],
        warning: 'Failed to fetch works'
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  }
}

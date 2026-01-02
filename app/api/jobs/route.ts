import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

// Cache the response for 60 seconds
export const revalidate = 60
export const dynamic = 'force-dynamic'

// Add timeout wrapper
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    ),
  ])
}

export async function GET() {
  const startTime = Date.now()
  
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not configured - returning empty jobs array')
      return NextResponse.json(
        { success: true, data: [] },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          },
        }
      )
    }

    const collection = await withTimeout(getCollection('jobs'), 5000)
    
    // Only fetch published jobs for public API
    const jobs = await withTimeout(
      collection
        .find(
          { status: 'published' },
          {
            projection: {
              _id: 1,
              title: 1,
              department: 1,
              location: 1,
              type: 1,
              description: 1,
              requirements: 1,
              salaryRange: 1,
              resumeRequired: 1,
              portfolioRequired: 1,
              referenceWorkRequired: 1,
              order: 1,
              createdAt: 1,
            },
          }
        )
        .sort({ order: 1, createdAt: -1 })
        .limit(50)
        .toArray(),
      5000
    )
    
    const formatted = jobs.map(doc => ({
      id: doc._id.toString(),
      title: doc.title || '',
      department: doc.department || 'General',
      location: doc.location || 'Remote',
      type: doc.type || 'Full-time',
      description: doc.description || '',
      requirements: doc.requirements || [],
      salaryRange: doc.salaryRange || '',
      resumeRequired: doc.resumeRequired ?? true,
      portfolioRequired: doc.portfolioRequired ?? false,
      referenceWorkRequired: doc.referenceWorkRequired ?? false,
    }))
    
    const duration = Date.now() - startTime
    console.log(`Jobs API: Fetched ${formatted.length} jobs in ${duration}ms`)
    
    return NextResponse.json(
      { success: true, data: formatted },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`Fetch jobs error (${duration}ms):`, error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isTimeout = errorMessage.includes('timed out')
    
    return NextResponse.json(
      { 
        success: true, 
        data: [],
        warning: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      {
        status: isTimeout ? 504 : 200,
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        },
      }
    )
  }
}

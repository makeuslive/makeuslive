import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

// Cache the response for 60 seconds (ISR-like behavior)
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
      console.warn('MONGODB_URI not configured - returning empty works array')
      return NextResponse.json(
        { success: true, data: [] },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          },
        }
      )
    }

    // Use timeout to prevent hanging requests (5 seconds max)
    const collection = await withTimeout(getCollection('works'), 5000)
    
    // Optimize query: only fetch needed fields and limit results
    const works = await withTimeout(
      collection
        .find(
          {},
          {
            projection: {
              _id: 1,
              title: 1,
              category: 1,
              description: 1,
              image: 1,
              stats: 1,
              tags: 1,
              gradient: 1,
              order: 1,
              createdAt: 1,
            },
          }
        )
        .sort({ order: 1, createdAt: -1 })
        .limit(50) // Limit to 50 works max
        .toArray(),
      5000
    )
    
    // Format for frontend (optimized)
    const formatted = works.map(doc => ({
      id: doc._id.toString(),
      title: doc.title || '',
      category: doc.category || 'Uncategorized',
      description: doc.description || '',
      image: doc.image || undefined,
      stats: doc.stats || undefined,
      tags: doc.tags || [],
      gradient: doc.gradient || 'from-gold/20 to-amber-500/10',
    }))
    
    const duration = Date.now() - startTime
    console.log(`Works API: Fetched ${formatted.length} works in ${duration}ms`)
    
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
    console.error(`Fetch works error (${duration}ms):`, error)
    
    // Enhanced error logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isTimeout = errorMessage.includes('timed out')
    
    console.error('Works API error details:', {
      message: errorMessage,
      hasMongoUri: !!process.env.MONGODB_URI,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      duration,
      isTimeout,
    })
    
    // Return empty array instead of error to prevent frontend crashes
    // This allows the site to still function even if database is unavailable
    return NextResponse.json(
      { 
        success: true, 
        data: [],
        warning: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      {
        status: isTimeout ? 504 : 200, // Gateway Timeout if timeout occurred
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30', // Shorter cache on error
        },
      }
    )
  }
}

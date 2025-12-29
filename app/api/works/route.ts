import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not configured - returning empty works array')
      return NextResponse.json({ success: true, data: [] })
    }

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
    
    // Enhanced error logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Works API error details:', {
      message: errorMessage,
      hasMongoUri: !!process.env.MONGODB_URI,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    })
    
    // Return empty array instead of error to prevent frontend crashes
    // This allows the site to still function even if database is unavailable
    return NextResponse.json({ 
      success: true, 
      data: [],
      warning: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    })
  }
}

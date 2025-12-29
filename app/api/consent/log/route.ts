import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

interface ConsentLog {
  timestamp: string
  preferences: {
    essential: boolean
    analytics: boolean
    marketing: boolean
  }
  userAgent?: string
  ipAddress?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ConsentLog = await request.json()

    // Validate required fields
    if (!body.timestamp || !body.preferences) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get IP address from request
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const logEntry = {
      ...body,
      ipAddress,
      createdAt: new Date(),
    }

    // Store in MongoDB
    const collection = await getCollection('consent_logs')
    await collection.insertOne(logEntry)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to log consent', error)
    return NextResponse.json(
      { success: false, error: 'Failed to log consent' },
      { status: 500 }
    )
  }
}


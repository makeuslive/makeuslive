import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const collection = await getCollection('career_applications')
    const applications = await collection
      .find({})
      .sort({ submittedAt: -1 })
      .toArray()
    
    const formatted = applications.map(doc => ({
      id: doc._id.toString(),
      jobId: doc.jobId,
      jobTitle: doc.jobTitle || 'Unknown Position',
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      coverLetter: doc.coverLetter,
      resumeUrl: doc.resumeUrl,
      portfolioUrl: doc.portfolioUrl,
      referenceWork: doc.referenceWork,
      expectedSalary: doc.expectedSalary,
      status: doc.status || 'new',
      submittedAt: doc.submittedAt,
      timestamp: doc.timestamp,
    }))
    
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

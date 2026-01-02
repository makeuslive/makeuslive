import { unstable_cache } from 'next/cache'
import { getCollection } from '@/lib/mongodb'

export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  salaryRange?: string
  resumeRequired: boolean
  portfolioRequired: boolean
  referenceWorkRequired: boolean
  createdAt?: string
}

const CACHE_TAG_JOBS = 'jobs'
const CACHE_REVALIDATE = 60

export const getJobs = unstable_cache(
  async (): Promise<Job[]> => {
    try {
      if (!process.env.MONGODB_URI) return []

      const collection = await getCollection('jobs')
      
      const jobs = await collection
        .find({ status: 'published' })
        .sort({ order: 1, createdAt: -1 })
        .limit(50)
        .toArray()

      return jobs.map(doc => ({
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
        createdAt: doc.createdAt,
      }))
    } catch (error) {
      console.error('Error fetching jobs:', error)
      return []
    }
  },
  ['jobs-list'],
  {
    revalidate: CACHE_REVALIDATE,
    tags: [CACHE_TAG_JOBS],
  }
)

export const getJobById = unstable_cache(
  async (id: string): Promise<Job | null> => {
    try {
      if (!process.env.MONGODB_URI) return null
      
      const jobs = await getJobs()
      return jobs.find(job => job.id === id) || null
    } catch (error) {
      console.error('Error fetching job by id:', error)
      return null
    }
  },
  ['job-detail'],
  {
    revalidate: CACHE_REVALIDATE,
    tags: [CACHE_TAG_JOBS],
  }
)

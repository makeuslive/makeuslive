import { getCollection } from '@/lib/mongodb'
import { unstable_cache } from 'next/cache'

export interface Work {
  id: string
  title: string
  category: string
  description: string
  image?: string
  stats?: {
    metric: string
    label: string
  }
  tags?: string[]
  gradient?: string
  featured?: boolean
  year?: string
  client?: string
  order?: number
}

// Premium agency works with richer data
export const FALLBACK_WORKS: Work[] = [
  {
    id: 'case-1',
    title: 'Internal Ticket & SLA Management System',
    category: 'Enterprise Platform',
    description: 'Production-ready workflow platform managing tickets, projects, and SLA commitments across engineering and operations teams. Built with FastAPI, MongoDB, and Next.js.',
    stats: { metric: 'Multi-Team', label: 'Operations Platform' },
    tags: ['FastAPI', 'MongoDB', 'Next.js', 'TypeScript', 'JWT Auth'],
    gradient: 'from-blue-500/30 via-indigo-600/20 to-purple-700/10',
    featured: true,
    year: '2024',
    client: 'Enterprise Client',
  },
  {
    id: 'case-2',
    title: 'Real-Time Distraction Alert Mobile App',
    category: 'Mobile Safety',
    description: 'Production-grade mobile app detecting user distraction near roadways with intelligent safety alerts. Features background processing and geofencing.',
    stats: { metric: 'Real-Time', label: 'Safety System' },
    tags: ['Flutter', 'Background Services', 'GPS', 'Activity Recognition'],
    gradient: 'from-orange-500/30 via-red-600/20 to-rose-700/10',
    featured: true,
    year: '2024',
    client: 'Safety Tech Startup',
  },
  {
    id: 'case-3',
    title: 'Documate – Secure Document Locker',
    category: 'Production Mobile App',
    description: 'Live on Google Play with 10K+ downloads and 4.4★ rating. Secure document locker with offline access and advanced encryption.',
    stats: { metric: '10K+', label: 'Active Downloads' },
    tags: ['Flutter', 'Secure Storage', 'Offline-First', 'Document Scanning'],
    gradient: 'from-emerald-500/30 via-teal-600/20 to-cyan-700/10',
    featured: true,
    year: '2023',
    client: 'In-House Product',
  },
  {
    id: 'case-4',
    title: 'AI-Powered Content Generation Platform',
    category: 'AI & Automation',
    description: 'Enterprise-grade content generation platform leveraging LLMs for automated content creation, SEO optimization, and multi-channel distribution.',
    stats: { metric: '95%', label: 'Time Saved' },
    tags: ['OpenAI', 'LLM Integration', 'Next.js', 'Vector DB'],
    gradient: 'from-purple-500/30 via-pink-600/20 to-fuchsia-700/10',
    year: '2024',
    client: 'Marketing Agency',
  },
  {
    id: 'case-5',
    title: 'E-Commerce Platform with AI Recommendations',
    category: 'E-Commerce',
    description: 'Full-stack e-commerce solution with AI-powered product recommendations, real-time inventory management, and seamless payment integration.',
    stats: { metric: '40%', label: 'Conversion Boost' },
    tags: ['Next.js', 'Stripe', 'Machine Learning', 'Redis'],
    gradient: 'from-cyan-500/30 via-blue-600/20 to-indigo-700/10',
    year: '2024',
    client: 'Retail Brand',
  },
  {
    id: 'case-6',
    title: 'Healthcare Management System',
    category: 'Healthcare Tech',
    description: 'HIPAA-compliant healthcare management system with patient records, appointment scheduling, and telemedicine capabilities.',
    stats: { metric: '50K+', label: 'Patients Served' },
    tags: ['React', 'Node.js', 'HIPAA Compliance', 'WebRTC'],
    gradient: 'from-green-500/30 via-emerald-600/20 to-teal-700/10',
    year: '2023',
    client: 'Healthcare Provider',
  },
]

// Cached function to fetch works
export const getWorks = unstable_cache(
  async (): Promise<Work[]> => {
    try {
      if (!process.env.MONGODB_URI) return FALLBACK_WORKS

      const collection = await getCollection('works')
      
      const works = await collection
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
        .limit(50)
        .toArray()

      if (works.length === 0) return FALLBACK_WORKS

      return works.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title || '',
        category: doc.category || 'Uncategorized',
        description: doc.description || '',
        image: doc.image || undefined,
        stats: doc.stats || undefined,
        tags: doc.tags || [],
        gradient: doc.gradient || 'from-gold/20 to-amber-500/10',
        featured: doc.featured || false,
        year: doc.year || undefined,
        client: doc.client || undefined,
        order: doc.order,
      })) as Work[]
    } catch (error) {
      console.error('Error fetching works:', error)
      return FALLBACK_WORKS
    }
  },
  ['works-collection'], // Cache Key
  {
    revalidate: 60, // Revalidate every 60 seconds (like ISR)
    tags: ['works'], // Tag for manual invalidation
  }
)

import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Helper functions
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function calculateReadTime(content: string): string {
  if (!content) return '1 min'
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min`
}

function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    'AI & Technology': 'from-blue-500/20 to-purple-500/10',
    'Design': 'from-pink-500/20 to-rose-500/10',
    'Development': 'from-green-500/20 to-emerald-500/10',
    'UX Research': 'from-amber-500/20 to-yellow-500/10',
    'Animation': 'from-cyan-500/20 to-teal-500/10',
  }
  return gradients[category] || 'from-gold/20 to-amber-500/10'
}

// Define types for resolver context and args
interface TestimonialInput {
  author: string
  role: string
  company?: string
  quote: string
  rating?: number
}

interface WorkInput {
  title: string
  category: string
  description?: string
  image?: string
  stats?: { metric?: string; label?: string }
  tags?: string[]
  order?: number
}

interface BlogPostInput {
  title: string
  slug: string
  excerpt?: string
  content?: string
  category?: string
  tags?: string[]
  featuredImage?: string
  status?: string
}

// GraphQL Resolvers
export const resolvers = {
  Query: {
    // Testimonials
    testimonials: async () => {
      const collection = await getCollection('testimonials')
      const docs = await collection.find({}).sort({ createdAt: -1 }).toArray()
      return docs.map(doc => ({
        id: doc._id.toString(),
        author: doc.author,
        role: doc.role,
        company: doc.company,
        quote: doc.quote,
        rating: doc.rating || 5,
        createdAt: doc.createdAt,
      }))
    },
    
    testimonial: async (_: unknown, { id }: { id: string }) => {
      const collection = await getCollection('testimonials')
      const doc = await collection.findOne({ _id: new ObjectId(id) })
      if (!doc) return null
      return {
        id: doc._id.toString(),
        author: doc.author,
        role: doc.role,
        company: doc.company,
        quote: doc.quote,
        rating: doc.rating || 5,
        createdAt: doc.createdAt,
      }
    },

    // Works
    works: async () => {
      const collection = await getCollection('works')
      const docs = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray()
      return docs.map(doc => ({
        id: doc._id.toString(),
        title: doc.title,
        category: doc.category,
        description: doc.description,
        image: doc.image,
        stats: doc.stats,
        tags: doc.tags || [],
        gradient: doc.gradient || 'from-gold/20 to-amber-500/10',
        order: doc.order,
        createdAt: doc.createdAt,
      }))
    },
    
    work: async (_: unknown, { id }: { id: string }) => {
      const collection = await getCollection('works')
      const doc = await collection.findOne({ _id: new ObjectId(id) })
      if (!doc) return null
      return {
        id: doc._id.toString(),
        title: doc.title,
        category: doc.category,
        description: doc.description,
        image: doc.image,
        stats: doc.stats,
        tags: doc.tags || [],
        gradient: doc.gradient || 'from-gold/20 to-amber-500/10',
        order: doc.order,
        createdAt: doc.createdAt,
      }
    },

    // Blog Posts
    blogPosts: async (_: unknown, { status, category, page = 1, limit = 9 }: { status?: string; category?: string; page?: number; limit?: number }) => {
      const collection = await getCollection('blog_posts')
      const query: any = {}
      if (status) query.status = status
      if (category && category !== 'All') query.category = category
      
      const skip = (page - 1) * limit
      const totalCount = await collection.countDocuments(query)
      const totalPages = Math.ceil(totalCount / limit)
      
      const cursor = collection.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit)
      const docs = await cursor.toArray()
      
      const posts = docs.map(doc => ({
        id: doc._id.toString(),
        title: doc.title,
        slug: doc.slug,
        excerpt: doc.excerpt,
        content: doc.content,
        category: doc.category,
        tags: doc.tags || [],
        featuredImage: doc.featuredImage,
        status: doc.status,
        date: formatDate(doc.publishedAt || doc.createdAt),
        readTime: calculateReadTime(doc.content),
        gradient: getCategoryGradient(doc.category),
        createdAt: doc.createdAt,
        publishedAt: doc.publishedAt,
      }))

      return {
        posts,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }
    },
    
    blogPost: async (_: unknown, { id }: { id?: string }) => {
      if (!id) return null
      const collection = await getCollection('blog_posts')
      const doc = await collection.findOne({ _id: new ObjectId(id) })
      if (!doc) return null
      return {
        id: doc._id.toString(),
        title: doc.title,
        slug: doc.slug,
        excerpt: doc.excerpt,
        content: doc.content,
        category: doc.category,
        tags: doc.tags || [],
        featuredImage: doc.featuredImage,
        status: doc.status,
        date: formatDate(doc.publishedAt || doc.createdAt),
        readTime: calculateReadTime(doc.content),
        gradient: getCategoryGradient(doc.category),
        createdAt: doc.createdAt,
        publishedAt: doc.publishedAt,
      }
    },
    
    blogPostBySlug: async (_: unknown, { slug }: { slug: string }) => {
      const collection = await getCollection('blog_posts')
      const doc = await collection.findOne({ slug })
      if (!doc) return null
      return {
        id: doc._id.toString(),
        title: doc.title,
        slug: doc.slug,
        excerpt: doc.excerpt,
        content: doc.content,
        category: doc.category,
        tags: doc.tags || [],
        featuredImage: doc.featuredImage,
        status: doc.status,
        date: formatDate(doc.publishedAt || doc.createdAt),
        readTime: calculateReadTime(doc.content),
        gradient: getCategoryGradient(doc.category),
        createdAt: doc.createdAt,
        publishedAt: doc.publishedAt,
      }
    },

    // Subscribers
    subscribers: async () => {
      const collection = await getCollection('newsletter_subscribers')
      const docs = await collection.find({}).sort({ subscribedAt: -1 }).toArray()
      return docs.map(doc => ({
        id: doc._id.toString(),
        email: doc.email,
        subscribedAt: doc.subscribedAt,
        isActive: doc.isActive !== false,
      }))
    },

    // Contacts
    contacts: async () => {
      const collection = await getCollection('contact_submissions')
      const docs = await collection.find({}).sort({ submittedAt: -1 }).toArray()
      return docs.map(doc => ({
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        website: doc.website,
        message: doc.message,
        isRead: doc.isRead || false,
        createdAt: doc.submittedAt || doc.createdAt,
      }))
    },
    
    contact: async (_: unknown, { id }: { id: string }) => {
      const collection = await getCollection('contact_submissions')
      const doc = await collection.findOne({ _id: new ObjectId(id) })
      if (!doc) return null
      return {
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        website: doc.website,
        message: doc.message,
        isRead: doc.isRead || false,
        createdAt: doc.submittedAt || doc.createdAt,
      }
    },
  },

  Mutation: {
    // Testimonials
    createTestimonial: async (_: unknown, { input }: { input: TestimonialInput }) => {
      const collection = await getCollection('testimonials')
      const result = await collection.insertOne({
        ...input,
        rating: input.rating || 5,
        createdAt: new Date().toISOString(),
      })
      return {
        id: result.insertedId.toString(),
        ...input,
        rating: input.rating || 5,
      }
    },
    
    updateTestimonial: async (_: unknown, { id, input }: { id: string; input: TestimonialInput }) => {
      const collection = await getCollection('testimonials')
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...input, updatedAt: new Date().toISOString() } }
      )
      return { id, ...input }
    },
    
    deleteTestimonial: async (_: unknown, { id }: { id: string }) => {
      const collection = await getCollection('testimonials')
      await collection.deleteOne({ _id: new ObjectId(id) })
      return true
    },

    // Works
    createWork: async (_: unknown, { input }: { input: WorkInput }) => {
      const collection = await getCollection('works')
      const result = await collection.insertOne({
        ...input,
        createdAt: new Date().toISOString(),
      })
      return { id: result.insertedId.toString(), ...input }
    },
    
    updateWork: async (_: unknown, { id, input }: { id: string; input: WorkInput }) => {
      const collection = await getCollection('works')
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...input, updatedAt: new Date().toISOString() } }
      )
      return { id, ...input }
    },
    
    deleteWork: async (_: unknown, { id }: { id: string }) => {
      const collection = await getCollection('works')
      await collection.deleteOne({ _id: new ObjectId(id) })
      return true
    },

    // Blog Posts
    createBlogPost: async (_: unknown, { input }: { input: BlogPostInput }) => {
      const collection = await getCollection('blog_posts')
      const now = new Date().toISOString()
      const result = await collection.insertOne({
        ...input,
        status: input.status || 'draft',
        createdAt: now,
        publishedAt: input.status === 'published' ? now : null,
      })
      return { id: result.insertedId.toString(), ...input }
    },
    
    updateBlogPost: async (_: unknown, { id, input }: { id: string; input: BlogPostInput }) => {
      const collection = await getCollection('blog_posts')
      const existing = await collection.findOne({ _id: new ObjectId(id) })
      const updateData: Record<string, unknown> = {
        ...input,
        updatedAt: new Date().toISOString(),
      }
      if (input.status === 'published' && !existing?.publishedAt) {
        updateData.publishedAt = new Date().toISOString()
      }
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })
      return { id, ...input }
    },
    
    deleteBlogPost: async (_: unknown, { id }: { id: string }) => {
      const collection = await getCollection('blog_posts')
      await collection.deleteOne({ _id: new ObjectId(id) })
      return true
    },

    // Newsletter
    subscribe: async (_: unknown, { email }: { email: string }) => {
      const collection = await getCollection('newsletter_subscribers')
      const existing = await collection.findOne({ email: email.toLowerCase() })
      if (existing) throw new Error('Email already subscribed')
      
      const result = await collection.insertOne({
        email: email.toLowerCase(),
        subscribedAt: new Date().toISOString(),
        isActive: true,
      })
      return {
        id: result.insertedId.toString(),
        email: email.toLowerCase(),
        isActive: true,
      }
    },
    
    unsubscribe: async (_: unknown, { id }: { id: string }) => {
      const collection = await getCollection('newsletter_subscribers')
      await collection.deleteOne({ _id: new ObjectId(id) })
      return true
    },

    // Contacts
    markContactAsRead: async (_: unknown, { id }: { id: string }) => {
      const collection = await getCollection('contact_submissions')
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: { isRead: true } })
      const doc = await collection.findOne({ _id: new ObjectId(id) })
      if (!doc) return null
      return {
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        isRead: true,
      }
    },
    
    deleteContact: async (_: unknown, { id }: { id: string }) => {
      const collection = await getCollection('contact_submissions')
      await collection.deleteOne({ _id: new ObjectId(id) })
      return true
    },
  },
}

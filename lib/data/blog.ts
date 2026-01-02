import { getCollection } from '@/lib/mongodb'
import { unstable_cache } from 'next/cache'
import type { PostItem } from '@/types'
import { formatDisplayDate } from '@/lib/date-utils'

// Cache keys
const CACHE_TAG_BLOG = 'blog-posts'
const CACHE_REVALIDATE = 60 // 1 minute (like ISR)

// Types for filtering and pagination
export interface BlogQuery {
  status?: string
  category?: string
  featured?: boolean
  search?: string
  limit?: number
  page?: number
  sort?: 'date' | 'title'
  order?: 'asc' | 'desc'
}

export interface BlogResponse {
  posts: PostItem[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    limit: number
  }
}

// Helpers
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

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return formatDisplayDate(date)
}

// Cached function to fetch blog posts
export const getBlogPosts = unstable_cache(
  async (query: BlogQuery = {}): Promise<BlogResponse> => {
    try {
      if (!process.env.MONGODB_URI) {
        return {
          posts: [],
          pagination: { currentPage: 1, totalPages: 1, totalCount: 0, hasNextPage: false, hasPreviousPage: false, limit: 10 }
        }
      }

      const {
        status = 'published',
        category,
        featured,
        search,
        limit = 9,
        page = 1,
        sort = 'date',
        order = 'desc'
      } = query

      const collection = await getCollection('blog_posts')

      // Build Filter
      const filter: any = {}
      
      if (status && status !== 'all') filter.status = status
      if (category && category !== 'All') filter.category = category
      if (featured !== undefined) filter.featured = featured
      
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
        ]
      }

      // Pagination
      const totalCount = await collection.countDocuments(filter)
      const totalPages = Math.ceil(totalCount / limit)
      const skip = (page - 1) * limit

      // Sort
      let sortField: any = { publishedAt: -1 }
      if (sort === 'title') {
        sortField = { title: order === 'asc' ? 1 : -1 }
      } else if (sort === 'date') {
        sortField = { publishedAt: order === 'asc' ? 1 : -1 }
      }

      // Fetch
      const posts = await collection
        .find(filter)
        .sort(sortField)
        .skip(skip)
        .limit(limit)
        .toArray()

      // Format
      const formatted = posts.map(doc => ({
        id: doc._id.toString(),
        title: doc.title,
        slug: doc.slug,
        excerpt: doc.excerpt,
        content: doc.content,
        category: doc.category,
        tags: doc.tags || [],
        featuredImage: doc.featuredImage,
        featured: doc.featured || false,
        status: doc.status,
        date: formatDate(doc.publishedAt),
        publishedAt: doc.publishedAt,
        readTime: calculateReadTime(doc.content),
        gradient: getCategoryGradient(doc.category),
        author: doc.author || { name: 'MakeUsLive', role: 'Team' },
        seo: doc.seo,
        views: doc.views || 0,
        likes: doc.likes || 0,
      })) as PostItem[]

      return {
        posts: formatted,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          limit,
        },
      }

    } catch (error) {
      console.error('Error fetching blog posts:', error)
      return {
        posts: [],
        pagination: { currentPage: 1, totalPages: 1, totalCount: 0, hasNextPage: false, hasPreviousPage: false, limit: 10 }
      }
    }
  },
  [CACHE_TAG_BLOG], // base cache key
  {
    revalidate: CACHE_REVALIDATE,
    tags: [CACHE_TAG_BLOG],
  }
)

export const getBlogPostBySlug = unstable_cache(
  async (slug: string): Promise<PostItem | null> => {
    try {
      if (!process.env.MONGODB_URI) return null
      
      const collection = await getCollection('blog_posts')
      const doc = await collection.findOne({ slug })
      
      if (!doc) return null

      // Increment view count (fire and forget, don't await)
      collection.updateOne({ slug }, { $inc: { views: 1 } }).catch(console.error)

      return {
        id: doc._id.toString(),
        title: doc.title,
        slug: doc.slug,
        excerpt: doc.excerpt,
        content: doc.content,
        category: doc.category,
        tags: doc.tags || [],
        featuredImage: doc.featuredImage,
        featured: doc.featured || false,
        status: doc.status,
        date: formatDate(doc.publishedAt),
        publishedAt: doc.publishedAt,
        readTime: calculateReadTime(doc.content),
        gradient: getCategoryGradient(doc.category),
        author: doc.author || { name: 'MakeUsLive', role: 'Team' },
        seo: doc.seo,
        views: (doc.views || 0) + 1,
        likes: doc.likes || 0,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      } as PostItem
    } catch (error) {
      console.error('Error fetching blog post by slug:', error)
      return null
    }
  },
  ['blog-post-slug'], 
  {
    revalidate: CACHE_REVALIDATE,
    tags: [CACHE_TAG_BLOG], 
  }
)

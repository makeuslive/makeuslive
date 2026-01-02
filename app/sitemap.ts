import { MetadataRoute } from 'next'
import { getCollection } from '@/lib/mongodb'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.makeuslive.com'
  const currentDate = new Date().toISOString()

  // ============================================
  // CORE PAGES - Highest priority
  // ============================================
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // ============================================
  // SERVICE HUB PAGES - Primary money pages
  // ============================================
  const serviceHubPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/web-design`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/app-development`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ui-ux-design`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/custom-software`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/mvp-development`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
  ]

  // ============================================
  // SERVICE PAGES - Deep linking for SEO
  // ============================================
  const servicePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/services#ai-products`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services#enterprise`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services#web-development`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services#mobile-apps`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services#blockchain`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/services#ar-vr`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/services#design-systems`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services#marketing`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/services#consulting`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.75 },
  ]

  // ============================================
  // DYNAMIC BLOG POSTS - Fetched from MongoDB
  // ============================================
  let blogPosts: MetadataRoute.Sitemap = []
  try {
    const collection = await getCollection('blogs')
    const posts = await collection.find({ status: 'published' }).sort({ publishedAt: -1 }).toArray()
    
    blogPosts = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: post.featured ? 0.8 : 0.7,
    }))
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
    // Fallback static blog posts
    blogPosts = [
      { url: `${baseUrl}/blog/future-of-ai-web-development`, lastModified: '2024-12-20', changeFrequency: 'yearly', priority: 0.7 },
      { url: `${baseUrl}/blog/building-design-systems`, lastModified: '2024-12-15', changeFrequency: 'yearly', priority: 0.7 },
    ]
  }

  // ============================================
  // DYNAMIC WORKS/CASE STUDIES - Fetched from MongoDB
  // ============================================
  let workPages: MetadataRoute.Sitemap = []
  try {
    const collection = await getCollection('works')
    const works = await collection.find({}).sort({ order: 1 }).toArray()
    
    workPages = works.map(work => ({
      url: `${baseUrl}/work/${work._id.toString()}`,
      lastModified: work.updatedAt || work.createdAt || currentDate,
      changeFrequency: 'yearly' as const,
      priority: work.order === 0 ? 0.8 : 0.7,
    }))
  } catch (error) {
    console.error('Error fetching works for sitemap:', error)
  }

  // ============================================
  // LEGAL PAGES
  // ============================================
  const legalPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/privacy-policy`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // ============================================
  // UTILITY PAGES - For AI crawlers
  // ============================================
  const utilityPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/llms.txt`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.9 },
  ]

  // ============================================
  // CAREER PAGES - Static job listings
  // ============================================
  const careerPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/careers/senior-frontend-engineer`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/careers/ui-ux-designer`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
  ]

  return [
    ...corePages,
    ...serviceHubPages,
    ...servicePages,
    ...blogPosts,
    ...workPages,
    ...careerPages,
    ...legalPages,
    ...utilityPages,
  ]
}

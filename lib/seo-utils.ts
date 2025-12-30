import { Metadata } from 'next'

// =====================================================
// SEO UTILITIES FOR MAKEUSLIVE
// Enterprise-grade SEO helpers for Next.js 15
// =====================================================

const SITE_URL = 'https://www.makeuslive.com'
const SITE_NAME = 'Make Us Live'
const SITE_NAME_ALT = 'MakeUsLive'
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/logo.png`

// Brand name variations for SEO
const BRAND_VARIATIONS = [
  'MakeUsLive',
  'Make Us Live',
  'make us live',
  'MAKEUSLIVE',
  'Make Us Live Agency',
  'make us live agency',
  'MakeUsLive Agency',
  'makeuslive agency',
  'MUL Studio',
  'MUL Agency',
  'Make Us Live Studio',
  'Make Us Live Digital',
  'MakeUsLive Creative Studio',
  'Make Us Live Creative Agency',
]

// =====================================================
// TYPES
// =====================================================

export interface PageSeoConfig {
  title: string
  description: string
  slug: string
  image?: string
  noIndex?: boolean
  keywords?: string[]
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface BlogPostSeoConfig {
  title: string
  description: string
  slug: string
  author: string
  publishedAt: string
  updatedAt?: string
  image?: string
  category?: string
  tags?: string[]
}

export interface ServiceSeoConfig {
  name: string
  description: string
  url: string
  image?: string
  price?: string
  category?: string
}

// =====================================================
// METADATA GENERATORS
// =====================================================

/**
 * Generate comprehensive page metadata
 * Use this for every page in your app
 */
export function generatePageMetadata({
  title,
  description,
  slug,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  keywords = [],
}: PageSeoConfig): Metadata {
  const fullUrl = `${SITE_URL}${slug}`
  const fullTitle = `${title} | ${SITE_NAME}`

  return {
    title: fullTitle,
    description,
    keywords: [
      ...keywords,
      'MakeUsLive',
      'Make Us Live',
      'make us live',
      'Make Us Live Agency',
      'digital agency',
      'web development',
      'AI development',
    ],
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      site: '@makeuslivee',
      creator: '@makeuslivee',
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }
}

/**
 * Generate blog post metadata with Article schema support
 */
export function generateBlogMetadata({
  title,
  description,
  slug,
  author,
  publishedAt,
  updatedAt,
  image = DEFAULT_OG_IMAGE,
  category,
  tags = [],
}: BlogPostSeoConfig): Metadata {
  const fullUrl = `${SITE_URL}/blog/${slug}`
  const fullTitle = `${title} | Blog | ${SITE_NAME}`

  return {
    title: fullTitle,
    description,
    keywords: [...tags, 'blog', 'article', category || 'technology'].filter(Boolean),
    authors: [{ name: author }],
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: updatedAt || publishedAt,
      authors: [author],
      section: category,
      tags,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: '@makeuslivee',
    },
  }
}

// =====================================================
// JSON-LD SCHEMA GENERATORS
// =====================================================

/**
 * Generate BreadcrumbList schema
 * Add to every page for better SERP display
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate FAQPage schema
 * Great for service pages and blog posts
 */
export function generateFaqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate Article schema for blog posts
 */
export function generateArticleSchema({
  title,
  description,
  slug,
  author,
  publishedAt,
  updatedAt,
  image = DEFAULT_OG_IMAGE,
}: BlogPostSeoConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
  }
}

/**
 * Generate Service schema
 */
export function generateServiceSchema({
  name,
  description,
  url,
  image,
  price,
  category,
}: ServiceSeoConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    image,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 23.2599,
        longitude: 77.4126,
      },
      geoRadius: '10000',
    },
    ...(price && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'USD',
      },
    }),
    ...(category && { category }),
  }
}

/**
 * Generate Brand schema for brand recognition
 * Critical for helping search engines understand brand name variations
 */
export function generateBrandSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    '@id': `${SITE_URL}/#brand`,
    name: SITE_NAME_ALT,
    alternateName: BRAND_VARIATIONS,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: 'Make Us Live (MakeUsLive) is a creative digital agency offering AI development, web development, mobile apps, and design services.',
    slogan: 'Design. Think. Build. Automate.',
  }
}

/**
 * Generate HowTo schema
 * Great for tutorial-style content
 */
export function generateHowToSchema(
  name: string,
  description: string,
  steps: { name: string; text: string; image?: string }[],
  totalTime?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  }
}

/**
 * Generate Review schema
 * For testimonials and case studies
 */
export function generateReviewSchema(
  itemName: string,
  reviewerName: string,
  reviewBody: string,
  ratingValue: number,
  datePublished: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Organization',
      name: itemName,
    },
    author: {
      '@type': 'Person',
      name: reviewerName,
    },
    reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
    datePublished,
  }
}

/**
 * Generate VideoObject schema
 * For video content SEO
 */
export function generateVideoSchema(
  name: string,
  description: string,
  thumbnailUrl: string,
  uploadDate: string,
  duration: string,
  contentUrl?: string,
  embedUrl?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl }),
  }
}

// =====================================================
// AI / LLM OPTIMIZATION
// =====================================================

/**
 * Generate AI-friendly content summary
 * Helps LLMs understand page content better
 */
export function generateAISummary(content: {
  topic: string
  mainPoints: string[]
  targetAudience: string
  expertise: string
  lastUpdated: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    mainContentOfPage: {
      '@type': 'WebPageElement',
      about: content.topic,
    },
    specialty: content.expertise,
    audience: {
      '@type': 'Audience',
      audienceType: content.targetAudience,
    },
    lastReviewed: content.lastUpdated,
    mainEntity: content.mainPoints.map((point) => ({
      '@type': 'Thing',
      name: point,
    })),
  }
}

// =====================================================
// VALIDATION & UTILITIES
// =====================================================

/**
 * Validate page SEO configuration
 * Returns array of issues found
 */
export function validatePageSeo(config: PageSeoConfig): string[] {
  const issues: string[] = []

  // Title validation
  if (!config.title) {
    issues.push('Title is required')
  } else if (config.title.length < 30) {
    issues.push('Title should be at least 30 characters')
  } else if (config.title.length > 60) {
    issues.push('Title should be under 60 characters')
  }

  // Description validation
  if (!config.description) {
    issues.push('Description is required')
  } else if (config.description.length < 120) {
    issues.push('Description should be at least 120 characters')
  } else if (config.description.length > 160) {
    issues.push('Description should be under 160 characters')
  }

  // Slug validation
  if (!config.slug) {
    issues.push('Slug is required')
  } else if (!config.slug.startsWith('/')) {
    issues.push('Slug should start with /')
  }

  return issues
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${cleanPath}`
}

/**
 * Format date for schema.org
 */
export function formatSchemaDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString()
}

/**
 * Generate alternate language links
 */
export function generateAlternateLinks(path: string) {
  return {
    'en-US': `${SITE_URL}${path}`,
    'en-IN': `${SITE_URL}${path}`,
    'x-default': `${SITE_URL}${path}`,
  }
}

// =====================================================
// CORE WEB VITALS TRACKING
// =====================================================

/**
 * Report Web Vitals to analytics
 * Use with next/web-vitals
 */
export function reportWebVitals(metric: {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: string
}) {
  // Send to Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
      metric_id: metric.id,
      metric_value: metric.value,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
    })
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
    })
  }
}

// =====================================================
// SOCIAL SHARING
// =====================================================

/**
 * Generate social sharing URLs
 */
export function generateSocialShareUrls(url: string, title: string, description?: string) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDesc = description ? encodeURIComponent(description) : ''

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
    copy: url,
  }
}

// =====================================================
// EXPORTS
// =====================================================

export const SEO_CONFIG = {
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  siteNameAlt: SITE_NAME_ALT,
  brandVariations: BRAND_VARIATIONS,
  defaultOgImage: DEFAULT_OG_IMAGE,
  twitterHandle: '@makeuslivee',
  locale: 'en_US',
}

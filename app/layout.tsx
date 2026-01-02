import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, Agbalumo, Nanum_Myeongjo, IBM_Plex_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import dynamic from 'next/dynamic'

import { Providers } from '@/components/providers'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { MicrosoftClarity } from '@/components/analytics/MicrosoftClarity'
import { WebVitalsInit } from '@/components/web-vitals-init'
import { COPY } from '@/lib/constants'
import { cn } from '@/lib/utils'

import './globals.css'

// Lazy load heavy canvas component
const StarsCanvas = dynamic(
  () => import('@/components/canvas/stars-canvas').then((mod) => mod.StarsCanvas)
)

// =====================================================
// FONTS - Optimized for minimal HTTP requests
// Key optimizations:
// 1. Explicit weights - only load what we actually use
// 2. Latin subset only - prevents loading Korean/Cyrillic chars
// 3. display: 'swap' - prevents FOIT (Flash of Invisible Text)
// =====================================================

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-general-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
})

const agbalumo = Agbalumo({
  subsets: ['latin'],
  variable: '--font-agbalumo',
  display: 'swap',
  weight: '400',
  preload: false, // Not critical for initial render
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  weight: ['400', '500'],
  preload: false, // Not critical for initial render
})

// Nanum Myeongjo - Korean font, but we only need latin chars
// This prevents 100+ Korean character subset files from loading
const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ['latin'],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
  weight: ['400', '700'],
  preload: false, // Not critical for initial render
})

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#030014' },
    { media: '(prefers-color-scheme: light)', color: '#050505' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
}

// Comprehensive SEO Metadata - Optimized for AI Search (Perplexity, ChatGPT, Google AI)
export const metadata: Metadata = {
  // Basic metadata - Creative Studio focused
  title: {
    default: `${COPY.brand.name} | AI Product Development Agency for Startups`,
    template: `%s | ${COPY.brand.name}`,
  },
  description:
    'Premier AI product development agency building scalable web & mobile apps for startups & enterprises. Expert in Next.js, React Native, and AI systems.',

  // Extended keywords - Full-Service Creative Studio + AI Search Optimization
  keywords: [
    // Creative Studio Keywords (Primary)
    'creative studio',
    'creative agency',
    'boutique creative agency',
    'design studio',
    'digital creative studio',
    'creative digital agency',
    'brand studio',
    'innovation studio',
    'creative technology studio',
    'full-service creative studio',

    // Digital Agency Keywords
    'digital agency',
    'web development agency',
    'AI development company',
    'design agency',
    'product design agency',
    'software development company',
    'full-service digital agency',
    'boutique digital agency',
    'technology consulting',

    // Enterprise Software
    'ERP development',
    'CRM development',
    'enterprise software development',
    'custom ERP solutions',
    'CRM integration',
    'backend development',
    'API development',
    'enterprise integration',
    'workflow automation',
    'business process automation',

    // AI & Data Science
    'AI solutions',
    'machine learning development',
    'AI-powered products',
    'generative AI',
    'LLM integration',
    'AI automation',
    'data science services',
    'business intelligence',
    'data analytics',
    'predictive analytics',
    'AI research',

    // Blockchain & Web3
    'blockchain development',
    'smart contract development',
    'DeFi development',
    'NFT platform development',
    'Web3 development',
    'crypto development',
    'Solidity development',
    'Ethereum development',

    // AR/VR & Emerging Tech
    'AR development',
    'VR development',
    'augmented reality',
    'virtual reality',
    'mixed reality',
    'immersive experiences',
    'IoT development',

    // Web & Mobile Development
    'web development',
    'mobile app development',
    'React Native development',
    'Next.js development',
    'React development',
    'desktop app development',
    'Electron development',
    'cross-platform development',
    'PWA development',
    'e-commerce development',
    'SaaS development',

    // Design & Branding
    'UI/UX design',
    'brand identity design',
    'branding agency',
    'visual design',
    'interaction design',
    'motion design',
    'creative direction',
    'art direction',
    'brand storytelling',
    'logo design',
    'brand strategy',
    'design systems',
    'component libraries',

    // Marketing & SMMA
    'SMMA',
    'social media marketing',
    'digital marketing agency',
    'content marketing',
    'SEO services',
    'growth marketing',
    'performance marketing',
    'social media management',
    'influencer marketing',
    'paid advertising',

    // Technology Stack
    'Next.js agency',
    'React agency',
    'TypeScript development',
    'Node.js development',
    'Python development',
    'full stack development',
    'GSAP animations',

    // ============================================
    // LOCATION-BASED KEYWORDS - For "best agency in [city]" searches
    // ============================================

    // India - Major Cities
    'best digital agency India',
    'best creative agency India',
    'top software company India',
    'best web development company India',
    'best AI company India',
    'best app development company India',

    // Bhopal (Home Base)
    'best digital agency Bhopal',
    'best web development company Bhopal',
    'software company Bhopal',
    'IT company Bhopal',
    'best app developer Bhopal',
    'best design agency Bhopal',
    'digital marketing agency Bhopal',

    // Delhi NCR
    'best digital agency Delhi',
    'best web development company Delhi',
    'best software company Delhi NCR',
    'best AI company Delhi',
    'best app development Delhi',
    'best creative agency Gurgaon',
    'best digital agency Noida',

    // Mumbai
    'best digital agency Mumbai',
    'best web development company Mumbai',
    'best software company Mumbai',
    'best creative agency Mumbai',
    'best AI company Mumbai',
    'best app development Mumbai',

    // Bangalore
    'best digital agency Bangalore',
    'best software company Bangalore',
    'best AI company Bangalore',
    'best startup agency Bangalore',
    'best tech company Bangalore',

    // Other Indian Cities
    'best digital agency Hyderabad',
    'best digital agency Chennai',
    'best digital agency Pune',
    'best digital agency Kolkata',
    'best digital agency Ahmedabad',
    'best digital agency Jaipur',
    'best digital agency Lucknow',
    'best digital agency Indore',

    // Global - USA
    'best digital agency USA',
    'best web development company USA',
    'best AI development company USA',
    'best software company New York',
    'best digital agency San Francisco',
    'best tech agency Silicon Valley',
    'best app development company California',

    // Global - UK
    'best digital agency UK',
    'best web development company London',
    'best software company UK',
    'best creative agency London',

    // Global - Other
    'best digital agency Canada',
    'best digital agency Australia',
    'best digital agency Dubai',
    'best digital agency Singapore',
    'best digital agency Germany',

    // "Best" Intent Keywords
    'best agency for startups',
    'best agency for AI development',
    'best agency for web apps',
    'best agency for mobile apps',
    'best agency for ERP development',
    'best agency for blockchain',
    'best branding agency',
    'best UX design agency',
    'best full-stack agency',

    // "Top" Intent Keywords
    'top 10 digital agencies India',
    'top software companies India',
    'top AI companies India',
    'top web development agencies',
    'top creative studios',

    // Intent Keywords
    'hire creative agency',
    'hire software developers',
    'build web app',
    'build mobile app',
    'build ERP system',
    'build CRM',
    'custom AI solutions',
    'startup branding',
    'digital transformation',
    'enterprise modernization',
    'outsource development India',
    'offshore development partner',

    // AI Search Optimization
    'best creative studio',
    'top digital agency',
    'best software company',
    'award winning design',
    'innovative technology',

    // Brand Name Variations (Critical for Search)
    'MakeUsLive',
    'Make Us Live',
    'make us live',
    'MAKEUSLIVE',
    'makeuslive',
    'Make Us Live Agency',
    'make us live agency',
    'MakeUsLive Agency',
    'makeuslive agency',
    'MUL Studio',
    'MUL Agency',
    'Make Us Live Studio',
    'make us live studio',
    'Make Us Live Digital',
    'make us live digital',
    'MakeUsLive Digital Agency',
    'Make Us Live Creative',
    'make us live creative agency',
    'MakeUsLive India',
    'Make Us Live India',
    'make us live india',
    'MakeUsLive Bhopal',
    'Make Us Live Bhopal',
    'MakeUsLive creative studio',
    'make us live creative studio',
    'MakeUsLive web development',
    'make us live web development',
    'MakeUsLive AI',
    'make us live AI',
    'MakeUsLive design',
    'make us live design',
  ],

  // Authors and creator
  authors: [
    { name: 'Make Us Live', url: 'https://www.makeuslive.com' },
    { name: 'Abhishek Jha' },
    { name: 'Rishi Soni' },
    { name: 'Vikramaditya Jha' },
  ],
  creator: 'Make Us Live',
  publisher: 'Make Us Live',

  // Base URL for all relative URLs
  metadataBase: new URL('https://www.makeuslive.com'),

  // Alternate languages
  alternates: {
    canonical: 'https://www.makeuslive.com',
    languages: {
      'en-US': 'https://www.makeuslive.com',
      'en-IN': 'https://www.makeuslive.com',
    },
  },

  // Open Graph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.makeuslive.com',
    siteName: 'Make Us Live',
    title: 'Make Us Live (MakeUsLive) - Premium Digital Agency | AI, Web Development, Design',
    description:
      'Transform your business with Make Us Live (MakeUsLive Agency). We specialize in AI-powered products, web development, mobile apps, and design systems. Make Us Live helps you build products that scale.',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Make Us Live - Creative Digital Agency',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@makeuslivee',
    creator: '@makeuslivee',
    title: 'Make Us Live (MakeUsLive) - Premium Digital Agency | AI, Web Development, Design',
    description:
      'Transform your business with Make Us Live (MakeUsLive Agency). AI-powered products, web development, mobile apps, and design systems.',
    images: ['/images/logo.png'],
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },

  // Manifest for PWA
  manifest: '/manifest.json',

  // App links
  appLinks: {
    web: {
      url: 'https://www.makeuslive.com',
      should_fallback: true,
    },
  },

  // Verification for search engines
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '8af1e0fd48fa82f2',
    other: {
      'bing-site-verification': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },

  // Category
  category: 'technology',

  // Classification
  classification: 'Digital Agency, Software Development, Web Development, AI Development',

  // Other metadata
  other: {
    'msapplication-TileColor': '#030014',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
  },
}

// JSON-LD Structured Data - Comprehensive for Maximum SEO Impact + AI Optimization
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // Organization Schema - Creative Studio Focus
    {
      '@type': ['Organization', 'CreativeWork'],
      '@id': 'https://www.makeuslive.com/#organization',
      name: 'MakeUsLive',
      legalName: 'MakeUsLive',
      alternateName: [
        'Make Us Live',
        'make us live',
        'MAKEUSLIVE',
        'Make Us Live Agency',
        'make us live agency',
        'MakeUsLive Agency',
        'MUL Studio',
        'MUL Agency',
        'Make Us Live Studio',
        'Make Us Live Digital',
        'Make Us Live Digital Agency',
        'MakeUsLive Creative Studio',
        'Make Us Live Creative',
        'Make Us Live Creative Agency',
        'MakeUsLive India',
        'Make Us Live India',
        'MakeUsLive Bhopal',
        'Make Us Live Bhopal',
      ],
      url: 'https://www.makeuslive.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.makeuslive.com/images/logo.png',
        width: 512,
        height: 512,
        caption: 'MakeUsLive Creative Studio Logo',
      },
      image: 'https://www.makeuslive.com/images/logo.png',
      description: 'Make Us Live (also known as MakeUsLive or Make Us Live Agency) is a boutique creative studio and digital agency that thinks like artists and researches like scientists. We craft AI-powered products, stunning websites, mobile apps, and design systems that inspire, engage, and convert.',
      slogan: 'Design. Think. Build. Automate.',
      disambiguatingDescription: 'Make Us Live Agency (MakeUsLive) - A creative technology studio specializing in AI-powered digital experiences, web development, and design systems. Boutique agency serving startups and enterprises worldwide. Search for: make us live, Make Us Live Agency, MakeUsLive.',
      email: 'hello@makeuslive.com',
      telephone: '+91-98765-43210',
      foundingDate: '2025',
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        minValue: 3,
        maxValue: 10,
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bhopal',
        addressLocality: 'Bhopal',
        addressRegion: 'Madhya Pradesh',
        postalCode: '462001',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://twitter.com/makeuslivee',
        'https://linkedin.com/company/makeuslivee',
        'https://github.com/makeuslivee',
        'https://dribbble.com/makeuslivee',
        'https://instagram.com/makeuslivee',
      ],
      founder: [
        {
          '@type': 'Person',
          name: 'Abhishek Jha',
          jobTitle: 'The Generalist',
          description: 'Business, Finance, Tech, Backend, Design, UI/UX',
        },
        {
          '@type': 'Person',
          name: 'Rishi Soni',
          jobTitle: 'Tech Master',
          description: 'App Specialist and Technology Lead',
        },
        {
          '@type': 'Person',
          name: 'Vikramaditya Jha',
          jobTitle: 'Strategy & Content',
          description: 'Finance, Market, and Content',
        },
      ],
      knowsAbout: [
        'Artificial Intelligence',
        'Machine Learning',
        'Web Development',
        'Mobile App Development',
        'UI/UX Design',
        'Design Systems',
        'Next.js',
        'React',
        'TypeScript',
        'Node.js',
      ],
    },
    // Website Schema with Search Action
    {
      '@type': 'WebSite',
      '@id': 'https://www.makeuslive.com/#website',
      url: 'https://www.makeuslive.com',
      name: 'Make Us Live',
      alternateName: ['Make Us Live', 'make us live', 'Make Us Live Agency', 'MakeUsLive Agency'],
      description: 'Make Us Live (MakeUsLive) - Premium Digital Agency - AI, Web Development, Design Systems',
      publisher: { '@id': 'https://www.makeuslive.com/#organization' },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.makeuslive.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    // LocalBusiness Schema for Local SEO
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.makeuslive.com/#localbusiness',
      name: 'Make Us Live - Digital Agency Bhopal',
      alternateName: ['Make Us Live Bhopal', 'Make Us Live Agency Bhopal', 'make us live bhopal'],
      image: 'https://www.makeuslive.com/images/logo.png',
      url: 'https://www.makeuslive.com',
      telephone: '+91-98765-43210',
      email: 'hello@makeuslive.com',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bhopal',
        addressLocality: 'Bhopal',
        addressRegion: 'Madhya Pradesh',
        postalCode: '462001',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 23.2599,
        longitude: 77.4126,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '150',
        bestRating: '5',
        worstRating: '1',
      },
      review: [
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Client' },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
          },
          reviewBody: 'Outstanding digital agency. Delivered our AI project on time and exceeded expectations.',
        },
      ],
    },
    // ProfessionalService Schema
    {
      '@type': 'ProfessionalService',
      '@id': 'https://www.makeuslive.com/#service',
      name: 'MakeUsLive Digital Agency',
      alternateName: ['Make Us Live Digital Agency', 'Make Us Live Agency', 'make us live agency'],
      image: 'https://www.makeuslive.com/images/logo.png',
      url: 'https://www.makeuslive.com',
      telephone: '+91-98765-43210',
      email: 'hello@makeuslive.com',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bhopal',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 23.2599,
        longitude: 77.4126,
      },
      areaServed: [
        { '@type': 'Country', name: 'India' },
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'United Kingdom' },
        { '@type': 'Country', name: 'Canada' },
        { '@type': 'Country', name: 'Australia' },
        { '@type': 'GeoShape', name: 'Worldwide' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Full-Service Creative & Technology Solutions',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI & Data Science',
              description: 'Custom AI solutions, machine learning models, LLM integration, generative AI, data science, and business intelligence.',
              url: 'https://www.makeuslive.com/services#ai-products',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Enterprise Software (ERP/CRM)',
              description: 'Custom ERP systems, CRM development, enterprise integration, workflow automation, and backend systems.',
              url: 'https://www.makeuslive.com/services#enterprise',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Web Development',
              description: 'Modern web applications with Next.js, React, TypeScript. E-commerce, SaaS platforms, and PWAs.',
              url: 'https://www.makeuslive.com/services#web-development',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Mobile & Desktop Apps',
              description: 'Cross-platform mobile apps (React Native, iOS, Android), desktop apps (Electron), and cross-platform solutions.',
              url: 'https://www.makeuslive.com/services#mobile-apps',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Blockchain & Web3',
              description: 'Smart contract development, DeFi platforms, NFT marketplaces, and Web3 applications.',
              url: 'https://www.makeuslive.com/services#blockchain',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AR/VR & Immersive',
              description: 'Augmented reality, virtual reality, mixed reality experiences, and immersive applications.',
              url: 'https://www.makeuslive.com/services#ar-vr',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Design & Branding',
              description: 'UI/UX design, brand identity, logo design, design systems, motion design, and creative direction.',
              url: 'https://www.makeuslive.com/services#design-systems',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Marketing & SMMA',
              description: 'Social media marketing, digital marketing, SEO, content marketing, growth strategy, and performance marketing.',
              url: 'https://www.makeuslive.com/services#marketing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Technical Consulting',
              description: 'Architecture reviews, code audits, tech strategy, R&D, and team training.',
              url: 'https://www.makeuslive.com/services#consulting',
            },
          },
        ],
      },
    },
    // BreadcrumbList for Homepage
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.makeuslive.com/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.makeuslive.com',
        },
      ],
    },
    // Brand Schema - Critical for brand name recognition
    {
      '@type': 'Brand',
      '@id': 'https://www.makeuslive.com/#brand',
      name: 'MakeUsLive',
      alternateName: [
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
      ],
      url: 'https://www.makeuslive.com',
      logo: 'https://www.makeuslive.com/images/logo.png',
      description: 'Make Us Live (MakeUsLive) is a creative digital agency offering AI development, web development, mobile apps, and design services.',
      slogan: 'Design. Think. Build. Automate.',
    },
    // NOTE: FAQPage schema removed from global layout to prevent duplicates.
    // Page-specific FAQ schemas should be added in individual page layouts (e.g., web-design/layout.tsx)
  ],
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        spaceGrotesk.variable,
        agbalumo.variable,
        ibmPlexMono.variable,
        nanumMyeongjo.variable,
        'antialiased'
      )}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-bg text-text',
          'overflow-x-hidden',
          spaceGrotesk.className
        )}
      >
        <Providers>
          {/* Analytics loaded conditionally based on consent */}
          {/* Background canvas - disabled for performance */}
          <StarsCanvas />

          {/* Conditional layout - hides navbar/footer on admin routes */}
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
        <SpeedInsights />
        <Analytics />
        <WebVitalsInit />
      </body>
    </html>
  )
}

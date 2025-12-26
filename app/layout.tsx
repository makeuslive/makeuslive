import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, Agbalumo } from 'next/font/google'
import type { ReactNode } from 'react'

import { Providers } from '@/components/providers'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { StarsCanvas } from '@/components/canvas/stars-canvas'
import { COPY } from '@/lib/constants'
import { cn } from '@/lib/utils'

import './globals.css'

// Fonts - Using Google Fonts for better compatibility
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-general-sans',
  display: 'swap',
})

const agbalumo = Agbalumo({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-agbalumo',
  display: 'swap',
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
    default: `${COPY.brand.name} - Creative Studio & Digital Agency | AI, Design, Web Development`,
    template: `%s | ${COPY.brand.name} - Creative Studio`,
  },
  description:
    'MakeUsLive is a creative studio and digital agency that thinks like artists and researches like scientists. We craft AI-powered products, stunning websites, mobile apps, and design systems. Boutique agency creating digital experiences that inspire, engage, and convert. Based in India, serving clients worldwide.',

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

    // Location Keywords
    'creative studio India',
    'digital agency India',
    'software company India',
    'tech startup India',
    'ERP company India',
    'blockchain company India',

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

    // AI Search Optimization
    'best creative studio',
    'top digital agency',
    'best software company',
    'award winning design',
    'innovative technology',

    // Brand
    'MakeUsLive',
    'Make Us Live',
    'MUL Studio',
  ],

  // Authors and creator
  authors: [
    { name: 'MakeUsLive', url: 'https://makeuslive.com' },
    { name: 'Abhishek Jha' },
    { name: 'Rishi Soni' },
    { name: 'Vikramaditya Jha' },
  ],
  creator: 'MakeUsLive',
  publisher: 'MakeUsLive',

  // Base URL for all relative URLs
  metadataBase: new URL('https://makeuslive.com'),

  // Alternate languages
  alternates: {
    canonical: 'https://makeuslive.com',
    languages: {
      'en-US': 'https://makeuslive.com',
      'en-IN': 'https://makeuslive.com',
    },
  },

  // Open Graph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://makeuslive.com',
    siteName: 'MakeUsLive',
    title: 'MakeUsLive - Premium Digital Agency | AI, Web Development, Design',
    description:
      'Transform your business with MakeUsLive. We specialize in AI-powered products, web development, mobile apps, and design systems. Build products that scale.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MakeUsLive - Premium Digital Agency',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 600,
        height: 600,
        alt: 'MakeUsLive Logo',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@makeuslive',
    creator: '@makeuslive',
    title: 'MakeUsLive - Premium Digital Agency | AI, Web Development, Design',
    description:
      'Transform your business with MakeUsLive. AI-powered products, web development, mobile apps, and design systems.',
    images: ['/twitter-image.png'],
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
      url: 'https://makeuslive.com',
      should_fallback: true,
    },
  },

  // Verification for search engines
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
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
      '@id': 'https://makeuslive.com/#organization',
      name: 'MakeUsLive',
      alternateName: ['Make Us Live', 'MUL Studio', 'MakeUsLive Creative Studio'],
      url: 'https://makeuslive.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://makeuslive.com/logo.png',
        width: 512,
        height: 512,
        caption: 'MakeUsLive Creative Studio Logo',
      },
      image: 'https://makeuslive.com/og-image.png',
      description: 'MakeUsLive is a boutique creative studio and digital agency that thinks like artists and researches like scientists. We craft AI-powered products, stunning websites, mobile apps, and design systems that inspire, engage, and convert.',
      slogan: 'Design. Think. Build. Automate.',
      disambiguatingDescription: 'A creative technology studio specializing in AI-powered digital experiences, web development, and design systems. Boutique agency serving startups and enterprises worldwide.',
      email: 'hello@makeuslive.com',
      telephone: '+91-98765-43210',
      foundingDate: '2019',
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
        'https://twitter.com/makeuslive',
        'https://linkedin.com/company/makeuslive',
        'https://github.com/makeuslive',
        'https://dribbble.com/makeuslive',
        'https://instagram.com/makeuslive',
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
      '@id': 'https://makeuslive.com/#website',
      url: 'https://makeuslive.com',
      name: 'MakeUsLive',
      description: 'Premium Digital Agency - AI, Web Development, Design Systems',
      publisher: { '@id': 'https://makeuslive.com/#organization' },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://makeuslive.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    // LocalBusiness Schema for Local SEO
    {
      '@type': 'LocalBusiness',
      '@id': 'https://makeuslive.com/#localbusiness',
      name: 'MakeUsLive - Digital Agency Bhopal',
      image: 'https://makeuslive.com/og-image.png',
      url: 'https://makeuslive.com',
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
      '@id': 'https://makeuslive.com/#service',
      name: 'MakeUsLive Digital Agency',
      image: 'https://makeuslive.com/og-image.png',
      url: 'https://makeuslive.com',
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
              url: 'https://makeuslive.com/services#ai-products',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Enterprise Software (ERP/CRM)',
              description: 'Custom ERP systems, CRM development, enterprise integration, workflow automation, and backend systems.',
              url: 'https://makeuslive.com/services#enterprise',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Web Development',
              description: 'Modern web applications with Next.js, React, TypeScript. E-commerce, SaaS platforms, and PWAs.',
              url: 'https://makeuslive.com/services#web-development',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Mobile & Desktop Apps',
              description: 'Cross-platform mobile apps (React Native, iOS, Android), desktop apps (Electron), and cross-platform solutions.',
              url: 'https://makeuslive.com/services#mobile-apps',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Blockchain & Web3',
              description: 'Smart contract development, DeFi platforms, NFT marketplaces, and Web3 applications.',
              url: 'https://makeuslive.com/services#blockchain',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AR/VR & Immersive',
              description: 'Augmented reality, virtual reality, mixed reality experiences, and immersive applications.',
              url: 'https://makeuslive.com/services#ar-vr',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Design & Branding',
              description: 'UI/UX design, brand identity, logo design, design systems, motion design, and creative direction.',
              url: 'https://makeuslive.com/services#design-systems',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Marketing & SMMA',
              description: 'Social media marketing, digital marketing, SEO, content marketing, growth strategy, and performance marketing.',
              url: 'https://makeuslive.com/services#marketing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Technical Consulting',
              description: 'Architecture reviews, code audits, tech strategy, R&D, and team training.',
              url: 'https://makeuslive.com/services#consulting',
            },
          },
        ],
      },
    },
    // BreadcrumbList for Homepage
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://makeuslive.com/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://makeuslive.com',
        },
      ],
    },
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
          {/* Background canvas */}
          <StarsCanvas />

          {/* Navigation */}
          <Navbar />

          {/* Main content */}
          <main className="relative z-10">{children}</main>

          {/* Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

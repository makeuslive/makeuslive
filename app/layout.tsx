import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'

import { Providers } from '@/components/providers'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { WebVitalsInit } from '@/components/web-vitals-init'
import { COPY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { globalJsonLd } from '@/lib/schema/global'

import './globals.css'

// =====================================================
// FONTS - Optimized for Performance
// Only 2 critical fonts with preload. Mono loaded on-demand.
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

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  weight: ['400', '500'],
  preload: false, // Only used in code blocks
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

// =====================================================
// METADATA - Clean, Semantic, Zero Spam
// =====================================================
export const metadata: Metadata = {
  title: {
    default: `${COPY.brand.name} | AI Product Development Agency`,
    template: `%s | ${COPY.brand.name}`,
  },
  description:
    'AI product development agency building scalable web & mobile apps for startups and enterprises. Expert in Next.js, React Native, and AI systems.',

  // Semantic keywords - international coverage without stuffing
  keywords: [
    // Core Services
    'AI development agency',
    'web development company',
    'mobile app development',
    'UI/UX design agency',
    'Next.js development',
    'React Native development',
    'design systems',
    'startup software development',
    'enterprise software',
    'digital product agency',

    // International - Major Markets
    'software development company India',
    'AI agency USA',
    'web development UK',
    'mobile app developers Dubai',
    'digital agency Singapore',
    'tech consultancy Australia',
    'app development Canada',

    // Brand
    'MakeUsLive',
    'Make Us Live',
    'Make Us Live Agency',
  ],

  authors: [
    { name: 'Make Us Live', url: 'https://www.makeuslive.com' },
  ],
  creator: 'Make Us Live',
  publisher: 'Make Us Live',

  metadataBase: new URL('https://www.makeuslive.com'),

  alternates: {
    canonical: './',
    languages: {
      'en-US': './',
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.makeuslive.com',
    siteName: 'Make Us Live',
    title: 'Make Us Live — AI Product Development Agency',
    description:
      'We build AI-powered products, web applications, mobile apps, and design systems that scale.',
    images: [
      {
        url: '/images/biglogo.png',
        width: 1200,
        height: 630,
        alt: 'Make Us Live - AI Product Development Agency',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@makeuslivee',
    creator: '@makeuslivee',
    title: 'Make Us Live — AI Product Development Agency',
    description:
      'AI-powered products, web development, mobile apps, and design systems.',
    images: ['/images/biglogo.png'],
  },

  robots: {
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

  manifest: '/manifest.json',

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '8af1e0fd48fa82f2',
  },

  category: 'technology',

  other: {
    'msapplication-TileColor': '#030014',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
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
        ibmPlexMono.variable,
        'antialiased'
      )}
      suppressHydrationWarning
    >
      <head>
        {/* Global JSON-LD - Organization + WebSite only */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-bg text-text',
          'overflow-x-hidden',
          spaceGrotesk.className
        )}
      >
        <Providers>
          {/* Layout wrapper handles navbar/footer visibility */}
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

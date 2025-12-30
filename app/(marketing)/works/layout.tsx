import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio & Case Studies - Our Work | Make Us Live',
  description:
    'Explore Make Us Live portfolio: Enterprise platforms, mobile apps, AI solutions, and web development projects. See real case studies with production-ready systems serving thousands of users. View our work in AI automation, Flutter apps, Next.js development, and more.',
  keywords: [
    // Portfolio searches
    'makeuslive portfolio',
    'makeuslive case studies',
    'make us live portfolio',
    'digital agency portfolio India',
    'creative studio portfolio',
    'web development case studies',
    'mobile app case studies',

    // Service-specific portfolio
    'AI project examples',
    'enterprise software case studies',
    'Flutter app portfolio',
    'Next.js project examples',
    'React development portfolio',

    // Intent-based searches
    'best digital agency portfolio',
    'top web development projects India',
    'mobile app development examples',
    'successful startup projects',
    'production app examples',

    // Location-based
    'digital agency work Bhopal',
    'software company projects India',
    'creative agency case studies India',
  ],
  openGraph: {
    title: 'Portfolio & Case Studies - Our Work | Make Us Live',
    description:
      'Explore our portfolio of production-ready projects: Enterprise platforms, mobile apps with 10K+ downloads, AI solutions, and web development.',
    url: 'https://www.makeuslive.com/works',
    type: 'website',
    images: [
      {
        url: '/og-works.png',
        width: 1200,
        height: 630,
        alt: 'Make Us Live Portfolio - Case Studies & Projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio & Case Studies | Make Us Live',
    description:
      'Enterprise platforms, mobile apps, AI solutions. See our production-ready projects.',
    images: ['/twitter-works.png'],
  },
  alternates: {
    canonical: 'https://www.makeuslive.com/works',
  },
}

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

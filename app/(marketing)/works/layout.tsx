import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Portfolio & Case Studies - Creative Work That Inspires',
    description:
        'Explore MakeUsLive creative studio portfolio. Featured work includes AI-powered analytics (340% conversion boost), e-commerce platforms (98% Lighthouse), and mobile apps (4.9★ rating). See how we craft digital experiences that inspire and convert.',
    keywords: [
        // Portfolio Keywords
        'creative portfolio',
        'design portfolio',
        'agency portfolio',
        'case studies',
        'creative work',
        'featured projects',

        // Project Types
        'AI projects',
        'web development projects',
        'mobile app portfolio',
        'design system examples',
        'e-commerce development',
        'SaaS portfolio',

        // Results
        'conversion optimization results',
        'performance optimization',
        'app store success',
        'startup success stories',

        // Tech
        'Next.js portfolio',
        'React projects',
        'React Native apps',
    ],
    openGraph: {
        title: 'Portfolio & Case Studies | MakeUsLive Creative Studio',
        description:
            'Explore our creative portfolio. AI analytics, e-commerce platforms, mobile apps, and more. Results that speak for themselves.',
        url: 'https://makeuslive.com/works',
        type: 'website',
        images: [
            {
                url: '/og-works.png',
                width: 1200,
                height: 630,
                alt: 'MakeUsLive Creative Portfolio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Portfolio & Case Studies | MakeUsLive Creative Studio',
        description:
            'Explore our creative portfolio. Results that speak for themselves.',
        images: ['/twitter-works.png'],
    },
    alternates: {
        canonical: 'https://makeuslive.com/works',
    },
}

export default function WorksLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Creative Services - AI, Design, Web & Mobile Development',
    description:
        'Explore Make Us Live creative studio services: AI-powered products with LLM integration, custom web development using Next.js & React, mobile app development, design systems, and creative direction. Full-service boutique agency for startups and enterprises.',
    keywords: [
        // Creative Services
        'creative services',
        'creative studio services',
        'boutique agency services',
        'full-service creative agency',
        'creative direction',
        'art direction',

        // AI Services
        'AI development services',
        'LLM integration',
        'generative AI services',
        'AI automation',
        'machine learning services',

        // Web & Mobile
        'web development services',
        'mobile app development',
        'Next.js development',
        'React development',
        'React Native services',

        // Design
        'design system services',
        'UI/UX design services',
        'brand identity design',
        'visual design services',
        'motion design',

        // Business
        'digital transformation',
        'startup development services',
        'enterprise software',
        'SaaS development',
    ],
    openGraph: {
        title: 'Creative Services - AI, Design, Web & Mobile | Make Us Live Studio',
        description:
            'Full-service creative studio: AI products, web development, mobile apps, and design systems. Transform your vision into reality.',
        url: 'https://makeuslive.com/services',
        type: 'website',
        images: [
            {
                url: '/og-services.png',
                width: 1200,
                height: 630,
                alt: 'Make Us Live Creative Services',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Creative Services - AI, Design, Web & Mobile',
        description:
            'Full-service creative studio: AI products, web development, mobile apps, and design systems.',
        images: ['/twitter-services.png'],
    },
    alternates: {
        canonical: 'https://makeuslive.com/services',
    },
}

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}

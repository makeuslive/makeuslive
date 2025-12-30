import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FAQ - Common Questions About Our Services | Make Us Live',
    description:
        'Find answers to frequently asked questions about Make Us Live services, pricing, process, and technologies. Learn how we work with startups and enterprises, project timelines, tech stack, and quality assurance.',
    keywords: [
        // Question-based searches
        'how does makeuslive work',
        'makeuslive pricing',
        'makeuslive process',
        'digital agency FAQ',
        'web development questions',
        'app development FAQ',

        // Service questions
        'how long does web development take',
        'mobile app development timeline',
        'AI development cost',
        'design system pricing',
        'startup development services',

        // Process questions
        'digital agency process',
        'software development methodology',
        'agile development India',
        'project management process',

        // Technology questions
        'Next.js development company',
        'React Native agency',
        'AI development company India',
        'what technologies does makeuslive use',
    ],
    openGraph: {
        title: 'FAQ - Common Questions | Make Us Live',
        description:
            'Answers to common questions about our services, process, pricing, and technologies.',
        url: 'https://www.makeuslive.com/faq',
        type: 'website',
        images: [
            {
                url: '/og-faq.png',
                width: 1200,
                height: 630,
                alt: 'Make Us Live FAQ',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FAQ - Questions About Our Services',
        description:
            'Find answers about our services, process, pricing, and technologies.',
        images: ['/twitter-faq.png'],
    },
    alternates: {
        canonical: 'https://www.makeuslive.com/faq',
    },
}

// FAQPage structured data for rich snippets
const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What services does Make Us Live offer?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'We offer AI-powered products, design systems, web development with Next.js and React, mobile applications with React Native and Flutter, and technical consulting.',
            },
        },
        {
            '@type': 'Question',
            name: 'How long does a typical project take?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Project timelines vary based on scope. A typical web project takes 4-8 weeks, while mobile apps may take 6-12 weeks. We provide detailed timelines during discovery.',
            },
        },
        {
            '@type': 'Question',
            name: 'Do you work with startups?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes! We love working with startups and have experience helping early-stage companies build their first products with flexible engagement models.',
            },
        },
        {
            '@type': 'Question',
            name: 'What technologies do you use?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'We use Next.js, React, TypeScript, Node.js, Python, React Native, Flutter, and various AI/ML frameworks. We choose the best stack for each project.',
            },
        },
    ],
}

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
            />
            {children}
        </>
    )
}

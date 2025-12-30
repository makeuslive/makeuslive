import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog - Insights on AI, Design, Development & Technology',
    description:
        'Read the latest insights from Make Us Live on AI, web development, design systems, UX research, and technology trends. Expert articles and tutorials from our engineering and design team.',
    keywords: [
        'tech blog',
        'AI articles',
        'web development tutorials',
        'design system blog',
        'React tutorials',
        'Next.js guides',
        'UX research articles',
        'software engineering blog',
        'startup insights',
        'technology trends',
        'GSAP animation tutorials',
        'TypeScript guides',
    ],
    openGraph: {
        title: 'Blog - Insights on AI, Design & Development | Make Us Live',
        description:
            'Expert insights on AI, web development, design systems, and technology trends from the Make Us Live team.',
        url: 'https://makeuslive.com/blog',
        type: 'website',
        images: [
            {
                url: '/og-blog.png',
                width: 1200,
                height: 630,
                alt: 'Make Us Live Blog',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog - Insights on AI, Design & Development',
        description:
            'Expert insights on AI, web development, design systems, and technology trends.',
        images: ['/twitter-blog.png'],
    },
    alternates: {
        canonical: 'https://makeuslive.com/blog',
    },
}

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}

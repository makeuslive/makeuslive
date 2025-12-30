import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Us - Meet the Creative Studio Team',
    description:
        'Discover Make Us Live - a boutique creative studio and digital agency founded by passionate engineers and designers. We think like artists, research like scientists. Meet founders Abhishek Jha, Rishi Soni, and Vikramaditya Jha. Crafting AI-powered digital experiences since 2019.',
    keywords: [
        'about Make Us Live',
        'creative studio team',
        'boutique agency founders',
        'Abhishek Jha',
        'Rishi Soni',
        'Vikramaditya Jha',
        'creative studio India',
        'digital agency story',
        'design studio mission',
        'tech startup founders',
        'creative technology team',
    ],
    openGraph: {
        title: 'About Make Us Live - Meet the Creative Studio Team',
        description:
            'Discover the creative minds behind Make Us Live. We think like artists, research like scientists, and build products that scale.',
        url: 'https://makeuslive.com/about',
        type: 'website',
        images: [
            {
                url: '/og-about.png',
                width: 1200,
                height: 630,
                alt: 'Make Us Live Creative Studio Team',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Make Us Live - Meet the Creative Studio Team',
        description:
            'Discover the creative minds behind Make Us Live. We think like artists, research like scientists.',
        images: ['/twitter-about.png'],
    },
    alternates: {
        canonical: 'https://makeuslive.com/about',
    },
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}

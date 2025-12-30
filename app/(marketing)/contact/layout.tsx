import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Us - Get a Free Consultation',
    description:
        'Contact Make Us Live for a free consultation. Tell us about your project and get expert guidance on AI, web development, mobile apps, or design systems. We respond within 24 hours. Email: hello@makeuslive.com',
    keywords: [
        'contact digital agency',
        'hire web developers',
        'hire AI developers',
        'free consultation',
        'project inquiry',
        'software development quote',
        'web development contact',
        'mobile app development inquiry',
        'design agency contact',
        'startup consultation',
    ],
    openGraph: {
        title: 'Contact Make Us Live - Get a Free Consultation',
        description:
            'Tell us about your project. Free consultation for AI, web development, mobile apps, and design systems. We respond within 24 hours.',
        url: 'https://www.makeuslive.com/contact',
        type: 'website',
        images: [
            {
                url: '/og-contact.png',
                width: 1200,
                height: 630,
                alt: 'Contact Make Us Live',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Make Us Live - Get a Free Consultation',
        description:
            'Tell us about your project. Free consultation with response within 24 hours.',
        images: ['/twitter-contact.png'],
    },
    alternates: {
        canonical: 'https://www.makeuslive.com/contact',
    },
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Client Testimonials - What Our Clients Say | Make Us Live',
    description:
        'Read testimonials from our satisfied clients. See how Make Us Live has helped startups and enterprises build exceptional digital products with 98% client satisfaction.',
    keywords: [
        'makeuslive testimonials',
        'client reviews',
        'customer feedback',
        'web development reviews',
        'app development testimonials',
        'design agency reviews',
    ],
    openGraph: {
        title: 'Client Testimonials | Make Us Live',
        description: 'What our clients say about working with Make Us Live.',
        url: 'https://www.makeuslive.com/testimonials',
        type: 'website',
    },
    alternates: {
        canonical: 'https://www.makeuslive.com/testimonials',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function TestimonialsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}

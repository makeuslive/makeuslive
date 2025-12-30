import { Metadata } from 'next'

const baseUrl = 'https://www.makeuslive.com'

export const metadata: Metadata = {
    title: 'Web Design Company | Custom Website Design Services',
    description: 'Make Us Live is a top web design company creating stunning, responsive websites that convert. Custom web design services for startups, SaaS, and enterprises. Get a free quote.',
    keywords: [
        'web design company',
        'web design agency',
        'website design services',
        'custom web design',
        'responsive web design',
        'web design for startups',
        'SaaS web design',
        'enterprise web design',
        'ecommerce web design',
        'professional web design',
    ],
    alternates: {
        canonical: `${baseUrl}/web-design`,
    },
    openGraph: {
        title: 'Web Design Company | Custom Website Design Services | Make Us Live',
        description: 'Award-winning web design company creating stunning websites that convert. Custom, responsive designs for startups and enterprises.',
        url: `${baseUrl}/web-design`,
        siteName: 'Make Us Live',
        type: 'website',
        images: [
            {
                url: `${baseUrl}/images/og/web-design.png`,
                width: 1200,
                height: 630,
                alt: 'Make Us Live - Web Design Services',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Web Design Company | Make Us Live',
        description: 'Custom web design services that convert visitors into customers.',
    },
}

export default function WebDesignLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Service',
                        '@id': `${baseUrl}/web-design#service`,
                        name: 'Web Design Services',
                        alternateName: ['Website Design', 'Custom Web Design', 'Responsive Web Design'],
                        description: 'Professional web design services creating custom, responsive websites that drive business growth.',
                        provider: {
                            '@type': 'Organization',
                            '@id': `${baseUrl}/#organization`,
                            name: 'Make Us Live',
                        },
                        serviceType: 'Web Design',
                        areaServed: [
                            { '@type': 'Country', name: 'United States' },
                            { '@type': 'Country', name: 'United Kingdom' },
                            { '@type': 'Country', name: 'India' },
                            { '@type': 'GeoShape', name: 'Worldwide' },
                        ],
                        hasOfferCatalog: {
                            '@type': 'OfferCatalog',
                            name: 'Web Design Services',
                            itemListElement: [
                                {
                                    '@type': 'Offer',
                                    itemOffered: {
                                        '@type': 'Service',
                                        name: 'Custom Website Design',
                                        description: 'Bespoke website designs tailored to your brand',
                                    },
                                },
                                {
                                    '@type': 'Offer',
                                    itemOffered: {
                                        '@type': 'Service',
                                        name: 'Responsive Web Design',
                                        description: 'Mobile-first designs that work on all devices',
                                    },
                                },
                                {
                                    '@type': 'Offer',
                                    itemOffered: {
                                        '@type': 'Service',
                                        name: 'E-commerce Design',
                                        description: 'Online store designs optimized for conversions',
                                    },
                                },
                            ],
                        },
                        url: `${baseUrl}/web-design`,
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        '@id': `${baseUrl}/web-design#faq`,
                        mainEntity: [
                            {
                                '@type': 'Question',
                                name: 'How much does custom web design cost?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'Custom web design projects typically range from $5,000 to $50,000+ depending on complexity, features, and scope. We provide detailed quotes after understanding your specific requirements.',
                                },
                            },
                            {
                                '@type': 'Question',
                                name: 'How long does it take to design a website?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'A typical web design project takes 4-12 weeks from discovery to launch. Complex projects with custom features may take longer. We provide detailed timelines during our initial consultation.',
                                },
                            },
                            {
                                '@type': 'Question',
                                name: 'Do you design responsive websites?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'Yes! All our websites are designed mobile-first and fully responsive. They work seamlessly across all devices including phones, tablets, laptops, and desktops.',
                                },
                            },
                            {
                                '@type': 'Question',
                                name: 'What makes Make Us Live different from other web design agencies?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'We combine stunning design with conversion optimization. Every design decision is backed by data and UX research. Plus, we don\'t just design—we build production-ready websites with Next.js.',
                                },
                            },
                        ],
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Home',
                                item: baseUrl,
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: 'Web Design',
                                item: `${baseUrl}/web-design`,
                            },
                        ],
                    }),
                }}
            />
            {children}
        </>
    )
}

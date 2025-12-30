import { Metadata } from 'next'

const baseUrl = 'https://www.makeuslive.com'

export const metadata: Metadata = {
    title: 'UI UX Design Agency | User Experience Design Services',
    description: 'Make Us Live is a top UI UX design agency creating intuitive, user-centered digital experiences. UX design services for SaaS, mobile apps, and enterprise products.',
    keywords: [
        'UI UX design agency',
        'UX design services',
        'user experience design',
        'UI design company',
        'product design agency',
        'UX consulting',
        'interface design',
        'user research',
        'design systems',
    ],
    alternates: {
        canonical: `${baseUrl}/ui-ux-design`,
    },
    openGraph: {
        title: 'UI UX Design Agency | User Experience Design | Make Us Live',
        description: 'Create delightful user experiences with our UI UX design agency. Research-driven design that users love.',
        url: `${baseUrl}/ui-ux-design`,
        siteName: 'Make Us Live',
        type: 'website',
    },
}

export default function UIUXLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Service',
                        '@id': `${baseUrl}/ui-ux-design#service`,
                        name: 'UI UX Design Services',
                        alternateName: ['UX Design', 'User Experience Design', 'Interface Design'],
                        description: 'Research-driven UI/UX design services creating intuitive digital experiences.',
                        provider: { '@type': 'Organization', '@id': `${baseUrl}/#organization` },
                        serviceType: 'UI UX Design',
                        url: `${baseUrl}/ui-ux-design`,
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
                            { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
                            { '@type': 'ListItem', position: 2, name: 'UI UX Design', item: `${baseUrl}/ui-ux-design` },
                        ],
                    }),
                }}
            />
            {children}
        </>
    )
}

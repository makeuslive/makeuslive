import { Metadata } from 'next'

const baseUrl = 'https://www.makeuslive.com'

export const metadata: Metadata = {
    title: 'App Development Company | Mobile App Development Services',
    description: 'Make Us Live is a leading mobile app development company building iOS, Android & cross-platform apps. Custom app development services for startups and enterprises.',
    keywords: [
        'app development company',
        'mobile app development company',
        'app development services',
        'iOS app development',
        'Android app development',
        'cross-platform app development',
        'React Native development',
        'Flutter app development',
        'custom mobile apps',
    ],
    alternates: {
        canonical: `${baseUrl}/app-development`,
    },
    openGraph: {
        title: 'App Development Company | Mobile App Development | Make Us Live',
        description: 'Build powerful mobile apps with our expert team. iOS, Android, and cross-platform development.',
        url: `${baseUrl}/app-development`,
        siteName: 'Make Us Live',
        type: 'website',
    },
}

export default function AppDevelopmentLayout({
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
                        '@id': `${baseUrl}/app-development#service`,
                        name: 'Mobile App Development Services',
                        alternateName: ['App Development', 'iOS Development', 'Android Development'],
                        description: 'Full-service mobile app development company creating iOS, Android, and cross-platform applications.',
                        provider: {
                            '@type': 'Organization',
                            '@id': `${baseUrl}/#organization`,
                        },
                        serviceType: 'Mobile App Development',
                        areaServed: { '@type': 'GeoShape', name: 'Worldwide' },
                        url: `${baseUrl}/app-development`,
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
                            { '@type': 'ListItem', position: 2, name: 'App Development', item: `${baseUrl}/app-development` },
                        ],
                    }),
                }}
            />
            {children}
        </>
    )
}

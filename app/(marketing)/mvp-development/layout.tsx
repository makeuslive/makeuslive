import { Metadata } from 'next'

const baseUrl = 'https://www.makeuslive.com'

export const metadata: Metadata = {
    title: 'MVP Development Company | Startup MVP Development Services',
    description: 'Make Us Live is an MVP development company helping startups launch fast with minimum viable products. Rapid prototyping and lean startup development services.',
    keywords: [
        'MVP development company',
        'minimum viable product development',
        'startup MVP development',
        'rapid prototyping',
        'lean startup development',
        'MVP for startups',
        'product prototype',
        'startup development agency',
    ],
    alternates: {
        canonical: `${baseUrl}/mvp-development`,
    },
    openGraph: {
        title: 'MVP Development Company | Startup MVP Services | Make Us Live',
        description: 'Launch your startup faster with our MVP development services. From idea to product in weeks.',
        url: `${baseUrl}/mvp-development`,
        siteName: 'Make Us Live',
        type: 'website',
    },
}

export default function MVPLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Service',
                        '@id': `${baseUrl}/mvp-development#service`,
                        name: 'MVP Development Services',
                        alternateName: ['Startup MVP Development', 'Minimum Viable Product', 'Rapid Prototyping'],
                        description: 'MVP development services for startups looking to validate ideas fast and launch products quickly.',
                        provider: { '@type': 'Organization', '@id': `${baseUrl}/#organization` },
                        serviceType: 'MVP Development',
                        url: `${baseUrl}/mvp-development`,
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
                            { '@type': 'ListItem', position: 2, name: 'MVP Development', item: `${baseUrl}/mvp-development` },
                        ],
                    }),
                }}
            />
            {children}
        </>
    )
}

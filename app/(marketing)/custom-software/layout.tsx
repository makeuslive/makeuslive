import { Metadata } from 'next'

const baseUrl = 'https://www.makeuslive.com'

export const metadata: Metadata = {
    title: 'Custom Software Development Company | Enterprise Solutions',
    description: 'Make Us Live is a custom software development company building scalable enterprise solutions, ERP systems, CRM platforms, and bespoke business software.',
    keywords: [
        'custom software development',
        'software development company',
        'enterprise software development',
        'bespoke software solutions',
        'ERP development',
        'CRM development',
        'business software',
        'custom application development',
    ],
    alternates: {
        canonical: `${baseUrl}/custom-software`,
    },
    openGraph: {
        title: 'Custom Software Development | Enterprise Solutions | Make Us Live',
        description: 'Build scalable enterprise software tailored to your business needs.',
        url: `${baseUrl}/custom-software`,
        siteName: 'Make Us Live',
        type: 'website',
    },
}

export default function CustomSoftwareLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Service',
                        '@id': `${baseUrl}/custom-software#service`,
                        name: 'Custom Software Development',
                        alternateName: ['Enterprise Software', 'Bespoke Software', 'Business Software'],
                        description: 'Custom software development for enterprises including ERP, CRM, and bespoke solutions.',
                        provider: { '@type': 'Organization', '@id': `${baseUrl}/#organization` },
                        serviceType: 'Software Development',
                        url: `${baseUrl}/custom-software`,
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
                            { '@type': 'ListItem', position: 2, name: 'Custom Software', item: `${baseUrl}/custom-software` },
                        ],
                    }),
                }}
            />
            {children}
        </>
    )
}

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Careers - Join Our Creative Team | Make Us Live',
    description:
        'Join Make Us Live creative studio. We are hiring talented engineers, designers, and product managers. Remote-first culture, competitive pay, growth opportunities. Explore open positions in web development, mobile apps, AI, and design.',
    keywords: [
        // Job searches
        'jobs at makeuslive',
        'makeuslive careers',
        'make us live jobs',
        'digital agency jobs India',
        'creative studio careers',

        // Role-specific
        'frontend developer jobs India',
        'React developer jobs remote',
        'Next.js developer jobs',
        'UI/UX designer jobs India',
        'mobile app developer jobs',
        'Flutter developer jobs',
        'AI engineer jobs India',

        // Location-based
        'remote developer jobs India',
        'Bhopal IT jobs',
        'software engineer jobs Bhopal',
        'design jobs remote India',

        // Culture-based
        'remote first company India',
        'startup jobs India',
        'creative agency hiring',
        'tech startup careers',
    ],
    openGraph: {
        title: 'Careers - Join Our Creative Team | Make Us Live',
        description:
            'We are hiring! Join our remote-first creative studio. Open positions in engineering, design, and product.',
        url: 'https://www.makeuslive.com/careers',
        type: 'website',
        images: [
            {
                url: '/og-careers.png',
                width: 1200,
                height: 630,
                alt: 'Make Us Live Careers - Join Our Team',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Careers - Join Our Team | Make Us Live',
        description:
            'Remote-first creative studio hiring engineers, designers, and product managers.',
        images: ['/twitter-careers.png'],
    },
    alternates: {
        canonical: 'https://www.makeuslive.com/careers',
    },
}

// JobPosting structured data for Google Jobs
const jobPostingsStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'JobPosting',
            '@id': 'https://www.makeuslive.com/careers#senior-frontend-engineer',
            title: 'Senior Frontend Engineer',
            description: 'We are looking for an experienced frontend engineer with 5+ years of React/Next.js experience to help build amazing user experiences.',
            identifier: {
                '@type': 'PropertyValue',
                name: 'Make Us Live',
                value: 'senior-frontend-engineer',
            },
            datePosted: '2025-12-01',
            validThrough: '2026-06-01',
            employmentType: 'FULL_TIME',
            hiringOrganization: {
                '@type': 'Organization',
                name: 'Make Us Live',
                sameAs: 'https://www.makeuslive.com',
                logo: 'https://www.makeuslive.com/images/biglogo.png',
            },
            jobLocation: {
                '@type': 'Place',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Bhopal',
                    addressRegion: 'Madhya Pradesh',
                    addressCountry: 'IN',
                },
            },
            jobLocationType: 'TELECOMMUTE',
            applicantLocationRequirements: {
                '@type': 'Country',
                name: 'India',
            },
            baseSalary: {
                '@type': 'MonetaryAmount',
                currency: 'INR',
                value: {
                    '@type': 'QuantitativeValue',
                    minValue: 1500000,
                    maxValue: 3000000,
                    unitText: 'YEAR',
                },
            },
        },
        {
            '@type': 'JobPosting',
            '@id': 'https://www.makeuslive.com/careers#ui-ux-designer',
            title: 'UI/UX Designer',
            description: 'Join our design team to create beautiful, functional interfaces. 3+ years of UI/UX design experience required.',
            identifier: {
                '@type': 'PropertyValue',
                name: 'Make Us Live',
                value: 'ui-ux-designer',
            },
            datePosted: '2025-12-01',
            validThrough: '2026-06-01',
            employmentType: 'FULL_TIME',
            hiringOrganization: {
                '@type': 'Organization',
                name: 'Make Us Live',
                sameAs: 'https://www.makeuslive.com',
                logo: 'https://www.makeuslive.com/images/biglogo.png',
            },
            jobLocation: {
                '@type': 'Place',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Bhopal',
                    addressRegion: 'Madhya Pradesh',
                    addressCountry: 'IN',
                },
            },
            jobLocationType: 'TELECOMMUTE',
            applicantLocationRequirements: {
                '@type': 'Country',
                name: 'India',
            },
            baseSalary: {
                '@type': 'MonetaryAmount',
                currency: 'INR',
                value: {
                    '@type': 'QuantitativeValue',
                    minValue: 800000,
                    maxValue: 1800000,
                    unitText: 'YEAR',
                },
            },
        },
    ],
}

export default function CareerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingsStructuredData) }}
            />
            {children}
        </>
    )
}

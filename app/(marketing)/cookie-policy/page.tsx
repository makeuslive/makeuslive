import { Metadata } from 'next'
import { formatDisplayDate } from '@/lib/date-utils'

export const metadata: Metadata = {
    title: 'Cookie Policy - How We Use Cookies | Make Us Live',
    description:
        'Learn how Make Us Live uses cookies and similar technologies on our website. Understand your choices and how to manage cookie preferences.',
    keywords: [
        'makeuslive cookie policy',
        'cookies',
        'website cookies',
        'tracking technologies',
        'cookie preferences',
        'GDPR cookies',
        'DPDP Act cookies',
    ],
    openGraph: {
        title: 'Cookie Policy | Make Us Live',
        description: 'How we use cookies and tracking technologies on our website.',
        url: 'https://www.makeuslive.com/cookie-policy',
        type: 'website',
    },
    alternates: {
        canonical: 'https://www.makeuslive.com/cookie-policy',
    },
    robots: {
        index: true,
        follow: true,
    },
}

const EFFECTIVE_DATE = new Date('2025-01-01')
const LAST_UPDATED = new Date('2025-01-01')

const COOKIE_TYPES = [
    {
        name: 'Essential Cookies',
        description: 'Required for the website to function properly. These cannot be disabled.',
        examples: ['Session management', 'Security tokens', 'Load balancing'],
        duration: 'Session or up to 1 year',
    },
    {
        name: 'Analytics Cookies',
        description: 'Help us understand how visitors interact with our website.',
        examples: ['Vercel Analytics', 'Page view tracking', 'Performance monitoring'],
        duration: 'Up to 2 years',
    },
    {
        name: 'Functional Cookies',
        description: 'Enable enhanced functionality and personalization.',
        examples: ['Language preferences', 'Theme settings', 'Form data'],
        duration: 'Up to 1 year',
    },
]

export default function CookiePolicyPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-4xl font-bold mb-8 text-gold">Cookie Policy</h1>

                <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-text-muted mb-2">
                        <strong className="text-text">Effective Date:</strong> {formatDisplayDate(EFFECTIVE_DATE)}
                    </p>
                    <p className="text-text-muted">
                        <strong className="text-text">Last Updated:</strong> {formatDisplayDate(LAST_UPDATED)}
                    </p>
                </div>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">1. What Are Cookies?</h2>
                    <p className="text-text-dim">
                        Cookies are small text files that are placed on your device when you visit a website.
                        They are widely used to make websites work more efficiently and to provide information
                        to website owners. We use cookies and similar technologies to enhance your experience
                        on our website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">2. Types of Cookies We Use</h2>
                    <div className="space-y-6">
                        {COOKIE_TYPES.map((cookie, index) => (
                            <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold text-gold mb-2">{cookie.name}</h3>
                                <p className="text-text-dim mb-3">{cookie.description}</p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {cookie.examples.map((example, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 text-xs rounded-full bg-white/10 text-text-muted"
                                        >
                                            {example}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-text-muted text-sm">
                                    <strong>Duration:</strong> {cookie.duration}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">3. Managing Cookies</h2>
                    <p className="text-text-dim mb-4">
                        Most web browsers allow you to control cookies through their settings. You can:
                    </p>
                    <ul className="list-disc pl-6 text-text-dim space-y-2">
                        <li>View what cookies are stored on your device and delete them individually</li>
                        <li>Block third-party cookies</li>
                        <li>Block cookies from specific websites</li>
                        <li>Block all cookies</li>
                        <li>Delete all cookies when you close your browser</li>
                    </ul>
                    <p className="text-text-dim mt-4">
                        Please note that restricting cookies may impact the functionality of our website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">4. Third-Party Cookies</h2>
                    <p className="text-text-dim">
                        We use services from third parties that may set cookies on your device:
                    </p>
                    <ul className="list-disc pl-6 text-text-dim space-y-2 mt-4">
                        <li><strong>Vercel Analytics:</strong> For website performance and usage analytics</li>
                        <li><strong>Vercel Speed Insights:</strong> For monitoring Core Web Vitals</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">5. Updates to This Policy</h2>
                    <p className="text-text-dim">
                        We may update this Cookie Policy from time to time. Any changes will be posted on
                        this page with an updated revision date. We encourage you to review this policy
                        periodically.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">6. Contact Us</h2>
                    <p className="text-text-dim">
                        If you have any questions about our use of cookies, please contact us at:{' '}
                        <a href="mailto:hello@makeuslive.com" className="text-gold hover:underline">
                            hello@makeuslive.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    )
}

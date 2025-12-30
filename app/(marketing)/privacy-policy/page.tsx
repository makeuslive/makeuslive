import { Metadata } from 'next'
import { formatDisplayDate } from '@/lib/date-utils'

export const metadata: Metadata = {
    title: 'Privacy Policy - Data Protection & Your Rights | Make Us Live',
    description:
        'Read Make Us Live privacy policy. Learn how we collect, use, store, and protect your personal data. Compliant with DPDP Act 2023 and GDPR. Your privacy rights and data protection information.',
    keywords: [
        'makeuslive privacy policy',
        'data protection',
        'DPDP Act compliance',
        'GDPR compliance',
        'privacy rights',
        'data collection policy',
        'cookie policy',
    ],
    openGraph: {
        title: 'Privacy Policy | Make Us Live',
        description: 'How we collect, use, and protect your personal data.',
        url: 'https://www.makeuslive.com/privacy-policy',
        type: 'website',
    },
    alternates: {
        canonical: 'https://www.makeuslive.com/privacy-policy',
    },
    robots: {
        index: true,
        follow: true,
    },
}

// Effective date and change log
const EFFECTIVE_DATE = new Date('2025-01-01')
const LAST_UPDATED = new Date('2025-12-27')

const CHANGE_LOG = [
    { date: new Date('2025-12-27'), description: 'Updated cookie consent section to align with DPDP Act 2023' },
    { date: new Date('2025-07-15'), description: 'Added data retention policies and user rights section' },
    { date: new Date('2025-01-01'), description: 'Initial privacy policy published' },
]

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-4xl font-bold mb-8 text-gold">Privacy Policy</h1>

                <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-text-muted mb-2">
                        <strong className="text-text">Effective Date:</strong> {formatDisplayDate(EFFECTIVE_DATE)}
                    </p>
                    <p className="text-text-muted">
                        <strong className="text-text">Last Updated:</strong> {formatDisplayDate(LAST_UPDATED)}
                    </p>
                </div>

                <section id="change-log" className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">Change Log</h2>
                    <ul className="list-none space-y-3">
                        {CHANGE_LOG.map((change, index) => (
                            <li key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-start gap-3">
                                    <span className="text-gold font-medium whitespace-nowrap">
                                        {formatDisplayDate(change.date)}
                                    </span>
                                    <span className="text-text-dim">{change.description}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">1. Introduction</h2>
                    <p className="text-text-dim">
                        Welcome to Make Us Live. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">2. Data We Collect</h2>
                    <p className="text-text-dim mb-4">
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="list-disc pl-6 text-text-dim space-y-2">
                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                        <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">3. How We Use Your Data</h2>
                    <p className="text-text-dim mb-4">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 text-text-dim space-y-2">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">4. Contact Us</h2>
                    <p className="text-text-dim">
                        If you have any questions about this privacy policy, please contact us at: <a href="mailto:hello@makeuslive.com" className="text-gold hover:underline">hello@makeuslive.com</a>
                    </p>
                </section>
            </div>
        </div>
    )
}

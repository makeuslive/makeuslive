'use client'

import { useEffect, useState } from 'react'
import { formatDisplayDate } from '@/lib/date-utils'

interface LegalPage {
    id: string
    slug: string
    title: string
    content: string
    effectiveDate: string
    lastUpdated: string
    changeLog: { date: string; description: string }[]
    metaTitle: string
    metaDescription: string
    status: 'draft' | 'published'
}

// Fallback content when API is unavailable
const FALLBACK_CONTENT = {
    effectiveDate: '2025-01-01',
    lastUpdated: '2025-12-27',
    content: `
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-text">1. Introduction</h2>
      <p class="text-text-dim">
        Welcome to Make Us Live. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-text">2. Data We Collect</h2>
      <p class="text-text-dim mb-4">
        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
      </p>
      <ul class="list-disc pl-6 text-text-dim space-y-2">
        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
        <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
        <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-text">3. How We Use Your Data</h2>
      <p class="text-text-dim mb-4">
        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
      </p>
      <ul class="list-disc pl-6 text-text-dim space-y-2">
        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
        <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
        <li>Where we need to comply with a legal or regulatory obligation.</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-text">4. Contact Us</h2>
      <p class="text-text-dim">
        If you have any questions about this privacy policy, please contact us at: <a href="mailto:hello@makeuslive.com" class="text-gold hover:underline">hello@makeuslive.com</a>
      </p>
    </section>
  `,
    changeLog: [
        { date: '2025-12-27', description: 'Updated cookie consent section to align with DPDP Act 2023' },
        { date: '2025-07-15', description: 'Added data retention policies and user rights section' },
        { date: '2025-01-01', description: 'Initial privacy policy published' },
    ],
}

export default function PrivacyPolicyPage() {
    const [page, setPage] = useState<LegalPage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await fetch('/api/legal?slug=privacy-policy')
                const data = await res.json()
                if (data.success && data.data) {
                    setPage(data.data)
                } else {
                    setError(true)
                }
            } catch (err) {
                console.error('Error fetching privacy policy:', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchPage()
    }, [])

    // Show loading state
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">
                <div className="max-w-3xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 bg-white/10 rounded w-48"></div>
                        <div className="h-4 bg-white/5 rounded w-full"></div>
                        <div className="h-4 bg-white/5 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        )
    }

    // Use API data or fallback
    const content = page?.content || FALLBACK_CONTENT.content
    const effectiveDate = page?.effectiveDate || FALLBACK_CONTENT.effectiveDate
    const lastUpdated = page?.lastUpdated || FALLBACK_CONTENT.lastUpdated
    const changeLog = page?.changeLog || FALLBACK_CONTENT.changeLog

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <h1 className="text-4xl font-bold mb-8 text-gold">Privacy Policy</h1>

                {/* Dates Box */}
                <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-text-muted mb-2">
                        <strong className="text-text">Effective Date:</strong> {formatDisplayDate(new Date(effectiveDate))}
                    </p>
                    <p className="text-text-muted">
                        <strong className="text-text">Last Updated:</strong> {formatDisplayDate(new Date(lastUpdated))}
                    </p>
                </div>

                {/* Change Log */}
                {changeLog.length > 0 && (
                    <section id="change-log" className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-text">Change Log</h2>
                        <ul className="list-none space-y-3">
                            {changeLog.map((change, index) => (
                                <li key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-start gap-3">
                                        <span className="text-gold font-medium whitespace-nowrap">
                                            {formatDisplayDate(new Date(change.date))}
                                        </span>
                                        <span className="text-text-dim">{change.description}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Content */}
                <div
                    className="prose prose-invert max-w-none
            prose-headings:text-text prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
            prose-p:text-text-dim prose-p:leading-relaxed
            prose-li:text-text-dim
            prose-a:text-gold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-text
            prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
          "
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    )
}

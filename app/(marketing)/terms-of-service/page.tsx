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
      <h2 class="text-2xl font-semibold mb-4 text-text">1. Agreement to Terms</h2>
      <p class="text-text-dim">
        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Make Us Live ("we," "us" or "our"), concerning your access to and use of the makeuslive.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-text">2. Intellectual Property Rights</h2>
      <p class="text-text-dim">
        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-text">3. User Representations</h2>
      <p class="text-text-dim mb-4">By using the Site, you represent and warrant that:</p>
      <ul class="list-disc pl-6 text-text-dim space-y-2">
        <li>All registration information you submit will be true, accurate, current, and complete.</li>
        <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
        <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-text">4. Contact Us</h2>
      <p class="text-text-dim">
        If you have any questions about these Terms of Service, please contact us at: <a href="mailto:hello@makeuslive.com" class="text-gold hover:underline">hello@makeuslive.com</a>
      </p>
    </section>
  `,
    changeLog: [
        { date: '2025-12-27', description: 'Updated service terms and user obligations' },
        { date: '2025-01-01', description: 'Initial terms of service published' },
    ],
}

export default function TermsOfServicePage() {
    const [page, setPage] = useState<LegalPage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await fetch('/api/legal?slug=terms-of-service')
                const data = await res.json()
                if (data.success && data.data) {
                    setPage(data.data)
                } else {
                    setError(true)
                }
            } catch (err) {
                console.error('Error fetching terms of service:', err)
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
                <h1 className="text-4xl font-bold mb-8 text-gold">Terms of Service</h1>

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

'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { formatDisplayDate, formatDisplayDateTime } from '@/lib/date-utils'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

// Mock case study data - would come from CMS/API
const CASE_STUDIES: Record<string, any> = {
  'internal-ticket-sla-system': {
    title: 'Internal Ticket & SLA Management System',
    client: 'Enterprise Client',
    sector: 'Technology',
    challenge: 'The client needed a comprehensive system to manage internal tickets, projects, and SLA commitments across multiple engineering and operations teams.',
    solution: 'We built a production-ready workflow platform using FastAPI, MongoDB, and Next.js. The system includes real-time notifications, automated SLA tracking, and comprehensive reporting.',
    results: [
      { metric: '95%', label: 'SLA Compliance Rate', methodology: 'Measured against defined SLA targets over 6 months' },
      { metric: '40%', label: 'Faster Ticket Resolution', methodology: 'Compared to previous manual process' },
      { metric: 'Multi-Team', label: 'Daily Operations', methodology: 'Serving 5+ teams simultaneously' },
    ],
    methodology: 'Results measured over 6 months of production use. SLA compliance tracked against defined targets. Resolution time compared to baseline manual process.',
    testimonial: {
      quote: 'The system has transformed how we manage internal operations. The automated SLA tracking alone has saved us countless hours.',
      author: 'Engineering Director',
      company: 'Enterprise Client',
    },
    pdfVersion: '1.0',
    pdfLastUpdated: new Date('2025-12-15'),
  },
  'realtime-distraction-alert': {
    title: 'Real-Time Distraction Alert Mobile App',
    client: 'Safety Tech Startup',
    sector: 'Mobile Safety',
    challenge: 'Building a mobile app that detects user distraction near roadways and provides intelligent safety alerts in real-time.',
    solution: 'Developed a production-grade mobile app using Flutter with background services, geofencing, and activity recognition. The app runs efficiently in the background while maintaining battery life.',
    results: [
      { metric: 'Real-Time', label: 'Background Operations', methodology: 'Continuous monitoring with minimal battery impact' },
      { metric: '99.9%', label: 'Uptime', methodology: 'Measured over 3 months of production use' },
    ],
    methodology: 'Uptime measured via monitoring services. Battery impact tested across multiple devices over 30-day periods.',
    testimonial: {
      quote: 'The app works seamlessly in the background and has helped prevent numerous potential accidents.',
      author: 'Product Manager',
      company: 'Safety Tech Startup',
    },
    pdfVersion: '1.0',
    pdfLastUpdated: new Date('2025-11-20'),
  },
}

export default function CaseStudyDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const caseStudy = CASE_STUDIES[slug]

  if (!caseStudy) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Case Study Not Found</h1>
          <p className="text-white/60 mb-8">The case study you're looking for doesn't exist.</p>
          <Link href="/" className="text-gold hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const handleDownload = () => {
    // Track download event
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
      gtag('event', 'case_study_download', {
        slug,
        version: caseStudy.pdfVersion,
      })
    }

    // In a real app, this would download the PDF
    alert(`Downloading case study PDF (v${caseStudy.pdfVersion})...`)
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/"
            className="text-gold hover:underline text-sm mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <div className="mb-4">
            <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-medium">
              {caseStudy.sector}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{caseStudy.title}</h1>
          <p className="text-white/60">
            Client: {caseStudy.client} • Sector: {caseStudy.sector}
          </p>
        </header>

        {/* Challenge */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Challenge</h2>
          <p className="text-white/60 leading-relaxed">{caseStudy.challenge}</p>
        </section>

        {/* Solution */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Solution</h2>
          <p className="text-white/60 leading-relaxed">{caseStudy.solution}</p>
        </section>

        {/* Results */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Results</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {caseStudy.results.map((result: any, index: number) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="text-3xl font-bold text-gold mb-2">{result.metric}</div>
                <div className="text-white/60 text-sm mb-2">{result.label}</div>
                <div className="text-white/40 text-xs">{result.methodology}</div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Methodology</h3>
            <p className="text-white/60 text-sm">{caseStudy.methodology}</p>
          </div>
        </section>

        {/* Testimonial */}
        {caseStudy.testimonial && (
          <section className="mb-12 p-8 rounded-lg bg-gradient-to-br from-gold/10 to-transparent border border-gold/20">
            <svg className="w-8 h-8 text-gold/40 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="text-white text-lg italic mb-4">
              &ldquo;{caseStudy.testimonial.quote}&rdquo;
            </blockquote>
            <div className="text-gold/80">
              <div className="font-semibold">{caseStudy.testimonial.author}</div>
              <div className="text-sm">{caseStudy.testimonial.company}</div>
            </div>
          </section>
        )}

        {/* Download PDF */}
        <section className="mb-12 p-6 rounded-lg bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Download Case Study</h2>
          <p className="text-white/60 text-sm mb-4">
            Version {caseStudy.pdfVersion} • Last updated: {formatDisplayDate(caseStudy.pdfLastUpdated)}
          </p>
          <Button onClick={handleDownload} variant="primary">
            Download PDF
          </Button>
        </section>

        {/* CTA */}
        <section className="p-8 rounded-lg bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Want Similar Results?
          </h2>
          <p className="text-white/60 mb-6">
            Let's discuss how we can help you achieve similar outcomes for your project.
          </p>
          <Link href="/contact">
            <Button variant="primary">Get in Touch</Button>
          </Link>
        </section>
      </div>
    </div>
  )
}


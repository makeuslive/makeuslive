import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui'
import { formatDisplayDate } from '@/lib/date-utils'
import { getCaseStudy } from '@/lib/data/case-studies'
import { CaseStudyDownload } from './case-study-download'

interface CaseStudyPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const caseStudy = getCaseStudy(slug)

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    }
  }

  return {
    title: `${caseStudy.title} | Case Study | Make Us Live`,
    description: caseStudy.challenge,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.challenge,
      type: 'article',
    },
  }
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const caseStudy = getCaseStudy(slug)

  if (!caseStudy) {
    notFound()
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
            {caseStudy.results.map((result, index) => (
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
          <CaseStudyDownload slug={caseStudy.slug} pdfVersion={caseStudy.pdfVersion} />
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

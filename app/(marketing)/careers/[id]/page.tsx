import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui'
import { getJobById } from '@/lib/data/careers'
import JobApplicationForm from './job-application-form'

interface JobDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
    const { id } = await params
    const job = await getJobById(id)

    if (!job) {
        return {
            title: 'Job Not Found',
        }
    }

    return {
        title: `${job.title} | Careers | Make Us Live`,
        description: `We are hiring a ${job.title} in ${job.location}. Join our team!`,
        openGraph: {
            title: `${job.title} - ${job.department}`,
            description: job.description.slice(0, 160) + '...',
            type: 'website',
        },
    }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    const { id } = await params
    const job = await getJobById(id)

    if (!job) {
        notFound()
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                {/* Back Link */}
                <Link
                    href="/careers"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Careers
                </Link>

                {/* Job Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{job.title}</h1>
                    <div className="flex flex-wrap gap-4 text-white/60">
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {job.department}
                        </span>
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                        </span>
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.type}
                        </span>
                        {job.salaryRange && (
                            <span className="flex items-center gap-2 text-gold">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {job.salaryRange}
                            </span>
                        )}
                    </div>
                </div>

                {/* Job Description */}
                {job.description && (
                    <div className="mb-8 p-6 rounded-lg bg-white/5 border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">About the Role</h2>
                        <p className="text-white/80 leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>
                )}

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg bg-white/5 border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
                        <ul className="space-y-2">
                            {job.requirements.map((req, index) => (
                                <li key={index} className="flex items-start gap-3 text-white/80">
                                    <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Application Requirements */}
                <div className="mb-8 p-6 rounded-lg bg-gradient-to-br from-gold/10 to-transparent border border-gold/20">
                    <h2 className="text-2xl font-bold text-white mb-4">Application Requirements</h2>
                    <div className="flex flex-wrap gap-3">
                        {job.resumeRequired && (
                            <span className="px-3 py-1.5 text-sm bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30">
                                Resume Required
                            </span>
                        )}
                        {job.portfolioRequired && (
                            <span className="px-3 py-1.5 text-sm bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30">
                                Portfolio Required
                            </span>
                        )}
                        {job.referenceWorkRequired && (
                            <span className="px-3 py-1.5 text-sm bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30">
                                Reference Work Required
                            </span>
                        )}
                    </div>
                </div>

                {/* Application Form Widget */}
                <JobApplicationForm job={job} />
            </div>
        </div>
    )
}

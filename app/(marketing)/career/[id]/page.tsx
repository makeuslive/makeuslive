'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'

interface Job {
    id: string
    title: string
    department: string
    location: string
    type: string
    description: string
    requirements: string[]
    salaryRange?: string
    resumeRequired: boolean
    portfolioRequired: boolean
    referenceWorkRequired: boolean
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)
    const [showApplicationForm, setShowApplicationForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
        resumeUrl: '',
        portfolioUrl: '',
        referenceWork: '',
        expectedSalary: '',
    })

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch('/api/jobs')
                const data = await res.json()
                if (data.success && Array.isArray(data.data)) {
                    const foundJob = data.data.find((j: Job) => j.id === id)
                    setJob(foundJob || null)
                }
            } catch (error) {
                console.error('Error fetching job:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchJob()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!job) return

        // Validate required fields
        if (!form.name || !form.email) {
            alert('Name and email are required')
            return
        }

        if (job.resumeRequired && !form.resumeUrl) {
            alert('Resume URL is required for this position')
            return
        }

        if (job.portfolioRequired && !form.portfolioUrl) {
            alert('Portfolio URL is required for this position')
            return
        }

        if (job.referenceWorkRequired && !form.referenceWork) {
            alert('Reference work is required for this position')
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch('/api/career/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId: job.id,
                    jobTitle: job.title,
                    ...form,
                }),
            })

            if (res.ok) {
                setSubmitted(true)
                setShowApplicationForm(false)
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to submit application')
            }
        } catch (error) {
            console.error('Error submitting application:', error)
            alert('Failed to submit application')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-gold"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!job) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    <div className="text-center py-16">
                        <h1 className="text-3xl font-bold text-white mb-4">Job Not Found</h1>
                        <p className="text-white/60 mb-8">This position may have been filled or removed.</p>
                        <Link href="/careers">
                            <Button variant="primary">View All Openings</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
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

                {/* Success Message */}
                {submitted && (
                    <div className="mb-8 p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <h3 className="text-xl font-bold text-emerald-400 mb-2">Application Submitted!</h3>
                        <p className="text-white/80">Thank you for your application. We'll review it and get back to you soon.</p>
                    </div>
                )}

                {/* Apply Button / Form */}
                {!submitted && !showApplicationForm && (
                    <div className="text-center">
                        <Button variant="primary" onClick={() => setShowApplicationForm(true)}>
                            Apply for this Position
                        </Button>
                    </div>
                )}

                {/* Application Form */}
                {showApplicationForm && !submitted && (
                    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Submit Your Application</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name & Email */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Full Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Email <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            {/* Resume URL */}
                            {job.resumeRequired && (
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Resume URL <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={form.resumeUrl}
                                        onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        placeholder="https://drive.google.com/... or https://dropbox.com/..."
                                        required
                                    />
                                    <p className="text-xs text-white/40 mt-1">Upload your resume to Google Drive, Dropbox, or similar and paste the shareable link</p>
                                </div>
                            )}

                            {/* Portfolio URL */}
                            {job.portfolioRequired && (
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Portfolio URL <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={form.portfolioUrl}
                                        onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        placeholder="https://yourportfolio.com or https://behance.net/..."
                                        required
                                    />
                                </div>
                            )}

                            {/* Reference Work */}
                            {job.referenceWorkRequired && (
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Reference Work / Links <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={form.referenceWork}
                                        onChange={(e) => setForm({ ...form, referenceWork: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                                        placeholder="Paste links to your work samples, GitHub repos, or describe relevant projects..."
                                        required
                                    />
                                </div>
                            )}

                            {/* Expected Salary */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">Expected Salary</label>
                                <input
                                    type="text"
                                    value={form.expectedSalary}
                                    onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    placeholder="e.g., ₹10 LPA or Negotiable"
                                />
                            </div>

                            {/* Cover Letter */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">Cover Letter</label>
                                <textarea
                                    value={form.coverLetter}
                                    onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                                    placeholder="Tell us why you're a great fit for this role..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <Button type="submit" variant="primary" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Application'}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setShowApplicationForm(false)}
                                    className="px-6 py-3 text-white/60 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

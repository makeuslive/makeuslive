'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import type { Job } from '@/lib/data/careers'

export default function JobApplicationForm({ job }: { job: Job }) {
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
            const res = await fetch('/api/careers/apply', {
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

    if (submitted) {
        return (
            <div className="mb-8 p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Application Submitted!</h3>
                <p className="text-white/80">Thank you for your application. We'll review it and get back to you soon.</p>
            </div>
        )
    }

    if (!showApplicationForm) {
        return (
            <div className="text-center">
                <Button variant="primary" onClick={() => setShowApplicationForm(true)}>
                    Apply for this Position
                </Button>
            </div>
        )
    }

    return (
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
    )
}

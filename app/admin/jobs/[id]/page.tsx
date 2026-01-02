'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DEPARTMENTS = [
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Operations',
    'Sales',
    'Other',
]

const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']

const LOCATIONS = [
    'Remote',
    'Bhopal, India',
    'Remote / Bhopal, India',
    'Hybrid',
]

interface Job {
    id: string
    title: string
    department: string
    location: string
    type: string
    description: string
    requirements: string[]
    salaryRange: string
    resumeRequired: boolean
    portfolioRequired: boolean
    referenceWorkRequired: boolean
    status: 'draft' | 'published'
    order: number
}

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        title: '',
        department: DEPARTMENTS[0],
        location: LOCATIONS[0],
        type: TYPES[0],
        description: '',
        requirements: '',
        salaryRange: '',
        resumeRequired: true,
        portfolioRequired: false,
        referenceWorkRequired: false,
        status: 'draft' as 'draft' | 'published',
        order: 0,
    })

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch('/api/admin/jobs')
                const data = await res.json()
                if (Array.isArray(data)) {
                    const job = data.find((j: Job) => j.id === id)
                    if (job) {
                        setForm({
                            title: job.title,
                            department: job.department,
                            location: job.location,
                            type: job.type,
                            description: job.description,
                            requirements: (job.requirements || []).join('\n'),
                            salaryRange: job.salaryRange || '',
                            resumeRequired: job.resumeRequired ?? true,
                            portfolioRequired: job.portfolioRequired ?? false,
                            referenceWorkRequired: job.referenceWorkRequired ?? false,
                            status: job.status || 'draft',
                            order: job.order ?? 0,
                        })
                    }
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
        if (!form.title.trim()) {
            alert('Title is required')
            return
        }

        setSaving(true)
        try {
            const res = await fetch('/api/admin/jobs', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    ...form,
                    requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean),
                }),
            })

            if (res.ok) {
                router.push('/admin/jobs')
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to update job')
            }
        } catch (error) {
            console.error('Error updating job:', error)
            alert('Failed to update job')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="absolute inset-0 overflow-auto">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-blue-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="absolute inset-0 overflow-auto">
            <div className="p-6 lg:p-8">
                <div className="max-w-2xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/admin/jobs"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Jobs
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Job</h1>
                        <p className="text-sm text-gray-500 mt-1">Update job details and requirements</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="e.g., Senior Frontend Engineer"
                                required
                            />
                        </div>

                        {/* Department & Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <select
                                    value={form.department}
                                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    {DEPARTMENTS.map((dept) => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    {TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <select
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            >
                                {LOCATIONS.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
                            />
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                            <textarea
                                value={form.requirements}
                                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                placeholder="One requirement per line"
                            />
                            <p className="text-xs text-gray-400 mt-1">Enter each requirement on a new line</p>
                        </div>

                        {/* Salary Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary Range</label>
                            <input
                                type="text"
                                value={form.salaryRange}
                                onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="e.g., ₹8-15 LPA or Competitive"
                            />
                        </div>

                        {/* Application Requirements */}
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Application Requirements</p>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.resumeRequired}
                                    onChange={(e) => setForm({ ...form, resumeRequired: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Resume Required</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.portfolioRequired}
                                    onChange={(e) => setForm({ ...form, portfolioRequired: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">Portfolio URL Required</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.referenceWorkRequired}
                                    onChange={(e) => setForm({ ...form, referenceWorkRequired: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Reference Work/Links Required</span>
                            </label>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm font-medium text-gray-700">Status:</p>
                            <div className="flex gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={form.status === 'draft'}
                                        onChange={() => setForm({ ...form, status: 'draft' })}
                                        className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                                    />
                                    <span className="text-sm text-gray-700">Draft</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={form.status === 'published'}
                                        onChange={() => setForm({ ...form, status: 'published' })}
                                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-gray-700">Published</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link
                                href="/admin/jobs"
                                className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

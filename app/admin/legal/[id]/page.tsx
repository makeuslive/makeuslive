'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    createdAt: string
    updatedAt: string
}

export default function EditLegalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()

    const [formData, setFormData] = useState<LegalPage | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [newChangeLogEntry, setNewChangeLogEntry] = useState('')

    useEffect(() => {
        fetchPage()
    }, [id])

    const fetchPage = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/legal/${id}`)
            const data = await res.json()
            if (data.success) {
                setFormData(data.data)
            } else {
                setError(data.error || 'Page not found')
            }
        } catch (err) {
            setError('Failed to fetch page')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData) return

        setSaving(true)
        setError(null)
        setSuccess(false)

        try {
            const res = await fetch(`/api/legal/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    lastUpdated: new Date().toISOString(),
                }),
            })

            const data = await res.json()
            if (data.success) {
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            } else {
                setError(data.error || 'Failed to update page')
            }
        } catch (err) {
            setError('Failed to update page')
        } finally {
            setSaving(false)
        }
    }

    const addChangeLogEntry = () => {
        if (!newChangeLogEntry.trim() || !formData) return
        setFormData(prev => prev ? ({
            ...prev,
            changeLog: [
                { date: new Date().toISOString(), description: newChangeLogEntry.trim() },
                ...prev.changeLog,
            ],
        }) : prev)
        setNewChangeLogEntry('')
    }

    const removeChangeLogEntry = (index: number) => {
        if (!formData) return
        setFormData(prev => prev ? ({
            ...prev,
            changeLog: prev.changeLog.filter((_, i) => i !== index),
        }) : prev)
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) return

        try {
            const res = await fetch(`/api/legal/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                router.push('/admin/legal')
            } else {
                setError(data.error || 'Failed to delete page')
            }
        } catch (err) {
            setError('Failed to delete page')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (!formData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h2>
                    <p className="text-gray-500 mb-4">The legal page you're looking for doesn't exist.</p>
                    <Link href="/admin/legal" className="text-blue-600 hover:underline">
                        Back to Legal Pages
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/admin/legal"
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900">Edit {formData.title}</h1>
                                    <p className="text-sm text-gray-500">Last updated {new Date(formData.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/${formData.slug}`}
                                    target="_blank"
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Preview
                                </Link>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => prev ? ({ ...prev, status: e.target.value as 'draft' | 'published' }) : prev)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                {(error || success) && (
                    <div className="max-w-7xl mx-auto px-6 mt-4">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
                                {error}
                                <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {success && (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Changes saved successfully!
                            </div>
                        )}
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => prev ? ({ ...prev, title: e.target.value }) : prev)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                            placeholder="Privacy Policy"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">/</span>
                                            <input
                                                type="text"
                                                value={formData.slug}
                                                disabled
                                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">URL slug cannot be changed after creation</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
                                <p className="text-sm text-gray-500 mb-4">Use HTML to format your content. Headings, lists, and links are supported.</p>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData(prev => prev ? ({ ...prev, content: e.target.value }) : prev)}
                                    className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-black focus:border-black resize-y"
                                    required
                                />
                            </div>

                            {/* Change Log */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Log</h2>
                                <p className="text-sm text-gray-500 mb-4">Track changes to your legal documents</p>

                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={newChangeLogEntry}
                                        onChange={(e) => setNewChangeLogEntry(e.target.value)}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                        placeholder="Describe the change..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChangeLogEntry())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addChangeLogEntry}
                                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>

                                {formData.changeLog.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.changeLog.map((entry, index) => (
                                            <div key={index} className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900">{entry.description}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeChangeLogEntry(index)}
                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Dates */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dates</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                                        <input
                                            type="date"
                                            value={formData.effectiveDate?.split('T')[0] || ''}
                                            onChange={(e) => setFormData(prev => prev ? ({ ...prev, effectiveDate: e.target.value }) : prev)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="text-sm text-gray-500 space-y-1">
                                            <p>Created: {new Date(formData.createdAt).toLocaleDateString()}</p>
                                            <p>Last updated: {new Date(formData.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SEO */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                                        <input
                                            type="text"
                                            value={formData.metaTitle}
                                            onChange={(e) => setFormData(prev => prev ? ({ ...prev, metaTitle: e.target.value }) : prev)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                            placeholder="Page title for search engines"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{formData.metaTitle?.length || 0}/60 characters</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                        <textarea
                                            value={formData.metaDescription}
                                            onChange={(e) => setFormData(prev => prev ? ({ ...prev, metaDescription: e.target.value }) : prev)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none"
                                            rows={3}
                                            placeholder="Brief description for search results"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{formData.metaDescription?.length || 0}/160 characters</p>
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="bg-gray-100 rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Preview</h2>
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <p className="text-blue-600 text-sm mb-1 truncate">makeuslive.com/{formData.slug}</p>
                                    <h3 className="text-lg text-blue-800 font-medium mb-1 line-clamp-1">
                                        {formData.metaTitle || formData.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {formData.metaDescription || 'Add a meta description to preview how this page will appear in search results.'}
                                    </p>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                                <h2 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h2>
                                <p className="text-sm text-red-700 mb-4">Permanently delete this legal page. This action cannot be undone.</p>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                >
                                    Delete Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = [
    'Web Development',
    'Mobile App',
    'Brand Identity',
    'UI/UX Design',
    'E-Commerce',
    'Marketing',
    'Other',
]

interface Work {
    id: string
    title: string
    category: string
    description: string
    image: string
    tags: string[]
    order: number
    stats?: {
        label: string
        value: string
    }[]
}

export default function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        title: '',
        category: CATEGORIES[0],
        description: '',
        image: '',
        tags: '',
        order: 1,
    })

    useEffect(() => {
        fetchWork()
    }, [id])

    const fetchWork = async () => {
        try {
            const res = await fetch('/api/admin/work')
            const data = await res.json()
            if (Array.isArray(data)) {
                const work = data.find((w: Work) => w.id === id)
                if (work) {
                    setForm({
                        title: work.title || '',
                        category: work.category || CATEGORIES[0],
                        description: work.description || '',
                        image: work.image || '',
                        tags: work.tags?.join(', ') || '',
                        order: work.order ?? 1,
                    })
                }
            }
        } catch (error) {
            console.error('Error fetching work:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title.trim()) {
            alert('Title is required')
            return
        }

        setSaving(true)
        try {
            const res = await fetch('/api/admin/work', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    ...form,
                    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                }),
            })

            if (res.ok) {
                router.push('/admin/work')
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to update work')
            }
        } catch (error) {
            console.error('Error updating work:', error)
            alert('Failed to update work')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Delete this project? This cannot be undone.')) return

        try {
            const res = await fetch(`/api/admin/work?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                router.push('/admin/work')
            }
        } catch (error) {
            console.error('Error deleting work:', error)
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
                            href="/admin/work"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Works
                        </Link>
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Project</h1>
                                <p className="text-sm text-gray-500 mt-1">Update your portfolio project</p>
                            </div>
                            <button
                                onClick={handleDelete}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete project"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="e.g., E-commerce Platform Redesign"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                placeholder="Describe the project, your role, and key achievements..."
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                            <input
                                type="url"
                                value={form.image}
                                onChange={(e) => setForm({ ...form, image: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="https://example.com/image.jpg"
                            />
                            {form.image && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                                    <img src={form.image} alt="Preview" className="w-full h-48 object-cover" />
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                            <input
                                type="text"
                                value={form.tags}
                                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="React, Node.js, TypeScript (comma-separated)"
                            />
                        </div>

                        {/* Featured */}
                        <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.order === 0}
                                    onChange={(e) => setForm({ ...form, order: e.target.checked ? 0 : 1 })}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Feature this project (show first)</span>
                            </label>
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
                                href="/admin/work"
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

'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface WorkData {
    id: string
    title: string
    category: string
    description: string
    image: string
    stats?: { metric: string; label: string }
    tags: string[]
}

export default function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [form, setForm] = useState<WorkData>({
        id: '',
        title: '',
        category: '',
        description: '',
        image: '',
        stats: { metric: '', label: '' },
        tags: [],
    })
    const [tagsInput, setTagsInput] = useState('')

    useEffect(() => {
        fetchWork()
    }, [resolvedParams.id])

    const fetchWork = async () => {
        try {
            const res = await fetch('/api/admin/works')
            const data = await res.json()
            if (Array.isArray(data)) {
                const work = data.find((w: WorkData) => w.id === resolvedParams.id)
                if (work) {
                    setForm(work)
                    setTagsInput(work.tags?.join(', ') || '')
                }
            }
        } catch (error) {
            console.error('Error fetching work:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'works')

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()
            if (data.url) {
                setForm({ ...form, image: data.url })
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)

        try {
            const res = await fetch('/api/admin/works', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, tags }),
            })

            if (res.ok) {
                router.push('/admin/works')
            } else {
                throw new Error('Failed to update')
            }
        } catch (error) {
            console.error('Error updating work:', error)
            alert('Failed to update work')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Edit Work</h2>
                    <p className="text-gray-400 text-sm">Update portfolio project</p>
                </div>
                <Link href="/admin/works" className="text-gray-400 hover:text-white text-sm">
                    ← Back
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Image</label>
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center">
                        {form.image ? (
                            <div className="relative">
                                <img src={form.image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, image: '' })}
                                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer block py-8">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                <span className="text-gray-400">
                                    {uploading ? 'Uploading...' : 'Click to upload or drag image here'}
                                </span>
                            </label>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Or paste image URL:</p>
                    <input
                        type="url"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        >
                            <option value="">Select category</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile App">Mobile App</option>
                            <option value="AI Product">AI Product</option>
                            <option value="Design System">Design System</option>
                            <option value="E-commerce">E-commerce</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Stat Metric</label>
                        <input
                            type="text"
                            value={form.stats?.metric || ''}
                            onChange={(e) => setForm({ ...form, stats: { ...form.stats!, metric: e.target.value } })}
                            placeholder="e.g., 250%"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Stat Label</label>
                        <input
                            type="text"
                            value={form.stats?.label || ''}
                            onChange={(e) => setForm({ ...form, stats: { ...form.stats!, label: e.target.value } })}
                            placeholder="e.g., Revenue Growth"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                    <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="React, Node.js, AWS (comma separated)"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-gold to-amber-500 text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link href="/admin/works" className="px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}

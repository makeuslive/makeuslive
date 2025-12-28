'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewWorkPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        image: '',
        statsMetric: '',
        statsLabel: '',
        tags: '',
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                image: formData.image || null,
                stats: formData.statsMetric ? {
                    metric: formData.statsMetric,
                    label: formData.statsLabel,
                } : null,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            }

            const res = await fetch('/api/admin/works', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                router.push('/admin/works')
            } else {
                alert('Failed to create work')
            }
        } catch (error) {
            console.error('Error creating work:', error)
            alert('Failed to create work')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/works"
                    className="text-sm text-gray-400 hover:text-white mb-4 inline-block"
                >
                    ← Back to Works
                </Link>
                <h2 className="text-xl font-bold text-white">Add New Work</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                            Project Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50"
                            placeholder="E-Commerce Revolution"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                            Category *
                        </label>
                        <select
                            id="category"
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        >
                            <option value="">Select category</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile App">Mobile App</option>
                            <option value="AI / ML">AI / ML</option>
                            <option value="Design Systems">Design Systems</option>
                            <option value="Branding">Branding</option>
                            <option value="E-Commerce">E-Commerce</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                            placeholder="Describe the project..."
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                            Image URL (optional)
                        </label>
                        <input
                            id="image"
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50"
                            placeholder="https://..."
                        />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="statsMetric" className="block text-sm font-medium text-gray-300 mb-2">
                                Stat Metric (optional)
                            </label>
                            <input
                                id="statsMetric"
                                type="text"
                                value={formData.statsMetric}
                                onChange={(e) => setFormData({ ...formData, statsMetric: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                placeholder="340%"
                            />
                        </div>
                        <div>
                            <label htmlFor="statsLabel" className="block text-sm font-medium text-gray-300 mb-2">
                                Stat Label
                            </label>
                            <input
                                id="statsLabel"
                                type="text"
                                value={formData.statsLabel}
                                onChange={(e) => setFormData({ ...formData, statsLabel: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                placeholder="Conversion Increase"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                            Tags (comma separated)
                        </label>
                        <input
                            id="tags"
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50"
                            placeholder="Next.js, React, AI"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-gold to-amber-500 text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {loading ? 'Creating...' : 'Create Work'}
                    </button>
                    <Link
                        href="/admin/works"
                        className="px-6 py-3 border border-white/20 text-gray-300 font-medium rounded-lg hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}

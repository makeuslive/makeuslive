'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Work {
    id: string
    title: string
    category: string
    description: string
    image: string
    tags: string[]
    order: number
    createdAt: string
}

export default function WorksPage() {
    const [works, setWorks] = useState<Work[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchWorks()
    }, [])

    const fetchWorks = async () => {
        try {
            const res = await fetch('/api/admin/work')
            const data = await res.json()
            if (Array.isArray(data)) {
                setWorks(data)
            }
        } catch (error) {
            console.error('Error fetching works:', error)
        } finally {
            setLoading(false)
        }
    }

    const deleteWork = async (id: string) => {
        if (!confirm('Delete this project? This action cannot be undone.')) return
        try {
            const res = await fetch(`/api/admin/work?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setWorks(works.filter(w => w.id !== id))
            }
        } catch (error) {
            console.error('Error deleting work:', error)
        }
    }

    const stats = {
        total: works.length,
        published: works.length, // All are published for now
        featured: works.filter(w => w.order === 0).length,
        drafts: 0,
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
            <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Works</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your portfolio projects</p>
                    </div>
                    <Link
                        href="/admin/work/new"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Work
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-gray-900', bg: 'bg-white' },
                        { label: 'Published', value: stats.published, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Featured', value: stats.featured, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Drafts', value: stats.drafts, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} border border-gray-100 rounded-xl p-4`}>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {works.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No projects yet</h3>
                        <p className="text-sm text-gray-500 mb-6">Showcase your best work to potential clients</p>
                        <Link
                            href="/admin/work/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Your First Project
                        </Link>
                    </div>
                )}

                {/* Works Grid */}
                {works.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {works.map((work) => (
                            <div key={work.id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                                <div className="aspect-video bg-gray-100 relative">
                                    {work.image ? (
                                        <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Link
                                            href={`/admin/work/${work.id}`}
                                            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => deleteWork(work.id)}
                                            className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{work.title}</h3>
                                            <p className="text-sm text-gray-500">{work.category}</p>
                                        </div>
                                        {work.order === 0 && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-50 text-blue-600 rounded-full">Featured</span>
                                        )}
                                    </div>
                                    {work.tags && work.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {work.tags.slice(0, 3).map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-md">{tag}</span>
                                            ))}
                                            {work.tags.length > 3 && (
                                                <span className="px-2 py-0.5 text-xs text-gray-400">+{work.tags.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

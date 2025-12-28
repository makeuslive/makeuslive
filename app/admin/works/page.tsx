'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Work {
    id: string
    title: string
    slug: string
    description: string
    category: string
    image: string
    client?: string
    year?: string
    status: 'draft' | 'published'
    featured: boolean
    createdAt: string
}

export default function WorksPage() {
    const [works, setWorks] = useState<Work[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Placeholder - would fetch from API
        setLoading(false)
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-blue-600"></div>
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
                        href="/admin/works/new"
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
                        { label: 'Total', value: works.length, color: 'text-gray-900', bg: 'bg-white' },
                        { label: 'Published', value: works.filter(w => w.status === 'published').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Featured', value: works.filter(w => w.featured).length, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Drafts', value: works.filter(w => w.status === 'draft').length, color: 'text-amber-600', bg: 'bg-amber-50' },
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
                            href="/admin/works/new"
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
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1">{work.title}</h3>
                                    <p className="text-sm text-gray-500">{work.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )   
}

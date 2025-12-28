'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Work {
    id: string
    title: string
    category: string
    description: string
    image?: string
    stats?: { metric: string; label: string }
    tags?: string[]
    createdAt: string
}

export default function WorksPage() {
    const [works, setWorks] = useState<Work[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        fetchWorks()
    }, [])

    const fetchWorks = async () => {
        try {
            const res = await fetch('/api/admin/works')
            const data = await res.json()
            if (Array.isArray(data)) {
                setWorks(data)
            } else {
                console.error('API returned non-array:', data)
                setWorks([])
            }
        } catch (error) {
            console.error('Error fetching works:', error)
            setWorks([])
        } finally {
            setLoading(false)
        }
    }

    const deleteWork = async (id: string) => {
        if (!confirm('Are you sure you want to delete this work?')) return

        setDeleting(id)
        try {
            await fetch(`/api/admin/works?id=${id}`, { method: 'DELETE' })
            setWorks(works.filter((w) => w.id !== id))
        } catch (error) {
            console.error('Error deleting work:', error)
            alert('Failed to delete work')
        } finally {
            setDeleting(null)
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Portfolio Works</h2>
                    <p className="text-gray-400 text-sm">Manage your case studies and projects</p>
                </div>
                <Link
                    href="/admin/works/new"
                    className="px-4 py-2 bg-gradient-to-r from-gold to-amber-500 text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                    Add Work
                </Link>
            </div>

            {/* Grid */}
            {works.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <p className="text-gray-400 mb-4">No works yet</p>
                    <Link href="/admin/works/new" className="text-gold hover:underline">
                        Add your first project
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {works.map((work) => (
                        <div
                            key={work.id}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all"
                        >
                            {/* Image placeholder */}
                            <div className="h-40 bg-gradient-to-br from-gold/10 to-amber-500/10 flex items-center justify-center">
                                {work.image ? (
                                    <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">🎨</span>
                                )}
                            </div>
                            <div className="p-4">
                                <span className="text-xs text-gold font-medium">{work.category}</span>
                                <h3 className="text-white font-semibold mt-1 mb-2">{work.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{work.description}</p>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/works/${work.id}`}
                                        className="flex-1 text-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => deleteWork(work.id)}
                                        disabled={deleting === work.id}
                                        className="px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                                    >
                                        {deleting === work.id ? '...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

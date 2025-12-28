'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Testimonial {
    id: string
    author: string
    role: string
    company?: string
    quote: string
    rating: number
    createdAt: string
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/admin/testimonials')
            const data = await res.json()
            // Ensure data is an array
            if (Array.isArray(data)) {
                setTestimonials(data)
            } else {
                console.error('API returned non-array:', data)
                setTestimonials([])
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error)
            setTestimonials([])
        } finally {
            setLoading(false)
        }
    }

    const deleteTestimonial = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return

        setDeleting(id)
        try {
            await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' })
            setTestimonials(testimonials.filter((t) => t.id !== id))
        } catch (error) {
            console.error('Error deleting testimonial:', error)
            alert('Failed to delete testimonial')
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
                    <h2 className="text-xl font-bold text-white">Testimonials</h2>
                    <p className="text-gray-400 text-sm">Manage client testimonials</p>
                </div>
                <Link
                    href="/admin/testimonials/new"
                    className="px-4 py-2 bg-gradient-to-r from-gold to-amber-500 text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                    Add Testimonial
                </Link>
            </div>

            {/* Table */}
            {testimonials.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <p className="text-gray-400 mb-4">No testimonials yet</p>
                    <Link
                        href="/admin/testimonials/new"
                        className="text-gold hover:underline"
                    >
                        Add your first testimonial
                    </Link>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Author</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Quote</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rating</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.map((testimonial) => (
                                <tr key={testimonial.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-medium">{testimonial.author}</p>
                                            <p className="text-gray-400 text-sm">
                                                {testimonial.role}
                                                {testimonial.company && ` at ${testimonial.company}`}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-300 text-sm line-clamp-2 max-w-md">
                                            &ldquo;{testimonial.quote}&rdquo;
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gold">{'★'.repeat(testimonial.rating)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/testimonials/${testimonial.id}`}
                                                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteTestimonial(testimonial.id)}
                                                disabled={deleting === testimonial.id}
                                                className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                                            >
                                                {deleting === testimonial.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

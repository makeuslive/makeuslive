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
            if (Array.isArray(data)) {
                setTestimonials(data)
            } else {
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
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Testimonials</h2>
                    <p className="text-gray-500 text-sm">Manage client testimonials</p>
                </div>
                <Link
                    href="/admin/testimonials/new"
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Add Testimonial
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/50">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quote</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {testimonials.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    <p>No testimonials yet</p>
                                    <Link href="/admin/testimonials/new" className="text-blue-600 hover:underline mt-1 inline-block">
                                        Add your first testimonial
                                    </Link>
                                </td>
                            </tr>
                        ) : (
                            testimonials.map((testimonial) => (
                                <tr key={testimonial.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-gray-900 font-medium">{testimonial.author}</p>
                                            <p className="text-gray-500 text-sm">
                                                {testimonial.role}
                                                {testimonial.company && ` at ${testimonial.company}`}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-600 text-sm line-clamp-2 max-w-md">
                                            "{testimonial.quote}"
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-amber-400 text-sm tracking-widest">{'★'.repeat(testimonial.rating)}</span>
                                        <span className="text-gray-200 text-sm tracking-widest">{'★'.repeat(5 - testimonial.rating)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/testimonials/${testimonial.id}`}
                                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteTestimonial(testimonial.id)}
                                                disabled={deleting === testimonial.id}
                                                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {deleting === testimonial.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

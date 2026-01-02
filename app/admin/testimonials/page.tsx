'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useToast, useConfirm } from '@/components/ui/toast'

interface Testimonial {
    id: string
    author: string
    role: string
    company?: string
    quote: string
    rating: number
    status: 'active' | 'inactive'
    createdAt: string
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const { showToast, ToastContainer } = useToast()
    const { confirm, ConfirmDialog } = useConfirm()

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/admin/testimonials')
            const data = await res.json()
            if (Array.isArray(data)) {
                setTestimonials(data)
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error)
            showToast({
                message: 'Failed to load testimonials',
                type: 'error',
            })
        } finally {
            setLoading(false)
        }
    }

    const deleteTestimonial = async (id: string) => {
        const confirmed = await confirm({
            title: 'Delete Testimonial',
            message: 'Are you sure you want to delete this testimonial? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        })
        if (!confirmed) return
        try {
            const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setTestimonials(testimonials.filter(t => t.id !== id))
                showToast({
                    message: 'Testimonial deleted successfully',
                    type: 'success',
                })
            } else {
                throw new Error('Failed to delete')
            }
        } catch (error) {
            console.error('Error deleting:', error)
            showToast({
                message: 'Failed to delete testimonial',
                type: 'error',
            })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-blue-600"></div>
            </div>
        )
    }

    return (
        <>
            <ToastContainer />
            <ConfirmDialog />
            <div className="absolute inset-0 overflow-auto">
                <div className="p-6 lg:p-8 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Testimonials</h1>
                            <p className="text-sm text-gray-500 mt-1">Manage client feedback and reviews</p>
                        </div>
                        <Link
                            href="/admin/testimonials/new"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Testimonial
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { label: 'Total', value: testimonials.length, color: 'text-gray-900', bg: 'bg-white' },
                            { label: 'Active', value: testimonials.filter(t => t.status === 'active').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: '5 Stars', value: testimonials.filter(t => t.rating === 5).length, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { label: 'Inactive', value: testimonials.filter(t => t.status === 'inactive').length, color: 'text-gray-500', bg: 'bg-gray-50' },
                        ].map((stat) => (
                            <div key={stat.label} className={`${stat.bg} border border-gray-100 rounded-xl p-4`}>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {testimonials.length === 0 && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No testimonials yet</h3>
                            <p className="text-sm text-gray-500 mb-6">Add client reviews to build trust and credibility</p>
                            <Link
                                href="/admin/testimonials/new"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add First Testimonial
                            </Link>
                        </div>
                    )}

                    {/* Testimonials Grid */}
                    {testimonials.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                                    {/* Rating */}
                                    <div className="flex items-center gap-0.5 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-4 h-4 ${star <= testimonial.rating ? 'text-amber-400' : 'text-gray-200'}`}
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-gray-600 mb-4 line-clamp-4 text-sm leading-relaxed">"{testimonial.quote}"</p>

                                    {/* Author */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{testimonial.author}</p>
                                            <p className="text-xs text-gray-500">
                                                {testimonial.role}{testimonial.company && ` at ${testimonial.company}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/testimonials/${testimonial.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => deleteTestimonial(testimonial.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewTestimonialPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        author: '',
        role: '',
        company: '',
        quote: '',
        rating: 5,
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/admin/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push('/admin/testimonials')
            } else {
                alert('Failed to create testimonial')
            }
        } catch (error) {
            console.error('Error creating testimonial:', error)
            alert('Failed to create testimonial')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="absolute inset-0 overflow-auto">
            <div className="p-6 lg:p-8">
                <div className="max-w-2xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/admin/testimonials"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Testimonials
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Testimonial</h1>
                        <p className="text-sm text-gray-500 mt-1">Create a new client testimonial</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
                            {/* Author Name */}
                            <div>
                                <label htmlFor="author" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Author Name *
                                </label>
                                <input
                                    id="author"
                                    type="text"
                                    required
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Role / Title *
                                </label>
                                <input
                                    id="role"
                                    type="text"
                                    required
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="CEO, Founder, etc."
                                />
                            </div>

                            {/* Company */}
                            <div>
                                <label htmlFor="company" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Company (optional)
                                </label>
                                <input
                                    id="company"
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Acme Inc."
                                />
                            </div>

                            {/* Quote */}
                            <div>
                                <label htmlFor="quote" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Testimonial Quote *
                                </label>
                                <textarea
                                    id="quote"
                                    required
                                    rows={4}
                                    value={formData.quote}
                                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Working with MakeUsLive was an amazing experience..."
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className={`p-1 rounded transition-all ${star <= formData.rating
                                                ? 'text-amber-400 hover:text-amber-500'
                                                : 'text-gray-200 hover:text-gray-300'
                                                }`}
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Creating...' : 'Create Testimonial'}
                            </button>
                            <Link
                                href="/admin/testimonials"
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

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
        <div className="max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/testimonials"
                    className="text-sm text-gray-400 hover:text-white mb-4 inline-block"
                >
                    ← Back to Testimonials
                </Link>
                <h2 className="text-xl font-bold text-white">Add New Testimonial</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    {/* Author Name */}
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
                            Author Name *
                        </label>
                        <input
                            id="author"
                            type="text"
                            required
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                            Role / Title *
                        </label>
                        <input
                            id="role"
                            type="text"
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                            placeholder="CEO, Founder, etc."
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                            Company (optional)
                        </label>
                        <input
                            id="company"
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                            placeholder="Acme Inc."
                        />
                    </div>

                    {/* Quote */}
                    <div>
                        <label htmlFor="quote" className="block text-sm font-medium text-gray-300 mb-2">
                            Testimonial Quote *
                        </label>
                        <textarea
                            id="quote"
                            required
                            rows={4}
                            value={formData.quote}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 resize-none"
                            placeholder="Working with MakeUsLive was an amazing experience..."
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className={`text-2xl ${star <= formData.rating ? 'text-gold' : 'text-gray-600'
                                        } hover:scale-110 transition-transform`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-gold to-amber-500 text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? 'Creating...' : 'Create Testimonial'}
                    </button>
                    <Link
                        href="/admin/testimonials"
                        className="px-6 py-3 border border-white/20 text-gray-300 font-medium rounded-lg hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}

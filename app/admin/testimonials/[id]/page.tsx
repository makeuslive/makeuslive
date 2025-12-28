'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TestimonialData {
    id: string
    author: string
    role: string
    company?: string
    quote: string
    rating: number
}

export default function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState<TestimonialData>({
        id: '',
        author: '',
        role: '',
        company: '',
        quote: '',
        rating: 5,
    })

    useEffect(() => {
        fetchTestimonial()
    }, [resolvedParams.id])

    const fetchTestimonial = async () => {
        try {
            const res = await fetch('/api/admin/testimonials')
            const data = await res.json()
            if (Array.isArray(data)) {
                const testimonial = data.find((t: TestimonialData) => t.id === resolvedParams.id)
                if (testimonial) {
                    setForm(testimonial)
                }
            }
        } catch (error) {
            console.error('Error fetching testimonial:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const res = await fetch('/api/admin/testimonials', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            if (res.ok) {
                router.push('/admin/testimonials')
            } else {
                throw new Error('Failed to update')
            }
        } catch (error) {
            console.error('Error updating testimonial:', error)
            alert('Failed to update testimonial')
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
                    <h2 className="text-xl font-bold text-white">Edit Testimonial</h2>
                    <p className="text-gray-400 text-sm">Update client feedback</p>
                </div>
                <Link href="/admin/testimonials" className="text-gray-400 hover:text-white text-sm">
                    ← Back
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Author Name *</label>
                        <input
                            type="text"
                            value={form.author}
                            onChange={(e) => setForm({ ...form, author: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Role/Position *</label>
                        <input
                            type="text"
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                    <input
                        type="text"
                        value={form.company || ''}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quote *</label>
                    <textarea
                        value={form.quote}
                        onChange={(e) => setForm({ ...form, quote: e.target.value })}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setForm({ ...form, rating: star })}
                                className={`text-2xl transition-all ${star <= form.rating ? 'text-gold' : 'text-gray-600'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-gold to-amber-500 text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link
                        href="/admin/testimonials"
                        className="px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}

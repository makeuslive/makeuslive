'use client'

import { useState, useEffect } from 'react'

interface Subscriber {
    id: string
    email: string
    subscribedAt: string
    isActive: boolean
}

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        fetchSubscribers()
    }, [])

    const fetchSubscribers = async () => {
        try {
            const res = await fetch('/api/newsletter')
            const data = await res.json()
            if (Array.isArray(data)) {
                setSubscribers(data)
            } else {
                console.error('API returned non-array:', data)
                setSubscribers([])
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error)
            setSubscribers([])
        } finally {
            setLoading(false)
        }
    }

    const deleteSubscriber = async (id: string) => {
        if (!confirm('Remove this subscriber?')) return

        setDeleting(id)
        try {
            await fetch(`/api/newsletter?id=${id}`, { method: 'DELETE' })
            setSubscribers(subscribers.filter((s) => s.id !== id))
        } catch (error) {
            console.error('Error deleting subscriber:', error)
        } finally {
            setDeleting(null)
        }
    }

    const exportCSV = () => {
        const csv = [
            'Email,Subscribed Date',
            ...subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleDateString()}`)
        ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
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
                    <h2 className="text-xl font-bold text-white">Newsletter Subscribers</h2>
                    <p className="text-gray-400 text-sm">{subscribers.length} subscribers</p>
                </div>
                {subscribers.length > 0 && (
                    <button
                        onClick={exportCSV}
                        className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-lg hover:bg-white/10 transition-all"
                    >
                        Export CSV
                    </button>
                )}
            </div>

            {/* Table */}
            {subscribers.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <span className="text-4xl mb-4 block">📧</span>
                    <p className="text-gray-400 mb-2">No subscribers yet</p>
                    <p className="text-gray-500 text-sm">
                        Subscribers will appear here when visitors sign up via the newsletter form
                    </p>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Email</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Subscribed</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((subscriber) => (
                                <tr key={subscriber.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="px-6 py-4">
                                        <a href={`mailto:${subscriber.email}`} className="text-white hover:text-gold">
                                            {subscriber.email}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => deleteSubscriber(subscriber.id)}
                                            disabled={deleting === subscriber.id}
                                            className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                                        >
                                            {deleting === subscriber.id ? '...' : 'Remove'}
                                        </button>
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

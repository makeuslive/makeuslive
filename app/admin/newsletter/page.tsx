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
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Newsletter Subscribers</h2>
                    <p className="text-gray-500 text-sm">{subscribers.length} subscribers</p>
                </div>
                {subscribers.length > 0 && (
                    <button
                        onClick={exportCSV}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/50">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribed</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {subscribers.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p>No subscribers yet</p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Subscribers will appear here when visitors sign up
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            subscribers.map((subscriber) => (
                                <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <a href={`mailto:${subscriber.email}`} className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                                            {subscriber.email}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => deleteSubscriber(subscriber.id)}
                                            disabled={deleting === subscriber.id}
                                            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {deleting === subscriber.id ? 'Removing...' : 'Remove'}
                                        </button>
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

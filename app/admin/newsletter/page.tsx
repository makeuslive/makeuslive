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
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showBroadcastModal, setShowBroadcastModal] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    const [adding, setAdding] = useState(false)
    const [broadcasting, setBroadcasting] = useState(false)
    const [broadcastForm, setBroadcastForm] = useState({
        subject: '',
        content: '',
        ctaText: '',
        ctaUrl: '',
    })

    useEffect(() => {
        fetchSubscribers()
    }, [])

    const fetchSubscribers = async () => {
        try {
            const res = await fetch('/api/newsletter')
            const data = await res.json()
            if (Array.isArray(data)) {
                setSubscribers(data)
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error)
        } finally {
            setLoading(false)
        }
    }

    const sendBroadcast = async () => {
        if (!broadcastForm.subject.trim() || !broadcastForm.content.trim()) {
            alert('Subject and content are required')
            return
        }

        if (!confirm(`Send newsletter to ${subscribers.filter(s => s.isActive).length} subscribers?`)) {
            return
        }

        setBroadcasting(true)
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'broadcast',
                    ...broadcastForm,
                }),
            })

            const data = await res.json()
            if (res.ok) {
                alert(`Newsletter sent! ${data.stats.sent} delivered, ${data.stats.failed} failed`)
                setShowBroadcastModal(false)
                setBroadcastForm({ subject: '', content: '', ctaText: '', ctaUrl: '' })
            } else {
                alert(data.error || 'Failed to send newsletter')
            }
        } catch (error) {
            console.error('Error broadcasting:', error)
            alert('Failed to send newsletter')
        } finally {
            setBroadcasting(false)
        }
    }

    const addSubscriber = async () => {
        if (!newEmail.trim() || !newEmail.includes('@')) {
            alert('Please enter a valid email address')
            return
        }

        setAdding(true)
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail }),
            })

            if (res.ok) {
                setNewEmail('')
                setShowAddModal(false)
                fetchSubscribers()
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to add subscriber')
            }
        } catch (error) {
            console.error('Error adding subscriber:', error)
            alert('Failed to add subscriber')
        } finally {
            setAdding(false)
        }
    }

    const deleteSubscriber = async (id: string) => {
        if (!confirm('Remove this subscriber?')) return
        try {
            const res = await fetch(`/api/newsletter?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setSubscribers(subscribers.filter(s => s.id !== id))
            }
        } catch (error) {
            console.error('Error removing subscriber:', error)
        }
    }

    const exportCSV = () => {
        const headers = ['Email', 'Subscribed Date', 'Status']
        const rows = subscribers.map(s => [
            s.email,
            new Date(s.subscribedAt).toLocaleDateString(),
            s.isActive ? 'Active' : 'Inactive'
        ])

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    const filteredSubscribers = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Calculate stats
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const stats = {
        total: subscribers.length,
        active: subscribers.filter(s => s.isActive).length,
        thisWeek: subscribers.filter(s => new Date(s.subscribedAt) >= weekAgo).length,
        inactive: subscribers.filter(s => !s.isActive).length,
    }

    if (loading) {
        return (
            <div className="absolute inset-0 overflow-auto">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-blue-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="absolute inset-0 overflow-auto">
            <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Newsletter</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your email subscribers</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Subscriber
                        </button>
                        <button
                            onClick={exportCSV}
                            disabled={subscribers.length === 0}
                            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </button>
                        <button
                            onClick={() => setShowBroadcastModal(true)}
                            disabled={subscribers.filter(s => s.isActive).length === 0}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Send Newsletter
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-gray-900', bg: 'bg-white' },
                        { label: 'Active', value: stats.active, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'This Week', value: stats.thisWeek, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Inactive', value: stats.inactive, color: 'text-gray-500', bg: 'bg-gray-50' },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} border border-gray-100 rounded-xl p-4`}>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search subscribers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>

                {/* Empty State */}
                {subscribers.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No subscribers yet</h3>
                        <p className="text-sm text-gray-500 mb-6">Newsletter subscriptions will appear here</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add First Subscriber
                        </button>
                    </div>
                )}

                {/* Subscribers Table */}
                {subscribers.length > 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Email</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Date</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredSubscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900">{sub.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${sub.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sub.isActive ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
                                                {sub.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm text-gray-500">{new Date(sub.subscribedAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => deleteSubscriber(sub.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Subscriber Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Subscriber</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="subscriber@example.com"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && addSubscriber()}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={addSubscriber}
                                disabled={adding}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {adding ? 'Adding...' : 'Add Subscriber'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddModal(false)
                                    setNewEmail('')
                                }}
                                className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Broadcast Newsletter Modal */}
            {showBroadcastModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Newsletter</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            This will send an email to {subscribers.filter(s => s.isActive).length} active subscribers.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                                <input
                                    type="text"
                                    value={broadcastForm.subject}
                                    onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                                    placeholder="Your newsletter subject..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                                <textarea
                                    value={broadcastForm.content}
                                    onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
                                    placeholder="Write your newsletter content here..."
                                    rows={6}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                                    <input
                                        type="text"
                                        value={broadcastForm.ctaText}
                                        onChange={(e) => setBroadcastForm({ ...broadcastForm, ctaText: e.target.value })}
                                        placeholder="Read More"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button URL</label>
                                    <input
                                        type="url"
                                        value={broadcastForm.ctaUrl}
                                        onChange={(e) => setBroadcastForm({ ...broadcastForm, ctaUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={sendBroadcast}
                                disabled={broadcasting || !broadcastForm.subject.trim() || !broadcastForm.content.trim()}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {broadcasting ? 'Sending...' : 'Send Newsletter'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowBroadcastModal(false)
                                    setBroadcastForm({ subject: '', content: '', ctaText: '', ctaUrl: '' })
                                }}
                                className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'

interface Subscriber {
    id: string
    email: string
    status: 'active' | 'unsubscribed'
    source: string
    createdAt: string
}

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        // Placeholder - would fetch from API
        setLoading(false)
    }, [])

    const filteredSubscribers = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-blue-600"></div>
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
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Total', value: subscribers.length, color: 'text-gray-900', bg: 'bg-white' },
                        { label: 'Active', value: subscribers.filter(s => s.status === 'active').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'This Week', value: 0, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Unsubscribed', value: subscribers.filter(s => s.status === 'unsubscribed').length, color: 'text-gray-500', bg: 'bg-gray-50' },
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
                        <p className="text-sm text-gray-500">Newsletter subscriptions will appear here</p>
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
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Source</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase hidden lg:table-cell">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredSubscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900">{sub.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${sub.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'active' ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
                                                {sub.status === 'active' ? 'Active' : 'Unsubscribed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm text-gray-500">{sub.source}</span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-sm text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

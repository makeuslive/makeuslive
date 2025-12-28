'use client'

import { useState, useEffect } from 'react'

interface Contact {
    id: string
    name: string
    email: string
    phone?: string
    company?: string
    message: string
    status: 'new' | 'read' | 'replied' | 'archived'
    createdAt: string
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'New' },
    read: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Read' },
    replied: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Replied' },
    archived: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Archived' },
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

    useEffect(() => {
        // Placeholder - would fetch from API
        setLoading(false)
    }, [])

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
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Contact Submissions</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage inquiries from your contact form</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Total', value: contacts.length, color: 'text-gray-900', bg: 'bg-white' },
                        { label: 'New', value: contacts.filter(c => c.status === 'new').length, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Replied', value: contacts.filter(c => c.status === 'replied').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Archived', value: contacts.filter(c => c.status === 'archived').length, color: 'text-orange-600', bg: 'bg-orange-50' },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} border border-gray-100 rounded-xl p-4`}>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {contacts.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No messages yet</h3>
                        <p className="text-sm text-gray-500">Contact form submissions will appear here</p>
                    </div>
                )}

                {/* Contacts List */}
                {contacts.length > 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {contacts.map((contact) => {
                                const status = STATUS_CONFIG[contact.status] || STATUS_CONFIG.new
                                return (
                                    <div
                                        key={contact.id}
                                        onClick={() => setSelectedContact(contact)}
                                        className="p-4 hover:bg-gray-50/50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-medium text-gray-900">{contact.name}</span>
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${status.bg} ${status.text}`}>{status.label}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                                                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{contact.message}</p>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {new Date(contact.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

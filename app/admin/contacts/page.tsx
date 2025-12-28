'use client'

import { useState, useEffect } from 'react'

interface Contact {
    id: string
    name: string
    email: string
    phone?: string
    website?: string
    message: string
    isRead: boolean
    createdAt: string
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        try {
            const res = await fetch('/api/admin/contacts')
            const data = await res.json()
            if (Array.isArray(data)) {
                setContacts(data)
            } else {
                setContacts([])
            }
        } catch (error) {
            console.error('Error fetching contacts:', error)
            setContacts([])
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id: string) => {
        try {
            await fetch('/api/admin/contacts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isRead: true }),
            })
            setContacts(contacts.map(c => c.id === id ? { ...c, isRead: true } : c))
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    const deleteContact = async (id: string) => {
        if (!confirm('Delete this submission?')) return
        try {
            await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' })
            setContacts(contacts.filter(c => c.id !== id))
            setSelectedContact(null)
        } catch (error) {
            console.error('Error deleting contact:', error)
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
            <div>
                <h2 className="text-xl font-bold text-gray-900">Contact Form Submissions</h2>
                <p className="text-gray-500 text-sm">
                    {contacts.filter(c => !c.isRead).length} unread messages
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* List */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[calc(100vh-12rem)]">
                    {contacts.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center flex-1">
                            <svg className="w-12 h-12 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p>No submissions yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 overflow-y-auto">
                            {contacts.map((contact) => (
                                <button
                                    key={contact.id}
                                    onClick={() => {
                                        setSelectedContact(contact)
                                        if (!contact.isRead) markAsRead(contact.id)
                                    }}
                                    className={`w-full text-left p-4 hover:bg-gray-50 transition-all ${selectedContact?.id === contact.id ? 'bg-blue-50/50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {!contact.isRead && (
                                            <span className="w-2.5 h-2.5 mt-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium truncate ${contact.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                                {contact.name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                                            <p className="text-sm text-gray-400 mt-1 line-clamp-1">{contact.message}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 flex-shrink-0">
                                            {new Date(contact.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail View */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-[calc(100vh-12rem)] overflow-y-auto">
                    {selectedContact ? (
                        <div className="space-y-6">
                            <div className="flex items-start justify-between border-b border-gray-100 pb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedContact.name}</h3>
                                    <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline text-sm font-medium">
                                        {selectedContact.email}
                                    </a>
                                </div>
                                <button
                                    onClick={() => deleteContact(selectedContact.id)}
                                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                                >
                                    Delete Submission
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {selectedContact.phone && (
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1">Phone</span>
                                        <span className="text-gray-900 font-medium">{selectedContact.phone}</span>
                                    </div>
                                )}
                                {selectedContact.website && (
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1">Website</span>
                                        <a href={selectedContact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">
                                            {selectedContact.website}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-2">Message</span>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedContact.message}
                                </div>
                            </div>

                            <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
                                Received on {new Date(selectedContact.createdAt).toLocaleString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p>Select a message to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

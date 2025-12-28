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
                console.error('API returned non-array:', data)
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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-white">Contact Form Submissions</h2>
                <p className="text-gray-400 text-sm">
                    {contacts.filter(c => !c.isRead).length} unread messages
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* List */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    {contacts.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            No submissions yet
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {contacts.map((contact) => (
                                <button
                                    key={contact.id}
                                    onClick={() => {
                                        setSelectedContact(contact)
                                        if (!contact.isRead) markAsRead(contact.id)
                                    }}
                                    className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${selectedContact?.id === contact.id ? 'bg-white/5' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {!contact.isRead && (
                                            <span className="w-2 h-2 mt-2 rounded-full bg-gold flex-shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium truncate ${contact.isRead ? 'text-gray-300' : 'text-white'}`}>
                                                {contact.name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                                            <p className="text-sm text-gray-400 mt-1 line-clamp-1">{contact.message}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 flex-shrink-0">
                                            {new Date(contact.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail View */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    {selectedContact ? (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{selectedContact.name}</h3>
                                    <a href={`mailto:${selectedContact.email}`} className="text-gold hover:underline text-sm">
                                        {selectedContact.email}
                                    </a>
                                </div>
                                <button
                                    onClick={() => deleteContact(selectedContact.id)}
                                    className="text-sm text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </div>

                            {selectedContact.phone && (
                                <p className="text-sm text-gray-400">
                                    📞 {selectedContact.phone}
                                </p>
                            )}

                            {selectedContact.website && (
                                <p className="text-sm text-gray-400">
                                    🌐 <a href={selectedContact.website} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">{selectedContact.website}</a>
                                </p>
                            )}

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-sm text-gray-500 mb-2">Message:</p>
                                <p className="text-gray-300 whitespace-pre-wrap">{selectedContact.message}</p>
                            </div>

                            <p className="text-xs text-gray-500 pt-4">
                                Received: {new Date(selectedContact.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-500">
                            Select a submission to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

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

const STATUS_OPTIONS = ['all', 'unread', 'read'] as const
type StatusFilter = typeof STATUS_OPTIONS[number]

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<StatusFilter>('all')
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
            }
        } catch (error) {
            console.error('Error fetching contacts:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleRead = async (contact: Contact) => {
        try {
            const res = await fetch('/api/admin/contacts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: contact.id, isRead: !contact.isRead }),
            })
            if (res.ok) {
                setContacts(contacts.map(c =>
                    c.id === contact.id ? { ...c, isRead: !c.isRead } : c
                ))
                if (selectedContact?.id === contact.id) {
                    setSelectedContact({ ...contact, isRead: !contact.isRead })
                }
            }
        } catch (error) {
            console.error('Error updating contact:', error)
        }
    }

    const deleteContact = async (id: string) => {
        if (!confirm('Delete this message?')) return
        try {
            const res = await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setContacts(contacts.filter(c => c.id !== id))
                if (selectedContact?.id === id) {
                    setSelectedContact(null)
                }
            }
        } catch (error) {
            console.error('Error deleting contact:', error)
        }
    }

    const filteredContacts = contacts.filter(c => {
        if (filter === 'unread') return !c.isRead
        if (filter === 'read') return c.isRead
        return true
    })

    const stats = {
        total: contacts.length,
        unread: contacts.filter(c => !c.isRead).length,
        read: contacts.filter(c => c.isRead).length,
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
        <div className="absolute inset-0 overflow-hidden flex">
            {/* List Panel */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200">
                <div className="p-6 border-b border-gray-100 bg-white">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Contact Submissions</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage inquiries from your contact form</p>

                    {/* Stats */}
                    <div className="flex gap-4 mt-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
                            <p className="text-xs text-gray-500">Unread</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-400">{stats.read}</p>
                            <p className="text-xs text-gray-500">Read</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-1 mt-4 p-1 bg-gray-100 rounded-lg w-fit">
                        {STATUS_OPTIONS.map((option) => (
                            <button
                                key={option}
                                onClick={() => setFilter(option)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${filter === option
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {filteredContacts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">No messages</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`p-4 cursor-pointer transition-colors ${selectedContact?.id === contact.id
                                        ? 'bg-blue-50 border-l-2 border-blue-500'
                                        : 'bg-white hover:bg-gray-50'
                                        } ${!contact.isRead ? 'font-medium' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                {!contact.isRead && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>
                                                )}
                                                <span className="text-gray-900 truncate">{contact.name}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate mt-0.5">{contact.email}</p>
                                            <p className="text-sm text-gray-400 line-clamp-1 mt-1">{contact.message}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {new Date(contact.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Panel */}
            <div className="w-[400px] bg-white flex flex-col shrink-0 hidden lg:flex">
                {selectedContact ? (
                    <>
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{selectedContact.name}</h2>
                                    <a href={`mailto:${selectedContact.email}`} className="text-sm text-blue-600 hover:underline">
                                        {selectedContact.email}
                                    </a>
                                    {selectedContact.phone && (
                                        <p className="text-sm text-gray-500 mt-1">{selectedContact.phone}</p>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => toggleRead(selectedContact)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title={selectedContact.isRead ? 'Mark as unread' : 'Mark as read'}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={selectedContact.isRead ? "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" : "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"} />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => deleteContact(selectedContact.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-3">
                                Received on {new Date(selectedContact.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Message</h3>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedContact.message}</p>

                            {selectedContact.website && (
                                <div className="mt-6">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Website</h3>
                                    <a href={selectedContact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                        {selectedContact.website}
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100">
                            <a
                                href={`mailto:${selectedContact.email}?from=team@makeuslive.com&subject=Re: Your Inquiry to MakeUsLive&body=%0A%0A---%0AOriginal message from ${encodeURIComponent(selectedContact.name)}:%0A${encodeURIComponent(selectedContact.message)}`}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Reply from team@makeuslive.com
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                        </svg>
                        <p className="text-sm">Select a message to view</p>
                    </div>
                )}
            </div>
        </div>
    )
}

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
    messages?: Array<{
        message: string
        createdAt: string
        website?: string
    }>
    replies?: Array<{
        message: string
        sentAt: string
        subject?: string
    }>
}

const STATUS_OPTIONS = ['all', 'unread', 'read'] as const
type StatusFilter = typeof STATUS_OPTIONS[number]

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<StatusFilter>('all')
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const [showReplyModal, setShowReplyModal] = useState(false)
    const [replying, setReplying] = useState(false)
    const [replyForm, setReplyForm] = useState({ subject: '', message: '' })

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

    const sendReply = async () => {
        if (!selectedContact || !replyForm.subject.trim() || !replyForm.message.trim()) {
            alert('Subject and message are required')
            return
        }

        setReplying(true)
        try {
            const res = await fetch('/api/admin/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedContact.id,
                    to: selectedContact.email,
                    name: selectedContact.name,
                    subject: replyForm.subject,
                    message: replyForm.message,
                    originalMessage: selectedContact.message,
                }),
            })

            if (res.ok) {
                alert('Reply sent successfully!')
                setShowReplyModal(false)
                setReplyForm({ subject: '', message: '' })
                // Refresh contacts to show the new reply
                await fetchContacts()
                // Mark as read
                if (!selectedContact.isRead) {
                    toggleRead(selectedContact)
                }
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to send reply')
            }
        } catch (error) {
            console.error('Error sending reply:', error)
            alert('Failed to send reply')
        } finally {
            setReplying(false)
        }
    }

    const filteredContacts = contacts.filter(c => {
        if (filter === 'unread') return !c.isRead
        if (filter === 'read') return c.isRead
        return true
    })

    // Group contacts by email address to show as conversation threads
    const groupedContacts = filteredContacts.reduce((acc, contact) => {
        const existing = acc.find(c => c.email === contact.email)
        if (existing) {
            // Add this message to the thread
            if (!existing.messages) {
                existing.messages = [{
                    message: existing.message,
                    createdAt: existing.createdAt,
                    website: existing.website
                }]
            }
            existing.messages.push({
                message: contact.message,
                createdAt: contact.createdAt,
                website: contact.website
            })
            // Sort messages by date (newest first for preview, but we'll reverse in display)
            existing.messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            // Update the preview to show the latest message
            existing.message = existing.messages[0].message
            existing.createdAt = existing.messages[0].createdAt
            // Mark as unread if any message is unread
            if (!contact.isRead) {
                existing.isRead = false
            }
        } else {
            acc.push({ ...contact })
        }
        return acc
    }, [] as (Contact & { messages?: Array<{ message: string; createdAt: string; website?: string }> })[])

    // Sort by latest message date
    groupedContacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

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
                    {groupedContacts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">No messages</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {groupedContacts.map((contact) => (
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
                                                {contact.messages && contact.messages.length > 1 && (
                                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                        {contact.messages.length}
                                                    </span>
                                                )}
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
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Conversation History</h3>

                            {/* All Customer Messages from this thread */}
                            <div className="space-y-4 mb-4">
                                {(selectedContact.messages || [{ message: selectedContact.message, createdAt: selectedContact.createdAt, website: selectedContact.website }])
                                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                                    .map((msg, idx) => (
                                        <div key={`msg-${idx}`}>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                    <span className="text-blue-600 text-xs font-semibold">{selectedContact.name.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-medium text-gray-900">{selectedContact.name}</span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                                                    </div>
                                                    {msg.website && (
                                                        <a href={msg.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                                                            🔗 {msg.website}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            {/* Replies */}
                            {selectedContact.replies && selectedContact.replies.length > 0 && (
                                <div className="space-y-4">
                                    {selectedContact.replies.map((reply, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                                                <span className="text-gold text-xs font-semibold">M</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-gray-900">MakeUsLive Team</span>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <span className="text-xs text-gray-400">{new Date(reply.sentAt).toLocaleString()}</span>
                                                </div>
                                                {reply.subject && (
                                                    <p className="text-xs text-gray-500 mb-1">Subject: {reply.subject}</p>
                                                )}
                                                <div className="bg-gold/5 rounded-lg p-3 border border-gold/20">
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setReplyForm({
                                        subject: `Re: Your inquiry to MakeUsLive`,
                                        message: `Hi ${selectedContact.name},\n\nThank you for reaching out to MakeUsLive.\n\n`
                                    })
                                    setShowReplyModal(true)
                                }}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Send Reply Email
                            </button>
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

            {/* Reply Modal */}
            {showReplyModal && selectedContact && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reply to {selectedContact.name}</h3>
                        <p className="text-sm text-gray-500 mb-6">Sending to: {selectedContact.email}</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                                <input
                                    type="text"
                                    value={replyForm.subject}
                                    onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                                    placeholder="Email subject..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                                <textarea
                                    value={replyForm.message}
                                    onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })}
                                    placeholder="Write your reply..."
                                    rows={8}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                />
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Original message:</p>
                                <p className="text-sm text-gray-700 line-clamp-3">{selectedContact.message}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={sendReply}
                                disabled={replying || !replyForm.subject.trim() || !replyForm.message.trim()}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {replying ? 'Sending...' : 'Send Reply'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowReplyModal(false)
                                    setReplyForm({ subject: '', message: '' })
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

'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import type { Form } from '@/lib/form-schema'

interface FormWithCount extends Form {
    submissionCount: number
}

export default function AdminFormsPage() {
    const { user } = useAuth()
    const [forms, setForms] = useState<FormWithCount[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const fetchForms = useCallback(async () => {
        if (!user) return

        try {
            setLoading(true)
            const token = await user.getIdToken()
            const response = await fetch('/api/forms', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()
            if (data.success) {
                setForms(data.forms)
            } else {
                setError(data.error || 'Failed to fetch forms')
            }
        } catch (err) {
            setError('Failed to fetch forms')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchForms()
    }, [fetchForms])

    const handleDelete = async (formId: string) => {
        if (!user) return

        try {
            const token = await user.getIdToken()
            const response = await fetch(`/api/forms/${formId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()
            if (data.success) {
                setForms(forms.filter(f => f._id !== formId))
                setDeleteConfirm(null)
            } else {
                setError(data.error || 'Failed to delete form')
            }
        } catch (err) {
            setError('Failed to delete form')
            console.error(err)
        }
    }

    const copyFormLink = (slug: string) => {
        const url = `${window.location.origin}/forms/${slug}`
        navigator.clipboard.writeText(url)
        // Could add toast notification here
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
                    <p className="text-gray-500 mt-1">Create and manage custom forms for lead collection</p>
                </div>
                <Link
                    href="/admin/forms/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Form
                </Link>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {error}
                    <button onClick={() => setError(null)} className="ml-2 underline">
                        Dismiss
                    </button>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Empty State */}
            {!loading && forms.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No forms yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Create your first form to start collecting leads and client information.
                    </p>
                    <Link
                        href="/admin/forms/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Your First Form
                    </Link>
                </div>
            )}

            {/* Forms Grid */}
            {!loading && forms.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {forms.map((form) => (
                        <div
                            key={form._id.toString()}
                            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            {/* Form Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{form.title}</h3>
                                    <p className="text-sm text-gray-500 truncate">/{form.slug}</p>
                                </div>
                                <span
                                    className={`shrink-0 ml-2 px-2 py-1 text-xs font-medium rounded-full ${form.settings?.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                        }`}
                                >
                                    {form.settings?.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            {/* Description */}
                            {form.description && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{form.description}</p>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>{form.fields?.length || 0} fields</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                    <span>{form.submissionCount} responses</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                <Link
                                    href={`/admin/forms/${form._id}`}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </Link>
                                <Link
                                    href={`/admin/forms/${form._id}/submissions`}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Responses
                                </Link>
                                <button
                                    onClick={() => copyFormLink(form.slug)}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Copy form link"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(form._id.toString())}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete form"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Delete Confirmation */}
                            {deleteConfirm === form._id.toString() && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700 mb-2">Delete this form and all its responses?</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(form._id.toString())}
                                            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(null)}
                                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

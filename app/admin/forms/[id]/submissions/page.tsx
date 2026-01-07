'use client'

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import type { Form, FormSubmission, FormField } from '@/lib/form-schema'

interface PageProps {
    params: Promise<{ id: string }>
}

export default function FormSubmissionsPage({ params }: PageProps) {
    const { id } = use(params)
    const { user } = useAuth()

    const [form, setForm] = useState<Form | null>(null)
    const [submissions, setSubmissions] = useState<FormSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchData = useCallback(async () => {
        if (!user) return

        try {
            setLoading(true)
            const token = await user.getIdToken()

            // Fetch form details
            const formResponse = await fetch(`/api/forms/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const formData = await formResponse.json()

            if (formData.success) {
                setForm(formData.form)
            }

            // Fetch submissions
            const subResponse = await fetch(`/api/forms/${id}/submissions?page=${page}&limit=25`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const subData = await subResponse.json()

            if (subData.success) {
                setSubmissions(subData.submissions)
                setTotalPages(subData.pagination?.totalPages || 1)
            }
        } catch (err) {
            setError('Failed to load data')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [id, user, page])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Export to CSV
    const handleExport = () => {
        if (!form || submissions.length === 0) return

        // Get all field labels for headers
        const inputFields = (form.fields || []).filter(
            (f) => !['heading', 'paragraph'].includes(f.type)
        )
        const headers = ['Submitted At', ...inputFields.map((f) => f.label)]

        // Build CSV rows
        const rows = submissions.map((sub) => {
            const date = new Date(sub.metadata.submittedAt).toLocaleString()
            const values = inputFields.map((field) => {
                const value = sub.data[field.id]
                if (Array.isArray(value)) return value.join('; ')
                return String(value || '')
            })
            return [date, ...values]
        })

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...rows.map((row) =>
                row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
            ),
        ].join('\n')

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `${form.slug}-submissions-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    // Format field value for display
    const formatValue = (value: unknown): string => {
        if (value === null || value === undefined || value === '') return '—'
        if (Array.isArray(value)) return value.join(', ')
        return String(value)
    }

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/forms"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{form?.title || 'Form'} Submissions</h1>
                        <p className="text-gray-500">{submissions.length} responses</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/admin/forms/${id}`}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Edit Form
                    </Link>
                    <button
                        onClick={handleExport}
                        disabled={submissions.length === 0}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {submissions.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Share your form link to start collecting responses.
                    </p>
                    <button
                        onClick={() => {
                            const url = `${window.location.origin}/forms/${form?.slug}`
                            navigator.clipboard.writeText(url)
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Form Link
                    </button>
                </div>
            )}

            {/* Submissions Table */}
            {submissions.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    {(form?.fields || [])
                                        .filter((f) => !['heading', 'paragraph'].includes(f.type))
                                        .slice(0, 4)
                                        .map((field) => (
                                            <th
                                                key={field.id}
                                                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                            >
                                                {field.label}
                                            </th>
                                        ))}
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {submissions.map((sub) => (
                                    <tr key={sub._id?.toString()} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(sub.metadata.submittedAt).toLocaleString()}
                                        </td>
                                        {(form?.fields || [])
                                            .filter((f) => !['heading', 'paragraph'].includes(f.type))
                                            .slice(0, 4)
                                            .map((field) => (
                                                <td
                                                    key={field.id}
                                                    className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate"
                                                >
                                                    {formatValue(sub.data[field.id])}
                                                </td>
                                            ))}
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => setSelectedSubmission(sub)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Submission Detail Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Submission Details</h3>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            {/* Meta info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Submitted:</span>
                                        <span className="ml-2 text-gray-900">
                                            {new Date(selectedSubmission.metadata.submittedAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {selectedSubmission.metadata.ip && (
                                        <div>
                                            <span className="text-gray-500">IP:</span>
                                            <span className="ml-2 text-gray-900">{selectedSubmission.metadata.ip}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Field values */}
                            <div className="space-y-4">
                                {(form?.fields || [])
                                    .filter((f) => !['heading', 'paragraph'].includes(f.type))
                                    .map((field) => (
                                        <div key={field.id} className="border-b border-gray-100 pb-3">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                {field.label}
                                            </label>
                                            <p className="text-gray-900 whitespace-pre-wrap">
                                                {formatValue(selectedSubmission.data[field.id])}
                                            </p>
                                        </div>
                                    ))}
                            </div>

                            {/* Files */}
                            {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Attachments</h4>
                                    <div className="space-y-2">
                                        {selectedSubmission.files.map((file, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                            >
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="text-sm text-gray-900">{file.filename}</span>
                                                <span className="text-xs text-gray-500">
                                                    ({(file.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

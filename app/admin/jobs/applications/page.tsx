'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Application {
    id: string
    jobId: string
    jobTitle: string
    name: string
    email: string
    phone?: string
    coverLetter?: string
    resumeUrl?: string
    portfolioUrl?: string
    referenceWork?: string
    expectedSalary?: string
    status: string
    submittedAt: string
    timestamp: string
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedApp, setSelectedApp] = useState<Application | null>(null)

    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        try {
            const res = await fetch('/api/admin/applications')
            const data = await res.json()
            if (Array.isArray(data)) {
                setApplications(data)
            }
        } catch (error) {
            console.error('Error fetching applications:', error)
        } finally {
            setLoading(false)
        }
    }

    const stats = {
        total: applications.length,
        new: applications.filter(a => a.status === 'new').length,
        reviewed: applications.filter(a => a.status === 'reviewed').length,
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
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Job Applications</h1>
                        <p className="text-sm text-gray-500 mt-1">Review and manage candidate applications</p>
                    </div>
                    <Link
                        href="/admin/jobs"
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Jobs
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-gray-900', bg: 'bg-white' },
                        { label: 'New', value: stats.new, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Reviewed', value: stats.reviewed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} border border-gray-100 rounded-xl p-4`}>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {applications.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No applications yet</h3>
                        <p className="text-sm text-gray-500">Applications will appear here when candidates apply for your job openings</p>
                    </div>
                )}

                {/* Applications List */}
                {applications.length > 0 && (
                    <div className="space-y-3">
                        {applications.map((app) => (
                            <div key={app.id} className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">{app.name}</h3>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${app.status === 'new'
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{app.jobTitle}</p>
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {app.email}
                                            </span>
                                            {app.phone && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {app.phone}
                                                </span>
                                            )}
                                            <span className="text-gray-400">
                                                {new Date(app.submittedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {/* Application materials badges */}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {app.resumeUrl && (
                                                <a
                                                    href={app.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                                                >
                                                    📄 Resume
                                                </a>
                                            )}
                                            {app.portfolioUrl && (
                                                <a
                                                    href={app.portfolioUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2 py-0.5 text-xs bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
                                                >
                                                    🎨 Portfolio
                                                </a>
                                            )}
                                            {app.expectedSalary && (
                                                <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-600 rounded-md">
                                                    💰 {app.expectedSalary}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedApp(app)}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Application Detail Modal */}
                {selectedApp && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
                        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedApp.name}</h2>
                                    <p className="text-sm text-gray-500">{selectedApp.jobTitle}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Contact Info */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500">Email:</span> <a href={`mailto:${selectedApp.email}`} className="text-blue-600 hover:underline">{selectedApp.email}</a></p>
                                        {selectedApp.phone && <p><span className="text-gray-500">Phone:</span> {selectedApp.phone}</p>}
                                        {selectedApp.expectedSalary && <p><span className="text-gray-500">Expected Salary:</span> {selectedApp.expectedSalary}</p>}
                                        <p><span className="text-gray-500">Applied:</span> {new Date(selectedApp.submittedAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Application Materials */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Application Materials</h3>
                                    <div className="space-y-2">
                                        {selectedApp.resumeUrl && (
                                            <a
                                                href={selectedApp.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                View Resume
                                            </a>
                                        )}
                                        {selectedApp.portfolioUrl && (
                                            <a
                                                href={selectedApp.portfolioUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                View Portfolio
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Reference Work */}
                                {selectedApp.referenceWork && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Reference Work</h3>
                                        <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">{selectedApp.referenceWork}</p>
                                    </div>
                                )}

                                {/* Cover Letter */}
                                {selectedApp.coverLetter && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Cover Letter</h3>
                                        <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">{selectedApp.coverLetter}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

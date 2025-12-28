'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardStats {
    testimonials: number
    works: number
    unreadContacts: number
    blogPosts: number
    publishedPosts: number
    draftPosts: number
    subscribers: number
}

// Dashboard stat card component
function StatCard({
    title,
    value,
    icon,
    href,
    change,
    color = 'blue',
}: {
    title: string
    value: string | number
    icon: React.ReactNode
    href: string
    change?: string
    color?: 'blue' | 'green' | 'yellow' | 'purple'
}) {
    const colorClasses = {
        blue: 'border-blue-100 hover:border-blue-200',
        green: 'border-green-100 hover:border-green-200',
        yellow: 'border-yellow-100 hover:border-yellow-200',
        purple: 'border-purple-100 hover:border-purple-200',
    }

    return (
        <Link
            href={href}
            className={`p-5 bg-white border ${colorClasses[color]} rounded-xl hover:shadow-md transition-all group`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    {icon}
                </div>
                {change && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                        {change}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors">
                {value}
            </p>
            <p className="text-sm text-gray-500">{title}</p>
        </Link>
    )
}

// Quick action button component
function QuickAction({
    label,
    description,
    icon,
    href,
}: {
    label: string
    description: string
    icon: React.ReactNode
    href: string
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group"
        >
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
        </Link>
    )
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        testimonials: 0,
        works: 0,
        unreadContacts: 0,
        blogPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        subscribers: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch blog stats
                const blogRes = await fetch('/api/admin/blog')
                const blogData = await blogRes.json()
                if (Array.isArray(blogData)) {
                    setStats(prev => ({
                        ...prev,
                        blogPosts: blogData.length,
                        publishedPosts: blogData.filter((p: { status: string }) => p.status === 'published').length,
                        draftPosts: blogData.filter((p: { status: string }) => p.status === 'draft').length,
                    }))
                }
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-1">Welcome to your CMS 👋</h2>
                <p className="text-blue-100">Manage your content, track performance, and publish with confidence.</p>
            </div>

            {/* Stats Grid */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Posts"
                        value={loading ? '...' : stats.blogPosts}
                        icon={<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        href="/admin/blog"
                        color="blue"
                    />
                    <StatCard
                        title="Published"
                        value={loading ? '...' : stats.publishedPosts}
                        icon={<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        href="/admin/blog?status=published"
                        color="green"
                    />
                    <StatCard
                        title="Drafts"
                        value={loading ? '...' : stats.draftPosts}
                        icon={<svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                        href="/admin/blog?status=draft"
                        color="yellow"
                    />
                    <StatCard
                        title="Contacts"
                        value={stats.unreadContacts}
                        icon={<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        href="/admin/contacts"
                        color="purple"
                        change="New"
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <QuickAction
                        label="New Blog Post"
                        description="Create a new article"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                        href="/admin/blog/new"
                    />
                    <QuickAction
                        label="Add Work"
                        description="Showcase a project"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        href="/admin/works/new"
                    />
                    <QuickAction
                        label="Add Testimonial"
                        description="Client feedback"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                        href="/admin/testimonials/new"
                    />
                </div>
            </div>

            {/* CMS Features */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">CMS Features</h3>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">SEO-First Editor</p>
                                    <p className="text-sm text-gray-500">Keywords, meta tags, and schema built-in</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Content Structure</p>
                                    <p className="text-sm text-gray-500">Live outline and heading navigation</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Featured Posts</p>
                                    <p className="text-sm text-gray-500">One-click featuring for homepage</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Workflow States</p>
                                    <p className="text-sm text-gray-500">Draft → Review → SEO → Published</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">SEO Checklist</p>
                                    <p className="text-sm text-gray-500">Publishing guardrails and scoring</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Coming Soon</p>
                                    <p className="text-sm text-gray-500">Topic clusters, versioning, comments</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

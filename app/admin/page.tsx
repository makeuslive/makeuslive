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

                // Fetch contacts stats
                const contactsRes = await fetch('/api/admin/contacts')
                const contactsData = await contactsRes.json()
                if (Array.isArray(contactsData)) {
                    // Group by email to get unique contacts
                    const uniqueEmails = new Set(contactsData.map((c: { email: string }) => c.email))
                    const unreadCount = contactsData.filter((c: { isRead: boolean }) => !c.isRead).length

                    setStats(prev => ({
                        ...prev,
                        unreadContacts: uniqueEmails.size,
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
        <div className="absolute inset-0 overflow-auto">
            <div className="p-6 lg:p-8 space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">👋</span>
                            <h1 className="text-2xl font-bold">Welcome back</h1>
                        </div>
                        <p className="text-gray-400 max-w-xl">Manage your content, track performance, and publish with confidence. Here's what's happening with your site.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Overview</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/admin/blog" className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-gray-200 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{loading ? '—' : stats.blogPosts}</p>
                            <p className="text-sm text-gray-500 mt-1">Total Posts</p>
                        </Link>

                        <Link href="/admin/blog?status=published" className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-gray-200 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{loading ? '—' : stats.publishedPosts}</p>
                            <p className="text-sm text-gray-500 mt-1">Published</p>
                        </Link>

                        <Link href="/admin/blog?status=draft" className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-gray-200 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{loading ? '—' : stats.draftPosts}</p>
                            <p className="text-sm text-gray-500 mt-1">Drafts</p>
                        </Link>

                        <Link href="/admin/contacts" className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-gray-200 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                {stats.unreadContacts > 0 && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-purple-100 text-purple-700 rounded-full">New</span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{stats.unreadContacts}</p>
                            <p className="text-sm text-gray-500 mt-1">Contacts</p>
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Link href="/admin/blog/new" className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">New Blog Post</p>
                                <p className="text-sm text-gray-500">Create a new article</p>
                            </div>
                        </Link>

                        <Link href="/admin/work/new" className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Add Work</p>
                                <p className="text-sm text-gray-500">Showcase a project</p>
                            </div>
                        </Link>

                        <Link href="/admin/testimonials/new" className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all">
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Add Testimonial</p>
                                <p className="text-sm text-gray-500">Client feedback</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Features Overview */}
                <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">CMS Features</h2>
                    <div className="bg-white border border-gray-100 rounded-2xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {[
                                    { title: 'SEO-First Editor', desc: 'Keywords, meta tags, and schema built-in' },
                                    { title: 'Content Structure', desc: 'Live outline and heading navigation' },
                                    { title: 'Featured Posts', desc: 'One-click featuring for homepage' },
                                ].map((feature) => (
                                    <div key={feature.title} className="flex items-start gap-3">
                                        <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{feature.title}</p>
                                            <p className="text-sm text-gray-500">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: 'Workflow States', desc: 'Draft → Review → SEO → Published' },
                                    { title: 'SEO Checklist', desc: 'Publishing guardrails and scoring' },
                                    { title: 'Coming Soon', desc: 'Topic clusters, versioning, comments', isSoon: true },
                                ].map((feature) => (
                                    <div key={feature.title} className="flex items-start gap-3">
                                        <div className={`w-5 h-5 ${feature.isSoon ? 'bg-blue-100' : 'bg-emerald-100'} rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
                                            {feature.isSoon ? (
                                                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{feature.title}</p>
                                            <p className="text-sm text-gray-500">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

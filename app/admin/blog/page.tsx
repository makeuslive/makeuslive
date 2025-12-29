'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    status: 'idea' | 'draft' | 'review' | 'seo_review' | 'scheduled' | 'published' | 'archived'
    featured: boolean
    category?: string
    primaryKeyword?: string
    views?: number
    readTime?: string
    wordCount?: number
    createdAt: string
    publishedAt?: string
    featuredImage?: string
}

type FilterStatus = 'all' | 'published' | 'draft' | 'review' | 'scheduled' | 'archived'

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    idea: { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Idea' },
    draft: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', label: 'Draft' },
    review: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400', label: 'Review' },
    seo_review: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400', label: 'SEO Review' },
    scheduled: { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-400', label: 'Scheduled' },
    published: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', label: 'Published' },
    archived: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400', label: 'Archived' },
}

function BlogPageLoading() {
    return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-blue-600"></div>
                <p className="text-sm text-gray-400">Loading posts...</p>
            </div>
        </div>
    )
}

export default function BlogPage() {
    return (
        <Suspense fallback={<BlogPageLoading />}>
            <BlogContent />
        </Suspense>
    )
}

function BlogContent() {
    const searchParams = useSearchParams()
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<FilterStatus>((searchParams.get('status') as FilterStatus) || 'all')
    const [searchQuery, setSearchQuery] = useState('')
    const [deleting, setDeleting] = useState<string | null>(null)
    const [togglingFeatured, setTogglingFeatured] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

    useEffect(() => {
        fetchPosts()
    }, [])

    useEffect(() => {
        const statusFromUrl = searchParams.get('status') as FilterStatus
        if (statusFromUrl && ['all', 'published', 'draft', 'review', 'scheduled', 'archived'].includes(statusFromUrl)) {
            setFilter(statusFromUrl)
        }
    }, [searchParams])

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/blog')
            const data = await res.json()
            if (Array.isArray(data)) {
                setPosts(data)
            } else {
                console.error('API returned non-array:', data)
                setPosts([])
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    const deletePost = async (id: string) => {
        if (!confirm('Delete this post? This cannot be undone.')) return
        setDeleting(id)
        try {
            await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' })
            setPosts(posts.filter((p) => p.id !== id))
        } catch (error) {
            console.error('Error deleting post:', error)
        } finally {
            setDeleting(null)
        }
    }

    const toggleFeatured = async (id: string) => {
        setTogglingFeatured(id)
        try {
            const res = await fetch(`/api/admin/blog/featured?id=${id}`, { method: 'POST' })
            const updatedPost = await res.json()
            setPosts(posts.map((p) =>
                p.id === id ? { ...p, featured: updatedPost.featured } : p
            ))
        } catch (error) {
            console.error('Error toggling featured:', error)
        } finally {
            setTogglingFeatured(null)
        }
    }

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            if (filter !== 'all' && post.status !== filter) return false
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                return (
                    post.title.toLowerCase().includes(query) ||
                    post.slug.toLowerCase().includes(query) ||
                    post.primaryKeyword?.toLowerCase().includes(query) ||
                    post.category?.toLowerCase().includes(query)
                )
            }
            return true
        })
    }, [posts, filter, searchQuery])

    const sortedPosts = useMemo(() => {
        return [...filteredPosts].sort((a, b) => {
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
        })
    }, [filteredPosts])

    const stats = useMemo(() => ({
        total: posts.length,
        published: posts.filter(p => p.status === 'published').length,
        drafts: posts.filter(p => p.status === 'draft').length,
        featured: posts.filter(p => p.featured).length,
    }), [posts])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-blue-600"></div>
                    <p className="text-sm text-gray-400">Loading posts...</p>
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
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Blog Posts</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {stats.total} total • {stats.published} published • {stats.featured} featured
                        </p>
                    </div>
                    <Link
                        href="/admin/blog/new"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Post
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-gray-900', bg: 'bg-white' },
                        { label: 'Published', value: stats.published, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Drafts', value: stats.drafts, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Featured', value: stats.featured, color: 'text-blue-600', bg: 'bg-blue-50' },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} border border-gray-100 rounded-xl p-4`}>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                        {(['all', 'published', 'draft', 'review'] as FilterStatus[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${filter === f
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
                            title="List View"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
                            title="Grid View"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                {sortedPosts.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {searchQuery ? 'No posts found' : 'No posts yet'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {searchQuery ? 'Try a different search term' : 'Create your first blog post to get started'}
                        </p>
                        <Link
                            href="/admin/blog/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Post
                        </Link>
                    </div>
                ) : viewMode === 'list' ? (
                    /* List View */
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Post</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Keyword</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Analytics</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {sortedPosts.map((post) => {
                                        const status = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft
                                        return (
                                            <tr key={post.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => toggleFeatured(post.id)}
                                                            disabled={togglingFeatured === post.id}
                                                            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${post.featured
                                                                ? 'bg-amber-100 text-amber-500'
                                                                : 'bg-gray-100 text-gray-300 hover:text-gray-400'
                                                                } ${togglingFeatured === post.id ? 'animate-pulse' : ''}`}
                                                            title={post.featured ? 'Remove from featured' : 'Add to featured'}
                                                        >
                                                            <svg className="w-4 h-4" fill={post.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                            </svg>
                                                        </button>
                                                        <div className="min-w-0">
                                                            <Link
                                                                href={`/admin/blog/${post.id}`}
                                                                className="text-gray-900 font-medium hover:text-blue-600 transition-colors line-clamp-1"
                                                            >
                                                                {post.title || 'Untitled'}
                                                            </Link>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-xs text-gray-400 font-mono">/blog/{post.slug}</span>
                                                                {post.category && (
                                                                    <>
                                                                        <span className="text-gray-200">•</span>
                                                                        <span className="text-xs text-gray-400">{post.category}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden lg:table-cell">
                                                    {post.primaryKeyword ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-md">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                            </svg>
                                                            {post.primaryKeyword}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-300">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            {(post.views || 0).toLocaleString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {post.readTime || '—'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {post.status === 'published' && (
                                                            <a
                                                                href={`/blog/${post.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                                                title="View"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                        <Link
                                                            href={`/admin/blog/${post.id}`}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => deletePost(post.id)}
                                                            disabled={deleting === post.id}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Grid View */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {sortedPosts.map((post) => {
                            const status = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft
                            return (
                                <div key={post.id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all">
                                    {/* Image */}
                                    <div className="aspect-video bg-gray-100 relative">
                                        {post.featuredImage ? (
                                            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-sm ${status.bg} ${status.text}`}>
                                                {status.label}
                                            </span>
                                            {post.featured && (
                                                <span className="p-1 bg-amber-100/90 text-amber-500 rounded-md backdrop-blur-sm">
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <Link href={`/admin/blog/${post.id}`} className="block">
                                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                                                {post.title || 'Untitled'}
                                            </h3>
                                        </Link>
                                        <p className="text-xs text-gray-400 font-mono mb-3">/blog/{post.slug}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <span>{(post.views || 0).toLocaleString()} views</span>
                                                <span>{post.readTime || '—'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/admin/blog/${post.id}`}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => deletePost(post.id)}
                                                    disabled={deleting === post.id}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

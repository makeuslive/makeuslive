'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
}

type FilterStatus = 'all' | 'published' | 'draft' | 'review' | 'scheduled' | 'archived'

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
    idea: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Idea' },
    draft: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Draft' },
    review: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Review' },
    seo_review: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'SEO Review' },
    scheduled: { bg: 'bg-cyan-50', text: 'text-cyan-700', label: 'Scheduled' },
    published: { bg: 'bg-green-50', text: 'text-green-700', label: 'Published' },
    archived: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Archived' },
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<FilterStatus>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [deleting, setDeleting] = useState<string | null>(null)
    const [togglingFeatured, setTogglingFeatured] = useState<string | null>(null)

    useEffect(() => {
        fetchPosts()
    }, [])

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

    const filteredPosts = posts.filter((post) => {
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

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
    })

    const stats = {
        total: posts.length,
        published: posts.filter(p => p.status === 'published').length,
        drafts: posts.filter(p => p.status === 'draft').length,
        featured: posts.filter(p => p.featured).length,
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {stats.total} posts • {stats.published} published • {stats.featured} featured
                    </p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <p className="text-gray-500 text-sm">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
                    <p className="text-green-600 text-sm">Published</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.published}</p>
                </div>
                <div className="bg-white border border-yellow-100 rounded-xl p-4 shadow-sm">
                    <p className="text-yellow-600 text-sm">Drafts</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.drafts}</p>
                </div>
                <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                    <p className="text-blue-600 text-sm">Featured</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{stats.featured}</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search posts, keywords, categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
                    {(['all', 'published', 'draft', 'review', 'scheduled'] as FilterStatus[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-sm rounded-md capitalize transition-all ${filter === f
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts Table */}
            {sortedPosts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 mb-4">
                        {searchQuery ? 'No posts match your search' : 'No posts yet'}
                    </p>
                    <Link
                        href="/admin/blog/new"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Create your first post →
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Post
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                    Keyword
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    Stats
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <button
                                                onClick={() => toggleFeatured(post.id)}
                                                disabled={togglingFeatured === post.id}
                                                className={`mt-0.5 text-lg transition-all ${post.featured
                                                        ? 'text-yellow-500 hover:text-yellow-400'
                                                        : 'text-gray-300 hover:text-gray-400'
                                                    } ${togglingFeatured === post.id ? 'animate-pulse' : ''}`}
                                                title={post.featured ? 'Remove from featured' : 'Add to featured'}
                                            >
                                                ★
                                            </button>
                                            <div>
                                                <Link
                                                    href={`/admin/blog/${post.id}`}
                                                    className="text-gray-900 font-medium hover:text-blue-600 transition-colors line-clamp-1"
                                                >
                                                    {post.title}
                                                </Link>
                                                <p className="text-gray-400 text-sm">/blog/{post.slug}</p>
                                                {post.category && (
                                                    <span className="text-xs text-gray-400 mt-1 inline-block">
                                                        {post.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        {post.primaryKeyword ? (
                                            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">
                                                {post.primaryKeyword}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300 text-sm">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_CONFIG[post.status]?.bg || 'bg-gray-100'
                                            } ${STATUS_CONFIG[post.status]?.text || 'text-gray-600'}`}>
                                            {STATUS_CONFIG[post.status]?.label || post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="text-sm text-gray-500">
                                            <span>{post.views?.toLocaleString() || 0} views</span>
                                            <span className="text-gray-300 mx-2">•</span>
                                            <span>{post.wordCount || 0} words</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {post.status === 'published' && (
                                                <a
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="View post"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h3 className="text-blue-800 font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pro Tips
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Click ★ to feature posts — they appear first on your blog</li>
                    <li>• Add a <strong>Primary Keyword</strong> to each post for SEO tracking</li>
                    <li>• Use the SEO tab in the editor to optimize meta tags</li>
                </ul>
            </div>
        </div>
    )
}

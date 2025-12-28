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
    createdAt: string
    publishedAt?: string
}

type FilterStatus = 'all' | 'published' | 'draft' | 'review' | 'scheduled' | 'archived'

const STATUS_COLORS: Record<string, string> = {
    idea: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    review: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    seo_review: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    scheduled: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    published: 'bg-green-500/10 text-green-400 border-green-500/20',
    archived: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
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
        if (!confirm('Delete this post?')) return

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
        // Status filter
        if (filter !== 'all' && post.status !== filter) return false
        // Search filter
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

    // Sort: featured first, then by date
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
    })

    // Stats
    const stats = {
        total: posts.length,
        published: posts.filter(p => p.status === 'published').length,
        drafts: posts.filter(p => p.status === 'draft').length,
        featured: posts.filter(p => p.featured).length,
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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Blog Management</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {stats.total} posts • {stats.published} published • {stats.featured} featured
                    </p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="px-5 py-2.5 bg-gradient-to-r from-gold to-amber-500 text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Total Posts</p>
                    <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                    <p className="text-green-400 text-sm">Published</p>
                    <p className="text-2xl font-bold text-green-400 mt-1">{stats.published}</p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-yellow-400 text-sm">Drafts</p>
                    <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.drafts}</p>
                </div>
                <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                    <p className="text-gold text-sm">Featured</p>
                    <p className="text-2xl font-bold text-gold mt-1">{stats.featured}</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
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
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                </div>

                {/* Status Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {(['all', 'published', 'draft', 'review', 'scheduled', 'archived'] as FilterStatus[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm rounded-lg capitalize whitespace-nowrap transition-all ${filter === f
                                    ? 'bg-gold/20 text-gold border border-gold/30'
                                    : 'text-gray-400 hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts Table */}
            {sortedPosts.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-400 mb-4">
                        {searchQuery ? 'No posts match your search' : 'No posts found'}
                    </p>
                    <Link href="/admin/blog/new" className="text-gold hover:underline">
                        Create your first post
                    </Link>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6">★</span>
                                        Title
                                    </div>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 hidden lg:table-cell">Keyword</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Views</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Date</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPosts.map((post) => (
                                <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            {/* Featured Toggle */}
                                            <button
                                                onClick={() => toggleFeatured(post.id)}
                                                disabled={togglingFeatured === post.id}
                                                className={`mt-1 text-xl transition-colors ${post.featured
                                                        ? 'text-gold hover:text-gold/70'
                                                        : 'text-gray-600 hover:text-gray-400'
                                                    } ${togglingFeatured === post.id ? 'animate-pulse' : ''}`}
                                                title={post.featured ? 'Remove from featured' : 'Add to featured'}
                                            >
                                                {post.featured ? '★' : '☆'}
                                            </button>
                                            <div>
                                                <p className="text-white font-medium line-clamp-1">{post.title}</p>
                                                <p className="text-gray-500 text-sm">/blog/{post.slug}</p>
                                                {post.category && (
                                                    <span className="text-xs text-gray-500 mt-1 inline-block">
                                                        {post.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        {post.primaryKeyword ? (
                                            <span className="text-sm text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                                                {post.primaryKeyword}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600 text-sm">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full border ${STATUS_COLORS[post.status] || STATUS_COLORS.draft}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                                        {post.views?.toLocaleString() || '0'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {post.status === 'published' && (
                                                <a
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                    title="View post"
                                                >
                                                    👁
                                                </a>
                                            )}
                                            <Link
                                                href={`/admin/blog/${post.id}`}
                                                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deletePost(post.id)}
                                                disabled={deleting === post.id}
                                                className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Quick Tips */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <h3 className="text-blue-400 font-medium mb-2">💡 CMS Tips</h3>
                <ul className="text-sm text-blue-300/80 space-y-1">
                    <li>• Click ★ to feature a post — featured posts appear first on the blog</li>
                    <li>• Add a <strong>Primary Keyword</strong> to each post for SEO tracking</li>
                    <li>• Use workflow statuses to manage your content pipeline</li>
                </ul>
            </div>
        </div>
    )
}

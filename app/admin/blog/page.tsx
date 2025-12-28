'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    status: 'draft' | 'published'
    category?: string
    createdAt: string
    publishedAt?: string
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
    const [deleting, setDeleting] = useState<string | null>(null)

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

    const filteredPosts = posts.filter((post) => {
        if (filter === 'all') return true
        return post.status === filter
    })

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
                    <h2 className="text-xl font-bold text-white">Blog Posts</h2>
                    <p className="text-gray-400 text-sm">{posts.length} posts total</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="px-4 py-2 bg-gradient-to-r from-gold to-amber-500 text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                    New Post
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'published', 'draft'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm rounded-lg capitalize transition-all ${filter === f
                            ? 'bg-gold/20 text-gold border border-gold/30'
                            : 'text-gray-400 hover:bg-white/5'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Table */}
            {filteredPosts.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <p className="text-gray-400 mb-4">No posts found</p>
                    <Link href="/admin/blog/new" className="text-gold hover:underline">
                        Create your first post
                    </Link>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Title</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-medium">{post.title}</p>
                                            <p className="text-gray-500 text-sm">/blog/{post.slug}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${post.status === 'published'
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
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
        </div>
    )
}

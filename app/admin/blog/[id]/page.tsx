'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MarkdownEditor from '@/components/admin/editor-loader'

interface BlogData {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    tags: string[]
    featuredImage: string
    status: 'draft' | 'published'
}

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(false)
    const [form, setForm] = useState<BlogData>({
        id: '',
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'General',
        tags: [],
        featuredImage: '',
        status: 'draft',
    })
    const [tagsInput, setTagsInput] = useState('')

    useEffect(() => {
        fetchPost()
    }, [resolvedParams.id])

    const fetchPost = async () => {
        try {
            const res = await fetch('/api/admin/blog')
            const data = await res.json()
            if (Array.isArray(data)) {
                const post = data.find((p: BlogData) => p.id === resolvedParams.id)
                if (post) {
                    setForm(post)
                    setTagsInput(post.tags?.join(', ') || '')
                }
            }
        } catch (error) {
            console.error('Error fetching post:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'blog')

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()
            if (data.url) {
                setForm({ ...form, featuredImage: data.url })
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent, publishStatus?: 'draft' | 'published') => {
        e.preventDefault()
        setSaving(true)

        const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
        const status = publishStatus || form.status

        try {
            const res = await fetch('/api/admin/blog', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, tags, status }),
            })

            if (res.ok) {
                router.push('/admin/blog')
            } else {
                throw new Error('Failed to update')
            }
        } catch (error) {
            console.error('Error updating post:', error)
            alert('Failed to update post')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Edit Blog Post</h2>
                    <p className="text-gray-400 text-sm">
                        Status: <span className={form.status === 'published' ? 'text-green-400' : 'text-yellow-400'}>{form.status}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setPreview(!preview)}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                        {preview ? 'Edit' : 'Preview'}
                    </button>
                    <Link href="/admin/blog" className="text-gray-400 hover:text-white text-sm py-2">
                        ← Back
                    </Link>
                </div>
            </div>

            <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="col-span-2 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    placeholder="Enter post title..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
                                <div className="flex items-center">
                                    <span className="text-gray-500 mr-2">/blog/</span>
                                    <input
                                        type="text"
                                        value={form.slug}
                                        onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        required
                                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
                                <textarea
                                    value={form.excerpt}
                                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                                    placeholder="Brief description for previews..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Content (Markdown) *</label>
                                {preview ? (
                                    <div className="w-full min-h-[400px] px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 prose prose-invert max-w-none overflow-auto">
                                        <div dangerouslySetInnerHTML={{ __html: form.content.replace(/\n/g, '<br/>') }} />
                                    </div>
                                ) : (
                                    <MarkdownEditor
                                        markdown={form.content}
                                        onChange={(content) => setForm({ ...form, content })}
                                        placeholder="Write your post content in Markdown..."
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Featured Image */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <label className="block text-sm font-medium text-gray-300 mb-3">Featured Image</label>
                            <div className="border-2 border-dashed border-white/20 rounded-xl overflow-hidden">
                                {form.featuredImage ? (
                                    <div className="relative">
                                        <img src={form.featuredImage} alt="Featured" className="w-full h-32 object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, featuredImage: '' })}
                                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer block py-6 text-center">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        <span className="text-gray-400 text-sm">
                                            {uploading ? 'Uploading...' : 'Upload image'}
                                        </span>
                                    </label>
                                )}
                            </div>
                            <input
                                type="url"
                                value={form.featuredImage}
                                onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                                placeholder="Or paste URL"
                                className="w-full mt-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-gold/50"
                            />
                        </div>

                        {/* Category */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                            >
                                <option value="General">General</option>
                                <option value="AI & Technology">AI & Technology</option>
                                <option value="Design">Design</option>
                                <option value="Development">Development</option>
                                <option value="UX Research">UX Research</option>
                                <option value="Animation">Animation</option>
                            </select>
                        </div>

                        {/* Tags */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="AI, Design, Next.js"
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                            />
                            <p className="text-xs text-gray-500 mt-1">Comma separated</p>
                        </div>

                        {/* Actions */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e as any, 'published')}
                                disabled={saving}
                                className="w-full py-3 px-4 bg-gradient-to-r from-gold to-amber-500 text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Publish'}
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e as any, 'draft')}
                                disabled={saving}
                                className="w-full py-2 px-4 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                            >
                                Save as Draft
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

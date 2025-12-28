'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MarkdownEditor from '@/components/admin/editor-loader'

interface SEOConfig {
    metaTitle: string
    metaDescription: string
    canonicalUrl: string
    schemaType: 'Article' | 'HowTo' | 'FAQ' | 'NewsArticle'
    noIndex: boolean
    noFollow: boolean
}

interface BlogData {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    tags: string[]
    featuredImage: string
    status: 'idea' | 'draft' | 'review' | 'seo_review' | 'scheduled' | 'published' | 'archived'
    featured: boolean
    priority: 'low' | 'medium' | 'high'
    primaryKeyword: string
    secondaryKeywords: string[]
    seo: SEOConfig
    views: number
    readTime: string
    wordCount: number
}

const CATEGORIES = [
    'General',
    'AI & Technology',
    'Design',
    'Development',
    'UX Research',
    'Animation',
    'Business',
    'Tutorial',
    'Case Study',
]

const STATUSES = [
    { value: 'idea', label: 'Idea', color: 'text-gray-400' },
    { value: 'draft', label: 'Draft', color: 'text-yellow-400' },
    { value: 'review', label: 'Editorial Review', color: 'text-blue-400' },
    { value: 'seo_review', label: 'SEO Review', color: 'text-purple-400' },
    { value: 'scheduled', label: 'Scheduled', color: 'text-cyan-400' },
    { value: 'published', label: 'Published', color: 'text-green-400' },
    { value: 'archived', label: 'Archived', color: 'text-orange-400' },
]

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content')

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
        featured: false,
        priority: 'medium',
        primaryKeyword: '',
        secondaryKeywords: [],
        seo: {
            metaTitle: '',
            metaDescription: '',
            canonicalUrl: '',
            schemaType: 'Article',
            noIndex: false,
            noFollow: false,
        },
        views: 0,
        readTime: '1 min',
        wordCount: 0,
    })

    const [tagsInput, setTagsInput] = useState('')
    const [secondaryKeywordsInput, setSecondaryKeywordsInput] = useState('')

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
                    setForm({
                        ...post,
                        seo: post.seo || {
                            metaTitle: post.title || '',
                            metaDescription: post.excerpt || '',
                            canonicalUrl: '',
                            schemaType: 'Article',
                            noIndex: false,
                            noFollow: false,
                        },
                        featured: post.featured || false,
                        priority: post.priority || 'medium',
                        primaryKeyword: post.primaryKeyword || '',
                        secondaryKeywords: post.secondaryKeywords || [],
                    })
                    setTagsInput(post.tags?.join(', ') || '')
                    setSecondaryKeywordsInput(post.secondaryKeywords?.join(', ') || '')
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

    const handleSubmit = async (e: React.FormEvent, publishStatus?: BlogData['status']) => {
        e.preventDefault()
        setSaving(true)

        const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
        const secondaryKeywords = secondaryKeywordsInput.split(',').map(k => k.trim()).filter(Boolean)
        const status = publishStatus || form.status

        try {
            const payload = {
                ...form,
                tags,
                secondaryKeywords,
                status,
                seo: {
                    ...form.seo,
                    metaTitle: form.seo.metaTitle || form.title,
                    metaDescription: form.seo.metaDescription || form.excerpt,
                },
            }

            const res = await fetch('/api/admin/blog', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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

    // Calculate word count and reading time
    useEffect(() => {
        if (form.content) {
            const words = form.content.split(/\s+/).filter(Boolean).length
            const readTime = Math.max(1, Math.ceil(words / 200))
            setForm(prev => ({
                ...prev,
                wordCount: words,
                readTime: `${readTime} min`,
            }))
        }
    }, [form.content])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blog"
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-white">Edit Post</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`text-sm ${STATUSES.find(s => s.value === form.status)?.color}`}>
                                {STATUSES.find(s => s.value === form.status)?.label}
                            </span>
                            {form.featured && (
                                <span className="text-gold text-sm">★ Featured</span>
                            )}
                            <span className="text-gray-500 text-sm">
                                {form.wordCount} words • {form.readTime} read
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {form.status === 'published' && (
                        <a
                            href={`/blog/${form.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg"
                        >
                            View Post →
                        </a>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-lg w-fit">
                {(['content', 'seo', 'settings'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm rounded-md capitalize transition-all ${activeTab === tab
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab === 'seo' ? 'SEO' : tab}
                    </button>
                ))}
            </div>

            <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
                {/* Content Tab */}
                {activeTab === 'content' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
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
                                    <MarkdownEditor
                                        markdown={form.content}
                                        onChange={(content) => setForm({ ...form, content })}
                                        placeholder="Write your post content in Markdown..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Actions */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                                <h3 className="font-medium text-white">Publish</h3>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value as BlogData['status'] })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
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

                            {/* Featured & Priority */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                                <h3 className="font-medium text-white">Post Settings</h3>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.featured}
                                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-600 text-gold focus:ring-gold/50"
                                    />
                                    <span className="text-white">★ Featured Post</span>
                                </label>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Priority</label>
                                    <select
                                        value={form.priority}
                                        onChange={(e) => setForm({ ...form, priority: e.target.value as BlogData['priority'] })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 space-y-4">
                                <h3 className="font-medium text-blue-400">🔑 Keywords</h3>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Primary Keyword *</label>
                                    <input
                                        type="text"
                                        value={form.primaryKeyword}
                                        onChange={(e) => setForm({ ...form, primaryKeyword: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        placeholder="e.g., AI development agency"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Main keyword this post should rank for</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Secondary Keywords</label>
                                    <input
                                        type="text"
                                        value={secondaryKeywordsInput}
                                        onChange={(e) => setSecondaryKeywordsInput(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Comma separated</p>
                                </div>
                            </div>

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

                            {/* Category & Tags */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
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
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                    <div className="max-w-3xl space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                                <span className="text-2xl">🔍</span>
                                <div>
                                    <h3 className="font-medium text-white">Search Engine Optimization</h3>
                                    <p className="text-sm text-gray-500">How your post appears in search results</p>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-blue-600 text-lg font-medium line-clamp-1">
                                    {form.seo.metaTitle || form.title || 'Post Title'}
                                </p>
                                <p className="text-green-700 text-sm">
                                    makeuslive.com/blog/{form.slug || 'post-slug'}
                                </p>
                                <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                                    {form.seo.metaDescription || form.excerpt || 'Post description will appear here...'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Meta Title
                                    <span className="text-gray-500 font-normal ml-2">
                                        ({(form.seo.metaTitle || form.title || '').length}/60)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={form.seo.metaTitle}
                                    onChange={(e) => setForm({
                                        ...form,
                                        seo: { ...form.seo, metaTitle: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    placeholder={form.title || 'SEO Title (defaults to post title)'}
                                    maxLength={60}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Meta Description
                                    <span className="text-gray-500 font-normal ml-2">
                                        ({(form.seo.metaDescription || form.excerpt || '').length}/160)
                                    </span>
                                </label>
                                <textarea
                                    value={form.seo.metaDescription}
                                    onChange={(e) => setForm({
                                        ...form,
                                        seo: { ...form.seo, metaDescription: e.target.value }
                                    })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                                    placeholder={form.excerpt || 'SEO Description (defaults to excerpt)'}
                                    maxLength={160}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Schema Type</label>
                                <select
                                    value={form.seo.schemaType}
                                    onChange={(e) => setForm({
                                        ...form,
                                        seo: { ...form.seo, schemaType: e.target.value as SEOConfig['schemaType'] }
                                    })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                >
                                    <option value="Article">Article</option>
                                    <option value="HowTo">How-To Guide</option>
                                    <option value="FAQ">FAQ</option>
                                    <option value="NewsArticle">News Article</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Canonical URL (optional)</label>
                                <input
                                    type="url"
                                    value={form.seo.canonicalUrl}
                                    onChange={(e) => setForm({
                                        ...form,
                                        seo: { ...form.seo, canonicalUrl: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    placeholder="https://..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Only set if this content exists elsewhere</p>
                            </div>

                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.seo.noIndex}
                                        onChange={(e) => setForm({
                                            ...form,
                                            seo: { ...form.seo, noIndex: e.target.checked }
                                        })}
                                        className="w-4 h-4 rounded border-gray-600 text-gold focus:ring-gold/50"
                                    />
                                    <span className="text-gray-300">No Index</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.seo.noFollow}
                                        onChange={(e) => setForm({
                                            ...form,
                                            seo: { ...form.seo, noFollow: e.target.checked }
                                        })}
                                        className="w-4 h-4 rounded border-gray-600 text-gold focus:ring-gold/50"
                                    />
                                    <span className="text-gray-300">No Follow</span>
                                </label>
                            </div>
                        </div>

                        {/* SEO Checklist */}
                        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
                            <h3 className="font-medium text-green-400 mb-4">✓ SEO Checklist</h3>
                            <ul className="space-y-2 text-sm">
                                <li className={form.primaryKeyword ? 'text-green-400' : 'text-gray-500'}>
                                    {form.primaryKeyword ? '✓' : '○'} Primary keyword is set
                                </li>
                                <li className={(form.seo.metaTitle || form.title)?.length >= 30 ? 'text-green-400' : 'text-gray-500'}>
                                    {(form.seo.metaTitle || form.title)?.length >= 30 ? '✓' : '○'} Meta title is at least 30 characters
                                </li>
                                <li className={(form.seo.metaDescription || form.excerpt)?.length >= 120 ? 'text-green-400' : 'text-gray-500'}>
                                    {(form.seo.metaDescription || form.excerpt)?.length >= 120 ? '✓' : '○'} Meta description is at least 120 characters
                                </li>
                                <li className={form.wordCount >= 500 ? 'text-green-400' : 'text-gray-500'}>
                                    {form.wordCount >= 500 ? '✓' : '○'} Content has 500+ words ({form.wordCount} words)
                                </li>
                                <li className={form.featuredImage ? 'text-green-400' : 'text-gray-500'}>
                                    {form.featuredImage ? '✓' : '○'} Featured image is set
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="max-w-3xl space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                            <h3 className="font-medium text-white">Post Analytics</h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-gray-400 text-xs uppercase">Views</p>
                                    <p className="text-2xl font-bold text-white mt-1">
                                        {form.views?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-gray-400 text-xs uppercase">Read Time</p>
                                    <p className="text-2xl font-bold text-white mt-1">{form.readTime}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-gray-400 text-xs uppercase">Word Count</p>
                                    <p className="text-2xl font-bold text-white mt-1">
                                        {form.wordCount?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-gray-400 text-xs uppercase">Status</p>
                                    <p className={`text-2xl font-bold mt-1 capitalize ${STATUSES.find(s => s.value === form.status)?.color}`}>
                                        {form.status}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                            <h3 className="font-medium text-red-400 mb-4">Danger Zone</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Archiving will hide this post from the public blog but keep it in your CMS.
                            </p>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e as any, 'archived')}
                                className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                            >
                                Archive Post
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

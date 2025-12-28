'use client'

import { useState, useEffect, FormEvent } from 'react'
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

export default function NewBlogPostPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        category: 'General',
        tags: '',
        status: 'draft' as 'draft' | 'published',
        featured: false,
        priority: 'medium' as 'low' | 'medium' | 'high',
        primaryKeyword: '',
        secondaryKeywords: '',
        seo: {
            metaTitle: '',
            metaDescription: '',
            canonicalUrl: '',
            schemaType: 'Article' as SEOConfig['schemaType'],
            noIndex: false,
            noFollow: false,
        },
    })

    const [wordCount, setWordCount] = useState(0)
    const [readTime, setReadTime] = useState('1 min')

    // Auto-generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: formData.slug || generateSlug(title),
        })
    }

    // Calculate word count and reading time
    useEffect(() => {
        if (formData.content) {
            const words = formData.content.split(/\s+/).filter(Boolean).length
            const time = Math.max(1, Math.ceil(words / 200))
            setWordCount(words)
            setReadTime(`${time} min`)
        }
    }, [formData.content])

    const handleSubmit = async (e: FormEvent, publishNow = false) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                secondaryKeywords: formData.secondaryKeywords.split(',').map(k => k.trim()).filter(Boolean),
                status: publishNow ? 'published' : formData.status,
                featuredImage: formData.image,
                seo: {
                    ...formData.seo,
                    metaTitle: formData.seo.metaTitle || formData.title,
                    metaDescription: formData.seo.metaDescription || formData.excerpt,
                },
            }

            const res = await fetch('/api/admin/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                router.push('/admin/blog')
            } else {
                alert('Failed to create post')
            }
        } catch (error) {
            console.error('Error creating post:', error)
            alert('Failed to create post')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blog"
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-white">New Post</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {wordCount} words • {readTime} read
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${formData.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm text-gray-400 uppercase">{formData.status}</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-lg w-fit">
                {(['content', 'seo'] as const).map((tab) => (
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

            <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
                {activeTab === 'content' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                {/* Title & Slug */}
                                <div>
                                    <input
                                        id="title"
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        className="w-full bg-transparent border-0 text-4xl font-bold text-white placeholder-white/40 focus:ring-0 p-0"
                                        placeholder="Post Title"
                                    />
                                </div>

                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <span>/blog/</span>
                                    <input
                                        id="slug"
                                        type="text"
                                        required
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="bg-transparent border-0 text-white/80 focus:text-white focus:ring-0 p-0 w-full"
                                        placeholder="post-slug"
                                    />
                                </div>

                                {/* Excerpt */}
                                <div className="pt-4">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Excerpt
                                    </label>
                                    <textarea
                                        id="excerpt"
                                        required
                                        rows={2}
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                                        placeholder="Write a brief summary..."
                                    />
                                </div>

                                {/* Content Editor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Content
                                    </label>
                                    <MarkdownEditor
                                        markdown={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        placeholder="Start writing your story..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Publish Actions */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                                <h3 className="font-medium text-white">Publish</h3>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="draft"
                                            checked={formData.status === 'draft'}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' })}
                                            className="text-gold focus:ring-gold/50"
                                        />
                                        <span className="text-white/80">Save as Draft</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="published"
                                            checked={formData.status === 'published'}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' })}
                                            className="text-gold focus:ring-gold/50"
                                        />
                                        <span className="text-white/80">Publish Now</span>
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 bg-gradient-to-r from-gold to-amber-500 text-black font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                                    >
                                        {loading ? 'Saving...' : formData.status === 'published' ? 'Publish' : 'Save Draft'}
                                    </button>
                                </div>
                            </div>

                            {/* Featured & Priority */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                                <h3 className="font-medium text-white">Post Settings</h3>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-600 text-gold focus:ring-gold/50"
                                    />
                                    <span className="text-white">★ Featured Post</span>
                                </label>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 space-y-4">
                                <h3 className="font-medium text-blue-400">🔑 Keywords</h3>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Primary Keyword</label>
                                    <input
                                        type="text"
                                        value={formData.primaryKeyword}
                                        onChange={(e) => setFormData({ ...formData, primaryKeyword: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        placeholder="e.g., AI development agency"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Secondary Keywords</label>
                                    <input
                                        type="text"
                                        value={formData.secondaryKeywords}
                                        onChange={(e) => setFormData({ ...formData, secondaryKeywords: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        placeholder="keyword1, keyword2, ..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Comma separated</p>
                                </div>
                            </div>

                            {/* Category & Tags */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Tags
                                    </label>
                                    <input
                                        id="tags"
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        placeholder="design, ai, nextjs..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                                <label className="block text-sm font-medium text-gray-400">
                                    Featured Image URL
                                </label>
                                <input
                                    id="image"
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    placeholder="https://..."
                                />
                                {formData.image && (
                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-white/5">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-70" />
                                    </div>
                                )}
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

                            {/* Google Preview */}
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-blue-600 text-lg font-medium line-clamp-1">
                                    {formData.seo.metaTitle || formData.title || 'Post Title'}
                                </p>
                                <p className="text-green-700 text-sm">
                                    makeuslive.com/blog/{formData.slug || 'post-slug'}
                                </p>
                                <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                                    {formData.seo.metaDescription || formData.excerpt || 'Post description will appear here...'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Meta Title
                                    <span className="text-gray-500 font-normal ml-2">
                                        ({(formData.seo.metaTitle || formData.title || '').length}/60)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.seo.metaTitle}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        seo: { ...formData.seo, metaTitle: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    placeholder={formData.title || 'SEO Title'}
                                    maxLength={60}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Meta Description
                                    <span className="text-gray-500 font-normal ml-2">
                                        ({(formData.seo.metaDescription || formData.excerpt || '').length}/160)
                                    </span>
                                </label>
                                <textarea
                                    value={formData.seo.metaDescription}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        seo: { ...formData.seo, metaDescription: e.target.value }
                                    })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                                    placeholder={formData.excerpt || 'SEO Description'}
                                    maxLength={160}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Schema Type</label>
                                <select
                                    value={formData.seo.schemaType}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        seo: { ...formData.seo, schemaType: e.target.value as SEOConfig['schemaType'] }
                                    })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                >
                                    <option value="Article">Article</option>
                                    <option value="HowTo">How-To Guide</option>
                                    <option value="FAQ">FAQ</option>
                                    <option value="NewsArticle">News Article</option>
                                </select>
                            </div>
                        </div>

                        {/* SEO Checklist */}
                        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
                            <h3 className="font-medium text-green-400 mb-4">✓ SEO Checklist</h3>
                            <ul className="space-y-2 text-sm">
                                <li className={formData.primaryKeyword ? 'text-green-400' : 'text-gray-500'}>
                                    {formData.primaryKeyword ? '✓' : '○'} Primary keyword is set
                                </li>
                                <li className={(formData.seo.metaTitle || formData.title)?.length >= 30 ? 'text-green-400' : 'text-gray-500'}>
                                    {(formData.seo.metaTitle || formData.title)?.length >= 30 ? '✓' : '○'} Meta title is at least 30 characters
                                </li>
                                <li className={(formData.seo.metaDescription || formData.excerpt)?.length >= 120 ? 'text-green-400' : 'text-gray-500'}>
                                    {(formData.seo.metaDescription || formData.excerpt)?.length >= 120 ? '✓' : '○'} Meta description is at least 120 characters
                                </li>
                                <li className={wordCount >= 500 ? 'text-green-400' : 'text-gray-500'}>
                                    {wordCount >= 500 ? '✓' : '○'} Content has 500+ words ({wordCount} words)
                                </li>
                                <li className={formData.image ? 'text-green-400' : 'text-gray-500'}>
                                    {formData.image ? '✓' : '○'} Featured image is set
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

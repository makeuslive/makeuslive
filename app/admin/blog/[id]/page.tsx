'use client'

import { useState, useEffect, use, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import the editor
const TiptapEditor = dynamic(() => import('@/components/admin/tiptap-editor'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-[400px] bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Loading Editor...</p>
            </div>
        </div>
    )
})

// Types
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

// Constants
const CATEGORIES = [
    'General', 'AI & Technology', 'Design', 'Development',
    'UX Research', 'Animation', 'Business', 'Tutorial', 'Case Study',
]

const STATUSES = [
    { value: 'idea', label: 'Idea', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
    { value: 'draft', label: 'Draft', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
    { value: 'review', label: 'Review', color: 'bg-blue-50 text-blue-700', dot: 'bg-blue-400' },
    { value: 'seo_review', label: 'SEO Review', color: 'bg-purple-50 text-purple-700', dot: 'bg-purple-400' },
    { value: 'scheduled', label: 'Scheduled', color: 'bg-cyan-50 text-cyan-700', dot: 'bg-cyan-400' },
    { value: 'published', label: 'Published', color: 'bg-green-50 text-green-700', dot: 'bg-green-400' },
    { value: 'archived', label: 'Archived', color: 'bg-orange-50 text-orange-700', dot: 'bg-orange-400' },
]

// Extract headings from HTML content
function extractHeadings(content: string) {
    const headings: { level: number; text: string }[] = []
    const regex = /<h([1-4])[^>]*>([^<]+)<\/h[1-4]>/gi
    let match
    while ((match = regex.exec(content)) !== null) {
        headings.push({
            level: parseInt(match[1]),
            text: match[2].replace(/&[^;]+;/g, ' ').trim(),
        })
    }
    return headings
}

// Count words in HTML content
function countWords(content: string) {
    const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    return text ? text.split(' ').length : 0
}

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [rightPanel, setRightPanel] = useState<'keywords' | 'seo' | 'workflow' | 'settings'>('keywords')

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

    // Computed values
    const headings = useMemo(() => extractHeadings(form.content), [form.content])
    const wordCount = useMemo(() => countWords(form.content), [form.content])
    const readTime = useMemo(() => `${Math.max(1, Math.ceil(wordCount / 200))} min`, [wordCount])

    // SEO Checklist
    const seoChecklist = useMemo(() => {
        const title = form.seo.metaTitle || form.title
        const desc = form.seo.metaDescription || form.excerpt
        const contentLower = form.content.toLowerCase()
        const keywordInContent = form.primaryKeyword ? contentLower.includes(form.primaryKeyword.toLowerCase()) : false

        return {
            hasKeyword: !!form.primaryKeyword,
            keywordInTitle: form.primaryKeyword ? form.title.toLowerCase().includes(form.primaryKeyword.toLowerCase()) : false,
            keywordInContent,
            hasTitle: title.length >= 30,
            hasDescription: desc.length >= 120,
            hasContent: wordCount >= 500,
            hasImage: !!form.featuredImage,
            hasH2: headings.some(h => h.level === 2),
        }
    }, [form, wordCount, headings])

    const seoScore = useMemo(() => {
        const checks = Object.values(seoChecklist)
        return Math.round((checks.filter(Boolean).length / checks.length) * 100)
    }, [seoChecklist])

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
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (data.url) setForm({ ...form, featuredImage: data.url })
        } catch (error) {
            console.error('Upload error:', error)
        } finally {
            setUploading(false)
        }
    }

    const handleSave = useCallback(async (newStatus?: BlogData['status']) => {
        setSaving(true)
        const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
        const secondaryKeywords = secondaryKeywordsInput.split(',').map(k => k.trim()).filter(Boolean)
        const status = newStatus || form.status

        try {
            const payload = {
                ...form,
                tags,
                secondaryKeywords,
                status,
                wordCount,
                readTime,
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
                setLastSaved(new Date())
                if (newStatus) setForm({ ...form, status: newStatus })
            }
        } catch (error) {
            console.error('Error saving:', error)
        } finally {
            setSaving(false)
        }
    }, [form, tagsInput, secondaryKeywordsInput, wordCount, readTime])

    const handlePublish = async () => {
        if (seoScore < 50) {
            if (!confirm('SEO score is below 50%. Publish anyway?')) return
        }
        await handleSave('published')
        router.push('/admin/blog')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
            </div>
        )
    }

    const statusConfig = STATUSES.find(s => s.value === form.status) || STATUSES[1]

    return (
        <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50 -m-6">
            {/* Top Bar */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blog"
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </Link>

                    <div className="h-6 w-px bg-gray-200" />

                    <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                            {statusConfig.label}
                        </span>
                        {form.featured && (
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700">
                                ★ Featured
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {lastSaved && (
                        <span className="text-xs text-gray-400">
                            Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                    <button
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    {form.status === 'published' ? (
                        <a
                            href={`/blog/${form.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                        >
                            View Post
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    ) : (
                        <button
                            onClick={handlePublish}
                            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Publish
                        </button>
                    )}
                </div>
            </div>

            {/* Three-Pane Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Structure */}
                <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto shrink-0 hidden lg:block">
                    <div className="p-5">
                        {/* Document Info */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Document</h3>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-500">Words</span>
                                    <span className="font-semibold text-gray-900">{wordCount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-500">Reading</span>
                                    <span className="font-semibold text-gray-900">{readTime}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Headings</span>
                                    <span className="font-semibold text-gray-900">{headings.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* SEO Score */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">SEO Score</h3>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-2xl font-bold ${seoScore >= 80 ? 'text-green-600' :
                                            seoScore >= 50 ? 'text-yellow-600' : 'text-red-500'
                                        }`}>{seoScore}%</span>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${seoScore >= 80 ? 'bg-green-100 text-green-700' :
                                            seoScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {seoScore >= 80 ? 'Good' : seoScore >= 50 ? 'Fair' : 'Needs Work'}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${seoScore >= 80 ? 'bg-green-500' :
                                                seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${seoScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Structure Outline */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Outline</h3>
                            <div className="space-y-1">
                                {headings.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic py-3 text-center bg-gray-50 rounded-lg">
                                        No headings yet
                                    </p>
                                ) : (
                                    headings.map((h, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-sm ${h.level === 1 ? 'font-semibold text-gray-900' :
                                                    h.level === 2 ? 'pl-4 text-gray-700' :
                                                        h.level === 3 ? 'pl-6 text-gray-500 text-xs' :
                                                            'pl-8 text-gray-400 text-xs'
                                                }`}
                                        >
                                            <span className={`shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-mono ${h.level === 1 ? 'bg-blue-100 text-blue-700' :
                                                    h.level === 2 ? 'bg-gray-100 text-gray-600' :
                                                        'bg-gray-50 text-gray-400'
                                                }`}>
                                                H{h.level}
                                            </span>
                                            <span className="line-clamp-1">{h.text}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Panel - Editor */}
                <div className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-3xl mx-auto px-8 py-8">
                        {/* Title */}
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full text-4xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 mb-2 placeholder-gray-300"
                            placeholder="Post title"
                        />

                        {/* Slug */}
                        <div className="flex items-center gap-1 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100">
                            <span className="text-gray-300">/blog/</span>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                                className="bg-transparent border-none text-gray-500 focus:outline-none focus:ring-0 p-0 min-w-[200px]"
                                placeholder="post-slug"
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Excerpt</label>
                            <textarea
                                value={form.excerpt}
                                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                rows={2}
                                className="w-full text-lg text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                                placeholder="Write a brief summary of your post..."
                            />
                        </div>

                        {/* Content Editor */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Content</label>
                            <TiptapEditor
                                markdown={form.content}
                                onChange={(content) => setForm({ ...form, content })}
                                placeholder="Start writing your post..."
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel - Context */}
                <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto shrink-0 hidden xl:block">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
                        {(['keywords', 'seo', 'workflow', 'settings'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setRightPanel(tab)}
                                className={`flex-1 px-2 py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors ${rightPanel === tab
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {tab === 'seo' ? 'SEO' : tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-5">
                        {/* Keywords Tab */}
                        {rightPanel === 'keywords' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Primary Keyword
                                        <span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.primaryKeyword}
                                        onChange={(e) => setForm({ ...form, primaryKeyword: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., AI development"
                                    />
                                    {!form.primaryKeyword && (
                                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            Required for SEO optimization
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Secondary Keywords
                                    </label>
                                    <input
                                        type="text"
                                        value={secondaryKeywordsInput}
                                        onChange={(e) => setSecondaryKeywordsInput(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="keyword1, keyword2"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Comma separated</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags</label>
                                    <input
                                        type="text"
                                        value={tagsInput}
                                        onChange={(e) => setTagsInput(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="AI, Design, Next.js"
                                    />
                                </div>

                                {/* Keyword Usage */}
                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Keyword Optimization</h4>
                                    {form.primaryKeyword ? (
                                        <div className="space-y-2">
                                            <div className={`flex items-center gap-2 p-2 rounded-lg ${seoChecklist.keywordInTitle ? 'bg-green-50' : 'bg-gray-50'}`}>
                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${seoChecklist.keywordInTitle ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                                    {seoChecklist.keywordInTitle ? '✓' : '○'}
                                                </span>
                                                <span className={`text-sm ${seoChecklist.keywordInTitle ? 'text-green-700' : 'text-gray-500'}`}>
                                                    In title
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-2 p-2 rounded-lg ${seoChecklist.keywordInContent ? 'bg-green-50' : 'bg-gray-50'}`}>
                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${seoChecklist.keywordInContent ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                                    {seoChecklist.keywordInContent ? '✓' : '○'}
                                                </span>
                                                <span className={`text-sm ${seoChecklist.keywordInContent ? 'text-green-700' : 'text-gray-500'}`}>
                                                    In content
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg">
                                            Set a keyword to track usage
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SEO Tab */}
                        {rightPanel === 'seo' && (
                            <div className="space-y-6">
                                {/* Google Preview */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Search Preview</h4>
                                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                        <p className="text-blue-700 text-base font-medium line-clamp-1 hover:underline cursor-pointer">
                                            {form.seo.metaTitle || form.title || 'Post Title'}
                                        </p>
                                        <p className="text-green-700 text-xs mt-0.5">
                                            makeuslive.com › blog › {form.slug || 'post-slug'}
                                        </p>
                                        <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                                            {form.seo.metaDescription || form.excerpt || 'Add a description to see how it appears in search results...'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Meta Title
                                        <span className={`font-normal normal-case ${(form.seo.metaTitle || form.title).length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {(form.seo.metaTitle || form.title).length}/60
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.seo.metaTitle}
                                        onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaTitle: e.target.value } })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={form.title || 'SEO Title'}
                                        maxLength={70}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Meta Description
                                        <span className={`font-normal normal-case ${(form.seo.metaDescription || form.excerpt).length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {(form.seo.metaDescription || form.excerpt).length}/160
                                        </span>
                                    </label>
                                    <textarea
                                        value={form.seo.metaDescription}
                                        onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder={form.excerpt || 'SEO Description'}
                                        maxLength={170}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Schema Type</label>
                                    <select
                                        value={form.seo.schemaType}
                                        onChange={(e) => setForm({ ...form, seo: { ...form.seo, schemaType: e.target.value as SEOConfig['schemaType'] } })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Article">Article</option>
                                        <option value="HowTo">How-To Guide</option>
                                        <option value="FAQ">FAQ</option>
                                        <option value="NewsArticle">News Article</option>
                                    </select>
                                </div>

                                {/* SEO Checklist */}
                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">SEO Checklist</h4>
                                    <div className="space-y-2">
                                        {[
                                            { key: 'hasKeyword', label: 'Primary keyword set', check: seoChecklist.hasKeyword },
                                            { key: 'hasTitle', label: 'Title 30+ characters', check: seoChecklist.hasTitle },
                                            { key: 'hasDescription', label: 'Description 120+ chars', check: seoChecklist.hasDescription },
                                            { key: 'hasH2', label: 'Has H2 headings', check: seoChecklist.hasH2 },
                                            { key: 'hasContent', label: '500+ words', check: seoChecklist.hasContent },
                                            { key: 'hasImage', label: 'Featured image set', check: seoChecklist.hasImage },
                                        ].map((item) => (
                                            <div key={item.key} className={`flex items-center gap-2 p-2 rounded-lg ${item.check ? 'bg-green-50' : 'bg-gray-50'}`}>
                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${item.check ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                                    {item.check ? '✓' : '○'}
                                                </span>
                                                <span className={`text-sm ${item.check ? 'text-green-700' : 'text-gray-500'}`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Workflow Tab */}
                        {rightPanel === 'workflow' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value as BlogData['status'] })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {STATUSES.map((s) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-yellow-500 text-xl">★</span>
                                        <div>
                                            <p className="font-medium text-gray-900">Featured Post</p>
                                            <p className="text-xs text-gray-500">Show on homepage</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.featured}
                                            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
                                    <div className="flex gap-2">
                                        {(['low', 'medium', 'high'] as const).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setForm({ ...form, priority: p })}
                                                className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${form.priority === p
                                                        ? p === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                            p === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                                'bg-gray-100 text-gray-700 border border-gray-200'
                                                        : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <button
                                        onClick={handlePublish}
                                        disabled={saving}
                                        className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                                    >
                                        Publish Now
                                    </button>
                                    <button
                                        onClick={() => handleSave('draft')}
                                        disabled={saving}
                                        className="w-full py-3 text-gray-600 bg-gray-100 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Save as Draft
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {rightPanel === 'settings' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Featured Image</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                                        {form.featuredImage ? (
                                            <div className="relative group">
                                                <img src={form.featuredImage} alt="Featured" className="w-full h-40 object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        onClick={() => setForm({ ...form, featuredImage: '' })}
                                                        className="px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer block py-10 text-center">
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-gray-500 text-sm font-medium">
                                                    {uploading ? 'Uploading...' : 'Click to upload'}
                                                </p>
                                                <p className="text-gray-400 text-xs mt-1">PNG, JPG up to 10MB</p>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Analytics</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-gray-900">{(form.views || 0).toLocaleString()}</p>
                                            <p className="text-xs text-gray-500 mt-1">Views</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-gray-900">{readTime}</p>
                                            <p className="text-xs text-gray-500 mt-1">Read Time</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Danger Zone</h4>
                                    <button
                                        onClick={() => handleSave('archived')}
                                        className="w-full py-3 text-red-600 bg-red-50 font-medium rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                                    >
                                        Archive Post
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

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

    // Panel Toggles
    const [leftPanelOpen, setLeftPanelOpen] = useState(true)
    const [rightPanelOpen, setRightPanelOpen] = useState(true)

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
        <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50 -m-6 relative">
            {/* Top Bar */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 shadow-sm z-20">
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

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                    <button
                        onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                        className={`p-1.5 rounded-lg transition-colors ${leftPanelOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Toggle Structure"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setRightPanelOpen(!rightPanelOpen)}
                        className={`p-1.5 rounded-lg transition-colors ${rightPanelOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Toggle Sidebar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {lastSaved && (
                        <span className="text-xs text-gray-400 hidden sm:inline">
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
                            View
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
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Panel - Structure */}
                <div
                    className={`bg-white border-r border-gray-200 overflow-y-auto shrink-0 transition-all duration-300 ease-in-out ${leftPanelOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'
                        }`}
                >
                    <div className="p-5 w-64">
                        {/* SEO Score */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">SEO Score</h3>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${seoScore >= 80 ? 'bg-green-100 text-green-700' :
                                        seoScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {seoScore >= 80 ? 'Good' : seoScore >= 50 ? 'Fair' : 'Needs Work'}
                                </span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-2xl font-bold ${seoScore >= 80 ? 'text-green-600' :
                                            seoScore >= 50 ? 'text-yellow-600' : 'text-red-500'
                                        }`}>{seoScore}%</span>
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

                        {/* Document Info */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Structure</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-center">
                                    <span className="text-xs text-gray-500 block">Words</span>
                                    <span className="font-semibold text-gray-900 text-sm">{wordCount.toLocaleString()}</span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-center">
                                    <span className="text-xs text-gray-500 block">Time</span>
                                    <span className="font-semibold text-gray-900 text-sm">{readTime}</span>
                                </div>
                            </div>
                        </div>

                        {/* Structure Outline */}
                        <div className="pb-10">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Outline</h3>
                            <div className="space-y-0.5">
                                {headings.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        Use H1-H4 headings
                                    </p>
                                ) : (
                                    headings.map((h, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-start gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors text-xs ${h.level === 1 ? 'font-semibold text-gray-900 bg-gray-50' :
                                                    h.level === 2 ? 'pl-3 text-gray-700' :
                                                        h.level === 3 ? 'pl-5 text-gray-600' :
                                                            'pl-7 text-gray-500'
                                                }`}
                                        >
                                            <span className={`shrink-0 w-4 h-4 rounded flex items-center justify-center font-mono text-[10px] ${h.level === 1 ? 'bg-blue-100 text-blue-700' :
                                                    h.level === 2 ? 'bg-gray-100 text-gray-600' :
                                                        'bg-gray-50 text-gray-400'
                                                }`}>
                                                H{h.level}
                                            </span>
                                            <span className="line-clamp-1 py-0.5">{h.text}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Panel - Editor */}
                <div className="flex-1 overflow-y-auto bg-white scroll-smooth relative">
                    <div className={`max-w-3xl mx-auto px-8 py-8 transition-all duration-300 ${!leftPanelOpen && !rightPanelOpen ? 'max-w-4xl' : ''}`}>
                        {/* Title */}
                        <textarea
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full text-4xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 mb-4 placeholder-gray-300 resize-none overflow-hidden"
                            placeholder="Post title"
                            rows={1}
                            style={{ minHeight: '3rem' }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                            }}
                        />

                        {/* Slug */}
                        <div className="flex items-center gap-1 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100 group">
                            <span className="text-gray-300 group-hover:text-blue-400 transition-colors">/blog/</span>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                                className="bg-transparent border-none text-gray-500 focus:outline-none focus:ring-0 p-0 min-w-[200px] w-full hover:text-blue-600 transition-colors"
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
                                className="w-full text-lg text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400 transition-shadow hover:bg-white focus:bg-white"
                                placeholder="Write a brief summary of your post..."
                            />
                        </div>

                        {/* Content Editor */}
                        <div className="pb-20">
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
                <div
                    className={`bg-white border-l border-gray-200 overflow-y-auto shrink-0 transition-all duration-300 ease-in-out ${rightPanelOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'
                        }`}
                >
                    <div className="w-80">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
                            {(['keywords', 'seo', 'workflow', 'settings'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setRightPanel(tab)}
                                    className={`flex-1 px-2 py-3.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${rightPanel === tab
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab === 'seo' ? 'SEO' : tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-5 pb-20">
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
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="e.g., AI development"
                                        />
                                        {!form.primaryKeyword && (
                                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-100">
                                                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Required for SEO
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
                                        <p className="text-xs text-gray-400 mt-1 pl-1">Comma separated</p>
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
                                                <div className={`flex items-center gap-2 p-2 rounded-lg border ${seoChecklist.keywordInTitle ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${seoChecklist.keywordInTitle ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                                        {seoChecklist.keywordInTitle ? '✓' : '○'}
                                                    </span>
                                                    <span className={`text-sm ${seoChecklist.keywordInTitle ? 'text-green-700' : 'text-gray-500'}`}>
                                                        In title
                                                    </span>
                                                </div>
                                                <div className={`flex items-center gap-2 p-2 rounded-lg border ${seoChecklist.keywordInContent ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${seoChecklist.keywordInContent ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                                        {seoChecklist.keywordInContent ? '✓' : '○'}
                                                    </span>
                                                    <span className={`text-sm ${seoChecklist.keywordInContent ? 'text-green-700' : 'text-gray-500'}`}>
                                                        In content
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                                Set primary keyword first
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
                                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <p className="text-[#1a0dab] text-lg font-normal line-clamp-1 hover:underline cursor-pointer">
                                                {form.seo.metaTitle || form.title || 'Post Title'}
                                            </p>
                                            <div className="flex items-center gap-1 text-sm mt-1">
                                                <span className="text-[#202124]">makeuslive.com</span>
                                                <span className="text-[#5f6368]">› blog › {form.slug || 'slug'}</span>
                                            </div>
                                            <p className="text-[#4d5156] text-sm line-clamp-2 mt-1">
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
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                                            placeholder={form.excerpt || 'SEO Description'}
                                            maxLength={170}
                                        />
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
                                                <div key={item.key} className={`flex items-center gap-2 p-2 rounded-lg border ${item.check ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${item.check ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
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
                                            className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm shadow-blue-200"
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
                                            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                                                <p className="text-2xl font-bold text-gray-900">{(form.views || 0).toLocaleString()}</p>
                                                <p className="text-xs text-gray-500 mt-1">Views</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
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
        </div>
    )
}

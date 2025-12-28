'use client'

import { useState, useEffect, use, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const NovelEditor = dynamic(() => import('@/components/admin/novel-editor'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Loading Editor...</p>
            </div>
        </div>
    )
})

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

const CATEGORIES = ['General', 'AI & Technology', 'Design', 'Development', 'UX Research', 'Animation', 'Business', 'Tutorial', 'Case Study']

const STATUSES = [
    { value: 'idea', label: 'Idea', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
    { value: 'draft', label: 'Draft', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
    { value: 'review', label: 'Review', color: 'bg-blue-50 text-blue-700', dot: 'bg-blue-400' },
    { value: 'seo_review', label: 'SEO Review', color: 'bg-purple-50 text-purple-700', dot: 'bg-purple-400' },
    { value: 'scheduled', label: 'Scheduled', color: 'bg-cyan-50 text-cyan-700', dot: 'bg-cyan-400' },
    { value: 'published', label: 'Published', color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-400' },
    { value: 'archived', label: 'Archived', color: 'bg-orange-50 text-orange-700', dot: 'bg-orange-400' },
]

function extractHeadings(content: string) {
    const headings: { level: number; text: string }[] = []
    const regex = /<h([1-4])[^>]*>([^<]+)<\/h[1-4]>/gi
    let match
    while ((match = regex.exec(content)) !== null) {
        headings.push({ level: parseInt(match[1]), text: match[2].replace(/&[^;]+;/g, ' ').trim() })
    }
    return headings
}

function countWords(content: string) {
    const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    return text ? text.split(' ').length : 0
}

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [activeTab, setActiveTab] = useState<'details' | 'seo' | 'settings'>('details')
    const [showLeftPanel, setShowLeftPanel] = useState(true)
    const [showRightPanel, setShowRightPanel] = useState(true)

    const [form, setForm] = useState<BlogData>({
        id: '', title: '', slug: '', excerpt: '', content: '', category: 'General',
        tags: [], featuredImage: '', status: 'draft', featured: false, priority: 'medium',
        primaryKeyword: '', secondaryKeywords: [],
        seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', schemaType: 'Article', noIndex: false, noFollow: false },
        views: 0, readTime: '1 min', wordCount: 0,
    })

    const [tagsInput, setTagsInput] = useState('')

    const headings = useMemo(() => extractHeadings(form.content), [form.content])
    const wordCount = useMemo(() => countWords(form.content), [form.content])
    const readTime = useMemo(() => `${Math.max(1, Math.ceil(wordCount / 200))} min`, [wordCount])

    const seoScore = useMemo(() => {
        const checks = [
            !!form.primaryKeyword,
            form.primaryKeyword ? form.title.toLowerCase().includes(form.primaryKeyword.toLowerCase()) : false,
            form.primaryKeyword ? form.content.toLowerCase().includes(form.primaryKeyword.toLowerCase()) : false,
            (form.seo.metaTitle || form.title).length >= 30,
            (form.seo.metaDescription || form.excerpt).length >= 120,
            wordCount >= 500,
            !!form.featuredImage,
            headings.some(h => h.level === 2),
        ]
        return Math.round((checks.filter(Boolean).length / checks.length) * 100)
    }, [form, wordCount, headings])

    useEffect(() => { fetchPost() }, [resolvedParams.id])

    const fetchPost = async () => {
        try {
            const res = await fetch('/api/admin/blog')
            const data = await res.json()
            if (Array.isArray(data)) {
                const post = data.find((p: BlogData) => p.id === resolvedParams.id)
                if (post) {
                    setForm({
                        ...post,
                        seo: post.seo || { metaTitle: '', metaDescription: '', canonicalUrl: '', schemaType: 'Article', noIndex: false, noFollow: false },
                    })
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
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'blog')
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (data.url) setForm({ ...form, featuredImage: data.url })
        } catch (error) {
            console.error('Upload error:', error)
        }
    }

    const handleSave = useCallback(async (newStatus?: BlogData['status']) => {
        setSaving(true)
        const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
        try {
            const payload = {
                ...form, tags, status: newStatus || form.status, wordCount, readTime,
                seo: { ...form.seo, metaTitle: form.seo.metaTitle || form.title, metaDescription: form.seo.metaDescription || form.excerpt },
            }
            const res = await fetch('/api/admin/blog', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            if (res.ok) {
                setLastSaved(new Date())
                if (newStatus) setForm({ ...form, status: newStatus })
            }
        } catch (error) {
            console.error('Error saving:', error)
        } finally {
            setSaving(false)
        }
    }, [form, tagsInput, wordCount, readTime])

    const handlePublish = async () => {
        if (seoScore < 50 && !confirm('SEO score is below 50%. Publish anyway?')) return
        await handleSave('published')
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
        <div className="absolute inset-0 flex flex-col bg-gray-100/50">
            {/* Top Bar */}
            <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-30">
                <div className="flex items-center gap-3">
                    <Link href="/admin/blog" className="p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{form.title || 'Untitled'}</span>
                        <span className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${statusConfig.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                            {statusConfig.label}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Panel Toggles */}
                    <div className="hidden lg:flex items-center gap-1 mr-2">
                        <button
                            onClick={() => setShowLeftPanel(!showLeftPanel)}
                            className={`p-2 rounded-lg transition-colors ${showLeftPanel ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Toggle Structure Panel"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setShowRightPanel(!showRightPanel)}
                            className={`p-2 rounded-lg transition-colors ${showRightPanel ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Toggle Settings Panel"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>

                    {lastSaved && <span className="text-xs text-gray-400 hidden sm:inline mr-2">{lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    <button onClick={() => handleSave()} disabled={saving} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={form.status === 'published' ? () => handleSave('draft') : handlePublish} className={`px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-all shadow-sm ${form.status === 'published' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {form.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                </div>
            </header>

            {/* Main Editor Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Document Structure */}
                {showLeftPanel && (
                    <aside className="w-64 bg-white border-r border-gray-200 flex-col shrink-0 hidden xl:flex overflow-y-auto">
                        <div className="p-5">
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <p className="text-2xl font-bold text-gray-900">{wordCount}</p>
                                    <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Words</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <p className="text-2xl font-bold text-gray-900">{readTime}</p>
                                    <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Read</p>
                                </div>
                            </div>

                            {/* SEO Score */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500">SEO Score</span>
                                    <span className={`text-sm font-bold ${seoScore >= 80 ? 'text-emerald-600' : seoScore >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{seoScore}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-500 ${seoScore >= 80 ? 'bg-emerald-500' : seoScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${seoScore}%` }} />
                                </div>
                            </div>

                            {/* Outline */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-3">Document Outline</p>
                                <div className="space-y-0.5">
                                    {headings.length === 0 ? (
                                        <div className="py-8 text-center">
                                            <svg className="w-8 h-8 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h8m-8 6h16" />
                                            </svg>
                                            <p className="text-xs text-gray-400">Add headings to see outline</p>
                                        </div>
                                    ) : (
                                        headings.map((h, i) => (
                                            <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-sm ${h.level === 1 ? 'font-semibold text-gray-900' : h.level === 2 ? 'pl-4 text-gray-700' : 'pl-6 text-gray-500'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${h.level === 1 ? 'bg-blue-500' : h.level === 2 ? 'bg-gray-400' : 'bg-gray-300'}`} />
                                                <span className="truncate">{h.text}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Center - Writing Canvas */}
                <main className="flex-1 overflow-y-auto">
                    <div className="min-h-full py-12 px-4 lg:px-8">
                        <article className="max-w-3xl mx-auto">
                            {/* Title */}
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full text-4xl lg:text-5xl font-bold text-gray-900 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent mb-4 leading-tight tracking-tight"
                                placeholder="Untitled Post"
                            />

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-sm mb-8 pb-6 border-b border-gray-200">
                                <span className="text-gray-400 font-mono text-xs">/blog/</span>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                                    className="bg-transparent border-none text-gray-500 font-mono text-xs focus:outline-none p-0 flex-1 max-w-[150px]"
                                    placeholder="url-slug"
                                />
                                <span className="text-gray-200">•</span>
                                <span className="text-gray-400 text-xs">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>

                            {/* Excerpt */}
                            <textarea
                                value={form.excerpt}
                                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                rows={2}
                                className="w-full text-xl text-gray-500 bg-transparent border-none focus:outline-none resize-none placeholder-gray-300 mb-8 leading-relaxed"
                                placeholder="Write a compelling excerpt that summarizes your post..."
                                onInput={(e) => {
                                    e.currentTarget.style.height = 'auto'
                                    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
                                }}
                            />

                            {/* Editor */}
                            <NovelEditor
                                content={form.content}
                                onChange={(content: string) => setForm({ ...form, content })}
                            />
                        </article>
                    </div>
                </main>

                {/* Right Panel - Settings */}
                {showRightPanel && (
                    <aside className="w-80 bg-white border-l border-gray-200 flex-col shrink-0 hidden lg:flex">
                        {/* Tabs */}
                        <div className="p-3 border-b border-gray-100">
                            <div className="flex p-1 bg-gray-100 rounded-lg">
                                {(['details', 'seo', 'settings'] as const).map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{tab}</button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-5">
                            {activeTab === 'details' && (
                                <>
                                    <div className="p-4 rounded-xl bg-gray-50 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-semibold text-gray-500">Status</label>
                                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BlogData['status'] })} className="text-xs font-medium bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none">
                                                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-semibold text-gray-500">Featured</label>
                                            <button onClick={() => setForm({ ...form, featured: !form.featured })} className={`relative w-10 h-6 rounded-full transition-colors ${form.featured ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? 'translate-x-4' : ''}`} />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-2">Category</label>
                                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-400">
                                            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-2">Tags</label>
                                        <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-400" placeholder="design, tutorial, next.js" />
                                    </div>
                                </>
                            )}

                            {activeTab === 'seo' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-2">Primary Keyword</label>
                                        <input type="text" value={form.primaryKeyword} onChange={(e) => setForm({ ...form, primaryKeyword: e.target.value })} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-400" placeholder="e.g., AI development" />
                                    </div>

                                    {/* Google Preview */}
                                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                                        <p className="text-xs font-semibold text-gray-400 mb-3">Search Preview</p>
                                        <p className="text-[#1a0dab] text-base font-medium line-clamp-1">{form.seo.metaTitle || form.title || 'Page Title'}</p>
                                        <p className="text-[#006621] text-xs mt-1">makeuslive.com › blog › {form.slug || 'post'}</p>
                                        <p className="text-[#545454] text-xs mt-1 line-clamp-2">{form.seo.metaDescription || form.excerpt || 'Add a meta description...'}</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-xs font-semibold text-gray-500">Meta Title</label>
                                            <span className={`text-[10px] font-semibold ${(form.seo.metaTitle || form.title).length > 60 ? 'text-red-500' : 'text-gray-400'}`}>{(form.seo.metaTitle || form.title).length}/60</span>
                                        </div>
                                        <input type="text" value={form.seo.metaTitle} onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaTitle: e.target.value } })} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" placeholder={form.title} />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-xs font-semibold text-gray-500">Meta Description</label>
                                            <span className={`text-[10px] font-semibold ${(form.seo.metaDescription || form.excerpt).length > 160 ? 'text-red-500' : 'text-gray-400'}`}>{(form.seo.metaDescription || form.excerpt).length}/160</span>
                                        </div>
                                        <textarea value={form.seo.metaDescription} onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })} rows={3} className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none resize-none" placeholder={form.excerpt} />
                                    </div>
                                </>
                            )}

                            {activeTab === 'settings' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-2">Featured Image</label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors aspect-video flex items-center justify-center relative group">
                                            {form.featuredImage ? (
                                                <>
                                                    <img src={form.featuredImage} alt="Featured" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <label className="cursor-pointer px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium rounded-lg">Replace<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
                                                        <button onClick={() => setForm({ ...form, featuredImage: '' })} className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium rounded-lg">Remove</button>
                                                    </div>
                                                </>
                                            ) : (
                                                <label className="cursor-pointer text-center p-4 w-full h-full flex flex-col items-center justify-center">
                                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500">Upload Cover</span>
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <button onClick={() => handleSave('archived')} className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Move to Trash
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    )
}

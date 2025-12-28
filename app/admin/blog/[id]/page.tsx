'use client'

import { useState, useEffect, use, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MarkdownEditor from '@/components/admin/editor-loader'

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
    { value: 'idea', label: 'Idea', color: 'bg-gray-100 text-gray-600' },
    { value: 'draft', label: 'Draft', color: 'bg-yellow-50 text-yellow-700' },
    { value: 'review', label: 'Review', color: 'bg-blue-50 text-blue-700' },
    { value: 'seo_review', label: 'SEO Review', color: 'bg-purple-50 text-purple-700' },
    { value: 'scheduled', label: 'Scheduled', color: 'bg-cyan-50 text-cyan-700' },
    { value: 'published', label: 'Published', color: 'bg-green-50 text-green-700' },
    { value: 'archived', label: 'Archived', color: 'bg-orange-50 text-orange-700' },
]

// Extract headings from markdown content
function extractHeadings(content: string) {
    const headings: { level: number; text: string; id: string }[] = []
    const lines = content.split('\n')
    lines.forEach((line, index) => {
        const match = line.match(/^(#{1,4})\s+(.+)$/)
        if (match) {
            headings.push({
                level: match[1].length,
                text: match[2],
                id: `heading-${index}`,
            })
        }
    })
    return headings
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
    const wordCount = useMemo(() => {
        if (!form.content) return 0
        return form.content.split(/\s+/).filter(Boolean).length
    }, [form.content])
    const readTime = useMemo(() => `${Math.max(1, Math.ceil(wordCount / 200))} min`, [wordCount])

    // SEO Checklist
    const seoChecklist = useMemo(() => {
        const title = form.seo.metaTitle || form.title
        const desc = form.seo.metaDescription || form.excerpt
        return {
            hasKeyword: !!form.primaryKeyword,
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
        <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-white -m-6">
            {/* Top Bar */}
            <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 w-64 lg:w-96"
                        placeholder="Untitled Post"
                    />
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                        {statusConfig.label}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {lastSaved && (
                        <span className="text-xs text-gray-400">
                            Saved {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    {form.status === 'published' ? (
                        <a
                            href={`/blog/${form.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            View →
                        </a>
                    ) : (
                        <button
                            onClick={handlePublish}
                            className="px-4 py-1.5 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Publish
                        </button>
                    )}
                </div>
            </div>

            {/* Three-Pane Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Structure */}
                <div className="w-56 border-r border-gray-200 bg-gray-50/50 overflow-y-auto shrink-0 hidden lg:block">
                    <div className="p-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Structure</h3>

                        {/* Outline */}
                        <div className="space-y-1">
                            {headings.length === 0 ? (
                                <p className="text-xs text-gray-400 italic">No headings yet</p>
                            ) : (
                                headings.map((h, i) => (
                                    <button
                                        key={i}
                                        className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors ${h.level === 1 ? 'text-gray-900 font-medium' :
                                                h.level === 2 ? 'text-gray-700 pl-4' :
                                                    h.level === 3 ? 'text-gray-500 pl-6 text-xs' :
                                                        'text-gray-400 pl-8 text-xs'
                                            }`}
                                    >
                                        {h.text}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stats</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Words</span>
                                    <span className="text-gray-900 font-medium">{wordCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Read time</span>
                                    <span className="text-gray-900 font-medium">{readTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Headings</span>
                                    <span className="text-gray-900 font-medium">{headings.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">SEO Score</h3>
                            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`absolute left-0 top-0 h-full rounded-full transition-all ${seoScore >= 80 ? 'bg-green-500' :
                                            seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${seoScore}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{seoScore}% complete</p>
                        </div>
                    </div>
                </div>

                {/* Center Panel - Editor */}
                <div className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-3xl mx-auto px-8 py-8">
                        {/* Slug */}
                        <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                            <span>/blog/</span>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                className="bg-transparent border-none text-gray-600 focus:outline-none focus:ring-0 p-0"
                                placeholder="post-slug"
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="mb-6">
                            <textarea
                                value={form.excerpt}
                                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                rows={2}
                                className="w-full text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-lg"
                                placeholder="Write a brief excerpt..."
                            />
                        </div>

                        {/* Content Editor */}
                        <div className="prose prose-gray max-w-none">
                            <MarkdownEditor
                                markdown={form.content}
                                onChange={(content) => setForm({ ...form, content })}
                                placeholder="Start writing... Use / for blocks"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel - Context */}
                <div className="w-80 border-l border-gray-200 bg-gray-50/50 overflow-y-auto shrink-0 hidden xl:block">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 bg-white sticky top-0">
                        {(['keywords', 'seo', 'workflow', 'settings'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setRightPanel(tab)}
                                className={`flex-1 px-2 py-3 text-xs font-medium capitalize transition-colors ${rightPanel === tab
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-4">
                        {/* Keywords Tab */}
                        {rightPanel === 'keywords' && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Primary Keyword *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.primaryKeyword}
                                        onChange={(e) => setForm({ ...form, primaryKeyword: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., AI development"
                                    />
                                    {!form.primaryKeyword && (
                                        <p className="text-xs text-red-500 mt-1">Required for publishing</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Secondary Keywords
                                    </label>
                                    <input
                                        type="text"
                                        value={secondaryKeywordsInput}
                                        onChange={(e) => setSecondaryKeywordsInput(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="comma, separated"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        value={tagsInput}
                                        onChange={(e) => setTagsInput(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="AI, Design, Next.js"
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Keyword Usage</h4>
                                    {form.primaryKeyword ? (
                                        <ul className="space-y-2 text-sm">
                                            <li className={form.title.toLowerCase().includes(form.primaryKeyword.toLowerCase()) ? 'text-green-600' : 'text-gray-400'}>
                                                {form.title.toLowerCase().includes(form.primaryKeyword.toLowerCase()) ? '✓' : '○'} In title
                                            </li>
                                            <li className={form.excerpt.toLowerCase().includes(form.primaryKeyword.toLowerCase()) ? 'text-green-600' : 'text-gray-400'}>
                                                {form.excerpt.toLowerCase().includes(form.primaryKeyword.toLowerCase()) ? '✓' : '○'} In excerpt
                                            </li>
                                            <li className={headings.some(h => h.level === 2 && h.text.toLowerCase().includes(form.primaryKeyword.toLowerCase())) ? 'text-green-600' : 'text-gray-400'}>
                                                {headings.some(h => h.level === 2 && h.text.toLowerCase().includes(form.primaryKeyword.toLowerCase())) ? '✓' : '○'} In H2
                                            </li>
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">Set a keyword to see usage</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SEO Tab */}
                        {rightPanel === 'seo' && (
                            <div className="space-y-5">
                                {/* Preview */}
                                <div className="bg-white rounded-lg border border-gray-200 p-3">
                                    <p className="text-blue-600 text-sm font-medium line-clamp-1">
                                        {form.seo.metaTitle || form.title || 'Post Title'}
                                    </p>
                                    <p className="text-green-700 text-xs">makeuslive.com/blog/{form.slug}</p>
                                    <p className="text-gray-500 text-xs line-clamp-2 mt-0.5">
                                        {form.seo.metaDescription || form.excerpt || 'Description...'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Meta Title ({(form.seo.metaTitle || form.title).length}/60)
                                    </label>
                                    <input
                                        type="text"
                                        value={form.seo.metaTitle}
                                        onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaTitle: e.target.value } })}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={form.title}
                                        maxLength={60}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Meta Description ({(form.seo.metaDescription || form.excerpt).length}/160)
                                    </label>
                                    <textarea
                                        value={form.seo.metaDescription}
                                        onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder={form.excerpt}
                                        maxLength={160}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Schema Type
                                    </label>
                                    <select
                                        value={form.seo.schemaType}
                                        onChange={(e) => setForm({ ...form, seo: { ...form.seo, schemaType: e.target.value as SEOConfig['schemaType'] } })}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Article">Article</option>
                                        <option value="HowTo">How-To</option>
                                        <option value="FAQ">FAQ</option>
                                        <option value="NewsArticle">News</option>
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Checklist</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className={seoChecklist.hasKeyword ? 'text-green-600' : 'text-gray-400'}>
                                            {seoChecklist.hasKeyword ? '✓' : '○'} Primary keyword set
                                        </li>
                                        <li className={seoChecklist.hasTitle ? 'text-green-600' : 'text-gray-400'}>
                                            {seoChecklist.hasTitle ? '✓' : '○'} Title 30+ chars
                                        </li>
                                        <li className={seoChecklist.hasDescription ? 'text-green-600' : 'text-gray-400'}>
                                            {seoChecklist.hasDescription ? '✓' : '○'} Description 120+ chars
                                        </li>
                                        <li className={seoChecklist.hasH2 ? 'text-green-600' : 'text-gray-400'}>
                                            {seoChecklist.hasH2 ? '✓' : '○'} Has H2 headings
                                        </li>
                                        <li className={seoChecklist.hasContent ? 'text-green-600' : 'text-gray-400'}>
                                            {seoChecklist.hasContent ? '✓' : '○'} 500+ words
                                        </li>
                                        <li className={seoChecklist.hasImage ? 'text-green-600' : 'text-gray-400'}>
                                            {seoChecklist.hasImage ? '✓' : '○'} Featured image
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Workflow Tab */}
                        {rightPanel === 'workflow' && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value as BlogData['status'] })}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {STATUSES.map((s) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.featured}
                                            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">★ Featured Post</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={form.priority}
                                        onChange={(e) => setForm({ ...form, priority: e.target.value as BlogData['priority'] })}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={handlePublish}
                                        disabled={saving}
                                        className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        Publish Now
                                    </button>
                                    <button
                                        onClick={() => handleSave('draft')}
                                        disabled={saving}
                                        className="w-full py-2 mt-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Save as Draft
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {rightPanel === 'settings' && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Featured Image
                                    </label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg overflow-hidden bg-white">
                                        {form.featuredImage ? (
                                            <div className="relative">
                                                <img src={form.featuredImage} alt="Featured" className="w-full h-32 object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setForm({ ...form, featuredImage: '' })}
                                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 p-1 rounded-full shadow"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer block py-8 text-center">
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-gray-400 text-sm">
                                                    {uploading ? 'Uploading...' : 'Upload image'}
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Analytics</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                                            <p className="text-2xl font-bold text-gray-900">{form.views || 0}</p>
                                            <p className="text-xs text-gray-500">Views</p>
                                        </div>
                                        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                                            <p className="text-2xl font-bold text-gray-900">{readTime}</p>
                                            <p className="text-xs text-gray-500">Read Time</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleSave('archived')}
                                        className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
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

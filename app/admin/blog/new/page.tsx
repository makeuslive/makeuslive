'use client'

import { useState, useMemo } from 'react'
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

interface SEOConfig {
    metaTitle: string
    metaDescription: string
    canonicalUrl: string
    schemaType: 'Article' | 'HowTo' | 'FAQ' | 'NewsArticle'
    noIndex: boolean
    noFollow: boolean
}

const CATEGORIES = [
    'General', 'AI & Technology', 'Design', 'Development',
    'UX Research', 'Animation', 'Business', 'Tutorial', 'Case Study',
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

export default function NewBlogPostPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [rightPanel, setRightPanel] = useState<'keywords' | 'seo' | 'settings'>('keywords')

    const [form, setForm] = useState({
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
            hasImage: !!form.image,
            hasH2: headings.some(h => h.level === 2),
        }
    }, [form, wordCount, headings])

    const seoScore = useMemo(() => {
        const checks = Object.values(seoChecklist)
        return Math.round((checks.filter(Boolean).length / checks.length) * 100)
    }, [seoChecklist])

    // Auto-generate slug
    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    const handleTitleChange = (title: string) => {
        setForm({
            ...form,
            title,
            slug: form.slug || generateSlug(title),
        })
    }

    const handleSubmit = async (publishNow = false) => {
        setLoading(true)
        try {
            const payload = {
                ...form,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                secondaryKeywords: form.secondaryKeywords.split(',').map(k => k.trim()).filter(Boolean),
                status: publishNow ? 'published' : form.status,
                featuredImage: form.image,
                seo: {
                    ...form.seo,
                    metaTitle: form.seo.metaTitle || form.title,
                    metaDescription: form.seo.metaDescription || form.excerpt,
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
            console.error('Error:', error)
            alert('Failed to create post')
        } finally {
            setLoading(false)
        }
    }

    const handlePublish = () => {
        if (seoScore < 50) {
            if (!confirm('SEO score is below 50%. Publish anyway?')) return
        }
        if (!form.primaryKeyword) {
            if (!confirm('No primary keyword set. Publish anyway?')) return
        }
        handleSubmit(true)
    }

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

                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        New Draft
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        Publish
                    </button>
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
                            onChange={(e) => handleTitleChange(e.target.value)}
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
                        {(['keywords', 'seo', 'settings'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setRightPanel(tab)}
                                className={`flex-1 px-3 py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors ${rightPanel === tab
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
                                            Recommended for SEO
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Secondary Keywords</label>
                                    <input
                                        type="text"
                                        value={form.secondaryKeywords}
                                        onChange={(e) => setForm({ ...form, secondaryKeywords: e.target.value })}
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
                                        value={form.tags}
                                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="AI, Design, Next.js"
                                    />
                                </div>

                                {/* Keyword Optimization */}
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
                                            {form.seo.metaDescription || form.excerpt || 'Add a description...'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Meta Title
                                        <span className="font-normal normal-case text-gray-400">
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
                                        <span className="font-normal normal-case text-gray-400">
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
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Checklist</h4>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Primary keyword', check: seoChecklist.hasKeyword },
                                            { label: 'Title 30+ chars', check: seoChecklist.hasTitle },
                                            { label: 'Description 120+ chars', check: seoChecklist.hasDescription },
                                            { label: 'Has H2 headings', check: seoChecklist.hasH2 },
                                            { label: '500+ words', check: seoChecklist.hasContent },
                                            { label: 'Featured image', check: seoChecklist.hasImage },
                                        ].map((item, i) => (
                                            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${item.check ? 'bg-green-50' : 'bg-gray-50'}`}>
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

                        {/* Settings Tab */}
                        {rightPanel === 'settings' && (
                            <div className="space-y-6">
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

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Featured Image</label>
                                    <input
                                        type="url"
                                        value={form.image}
                                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://..."
                                    />
                                    {form.image && (
                                        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                                            <img src={form.image} alt="Preview" className="w-full h-32 object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

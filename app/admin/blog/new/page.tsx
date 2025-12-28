'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import the Novel editor
const NovelEditor = dynamic(() => import('@/components/admin/novel-editor'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full bg-gray-50/50 rounded-xl">
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
    const [rightPanel, setRightPanel] = useState<'details' | 'seo' | 'settings'>('details')

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

    const [tagsInput, setTagsInput] = useState('')

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'blog')
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (data.url) setForm({ ...form, image: data.url })
        } catch (error) {
            console.error('Upload error:', error)
            alert('Failed to upload image')
        }
    }

    const handleSubmit = async (publishNow = false) => {
        setLoading(true)
        try {
            const payload = {
                ...form,
                tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
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
        <div className="absolute inset-0 flex flex-col bg-white">
            {/* Top Navigation Bar */}
            <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 bg-white shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blog"
                        className="p-2 -ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Back to Blog"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>

                    <div className="h-4 w-px bg-gray-200" />

                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-green-50 text-green-700">
                        New Post
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={loading}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={loading}
                        className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        Publish
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT PANEL: Structure & Stats */}
                <div className="w-[260px] border-r border-gray-200 bg-gray-50/50 flex flex-col shrink-0 hidden xl:flex">
                    <div className="p-4 overflow-y-auto">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Words</p>
                                <p className="text-lg font-semibold text-gray-900 mt-0.5">{wordCount}</p>
                            </div>
                            <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time</p>
                                <p className="text-lg font-semibold text-gray-900 mt-0.5">{readTime}</p>
                            </div>
                        </div>

                        {/* SEO Preview Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SEO Score</span>
                                <span className={`text-xs font-bold ${seoScore >= 80 ? 'text-green-600' :
                                    seoScore >= 50 ? 'text-yellow-600' : 'text-red-500'
                                    }`}>{seoScore}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${seoScore >= 80 ? 'bg-green-500' :
                                        seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${seoScore}%` }}
                                />
                            </div>
                        </div>

                        {/* Interactive Outline */}
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Table of Contents</p>
                            <div className="space-y-px">
                                {headings.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center py-8 opacity-60">
                                        Headings will appear here
                                    </p>
                                ) : (
                                    headings.map((h, i) => (
                                        <div
                                            key={i}
                                            className={`group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${h.level === 1 ? 'text-gray-900 font-medium' :
                                                h.level === 2 ? 'pl-4 text-gray-600' :
                                                    'pl-6 text-gray-500'
                                                }`}
                                        >
                                            <div className={`w-1 h-1 rounded-full shrink-0 ${h.level === 1 ? 'bg-blue-400' : 'bg-gray-300 group-hover:bg-gray-400'
                                                }`} />
                                            <span className="text-xs truncate">{h.text}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER PANEL: Writing Canvas */}
                <div className="flex-1 overflow-y-auto bg-gray-50 flex justify-center scroll-smooth">
                    <div className="w-full max-w-[850px] bg-white min-h-screen shadow-sm my-6 mx-4 lg:mx-8 px-8 lg:px-12 py-12 rounded-xl">
                        {/* Title Input */}
                        <div className="mb-6">
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full text-4xl lg:text-5xl font-bold text-gray-900 placeholder-gray-200 border-none focus:outline-none focus:ring-0 p-0 bg-transparent leading-tight tracking-tight"
                                placeholder="Post Title"
                            />
                        </div>

                        {/* Meta Ribbon */}
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100 font-mono">
                            <div className="flex items-center gap-1">
                                <span className="opacity-50">/blog/</span>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                                    className="bg-transparent border-none text-gray-600 focus:outline-none focus:ring-0 p-0 min-w-[20px] w-auto max-w-[200px]"
                                    placeholder="slug"
                                />
                            </div>
                            <span className="text-gray-200">|</span>
                            <span className="opacity-70">{new Date().toLocaleDateString()}</span>
                        </div>

                        {/* Excerpt */}
                        <div className="mb-8 relative group">
                            <textarea
                                value={form.excerpt}
                                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                rows={1}
                                className="w-full text-xl text-gray-500 italic bg-transparent border-none focus:outline-none focus:ring-0 resize-none placeholder-gray-200 overflow-hidden"
                                placeholder="Add a short excerpt or summary..."
                                style={{ height: 'auto', minHeight: '40px' }}
                                onInput={(e) => {
                                    e.currentTarget.style.height = 'auto'
                                    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
                                }}
                            />
                            <div className="absolute left-0 -bottom-2 w-8 h-0.5 bg-gray-100 group-hover:bg-blue-100 transition-colors" />
                        </div>

                        {/* Novel Editor */}
                        <div className="prose prose-lg prose-gray max-w-none">
                            <NovelEditor
                                content={form.content}
                                onChange={(content: string) => setForm({ ...form, content })}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: Context & Settings */}
                <div className="w-[320px] border-l border-gray-200 bg-white flex flex-col shrink-0">
                    {/* Segmented Control Tabs */}
                    <div className="p-3 border-b border-gray-100">
                        <div className="flex p-1 bg-gray-100 rounded-lg">
                            {(['details', 'seo', 'settings'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setRightPanel(tab)}
                                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${rightPanel === tab
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* DETAILS TAB */}
                        {rightPanel === 'details' && (
                            <>
                                {/* Publish Card */}
                                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                                        <div className="text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded border border-gray-200">
                                            New Draft
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Featured</label>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.featured}
                                                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                                        <select
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tags</label>
                                        <div className="bg-white border border-gray-200 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                                            <input
                                                type="text"
                                                value={tagsInput}
                                                onChange={(e) => setTagsInput(e.target.value)}
                                                className="w-full text-sm outline-none px-1.5 pb-1"
                                                placeholder="Add tags..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* SEO TAB */}
                        {rightPanel === 'seo' && (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primary Keyword</label>
                                        <input
                                            type="text"
                                            value={form.primaryKeyword}
                                            onChange={(e) => setForm({ ...form, primaryKeyword: e.target.value })}
                                            className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                                            placeholder="Focus keyword"
                                        />
                                    </div>

                                    {/* Google Preview */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-default">
                                        <p className="text-[#1a0dab] text-sm font-medium hover:underline truncate">
                                            {form.seo.metaTitle || form.title || 'Page Title'}
                                        </p>
                                        <p className="text-[#006621] text-xs mt-0.5 truncate">
                                            makeuslive.com › blog › {form.slug || 'post'}
                                        </p>
                                        <p className="text-[#545454] text-xs mt-1 line-clamp-2 leading-relaxed">
                                            {form.seo.metaDescription || form.excerpt || 'Meta description will appear here...'}
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Meta Title</label>
                                                <span className={`text-[10px] font-bold ${(form.seo.metaTitle || form.title).length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {(form.seo.metaTitle || form.title).length}/60
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                value={form.seo.metaTitle}
                                                onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaTitle: e.target.value } })}
                                                className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
                                                placeholder={form.title}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Meta Description</label>
                                                <span className={`text-[10px] font-bold ${(form.seo.metaDescription || form.excerpt).length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {(form.seo.metaDescription || form.excerpt).length}/160
                                                </span>
                                            </div>
                                            <textarea
                                                value={form.seo.metaDescription}
                                                onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })}
                                                rows={3}
                                                className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 resize-none"
                                                placeholder={form.excerpt}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* SETTINGS TAB */}
                        {rightPanel === 'settings' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Featured Image</label>
                                    <div className="group relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors aspect-video flex items-center justify-center">
                                        {form.image ? (
                                            <>
                                                <img src={form.image} alt="Featured" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <label className="cursor-pointer px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
                                                        Replace
                                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                    </label>
                                                    <button
                                                        onClick={() => setForm({ ...form, image: '' })}
                                                        className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium rounded-lg"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <label className="cursor-pointer text-center p-4 w-full h-full flex flex-col items-center justify-center">
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </span>
                                                <span className="text-xs font-medium text-gray-500">Upload Cover</span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

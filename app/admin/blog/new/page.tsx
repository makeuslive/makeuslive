'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MarkdownEditor from '@/components/admin/editor-loader'

export default function NewBlogPostPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        category: '',
        tags: '',
        status: 'draft' as 'draft' | 'published',
    })

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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
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
                <Link
                    href="/admin/blog"
                    className="group inline-flex items-center text-sm font-mono text-white/40 hover:text-white transition-colors"
                >
                    <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
                    BACK TO POSTS
                </Link>
                <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${formData.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm font-mono text-white/60 uppercase">{formData.status}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content Area (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Title & Slug inputs (Clean, Notion-style) */}
                        <div className="space-y-4">
                            <input
                                id="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full bg-transparent border-0 text-5xl md:text-6xl font-serif text-white placeholder-white/40 focus:ring-0 p-0 leading-tight"
                                placeholder="Post Title"
                            />

                            <div className="flex items-center gap-2 text-white/60 font-mono text-sm">
                                <span>/blog/</span>
                                <input
                                    id="slug"
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="bg-transparent border-0 text-white/80 focus:text-white focus:ring-0 p-0 w-full font-medium"
                                    placeholder="post-slug"
                                />
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label htmlFor="excerpt" className="block font-mono text-xs font-medium text-white/60 uppercase tracking-widest mb-3">
                                Excerpt
                            </label>
                            <textarea
                                id="excerpt"
                                required
                                rows={3}
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold/50 resize-none transition-colors"
                                placeholder="Write a brief summary..."
                            />
                        </div>

                        {/* Editor */}
                        <div className="space-y-3">
                            <label className="block font-mono text-xs font-medium text-white/60 uppercase tracking-widest">
                                Content
                            </label>
                            <MarkdownEditor
                                markdown={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                placeholder="Start writing your story..."
                            />
                        </div>
                    </div>

                    {/* Sidebar (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Actions */}
                        <div className="p-6 border border-white/20 bg-[#0a0a0a] rounded-xl space-y-4">
                            <h3 className="font-serif text-xl italic text-white">Publishing</h3>

                            <div className="space-y-3 pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.status === 'draft' ? 'border-gold bg-gold/10' : 'border-white/20 group-hover:border-white/40'}`}>
                                        {formData.status === 'draft' && <div className="w-2 h-2 rounded-full bg-gold" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="draft"
                                        checked={formData.status === 'draft'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' })}
                                        className="hidden"
                                    />
                                    <span className="text-white/80">Save as Draft</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.status === 'published' ? 'border-gold bg-gold/10' : 'border-white/20 group-hover:border-white/40'}`}>
                                        {formData.status === 'published' && <div className="w-2 h-2 rounded-full bg-gold" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="published"
                                        checked={formData.status === 'published'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' })}
                                        className="hidden"
                                    />
                                    <span className="text-white/80">Publish Now</span>
                                </label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 disabled:opacity-50 transition-all font-mono text-sm uppercase tracking-wider"
                                >
                                    {loading ? 'Wait...' : formData.status === 'published' ? 'Publish' : 'Save Draft'}
                                </button>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="p-6 border border-white/20 bg-[#0a0a0a] rounded-xl space-y-6">
                            <h3 className="font-serif text-xl italic text-white">Metadata</h3>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block font-mono text-xs font-medium text-white/60 uppercase tracking-widest mb-2">
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-gold/50 transition-colors"
                                    >
                                        <option value="">Select Category...</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Design">Design</option>
                                        <option value="AI">AI</option>
                                        <option value="Business">Business</option>
                                        <option value="Tutorial">Tutorial</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                        ↓
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label htmlFor="tags" className="block font-mono text-xs font-medium text-white/60 uppercase tracking-widest mb-2">
                                    Tags
                                </label>
                                <input
                                    id="tags"
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold/50 transition-colors"
                                    placeholder="design, ai, nextjs..."
                                />
                                <p className="mt-2 text-xs text-white/50">Separate with commas</p>
                            </div>

                            {/* Featured Image */}
                            <div>
                                <label htmlFor="image" className="block font-mono text-xs font-medium text-white/60 uppercase tracking-widest mb-2">
                                    Featured Image URL
                                </label>
                                <input
                                    id="image"
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-gold/50 transition-colors mb-3"
                                    placeholder="https://"
                                />
                                {formData.image && (
                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-white/5">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-70" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

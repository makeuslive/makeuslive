'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const TEMPLATES = {
    'privacy-policy': {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        metaTitle: 'Privacy Policy - Data Protection & Your Rights | Make Us Live',
        metaDescription: 'Read Make Us Live privacy policy. Learn how we collect, use, store, and protect your personal data. Compliant with DPDP Act 2023 and GDPR.',
        content: `<h2>1. Introduction</h2>
<p>Welcome to Make Us Live. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>

<h2>2. Data We Collect</h2>
<p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
<ul>
<li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
<li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
<li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
<li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
</ul>

<h2>3. How We Use Your Data</h2>
<p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
<ul>
<li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
<li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
<li>Where we need to comply with a legal or regulatory obligation.</li>
</ul>

<h2>4. Contact Us</h2>
<p>If you have any questions about this privacy policy, please contact us at: <a href="mailto:hello@makeuslive.com">hello@makeuslive.com</a></p>`,
    },
    'terms-of-service': {
        slug: 'terms-of-service',
        title: 'Terms of Service',
        metaTitle: 'Terms of Service - Legal Agreement | Make Us Live',
        metaDescription: 'Read Make Us Live terms of service. Understand the legal terms and conditions for using our website and services.',
        content: `<h2>1. Agreement to Terms</h2>
<p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Make Us Live ("we," "us" or "our"), concerning your access to and use of the makeuslive.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").</p>

<h2>2. Intellectual Property Rights</h2>
<p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.</p>

<h2>3. User Representations</h2>
<p>By using the Site, you represent and warrant that:</p>
<ul>
<li>All registration information you submit will be true, accurate, current, and complete.</li>
<li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
<li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
</ul>

<h2>4. Contact Us</h2>
<p>If you have any questions about these Terms of Service, please contact us at: <a href="mailto:hello@makeuslive.com">hello@makeuslive.com</a></p>`,
    },
}

function NewLegalPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const template = searchParams.get('template') as keyof typeof TEMPLATES | null

    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        content: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        metaTitle: '',
        metaDescription: '',
        status: 'draft' as 'draft' | 'published',
        changeLog: [] as { date: string; description: string }[],
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [newChangeLogEntry, setNewChangeLogEntry] = useState('')

    useEffect(() => {
        if (template && TEMPLATES[template]) {
            const t = TEMPLATES[template]
            setFormData(prev => ({
                ...prev,
                slug: t.slug,
                title: t.title,
                content: t.content,
                metaTitle: t.metaTitle,
                metaDescription: t.metaDescription,
                changeLog: [{ date: new Date().toISOString(), description: 'Initial policy created' }],
            }))
        }
    }, [template])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const res = await fetch('/api/legal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()
            if (data.success) {
                router.push('/admin/legal')
            } else {
                setError(data.error || 'Failed to create page')
            }
        } catch (err) {
            setError('Failed to create page')
        } finally {
            setSaving(false)
        }
    }

    const addChangeLogEntry = () => {
        if (!newChangeLogEntry.trim()) return
        setFormData(prev => ({
            ...prev,
            changeLog: [
                { date: new Date().toISOString(), description: newChangeLogEntry.trim() },
                ...prev.changeLog,
            ],
        }))
        setNewChangeLogEntry('')
    }

    const removeChangeLogEntry = (index: number) => {
        setFormData(prev => ({
            ...prev,
            changeLog: prev.changeLog.filter((_, i) => i !== index),
        }))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/admin/legal"
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900">Create Legal Page</h1>
                                    <p className="text-sm text-gray-500">Add a new privacy policy or terms of service</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black"
                                >
                                    <option value="draft">Save as Draft</option>
                                    <option value="published">Publish</option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={saving || !formData.slug || !formData.title || !formData.content}
                                    className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {saving ? 'Saving...' : 'Save Page'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="max-w-7xl mx-auto px-6 mt-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                            placeholder="Privacy Policy"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">/</span>
                                            <input
                                                type="text"
                                                value={formData.slug}
                                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                                placeholder="privacy-policy"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
                                <p className="text-sm text-gray-500 mb-4">Use HTML to format your content. Headings, lists, and links are supported.</p>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                    className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-black focus:border-black resize-y"
                                    placeholder="<h2>1. Introduction</h2>
<p>Your policy content here...</p>"
                                    required
                                />
                            </div>

                            {/* Change Log */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Log</h2>
                                <p className="text-sm text-gray-500 mb-4">Track changes to your legal documents</p>

                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={newChangeLogEntry}
                                        onChange={(e) => setNewChangeLogEntry(e.target.value)}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                        placeholder="Describe the change..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChangeLogEntry())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addChangeLogEntry}
                                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>

                                {formData.changeLog.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.changeLog.map((entry, index) => (
                                            <div key={index} className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900">{entry.description}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeChangeLogEntry(index)}
                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Dates */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dates</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                                        <input
                                            type="date"
                                            value={formData.effectiveDate}
                                            onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SEO */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                                        <input
                                            type="text"
                                            value={formData.metaTitle}
                                            onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                            placeholder="Page title for search engines"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                        <textarea
                                            value={formData.metaDescription}
                                            onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none"
                                            rows={3}
                                            placeholder="Brief description for search results"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="bg-gray-100 rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <p className="text-blue-600 text-sm mb-1 truncate">makeuslive.com/{formData.slug || 'page-url'}</p>
                                    <h3 className="text-lg text-blue-800 font-medium mb-1 line-clamp-1">
                                        {formData.metaTitle || formData.title || 'Page Title'}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {formData.metaDescription || 'Add a meta description to preview how this page will appear in search results.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default function NewLegalPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
        }>
            <NewLegalPageContent />
        </Suspense>
    )
}

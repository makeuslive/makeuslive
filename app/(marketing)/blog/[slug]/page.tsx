'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

// Type definitions for blog post
interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    tags: string[]
    featuredImage: string
    date: string
    readTime: string
    gradient?: string
}

// Helper to extract headings from markdown content
function extractHeadings(content: string) {
    const regex = /^(#{2,3})\s+(.*)$/gm
    const headings = []
    let match

    while ((match = regex.exec(content)) !== null) {
        headings.push({
            level: match[1].length,
            text: match[2],
            id: match[2].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
        })
    }

    return headings
}

export default function BlogPostPage() {
    const params = useParams()
    const { slug } = params
    const [activeId, setActiveId] = useState<string>('')
    const [post, setPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // Fetch blog post from REST API
    useEffect(() => {
        if (!slug) return

        const fetchPost = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/blog/${slug}`)
                const result = await response.json()

                if (result.success && result.data) {
                    setPost(result.data)
                    setError(false)
                } else {
                    setError(true)
                }
            } catch (err) {
                console.error('Error fetching post:', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [slug])

    // Intersection Observer for TOC highlight
    useEffect(() => {
        if (loading || !post) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-20% 0px -35% 0px' }
        )

        document.querySelectorAll('h2, h3').forEach((heading) => {
            observer.observe(heading)
        })

        return () => observer.disconnect()
    }, [post, loading])

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    <p className="text-white/50 text-sm">Loading article...</p>
                </div>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Article Not Found
                </h1>
                <p className="text-white/50 text-lg mb-8 max-w-md">
                    The article you are looking for might have been moved, deleted, or never existed.
                </p>
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Blog
                </Link>
            </div>
        )
    }

    const headings = extractHeadings(post.content || '')

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#0a0a0a]">
            {/* Article Progress Bar (could add later) */}

            {/* Header Section */}
            <header className="max-w-4xl mx-auto text-center mb-16 md:mb-24 fade-in">
                {/* Breadcrumb / Back */}
                <div className="flex items-center justify-center gap-2 text-sm text-white/40 mb-8">
                    <Link href="/blog" className="hover:text-gold transition-colors">Blog</Link>
                    <ChevronRight size={14} />
                    <span>{post.category}</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                            <Calendar size={14} />
                        </div>
                        {post.date}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                            <Clock size={14} />
                        </div>
                        {post.readTime} read
                    </div>
                </div>
            </header>

            {/* Featured Image - Wide */}
            {post.featuredImage && (post.featuredImage.startsWith('/') || post.featuredImage.startsWith('http')) && (
                <div className="max-w-[1400px] mx-auto mb-20 md:mb-28 relative rounded-3xl overflow-hidden aspect-video md:aspect-[21/9] border border-white/10 group">
                    <div className={cn(
                        'absolute inset-0 bg-gradient-to-br opacity-40 mix-blend-overlay z-10',
                        post.gradient
                    )} />
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[1.5s]"
                    />

                    {/* Overlay description */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent z-20">
                        <p className="text-white/60 text-sm text-center max-w-2xl mx-auto italic">
                            {post.excerpt}
                        </p>
                    </div>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">

                {/* Left Sidebar - Table of Contents */}
                <aside className="hidden lg:block md:col-span-3 relative">
                    <div className="sticky top-32 transition-all duration-300">
                        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-6 px-4 border-l-2 border-gold/50">
                            Contents
                        </h3>
                        <nav className="flex flex-col gap-1">
                            {headings.map((heading) => (
                                <a
                                    key={heading.id}
                                    href={`#${heading.id}`}
                                    className={cn(
                                        'text-sm py-2 px-4 border-l-2 transition-all duration-300 block',
                                        activeId === heading.id
                                            ? 'border-gold text-white font-medium translate-x-2'
                                            : 'border-transparent text-white/40 hover:text-white hover:border-white/20'
                                    )}
                                    style={{ paddingLeft: heading.level === 3 ? '2rem' : '1rem' }}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                        setActiveId(heading.id)
                                    }}
                                >
                                    {heading.text}
                                </a>
                            ))}
                        </nav>

                        {/* Share Widget */}
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <p className="text-white/30 text-xs font-medium mb-4 uppercase tracking-widest">Share</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                    className="text-white/40 hover:text-gold transition-colors"
                                    title="Share on Twitter"
                                >
                                    <Twitter size={18} />
                                </button>
                                <button
                                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                    className="text-white/40 hover:text-gold transition-colors"
                                    title="Share on LinkedIn"
                                >
                                    <Linkedin size={18} />
                                </button>
                                <button
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                                    className="text-white/40 hover:text-gold transition-colors"
                                    title="Share on Facebook"
                                >
                                    <Facebook size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href)
                                        alert('Link copied to clipboard!')
                                    }}
                                    className="text-white/40 hover:text-gold transition-colors"
                                    title="Copy link"
                                >
                                    <LinkIcon size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-12 lg:col-span-8 lg:col-start-4">
                    <article className="prose prose-invert max-w-none prose-lg 
            prose-headings:text-white prose-headings:font-bold prose-headings:font-display
            prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-8
            prose-a:text-gold prose-a:no-underline prose-a:border-b prose-a:border-gold/30 hover:prose-a:border-gold hover:prose-a:bg-gold/10 prose-a:transition-all
            prose-blockquote:border-l-gold prose-blockquote:bg-white/5 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic
            prose-strong:text-white prose-strong:font-semibold
            prose-li:text-white/70 prose-li:marker:text-gold
            prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl
            prose-code:text-gold prose-code:bg-white/5 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-[''] prose-code:after:content-['']
            prose-hr:border-white/10 prose-hr:my-16
            md:prose-h2:text-4xl md:prose-h3:text-2xl
            [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-8
            [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:scroll-mt-32
            [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:scroll-mt-32
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-6
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-6
            [&_li]:my-2 [&_li]:text-white/70
          ">
                        {/* Check if content is HTML (starts with < and has tags) or Markdown */}
                        {post.content && post.content.trim().startsWith('<') ? (
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h2: ({ node, ...props }) => {
                                        const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                                        return <h2 id={id} className="scroll-mt-32" {...props} />
                                    },
                                    h3: ({ node, ...props }) => {
                                        const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                                        return <h3 id={id} className="scroll-mt-32" {...props} />
                                    },
                                    img: ({ node, ...props }) => (
                                        <div className="my-12">
                                            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
                                                <img {...props} className="w-full h-auto m-0" />
                                            </div>
                                            {props.alt && (
                                                <p className="text-center text-sm text-white/30 mt-3 italic">{props.alt}</p>
                                            )}
                                        </div>
                                    ),
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto my-12 border border-white/10 rounded-xl">
                                            <table className="w-full text-left text-sm" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => <thead className="bg-white/5 text-white font-medium border-b border-white/10" {...props} />,
                                    th: ({ node, ...props }) => <th className="px-6 py-4" {...props} />,
                                    td: ({ node, ...props }) => <td className="px-6 py-4 border-b border-white/5 text-white/60" {...props} />,
                                }}
                            >
                                {post.content || post.excerpt}
                            </ReactMarkdown>
                        )}
                    </article>
                </main>
            </div>

            {/* Related Posts Section */}
            <div className="max-w-[1400px] mx-auto mt-24 pt-16 border-t border-white/10">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-bold text-white">Continue Reading</h3>
                    <Link href="/blog" className="text-gold hover:text-gold-light transition-colors text-sm flex items-center gap-2">
                        View all posts <ChevronRight size={16} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Related posts would be fetched from GraphQL in production */}
                    <div className="group relative rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                        <div className="p-6">
                            <span className="text-gold text-xs font-medium uppercase tracking-wider">{post.category}</span>
                            <h4 className="text-lg font-bold text-white mt-2 mb-3 group-hover:text-gold transition-colors">Explore more in {post.category}</h4>
                            <p className="text-white/50 text-sm line-clamp-2">Discover more insights and articles in this category.</p>
                            <Link href={`/blog?category=${post.category}`} className="mt-4 inline-flex items-center gap-2 text-gold text-sm">
                                Browse {post.category} <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>
                    <div className="group relative rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-all p-6 flex flex-col justify-center items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                            <Share2 size={20} className="text-gold" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Share this article</h4>
                        <p className="text-white/50 text-sm mb-4">Found this helpful? Share it with others.</p>
                        <div className="flex gap-3">
                            <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-10 h-10 rounded-full bg-white/5 hover:bg-gold/20 flex items-center justify-center text-white/60 hover:text-gold transition-all"><Twitter size={16} /></button>
                            <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-10 h-10 rounded-full bg-white/5 hover:bg-gold/20 flex items-center justify-center text-white/60 hover:text-gold transition-all"><Linkedin size={16} /></button>
                            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Copied!') }} className="w-10 h-10 rounded-full bg-white/5 hover:bg-gold/20 flex items-center justify-center text-white/60 hover:text-gold transition-all"><LinkIcon size={16} /></button>
                        </div>
                    </div>
                    <Link href="/contact" className="group relative rounded-2xl border border-gold/30 overflow-hidden bg-gradient-to-br from-gold/10 to-transparent hover:from-gold/20 transition-all p-6 flex flex-col justify-center">
                        <span className="text-gold text-xs font-medium uppercase tracking-wider mb-2">Let's Work Together</span>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors">Start Your Project</h4>
                        <p className="text-white/50 text-sm mb-4">Ready to build something amazing? Get in touch.</p>
                        <span className="inline-flex items-center gap-2 text-gold text-sm font-medium">
                            Contact us <ChevronRight size={14} />
                        </span>
                    </Link>
                </div>
            </div>

            {/* Author / Footer CTA */}
            <div className="max-w-4xl mx-auto mt-24 pt-16 border-t border-white/10 text-center">
                <div className="inline-block p-1 rounded-full bg-gradient-to-r from-gold via-transparent to-gold bg-[length:400%_100%] animate-shimmer mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#0a0a0a] flex items-center justify-center border border-white/10">
                        <span className="text-2xl">⚡️</span>
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">MakeUsLive Agency</h3>
                <p className="text-white/50 max-w-xl mx-auto mb-10">
                    We help brands build future-ready digital experiences. Looking for simple improvements or a complete overhaul?
                </p>
                <Link
                    href="/contact"
                    className="px-10 py-4 rounded-full bg-gold text-bg font-bold text-lg hover:bg-gold-light transition-colors shadow-[0_0_30px_-5px_var(--gold)]"
                >
                    Start a Project
                </Link>
            </div>
        </div>
    )
}

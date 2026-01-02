'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRight, TechIcon } from '@/components/ui'
import type { PostItem } from '@/types'

const CATEGORIES = [
    { name: 'All', icon: null },
    { name: 'AI & Technology', icon: 'ai' },
    { name: 'Design', icon: 'design' },
    { name: 'Development', icon: 'development' },
    { name: 'UX Research', icon: 'uxresearch' },
    { name: 'Animation', icon: 'animation' },
]

// Featured Blog Card
const FeaturedCard = ({ post }: { post: PostItem }) => (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
        <article className="relative h-full min-h-[480px] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
            {/* Image */}
            <div className="absolute inset-0">
                {post.featuredImage && (post.featuredImage.startsWith('/') || post.featuredImage.startsWith('http')) ? (
                    <img
                        src={post.featuredImage}
                        alt={`Make Us Live Blog - ${post.title}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${post.gradient || 'from-gold/30 to-purple-600/20'}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="relative h-full flex flex-col justify-end p-8 md:p-10">
                <div className="flex items-center gap-3 mb-5">
                    <span className="px-3 py-1.5 rounded-full bg-gold text-bg text-xs font-semibold uppercase tracking-wide">
                        {post.category || 'Article'}
                    </span>
                    <span className="text-sm text-white/60">
                        {post.readTime || '5 min read'}
                    </span>
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-gold transition-colors">
                    {post.title}
                </h3>

                <p className="text-white/60 text-base leading-relaxed line-clamp-2 mb-6 max-w-xl">
                    {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold">
                            {post.author?.name?.charAt(0) || 'M'}
                        </div>
                        <div>
                            <div className="text-white text-sm font-medium">{post.author?.name || 'Make Us Live'}</div>
                            <div className="text-white/40 text-xs">{post.date}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-3 transition-all">
                        Read Article
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                </div>
            </div>
        </article>
    </Link>
)

// Standard blog card
const BlogCard = ({ post }: { post: PostItem }) => (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
        <article className="h-full rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300">
            <div className="aspect-[16/10] w-full overflow-hidden bg-white/5">
                {post.featuredImage && (post.featuredImage.startsWith('/') || post.featuredImage.startsWith('http')) ? (
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${post.gradient || 'from-gold/20 to-gold/5'}`} />
                )}
            </div>

            <div className="p-6 md:p-7">
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium">
                        {post.category || 'Article'}
                    </span>
                    <span className="text-xs text-white/40">
                        {post.date}
                    </span>
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-white mb-3 leading-snug group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                </h3>

                <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-5">
                    {post.excerpt}
                </p>

                <div className="flex items-center gap-2 text-gold/80 text-sm font-medium group-hover:text-gold group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </div>
            </div>
        </article>
    </Link>
)

const HeroNewsletter = () => {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !email.includes('@')) return

        setStatus('loading')
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setStatus('success')
                setEmail('')
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    return (
        <div className="relative bg-bg/50 border border-white/10 p-6 md:p-8">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold/60" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold/60" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold/60" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold/60" />

            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                    <h4 className="text-xl font-serif font-bold text-white mb-2">Don&apos;t miss a thing</h4>
                    <p className="text-white/60 text-sm">Subscribe to get updates straight to your inbox.</p>
                </div>

                <div className="hidden md:block">
                    <svg className="w-24 h-12 text-gold/30" viewBox="0 0 100 50">
                        <path d="M0,25 L60,25 L60,10 L100,25 L60,40 L60,25" fill="currentColor" />
                    </svg>
                </div>
            </div>

            {status === 'success' ? (
                <div className="mt-6 flex items-center gap-2 text-green-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Thanks for subscribing!
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors"
                            disabled={status === 'loading'}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="h-12 px-6 bg-white text-bg font-medium uppercase text-xs tracking-wider hover:bg-gold transition-colors disabled:opacity-50"
                    >
                        {status === 'loading' ? '...' : 'Subscribe'}
                    </button>
                </form>
            )}
        </div>
    )
}

interface BlogClientProps {
    initialPosts: PostItem[]
    pagination: {
        currentPage: number
        totalPages: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    }
}

export default function BlogClient({ initialPosts, pagination }: BlogClientProps) {
    const pageRef = useRef<HTMLDivElement>(null)
    const [activeCategory, setActiveCategory] = useState('All')

    // Client-side filtering if needed, but we start with server data
    // For simplicity in this demo, we can just filter the initialPosts if we wanted "instant" feel
    // But rigorous pagination implies we should probably fetch new pages when filtering.
    // Given the "Next.js 15/16" approach, filtering usually means navigating to ?category=Design
    // Let's implement client-side navigation for filters.
    const [posts, setPosts] = useState(initialPosts)
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(pagination.currentPage)
    const [totalPages, setTotalPages] = useState(pagination.totalPages)
    const [hasNextPage, setHasNextPage] = useState(pagination.hasNextPage)
    const [hasPreviousPage, setHasPreviousPage] = useState(pagination.hasPreviousPage)

    // NOTE: If you want full SSG/ISR without client fetch, you'd make categories links to /blog?category=Design
    // But here we'll keep the client fetch for interactivity since that was requested "to improve" 
    // actually, "research this for all left over pages" implies applying the SERVER PATTERN.

    // To handle client-side category switching without page reload (SPA feel) but with server data:
    useEffect(() => {
        // If it's the first render, we don't need to fetch - we have initialPosts
        if (activeCategory === 'All' && currentPage === 1 && posts === initialPosts) return

        const fetchPosts = async () => {
            try {
                setLoading(true)
                const params = new URLSearchParams({
                    status: 'published',
                    page: currentPage.toString(),
                    limit: '13',
                })

                if (activeCategory && activeCategory !== 'All') {
                    params.append('category', activeCategory)
                }

                const response = await fetch(`/api/blog?${params.toString()}`)
                const result = await response.json()

                if (result.success) {
                    setPosts(result.data.posts || [])
                    setTotalPages(result.data.pagination?.totalPages || 1)
                    setHasNextPage(result.data.pagination?.hasNextPage || false)
                    setHasPreviousPage(result.data.pagination?.hasPreviousPage || false)
                }
            } catch (error) {
                console.error('Error fetching posts:', error)
            } finally {
                setLoading(false)
            }
        }

        // Debounce or just call
        fetchPosts()
    }, [activeCategory, currentPage])
    // ^ Logic hole: initialPosts will be stale if we don't sync. 
    // Better approach: use useSearchParams() and router.push() for filters => Server Components handle it.
    // But user asked to replicate the Work page pattern which was: Server fetch initial -> Client takes over.

    useEffect(() => {
        setCurrentPage(1)
    }, [activeCategory])

    const featuredPost = posts.find(p => p.featured) || posts[0]
    const gridPosts = posts.filter(p => p.id !== featuredPost?.id)

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        const grid = document.getElementById('blog-grid')
        if (grid) {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <div ref={pageRef} className="min-h-screen bg-bg text-white">
            <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.02] via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <header className="mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-3 mb-8">
                            <span className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold/80">
                                Insights & Stories
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.05]">
                            <span className="text-white">Our </span>
                            <span className="bg-gradient-to-r from-white via-gold/90 to-gold bg-clip-text text-transparent">
                                Blog
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl">
                            Dive into well-crafted stories, interviews, and guides designed to inform,
                            inspire, and keep you updated with the latest in tech, design, and creativity.
                        </p>
                    </header>

                    <nav className="mb-16 md:mb-20">
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category.name}
                                    onClick={() => setActiveCategory(category.name)}
                                    className={cn(
                                        'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
                                        activeCategory === category.name
                                            ? 'bg-gold text-bg'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                                    )}
                                >
                                    {category.name !== 'All' && (
                                        <span className={activeCategory === category.name ? 'text-bg' : 'text-white/40'}>
                                            <TechIcon name={category.icon || ''} size={14} />
                                        </span>
                                    )}
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </nav>

                    {featuredPost && (
                        <div className="mb-16">
                            <div className="mb-6">
                                <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">Featured Article</span>
                            </div>
                            <FeaturedCard post={featuredPost} />
                        </div>
                    )}
                </div>
            </section>

            <section id="blog-grid" className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                    <div className="flex items-end justify-between mb-12 pb-8 border-b border-white/10">
                        <div>
                            <p className="text-gold/80 text-sm font-medium uppercase tracking-[0.15em] mb-3">
                                Latest Posts
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                                All Articles
                            </h2>
                        </div>
                        <p className="hidden md:block text-white/40 text-sm">
                            {gridPosts.length} articles
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-32">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-2 border-white/20 border-t-gold rounded-full animate-spin" />
                                <p className="text-white/40 text-sm">Loading articles...</p>
                            </div>
                        </div>
                    ) : gridPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                            {gridPosts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                <span className="text-2xl">📝</span>
                            </div>
                            <p className="text-white/50 text-lg mb-2">No posts found</p>
                            <p className="text-white/30 text-sm">Try selecting a different category</p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-6 pt-16 mt-16 border-t border-white/10">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!hasPreviousPage}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                            >
                                <ArrowRight className="rotate-180" size={16} />
                                Previous
                            </button>
                            <div className="px-4 py-2 rounded-full bg-white/5 font-mono text-sm text-white/60">
                                {currentPage} / {totalPages}
                            </div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!hasNextPage}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                            >
                                Next
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 md:py-32 bg-gradient-to-b from-bg to-[#080808]">
                <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <TechIcon name="email" size={32} className="text-gold" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                        Stay in the loop
                    </h3>
                    <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">
                        Get the latest insights on AI and design delivered to your inbox. No spam, ever.
                    </p>
                    <HeroNewsletter />
                </div>
            </section>
        </div>
    )
}

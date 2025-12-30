'use client'

import { PostItem } from '@/types'
import { useEffect, useRef, useState, memo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRight, TechIcon } from '@/components/ui'

const CATEGORIES = [
  { name: 'All', icon: null },
  { name: 'AI & Technology', icon: 'ai' },
  { name: 'Design', icon: 'design' },
  { name: 'Development', icon: 'development' },
  { name: 'UX Research', icon: 'uxresearch' },
  { name: 'Animation', icon: 'animation' },
]

// Category Icons as small SVG components
const CategoryIcon = ({ category }: { category: string }) => {
  const iconClass = "w-3 h-3 fill-current"

  switch (category) {
    case 'AI & Technology':
      return (
        <svg className={iconClass} viewBox="0 0 12 12">
          <rect x="1" y="1" width="10" height="10" rx="2" fill="currentColor" opacity="0.8" />
          <rect x="3" y="3" width="2" height="2" fill="currentColor" />
          <rect x="7" y="3" width="2" height="2" fill="currentColor" />
          <rect x="3" y="7" width="6" height="2" fill="currentColor" />
        </svg>
      )
    case 'Design':
      return (
        <svg className={iconClass} viewBox="0 0 12 12">
          <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="6" cy="6" r="2" fill="currentColor" />
        </svg>
      )
    case 'Development':
      return (
        <svg className={iconClass} viewBox="0 0 12 12">
          <path d="M3 3L1 6L3 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M9 3L11 6L9 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M7 2L5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'UX Research':
      return (
        <svg className={iconClass} viewBox="0 0 12 12">
          <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 8L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'Animation':
      return (
        <svg className={iconClass} viewBox="0 0 12 12">
          <polygon points="2,1 11,6 2,11" fill="currentColor" />
        </svg>
      )
    default:
      return null
  }
}

// Featured Blog Card - Hero style with proper framing
const FeaturedCard = memo(({ post }: { post: PostItem }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group block h-full"
  >
    <article className="relative h-full min-h-[480px] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
      {/* Image */}
      <div className="absolute inset-0">
        {post.featuredImage && (post.featuredImage.startsWith('/') || post.featuredImage.startsWith('http')) ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${post.gradient || 'from-gold/30 to-purple-600/20'}`} />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative h-full flex flex-col justify-end p-8 md:p-10">
        {/* Badges */}
        <div className="flex items-center gap-3 mb-5">
          <span className="px-3 py-1.5 rounded-full bg-gold text-bg text-xs font-semibold uppercase tracking-wide">
            {post.category || 'Article'}
          </span>
          <span className="text-sm text-white/60">
            {post.readTime || '5 min read'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-gold transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-white/60 text-base leading-relaxed line-clamp-2 mb-6 max-w-xl">
          {post.excerpt}
        </p>

        {/* Footer: Author & Read More */}
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
))
FeaturedCard.displayName = 'FeaturedCard'

// Standard blog card - Clean card style with proper framing
const BlogCard = memo(({ post }: { post: PostItem }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group block h-full"
  >
    <article className="h-full rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300">
      {/* Image */}
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

      {/* Content */}
      <div className="p-6 md:p-7">
        {/* Meta: Category & Date */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium">
            {post.category || 'Article'}
          </span>
          <span className="text-xs text-white/40">
            {post.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-semibold text-white mb-3 leading-snug group-hover:text-gold transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-5">
          {post.excerpt}
        </p>

        {/* Read more */}
        <div className="flex items-center gap-2 text-gold/80 text-sm font-medium group-hover:text-gold group-hover:gap-3 transition-all">
          Read Article
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </article>
  </Link>
))
BlogCard.displayName = 'BlogCard'

// Newsletter subscription component for hero
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
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold/60" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold/60" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold/60" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold/60" />

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h4 className="text-xl font-serif font-bold text-white mb-2">Don&apos;t miss a thing</h4>
          <p className="text-white/60 text-sm">Subscribe to get updates straight to your inbox.</p>
        </div>

        {/* Decorative arrow shape */}
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

export default function BlogPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)

  // Fetch blog posts from REST API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)

        // Build query params
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
        } else {
          console.error('Failed to fetch posts:', result.error)
          setPosts([])
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [activeCategory, currentPage])

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
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

          {/* Page Header */}
          <header className="mb-16 md:mb-24">
            {/* Eyebrow */}
            <p className="text-gold/80 text-sm font-medium uppercase tracking-[0.2em] mb-6">
              Insights & Stories
            </p>

            {/* Large Title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white leading-[0.9] tracking-tight mb-8">
              Blog
            </h1>

            {/* Subtitle */}
            <p className="text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed">
              Dive into well-crafted stories, interviews, and guides designed to inform,
              inspire, and keep you updated with the latest in tech, design, and creativity.
            </p>
          </header>

          {/* Category Navigation Bar */}
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

          {/* Featured Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left Column - Featured Article */}
            {featuredPost && (
              <div className="lg:col-span-7">
                <div className="mb-6">
                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">Featured Article</span>
                </div>
                <FeaturedCard post={featuredPost} />
              </div>
            )}

            {/* Right Column - Text & Newsletter */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="mb-12 lg:mb-0">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-6">
                  A modern magazine<br />for curious minds
                </h2>
                <p className="text-white/50 text-base leading-relaxed mb-8">
                  Stories and insights from the intersection of design, technology, and creativity.
                  Written by practitioners, for practitioners.
                </p>

                {/* Stats */}
                <div className="flex gap-8 mb-10 pb-10 border-b border-white/10">
                  <div>
                    <div className="text-3xl font-bold text-gold mb-1">50+</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">Articles</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gold mb-1">10K+</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">Readers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gold mb-1">Weekly</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">Updates</div>
                  </div>
                </div>
              </div>

              <HeroNewsletter />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section id="blog-grid" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          {/* Section Header */}
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

          {/* Pagination */}
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

      {/* Bottom Newsletter */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-bg to-[#080808]">
        <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
          {/* Icon */}
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

          <p className="mt-6 text-xs text-white/30">
            Join 2,000+ designers and developers
          </p>
        </div>
      </section>
    </div>
  )
}

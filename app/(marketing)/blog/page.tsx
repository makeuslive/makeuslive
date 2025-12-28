'use client'

import { PostItem } from '@/types'
import { useEffect, useRef, useState, memo } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client/react'
import { cn } from '@/lib/utils'
import { ArrowRight } from '@/components/ui'
import { GET_BLOG_POSTS } from '@/lib/graphql/queries'

const CATEGORIES = [
  { name: 'All', icon: null },
  { name: 'AI & Technology', icon: '💻' },
  { name: 'Design', icon: '🎨' },
  { name: 'Development', icon: '⚙️' },
  { name: 'UX Research', icon: '🔍' },
  { name: 'Animation', icon: '✨' },
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

// Featured Blog Card - Magazine Style
const FeaturedCard = memo(({ post }: { post: PostItem }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group block h-full"
  >
    <div className="relative h-full bg-bg border border-white/10 overflow-hidden">
      {/* Browser-style header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
        {/* Three dots */}
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full border border-white/30" />
          <span className="w-2 h-2 rounded-full border border-white/30" />
          <span className="w-2 h-2 rounded-full border border-white/30" />
        </div>
        {/* Dashed line */}
        <div className="flex-1 border-t border-dashed border-white/20" />
        {/* Featured badge */}
        <span className="text-[10px] uppercase tracking-wider text-white/50 px-2">Featured</span>
        {/* Dashed line */}
        <div className="flex-1 border-t border-dashed border-white/20" />
      </div>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {post.featuredImage && (post.featuredImage.startsWith('/') || post.featuredImage.startsWith('http')) ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${post.gradient || 'from-gold/20 to-gold/5'}`} />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Badges */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gold/90 text-bg text-xs font-medium uppercase tracking-wider">
              {post.category || 'Article'}
            </span>
            <span className="text-xs text-white/60 font-mono">
              {post.readTime || '5 min read'}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3 leading-tight group-hover:text-gold transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-white/70 text-sm line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-medium">
              {post.author?.charAt(0) || 'M'}
            </div>
            <div>
              <div className="text-white text-sm font-medium">{post.author || 'MakeUsLive'}</div>
              <div className="text-white/50 text-xs">{post.date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Link>
))
FeaturedCard.displayName = 'FeaturedCard'

// Standard blog card - Magazine grid style
const BlogCard = memo(({ post }: { post: PostItem }) => (
  <Link
    href={`/blog/${post.slug}`}
    className={cn(
      'group flex flex-col h-full',
      'border-r border-b border-white/10',
      'hover:bg-white/[0.02] transition-colors duration-300'
    )}
  >
    <div className="flex flex-col h-full p-6 md:p-8">
      {/* Date */}
      <div className="mb-4 font-mono text-xs font-medium text-white/40 uppercase tracking-widest">
        {post.date}
      </div>

      {/* Image */}
      <div className="aspect-video w-full mb-6 overflow-hidden bg-white/5">
        {post.featuredImage && (post.featuredImage.startsWith('/') || post.featuredImage.startsWith('http')) ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${post.gradient || 'from-gold/10 to-transparent'} opacity-40`} />
        )}
      </div>

      {/* Category */}
      <div className="mb-3">
        <span className="text-xs text-gold/80 font-medium uppercase tracking-wider">
          {post.category || 'Article'}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-serif font-semibold text-white mb-3 leading-tight group-hover:text-gold transition-colors">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-white/50 text-sm line-clamp-2 mb-auto">
        {post.excerpt}
      </p>

      {/* Read more */}
      <div className="mt-6 flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-3 transition-all">
        Read Article
        <ArrowRight size={14} />
      </div>
    </div>
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

  const { data, loading } = useQuery(GET_BLOG_POSTS, {
    variables: {
      status: 'published',
      category: activeCategory,
      page: currentPage,
      limit: 13
    }
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory])

  const postsData = (data as any)?.blogPosts
  const posts: PostItem[] = postsData?.posts || []
  const { totalPages, hasNextPage, hasPreviousPage } = postsData || {}

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
      <section className="pt-8 pb-12 md:pt-12 md:pb-20">
        <div className="max-w-[1460px] mx-auto px-6 md:px-8">

          {/* Large BLOG Title */}
          <div className="mb-8 md:mb-12 overflow-hidden">
            <h1 className="text-[80px] md:text-[140px] lg:text-[180px] font-serif font-bold text-white leading-none tracking-tight">
              BLOG
            </h1>
          </div>

          {/* Category Navigation Bar */}
          <div className="relative bg-white/5 backdrop-blur-sm mb-12 md:mb-16 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-start md:justify-center min-w-max px-4 py-4">
              {CATEGORIES.map((category, index) => (
                <div key={category.name} className="flex items-center">
                  {index > 0 && (
                    <div className="w-px h-4 bg-white/20 mx-4 md:mx-6" />
                  )}
                  <button
                    onClick={() => setActiveCategory(category.name)}
                    className={cn(
                      'flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider transition-colors whitespace-nowrap',
                      activeCategory === category.name
                        ? 'text-gold font-medium'
                        : 'text-white/60 hover:text-white'
                    )}
                  >
                    {category.name !== 'All' && (
                      <span className={activeCategory === category.name ? 'text-gold' : 'text-white/40'}>
                        <CategoryIcon category={category.name} />
                      </span>
                    )}
                    {category.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column - Text & Newsletter */}
            <div className="flex flex-col justify-between">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
                  A modern magazine<br />for curious minds
                </h2>
                <p className="text-white/60 text-lg leading-relaxed max-w-lg">
                  Dive into well-crafted stories, interviews, and guides designed to inform,
                  inspire, and keep you updated with the latest in tech, design, and creativity.
                </p>
              </div>

              <HeroNewsletter />
            </div>

            {/* Right Column - Featured Article */}
            {featuredPost && (
              <div className="h-full min-h-[500px]">
                <FeaturedCard post={featuredPost} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section id="blog-grid" className="bg-bg border-t border-white/10">
        <div className="max-w-[1920px] mx-auto">
          {loading ? (
            <div className="flex justify-center py-40">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : gridPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-white/10">
              {gridPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-white/40">
              <p>No posts found in this category.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-20 border-t border-white/10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
                className="p-3 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
              >
                <ArrowRight className="rotate-180 text-white" size={20} />
              </button>
              <div className="font-mono text-sm text-white/60">
                PAGE {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="p-3 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
              >
                <ArrowRight className="text-white" size={20} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Newsletter */}
      <section className="border-y border-white/10 bg-bg py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-3xl font-serif font-bold mb-4 text-white">Stay in the loop</h3>
          <p className="text-white/60 mb-8">Get the latest insights on AI and design delivered to your inbox.</p>
          <HeroNewsletter />
        </div>
      </section>
    </div>
  )
}

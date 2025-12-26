'use client'

import { PostItem } from '@/types'
import { memo, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { ArrowRight } from '@/components/ui'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Initial state or fallback
const BLOG_POSTS: PostItem[] = []

const CATEGORIES = ['All', 'AI & Technology', 'Design', 'Development', 'UX Research', 'Animation']

// Featured blog card (large)
const FeaturedBlogCard = memo(({ post }: { post: PostItem }) => (
  <div
    className={cn(
      'blog-card group relative rounded-3xl overflow-hidden',
      'border border-white/10 bg-[#0a0a0a]',
      'cursor-pointer transition-all duration-700 ease-out',
      'hover:border-white/20 hover:scale-[1.01]',
      'md:col-span-2 min-h-[400px] md:min-h-[450px]'
    )}
  >
    {/* Gradient background */}
    <div className={cn(
      'absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-700 group-hover:opacity-100',
      post.gradient
    )} />

    {/* Noise texture */}
    <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
    />

    {/* Decorative element */}
    <div className="absolute top-1/2 right-16 -translate-y-1/2 w-[300px] h-[300px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 hidden md:block">
      <div className="absolute inset-0 border border-white/30 rounded-full" />
      <div className="absolute inset-12 border border-white/20 rounded-full" />
      <div className="absolute inset-24 border border-white/10 rounded-full" />
    </div>

    {/* Glow effect */}
    <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none"
      style={{
        background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.06), transparent 40%)',
      }}
    />

    {/* Content */}
    <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-between">
      {/* Top */}
      <div className="flex items-center gap-4">
        <span className="px-3 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-xs font-medium text-gold">
          Featured
        </span>
        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
          {post.category}
        </span>
      </div>

      {/* Bottom */}
      <div className="max-w-xl">
        <p className="text-white/40 text-sm mb-3">{post.date} · {post.readTime} read</p>
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-gold/90 transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-white/50 text-base leading-relaxed mb-6">
          {post.excerpt}
        </p>
        <div className="inline-flex items-center gap-2 text-gold group-hover:text-gold-dark transition-colors">
          <span className="font-medium">Read Article</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>

    {/* Corner glow */}
    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
  </div>
))
FeaturedBlogCard.displayName = 'FeaturedBlogCard'

// Standard blog card
const BlogCard = memo(({ post }: { post: PostItem }) => (
  <div
    className={cn(
      'blog-card group relative rounded-2xl overflow-hidden',
      'border border-white/10 bg-[#0a0a0a]',
      'cursor-pointer transition-all duration-500',
      'hover:border-white/20 hover:scale-[1.02]',
      'min-h-[280px]'
    )}
  >
    {/* Gradient background */}
    <div className={cn(
      'absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity duration-500 group-hover:opacity-70',
      post.gradient
    )} />

    {/* Glow effect */}
    <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
      style={{
        background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.06), transparent 40%)',
      }}
    />

    {/* Content */}
    <div className="relative z-10 h-full p-6 flex flex-col justify-between">
      {/* Top */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/60">
            {post.category}
          </span>
          <span className="text-white/30 text-xs">{post.readTime}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-gold/90 transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-white/30 text-xs">{post.date}</span>
        <div className="flex items-center gap-2 text-sm font-medium text-white/50 group-hover:text-gold transition-colors">
          Read
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </div>
))
BlogCard.displayName = 'BlogCard'

export default function BlogPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [posts, setPosts] = useState<PostItem[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts')
        const data = await res.json()
        if (data.success) {
          setPosts(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      }
    }
    fetchPosts()
  }, [])

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(post => post.category === activeCategory)

  useEffect(() => {
    const page = pageRef.current
    if (!page) return

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.blog-hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
      gsap.from('.blog-hero-title', { y: 60, opacity: 0, duration: 1, delay: 0.1, ease: 'power3.out' })
      gsap.from('.blog-hero-subtitle', { y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' })

      // Categories
      gsap.from('.category-btn', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        delay: 0.3,
        ease: 'power3.out'
      })

      // Blog cards - individual triggers
      document.querySelectorAll('.blog-card').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            }
          }
        )
      })

      // Newsletter section
      gsap.fromTo('.newsletter-section',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.newsletter-section',
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      )
    }, page)

    // Mouse tracking for glow effect
    const handleMouseMove = (e: MouseEvent) => {
      const cards = page.querySelectorAll('.blog-card')
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
          ; (card as HTMLElement).style.setProperty('--mouse-x', `${x}%`)
          ; (card as HTMLElement).style.setProperty('--mouse-y', `${y}%`)
      })
    }
    page.addEventListener('mousemove', handleMouseMove)

    return () => {
      ctx.revert()
      page.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24 pb-8">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="blog-hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="text-sm font-medium text-white/70">Insights & Ideas</span>
          </div>

          {/* Title */}
          <h1 className="blog-hero-title text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[0.95]">
            <span className="text-white">The</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold">
              Blog
            </span>
          </h1>

          {/* Subtitle */}
          <p className="blog-hero-subtitle text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Thoughts on design, development, AI, and building products that people love.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'category-btn px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  'border',
                  activeCategory === category
                    ? 'bg-gold text-bg border-gold'
                    : 'bg-transparent text-white/60 border-white/10 hover:border-gold/40 hover:text-gold'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredPosts.map((post, index) => (
              post.featured && activeCategory === 'All' ? (
                <FeaturedBlogCard key={post.id} post={post} />
              ) : (
                <BlogCard key={post.id} post={post} />
              )
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/20 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay in the Loop
              </h2>
              <p className="text-white/50 text-lg mb-8 max-w-lg mx-auto">
                Get the latest insights delivered straight to your inbox. No spam, just quality content.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    'flex-grow h-12 rounded-xl bg-white/5 px-5',
                    'text-white placeholder:text-white/40',
                    'border border-white/10',
                    'focus:outline-none focus:border-gold/50 transition-colors'
                  )}
                />
                <button
                  type="submit"
                  className={cn(
                    'px-6 h-12 rounded-xl font-semibold',
                    'bg-gradient-to-r from-gold to-gold-dark text-bg',
                    'hover:scale-105 hover:shadow-xl hover:shadow-gold/20',
                    'transition-all duration-300'
                  )}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Have a Story to Share?
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            We&apos;re always looking for guest contributors. Share your insights with our community.
          </p>
          <Link
            href="/contact"
            className={cn(
              'group inline-flex items-center gap-3 px-8 py-4 rounded-xl',
              'bg-white/5 border border-white/10 text-white font-medium',
              'transition-all duration-300 hover:border-gold/40 hover:bg-white/10'
            )}
          >
            Get in Touch
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}

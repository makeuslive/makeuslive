'use client'

import { memo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRight } from '@/components/ui'

// Case studies data with varied visual styles
const CASE_STUDIES = [
  {
    id: 'featured-1',
    title: 'Redefining E-Commerce',
    subtitle: 'TechMart Platform',
    description: 'A complete digital transformation that increased conversions by 340% and redefined how users shop online.',
    category: 'Web Development',
    year: '2024',
    stats: { metric: '+340%', label: 'Conversions' },
    tags: ['Next.js', 'AI Search', 'Shopify'],
    gradient: 'from-purple-600/30 via-indigo-600/20 to-transparent',
    accentColor: 'purple',
    size: 'large',
  },
  {
    id: 'case-2',
    title: 'AI Analytics Dashboard',
    subtitle: 'DataFlow Intelligence',
    description: 'Real-time predictive analytics powering decisions for Fortune 500 companies.',
    category: 'Machine Learning',
    year: '2024',
    stats: { metric: '$2.4M', label: 'Revenue Impact' },
    tags: ['Python', 'TensorFlow', 'React'],
    gradient: 'from-blue-600/30 via-cyan-600/20 to-transparent',
    accentColor: 'blue',
    size: 'medium',
  },
  {
    id: 'case-3',
    title: 'Fintech Rebrand',
    subtitle: 'PayFlow Identity',
    description: 'Complete design system with 100+ components and a brand identity that converts.',
    category: 'Brand Design',
    year: '2023',
    stats: { metric: '100+', label: 'Components' },
    tags: ['Figma', 'Design Tokens'],
    gradient: 'from-emerald-600/30 via-teal-600/20 to-transparent',
    accentColor: 'emerald',
    size: 'medium',
  },
  {
    id: 'case-4',
    title: 'Mobile Experience',
    subtitle: 'HealthTrack App',
    description: 'Cross-platform wellness app with 4.9★ rating and 500K+ downloads.',
    category: 'Mobile App',
    year: '2024',
    stats: { metric: '4.9★', label: 'App Store' },
    tags: ['React Native', 'iOS', 'Android'],
    gradient: 'from-orange-600/30 via-red-600/20 to-transparent',
    accentColor: 'orange',
    size: 'small',
  },
  {
    id: 'case-5',
    title: 'SaaS Revolution',
    subtitle: 'TeamSync Platform',
    description: 'B2B collaboration tool scaled from MVP to 50K monthly active users.',
    category: 'Product Design',
    year: '2023',
    stats: { metric: '50K+', label: 'Monthly Users' },
    tags: ['UX Research', 'Full Stack'],
    gradient: 'from-pink-600/30 via-rose-600/20 to-transparent',
    accentColor: 'pink',
    size: 'small',
  },
  {
    id: 'case-6',
    title: 'AI Customer Service',
    subtitle: 'SmartBot System',
    description: 'Intelligent chatbot handling 10K+ queries daily with 89% resolution rate.',
    category: 'AI Integration',
    year: '2024',
    stats: { metric: '89%', label: 'Resolution' },
    tags: ['OpenAI', 'LangChain', 'Node.js'],
    gradient: 'from-violet-600/30 via-purple-600/20 to-transparent',
    accentColor: 'violet',
    size: 'wide',
  },
]

// Bento Case Card Component with multiple variants
const BentoCaseCard = memo(({
  study,
  className
}: {
  study: typeof CASE_STUDIES[0]
  className?: string
}) => {
  const sizeClasses = {
    large: 'md:col-span-2 md:row-span-2 min-h-[500px]',
    medium: 'md:col-span-1 md:row-span-2 min-h-[420px]',
    small: 'md:col-span-1 md:row-span-1 min-h-[280px]',
    wide: 'md:col-span-2 md:row-span-1 min-h-[280px]',
  }

  return (
    <div
      className={cn(
        'bento-card group relative rounded-3xl overflow-hidden',
        'border border-white/10',
        'bg-[#0a0a0a]',
        'cursor-pointer transition-all duration-700 ease-out',
        'hover:border-white/20 hover:scale-[1.02]',
        sizeClasses[study.size as keyof typeof sizeClasses],
        className
      )}
      style={{ contain: 'layout style' }}
    >
      {/* Animated gradient background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-700 group-hover:opacity-100',
        study.gradient
      )} />

      {/* Noise texture overlay - simplified */}
      <div className="absolute inset-0 opacity-[0.02] bg-noise" />

      {/* Glow effect on hover */}
      <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.06), transparent 40%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-between">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          {/* Category & Year */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70">
              {study.category}
            </span>
            <span className="text-xs text-white/40">{study.year}</span>
          </div>

          {/* Stats Badge - Animated */}
          <div className="text-right">
            <span className={cn(
              'font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-dark to-gold',
              study.size === 'large' ? 'text-5xl' : study.size === 'small' ? 'text-2xl' : 'text-4xl'
            )}>
              {study.stats.metric}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-white/40 mt-1">
              {study.stats.label}
            </span>
          </div>
        </div>

        {/* Middle - Visual Element */}
        {study.size === 'large' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20 group-hover:opacity-30 transition-opacity duration-700">
            <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow" />
            <div className="absolute inset-8 rounded-full border border-white/15 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />
            <div className="absolute inset-16 rounded-full border border-white/10 animate-spin-slow" style={{ animationDuration: '30s' }} />
            <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/50" />
          </div>
        )}

        {/* Bottom Section */}
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-white/60 group-hover:border-gold/30 group-hover:text-gold/80 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title & Description */}
          <p className="text-xs uppercase tracking-wider text-gold/70 mb-1">{study.subtitle}</p>
          <h3 className={cn(
            'font-bold text-white mb-2 leading-tight',
            study.size === 'large' ? 'text-3xl md:text-4xl' : study.size === 'small' ? 'text-xl' : 'text-2xl md:text-3xl'
          )}>
            {study.title}
          </h3>
          {(study.size === 'large' || study.size === 'medium') && (
            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              {study.description}
            </p>
          )}

          {/* CTA Arrow */}
          <div className="mt-6 flex items-center gap-2">
            <span className="text-sm font-medium text-white/60 group-hover:text-gold transition-colors duration-300">
              View Case Study
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/30 transition-all duration-300">
              <ArrowRight size={14} className="text-white/60 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
    </div>
  )
})
BentoCaseCard.displayName = 'BentoCaseCard'

// Floating badge component
const FloatingBadge = memo(({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) => (
  <div
    className={cn(
      'floating-badge absolute px-3 py-1.5 rounded-full',
      'bg-white/5 backdrop-blur-md border border-white/10',
      'text-xs font-medium text-white/70',
      'animate-float',
      className
    )}
    style={style}
  >
    {text}
  </div>
))
FloatingBadge.displayName = 'FloatingBadge'

export default function WorksPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const page = pageRef.current
    if (!page) return

    // Dynamically import GSAP for better initial load
    const initAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        // Bento cards - animate on scroll only
        document.querySelectorAll('.bento-card').forEach((el, i) => {
          gsap.fromTo(el,
            { y: 30, opacity: 0.7 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: i * 0.05,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 92%',
                toggleActions: 'play none none none',
              }
            }
          )
        })

        // Stats - lighter animation
        document.querySelectorAll('.stat-card').forEach((el, i) => {
          gsap.fromTo(el,
            { y: 20, opacity: 0.8 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              delay: i * 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 95%',
                toggleActions: 'play none none none',
              }
            }
          )
        })
      }, page)

      return () => ctx.revert()
    }

    // Start animations after a small delay to prioritize content paint
    const timer = setTimeout(initAnimations, 100)

    // Mouse tracking for glow effect - throttled
    let ticking = false
    const handleMouseMove = (e: MouseEvent) => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const cards = page.querySelectorAll('.bento-card')
        cards.forEach((card) => {
          const rect = (card as HTMLElement).getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100
            ; (card as HTMLElement).style.setProperty('--mouse-x', `${x}%`)
            ; (card as HTMLElement).style.setProperty('--mouse-y', `${y}%`)
        })
        ticking = false
      })
    }
    page.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      clearTimeout(timer)
      page.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen">
      {/* Hero Section - Immersive */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Background Effects - Optimized blur values */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[60px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        {/* Floating Badges */}
        <FloatingBadge text="✨ AI-Powered" className="top-32 left-[15%] hidden lg:block" />
        <FloatingBadge text="🚀 50+ Projects" className="top-48 right-[20%] hidden lg:block" style={{ animationDelay: '-2s' } as React.CSSProperties} />
        <FloatingBadge text="⭐ 5-Star Reviews" className="bottom-32 left-[25%] hidden lg:block" style={{ animationDelay: '-4s' } as React.CSSProperties} />

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="works-hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="text-sm font-medium text-white/70">Selected Works</span>
          </div>

          {/* Title with gradient */}
          <h1 className="works-hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95]">
            <span className="text-white">Crafted with</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold">
              Obsession
            </span>
          </h1>

          {/* Subtitle */}
          <p className="works-hero-subtitle text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Every pixel placed with purpose. Every line of code written with care.
            Explore our portfolio of transformative digital experiences.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-white/30">
            <span className="text-xs tracking-wider uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-min">
            {CASE_STUDIES.map((study) => (
              <BentoCaseCard key={study.id} study={study} />
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats - Floating Cards Style */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">The Numbers</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Impact We&apos;ve Created
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: '50+', label: 'Projects Shipped', icon: '🚀' },
              { value: '98%', label: 'Client Satisfaction', icon: '⭐' },
              { value: '$10M+', label: 'Revenue Generated', icon: '💰' },
              { value: '24/7', label: 'Support & Care', icon: '🛡️' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  'stat-card relative p-6 md:p-8 rounded-2xl',
                  'bg-white/[0.02] border border-white/10',
                  'hover:border-gold/30 hover:bg-white/[0.04]',
                  'transition-all duration-500 group overflow-hidden'
                )}
              >
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 text-center">
                  <span className="text-3xl mb-3 block">{stat.icon}</span>
                  <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-300">
                    {stat.value}
                  </span>
                  <p className="text-white/50 mt-2 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Join<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold">
              This Collection?
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            Your project could be the next case study. Let&apos;s create something remarkable together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className={cn(
                'group inline-flex items-center gap-3 px-8 py-4 rounded-xl',
                'bg-gradient-to-r from-gold to-gold-dark text-bg font-semibold',
                'transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gold/20'
              )}
            >
              Start Your Project
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                'inline-flex items-center gap-3 px-8 py-4 rounded-xl',
                'border border-white/20 text-white font-medium',
                'transition-all duration-300 hover:border-gold/40 hover:bg-white/5'
              )}
            >
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

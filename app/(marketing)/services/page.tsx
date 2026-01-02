'use client'

import { memo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { ArrowRight, TechIcon } from '@/components/ui'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// All services data with routing information
const ALL_SERVICES = [
  {
    slug: 'app-development',
    title: 'Mobile App Development',
    tagline: 'Apps That Users Love',
    description: 'High-performance iOS, Android, and cross-platform apps built with React Native & Flutter. From concept to App Store.',
    icon: 'smartphone',
    features: ['iOS Development', 'Android Development', 'React Native', 'Flutter'],
    stats: { value: '4.9★', label: 'App Store Rating' },
    gradient: 'from-blue-600/30 via-cyan-600/20 to-transparent',
    iconGradient: 'from-blue-500 to-cyan-600',
    size: 'large' as const,
  },
  {
    slug: 'web-design',
    title: 'Web Design & Development',
    tagline: 'Websites That Convert',
    description: 'Modern, performant websites built with Next.js and React. SEO-optimized, mobile-first designs that drive results.',
    icon: 'code',
    features: ['Next.js', 'React', 'SEO Optimization', 'Performance'],
    stats: { value: '98+', label: 'Lighthouse Score' },
    gradient: 'from-emerald-600/30 via-teal-600/20 to-transparent',
    iconGradient: 'from-emerald-500 to-teal-600',
    size: 'medium' as const,
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    tagline: 'Designs That Delight',
    description: 'User research, wireframing, and beautiful interfaces. Design systems that scale with your product.',
    icon: 'palette',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    stats: { value: '95%', label: 'User Satisfaction' },
    gradient: 'from-purple-600/30 via-pink-600/20 to-transparent',
    iconGradient: 'from-purple-500 to-pink-600',
    size: 'medium' as const,
  },
  {
    slug: 'mvp-development',
    title: 'MVP Development',
    tagline: 'Launch Fast, Learn Faster',
    description: 'Validate your idea with a lean MVP in 4-8 weeks. Scalable foundation that grows with your success.',
    icon: 'rocket',
    features: ['Rapid Development', 'Idea Validation', 'Investor Ready', 'Scalable'],
    stats: { value: '4-8', label: 'Weeks to Launch' },
    gradient: 'from-orange-600/30 via-red-600/20 to-transparent',
    iconGradient: 'from-orange-500 to-red-600',
    size: 'medium' as const,
  },
  {
    slug: 'custom-software',
    title: 'Custom Software',
    tagline: 'Enterprise Solutions',
    description: 'Tailored ERP, CRM, and business management systems. Enterprise-grade solutions that integrate seamlessly.',
    icon: 'building',
    features: ['ERP Systems', 'CRM Solutions', 'System Integration', 'Automation'],
    stats: { value: '24/7', label: 'Support' },
    gradient: 'from-yellow-600/30 via-amber-600/20 to-transparent',
    iconGradient: 'from-yellow-500 to-amber-600',
    size: 'medium' as const,
  },
]

// Service Card Component
const ServiceCard = memo(({ service }: { service: typeof ALL_SERVICES[0] }) => {
  const isLarge = service.size === 'large'

  return (
    <Link
      href={`/${service.slug}`}
      className={cn(
        'service-card group relative rounded-3xl overflow-hidden block',
        'border border-white/10 bg-[#0a0a0a]',
        'transition-all duration-700 ease-out',
        'hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl',
        isLarge ? 'md:col-span-2 min-h-[450px]' : 'min-h-[380px]'
      )}
    >
      {/* Gradient background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-700 group-hover:opacity-80',
        service.gradient
      )} />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />

      {/* Glow on hover */}
      <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.08), transparent 40%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-between">
        {/* Top Row */}
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center',
            'bg-gradient-to-br text-white transition-all duration-500',
            'group-hover:scale-110 group-hover:shadow-xl',
            service.iconGradient
          )}>
            <TechIcon name={service.icon} size={32} className="opacity-90" />
          </div>

          {/* Stats */}
          <div className="text-right">
            <span className={cn(
              'font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold',
              isLarge ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'
            )}>
              {service.stats.value}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-white/40 mt-1">
              {service.stats.label}
            </span>
          </div>
        </div>

        {/* Middle - Large card decoration */}
        {isLarge && (
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <div className="absolute inset-0 border border-white/30 rounded-full" />
            <div className="absolute inset-8 border border-white/20 rounded-full" />
            <div className="absolute inset-16 border border-white/10 rounded-full" />
          </div>
        )}

        {/* Bottom */}
        <div>
          {/* Title & Tagline */}
          <h3 className={cn(
            'font-bold text-white mb-1 leading-tight',
            isLarge ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'
          )}>
            {service.title}
          </h3>
          <p className="text-gold/80 text-sm md:text-base mb-3">{service.tagline}</p>

          {/* Description */}
          <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-lg">
            {service.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {service.features.map((feature) => (
              <span
                key={feature}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/60 group-hover:border-gold/30 group-hover:text-gold/80 transition-colors duration-300"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="inline-flex items-center gap-2 text-sm font-medium text-white/60 group-hover:text-gold transition-colors duration-300">
            Learn More
            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/30 group-hover:translate-x-1 transition-all duration-300">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Corner glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
    </Link>
  )
})
ServiceCard.displayName = 'ServiceCard'

export default function ServicesPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const page = pageRef.current
    if (!page) return

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.services-hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
      gsap.from('.services-hero-title', { y: 60, opacity: 0, duration: 1, delay: 0.1, ease: 'power3.out' })
      gsap.from('.services-hero-subtitle', { y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' })

      // Service cards
      document.querySelectorAll('.service-card').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
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
    }, page)

    // Mouse tracking for glow effect
    const handleMouseMove = (e: MouseEvent) => {
      const cards = page.querySelectorAll('.service-card')
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
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.02] via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="services-hero-badge inline-flex items-center gap-3 mb-8">
              <span className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold/80">
                What We Build
              </span>
            </div>

            {/* Main heading with gradient */}
            <h1 className="services-hero-title text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.05]">
              <span className="text-white">Services that </span>
              <span className="bg-gradient-to-r from-white via-gold/90 to-gold bg-clip-text text-transparent">
                Scale
              </span>
            </h1>

            {/* Subheading */}
            <p className="services-hero-subtitle text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mb-10">
              Make Us Live designs, builds, and scales digital experiences that captivate and convert. From mobile apps to enterprise software.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className={cn(
                  'group inline-flex items-center gap-3 px-8 py-4 rounded-xl',
                  'bg-gradient-to-r from-gold to-gold-dark text-bg font-semibold',
                  'transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gold/20'
                )}
              >
                Start a Project
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/work"
                className={cn(
                  'inline-flex items-center gap-3 px-8 py-4 rounded-xl',
                  'border border-white/20 text-white font-medium',
                  'transition-all duration-300 hover:border-gold/40 hover:bg-white/5'
                )}
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Our Expertise</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Comprehensive Digital Solutions
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Choose the service that fits your needs. Each one is crafted with expertise and delivered with excellence.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold">
              Something Amazing
            </span>
            ?
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            Let's discuss your project. Make Us Live helps bring your vision to life.
          </p>
          <Link
            href="/contact"
            className={cn(
              'group inline-flex items-center gap-3 px-10 py-5 rounded-xl',
              'bg-white text-bg font-semibold text-lg',
              'transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20'
            )}
          >
            Get a Free Consultation
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}

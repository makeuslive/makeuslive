'use client'

import { memo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { ArrowRight } from '@/components/ui'
import { Tablist, Tab } from '@/components/ui/tablist'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Services data with enhanced styling and categories
const SERVICES = [
  {
    id: 'ai-products',
    category: 'ai-automation',
    number: '01',
    title: 'AI-Powered Products',
    subtitle: 'Intelligence at Scale',
    description: 'From intelligent agents to predictive analytics, we create AI systems that solve real business problems and drive measurable results.',
    features: ['Custom AI Models', 'Predictive Analytics', 'Intelligent Automation', 'LLM Integration'],
    stats: { metric: '10x', label: 'Faster Insights' },
    gradient: 'from-indigo-600/30 via-purple-600/20 to-transparent',
    iconGradient: 'from-indigo-500 to-purple-600',
    size: 'large',
  },
  {
    id: 'design-systems',
    category: 'ui-ux',
    number: '02',
    title: 'Design Systems',
    subtitle: 'Brands that Convert',
    description: 'Component libraries, design tokens, and Figma-to-code pipelines that grow with your product.',
    features: ['Component Libraries', 'Design Tokens', 'Brand Guidelines', 'Figma Integration'],
    stats: { metric: '100+', label: 'Components' },
    gradient: 'from-emerald-600/30 via-teal-600/20 to-transparent',
    iconGradient: 'from-emerald-500 to-teal-600',
    size: 'medium',
  },
  {
    id: 'web-development',
    category: 'dev',
    number: '03',
    title: 'Web Development',
    subtitle: 'Performance First',
    description: 'Modern, performant websites built with Next.js, React, and cutting-edge technologies.',
    features: ['Next.js / React', 'Headless CMS', 'E-commerce', 'SEO Optimization'],
    stats: { metric: '98+', label: 'Lighthouse Score' },
    gradient: 'from-blue-600/30 via-cyan-600/20 to-transparent',
    iconGradient: 'from-blue-500 to-cyan-600',
    size: 'medium',
  },
  {
    id: 'mobile-apps',
    category: 'dev',
    number: '04',
    title: 'Mobile Applications',
    subtitle: 'Native Experience',
    description: 'Cross-platform mobile apps that feel native and perform exceptionally on iOS and Android.',
    features: ['React Native', 'iOS & Android', 'Offline-First', 'Push Notifications'],
    stats: { metric: '4.9★', label: 'App Store' },
    gradient: 'from-orange-600/30 via-red-600/20 to-transparent',
    iconGradient: 'from-orange-500 to-red-600',
    size: 'medium',
  },
  {
    id: 'consulting',
    category: 'analytics',
    number: '05',
    title: 'Technical Consulting',
    subtitle: 'Expert Guidance',
    description: 'Architecture reviews, code audits, and strategic technical guidance from senior engineers.',
    features: ['Architecture Reviews', 'Code Audits', 'Tech Strategy', 'Team Training'],
    stats: { metric: '24/7', label: 'Support' },
    gradient: 'from-yellow-600/30 via-amber-600/20 to-transparent',
    iconGradient: 'from-yellow-500 to-amber-600',
    size: 'medium',
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'ui-ux', label: 'UI/UX' },
  { id: 'dev', label: 'Dev' },
  { id: 'ai-automation', label: 'AI/Automation' },
  { id: 'analytics', label: 'Analytics' },
]

// Process steps
const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discover',
    description: 'Deep dive into your business, goals, and challenges through workshops and research.',
    duration: '1-2 weeks',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Create stunning visuals and intuitive interfaces. Every pixel intentional.',
    duration: '2-4 weeks',
  },
  {
    number: '03',
    title: 'Develop',
    description: 'Build robust, scalable solutions with clean code, tested thoroughly.',
    duration: '4-8 weeks',
  },
  {
    number: '04',
    title: 'Deploy',
    description: 'Launch, monitor, and optimize based on real user feedback and data.',
    duration: 'Ongoing',
  },
]

// Service icons as SVG components
const ServiceIcon = ({ id }: { id: string }) => {
  const icons: Record<string, JSX.Element> = {
    'ai-products': (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    'design-systems': (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    'web-development': (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    'mobile-apps': (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    'consulting': (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  }
  return icons[id] || null
}

// Bento Service Card
const BentoServiceCard = memo(({ service }: { service: typeof SERVICES[0] }) => {
  const isLarge = service.size === 'large'

  return (
    <div
      className={cn(
        'service-card group relative rounded-3xl overflow-hidden',
        'border border-white/10 bg-[#0a0a0a]',
        'cursor-pointer transition-all duration-700 ease-out',
        'hover:border-white/20 hover:scale-[1.01]',
        isLarge ? 'md:col-span-2 min-h-[400px]' : 'min-h-[340px]'
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
          background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.06), transparent 40%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-between">
        {/* Top Row */}
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center',
            'bg-gradient-to-br text-white transition-all duration-500',
            'group-hover:scale-110 group-hover:shadow-lg',
            service.iconGradient
          )}>
            <ServiceIcon id={service.id} />
          </div>

          {/* Stats */}
          <div className="text-right">
            <span className={cn(
              'font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold',
              isLarge ? 'text-4xl' : 'text-3xl'
            )}>
              {service.stats.metric}
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
          {/* Number */}
          <span className="text-white/20 text-sm font-medium mb-2 block">{service.number}</span>

          {/* Title & Subtitle */}
          <h3 className={cn(
            'font-bold text-white mb-1 leading-tight',
            isLarge ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          )}>
            {service.title}
          </h3>
          <p className="text-gold/80 text-sm mb-3">{service.subtitle}</p>

          {/* Description */}
          <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-lg">
            {service.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {service.features.slice(0, isLarge ? 4 : 3).map((feature) => (
              <span
                key={feature}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-white/60 group-hover:border-gold/30 group-hover:text-gold/80 transition-colors duration-300"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/60 group-hover:text-gold transition-colors duration-300"
          >
            Get Started
            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/30 transition-all duration-300">
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Corner glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
    </div>
  )
})
BentoServiceCard.displayName = 'BentoServiceCard'

// Process Step Card
const ProcessStep = memo(({ step, index }: { step: typeof PROCESS_STEPS[0]; index: number }) => (
  <div className="process-step group relative">
    {/* Connector line */}
    {index < PROCESS_STEPS.length - 1 && (
      <div className="hidden lg:block absolute top-10 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-gold/30 to-transparent" />
    )}

    <div className={cn(
      'relative p-6 md:p-8 rounded-2xl',
      'bg-white/[0.02] border border-white/10',
      'transition-all duration-500 hover:border-gold/30 hover:bg-white/[0.04]'
    )}>
      {/* Step number */}
      <div className="w-12 h-12 mb-6 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-bg font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-500">
        {step.number}
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
      <p className="text-white/50 text-sm leading-relaxed mb-4">{step.description}</p>

      <span className="inline-flex px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-xs font-medium text-gold">
        {step.duration}
      </span>
    </div>
  </div>
))
ProcessStep.displayName = 'ProcessStep'

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

      // Service cards - individual triggers
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

      // Process steps
      document.querySelectorAll('.process-step').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
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
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />
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
          <div className="services-hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="text-sm font-medium text-white/70">What We Build</span>
          </div>

          {/* Title */}
          <h1 className="services-hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95]">
            <span className="text-white">Services that</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold">
              Scale
            </span>
          </h1>

          {/* Subtitle */}
          <p className="services-hero-subtitle text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            We design, build, and scale with AI at the core. From concept to launch,
            we craft digital experiences that captivate and convert.
          </p>
        </div>
      </section>

      {/* Services with Category Tabs */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Our Expertise</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              End-to-End Digital Solutions
            </h2>
          </div>

          {/* Category Tabs with Services */}
          <Tablist
            tabs={CATEGORIES.map((category) => ({
              id: category.id,
              label: category.label,
              content: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {SERVICES.filter(
                    (service) => category.id === 'all' || service.category === category.id
                  ).map((service) => (
                    <BentoServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ),
            }))}
            defaultTab="all"
            syncWithHash={true}
            onTabChange={(tabId) => {
              // Analytics tracking handled in Tablist component
            }}
          />
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">How We Work</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              A Proven Process
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              From discovery to deployment, our methodology ensures quality at every step.
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, index) => (
              <ProcessStep key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/20 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <svg className="w-12 h-12 mx-auto mb-6 text-gold/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="text-xl md:text-2xl text-white font-medium italic mb-6 leading-relaxed">
                &ldquo;Innovation distinguishes between a leader and a follower.&rdquo;
              </blockquote>
              <p className="text-gold/80">— Steve Jobs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Let&apos;s Build<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold">
              Something Great
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            Ready to transform your idea into reality? Let&apos;s discuss your project.
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
              Start a Project
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/works"
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
      </section>
    </div>
  )
}

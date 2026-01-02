'use client'

import { memo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { ArrowRight } from '@/components/ui'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Core principle component
const CorePrinciple = memo(
  ({ icon, title, description, index }: { icon: React.ReactNode; title: string; description: string; index: number }) => (
    <div className="core-principle group text-center md:text-left">
      <div className="w-14 h-14 mx-auto md:mx-0 mb-5 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-gold transition-all duration-500 group-hover:scale-110 group-hover:border-gold/40">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-text mb-2">{title}</h4>
      <p className="text-text-muted text-sm leading-relaxed">{description}</p>
    </div>
  )
)
CorePrinciple.displayName = 'CorePrinciple'

// Journey milestone component
const Milestone = memo(
  ({ year, title, description, isLast }: { year: string; title: string; description: string; isLast?: boolean }) => (
    <div className="milestone relative flex gap-6 pb-12 last:pb-0">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gradient-to-b from-gold/50 to-gold/10" />
      )}
      {/* Dot */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gold" />
        </div>
      </div>
      {/* Content */}
      <div className="pt-1">
        <span className="text-gold text-sm font-medium">{year}</span>
        <h4 className="text-xl font-semibold text-text mt-1 mb-2">{title}</h4>
        <p className="text-text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  )
)
Milestone.displayName = 'Milestone'

// Team member card
const TeamCard = memo(
  ({ name, role, initial, quote }: { name: string; role: string; initial: string; quote: string }) => (
    <div className="team-card group relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-gold/30 hover:bg-white/[0.04]">
      {/* Avatar */}
      <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center text-2xl font-bold text-bg shadow-lg group-hover:scale-105 transition-transform duration-500">
        {initial}
      </div>
      <h4 className="text-lg font-semibold text-text">{name}</h4>
      <p className="text-gold/80 text-sm mb-3">{role}</p>
      <p className="text-text-muted text-sm italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
    </div>
  )
)
TeamCard.displayName = 'TeamCard'

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const page = pageRef.current
    if (!page) return

    const ctx = gsap.context(() => {
      // Hero animations - no scroll trigger, plays immediately
      gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
      gsap.from('.hero-title', { y: 60, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
      gsap.from('.hero-subtitle', { y: 40, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' })
      gsap.from('.hero-philosophy', { y: 40, opacity: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' })
      gsap.from('.hero-visual', { scale: 0.8, opacity: 0, duration: 1.2, delay: 0.3, ease: 'power3.out' })

      // For scroll-triggered sections, use individual ScrollTriggers per element
      // This ensures each element animates when IT enters the viewport, not all at once

      const sections = [
        { selector: '.vision-section', y: 40 },
      ]

      sections.forEach(({ selector, y }) => {
        gsap.fromTo(selector,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: selector,
              start: 'top 90%',
              toggleActions: 'play none none none',
            }
          }
        )
      })

      // Vision pillars - animate each individually
      document.querySelectorAll('.vision-pillar').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 30, opacity: 0 },
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

      // Core principles - animate each individually
      document.querySelectorAll('.core-principle').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              toggleActions: 'play none none none',
            }
          }
        )
      })

      // Milestones - animate each individually
      document.querySelectorAll('.milestone').forEach((el, i) => {
        gsap.fromTo(el,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
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

      // Team cards - animate each individually
      document.querySelectorAll('.team-card').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
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

      // CTA section
      gsap.fromTo('.cta-section',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      )
    }, page)

    return () => ctx.revert()
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
            <div className="hero-badge inline-flex items-center gap-3 mb-8">
              <span className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold/80">
                About Us
              </span>
            </div>

            {/* Main heading with gradient */}
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.05]">
              <span className="text-white">We Are </span>
              <span className="bg-gradient-to-r from-white via-gold/90 to-gold bg-clip-text text-transparent">
                Make Us Live
              </span>
            </h1>

            {/* Subheading */}
            <p className="hero-subtitle text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mb-10">
              Make Us Live started as freelancers in 2023—grinding on SMM, building MVPs, and helping businesses
              find their digital footing. Now in 2025, we&apos;re a full-service creative studio tackling enterprise
              backends, AI systems, and brands that demand excellence.
            </p>

            {/* Philosophy Quote */}
            <div className="hero-philosophy relative pl-6 border-l-2 border-gold/40">
              <p className="text-white/80 italic text-lg mb-2">
                &ldquo;From freelancers to founders. We know the hustle because we lived it.&rdquo;
              </p>
              <p className="text-gold/80 text-sm">— Our Story</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section - The Four Pillars */}
      <section className="vision-section py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-6">
              Our Vision
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Four pillars that guide every decision we make, every product we build,
              and every relationship we nurture.
            </p>
          </div>

          {/* Four Pillars */}
          <div className="vision-pillars grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                number: '01',
                title: 'Design',
                description: 'We craft visual systems that communicate intent, evoke emotion, and create lasting impressions.',
                gradient: 'from-purple-500/20 to-indigo-600/20',
              },
              {
                number: '02',
                title: 'Think',
                description: 'Strategic thinking drives every pixel. We solve complex problems before writing a single line of code.',
                gradient: 'from-blue-500/20 to-cyan-600/20',
              },
              {
                number: '03',
                title: 'Build',
                description: 'Engineering excellence at the core. We build systems that scale, perform, and endure.',
                gradient: 'from-emerald-500/20 to-teal-600/20',
              },
              {
                number: '04',
                title: 'Automate',
                description: 'Intelligence amplified. We leverage AI and automation to create experiences that feel magical.',
                gradient: 'from-orange-500/20 to-red-600/20',
              },
            ].map((pillar, index) => (
              <div
                key={pillar.title}
                className={cn(
                  'vision-pillar relative p-8 rounded-3xl overflow-hidden',
                  'border border-white/10 bg-white/[0.02]',
                  'transition-all duration-500 hover:border-gold/30 hover:bg-white/[0.04]',
                  'group cursor-default'
                )}
              >
                {/* Background gradient */}
                <div className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                  `bg-gradient-to-br ${pillar.gradient}`
                )} />

                <div className="relative z-10">
                  <span className="text-gold/60 text-sm font-medium tracking-wider">{pillar.number}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-text mt-2 mb-4">{pillar.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="core-section py-20 md:py-32 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: Header */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
                At Our Core
              </h2>
              <p className="text-text-muted text-lg leading-relaxed mb-8">
                We&apos;re not just building products—we&apos;re building a better way to work.
                These principles define who we are and how we operate.
              </p>
              <div className="p-6 rounded-2xl bg-gold/5 border border-gold/20">
                <p className="text-text italic">
                  &ldquo;We believe the best solutions emerge when artistry meets engineering,
                  when intuition is validated by data, and when ambition is grounded in execution.&rdquo;
                </p>
              </div>
            </div>

            {/* Right: Principles Grid */}
            <div className="grid sm:grid-cols-2 gap-8">
              <CorePrinciple
                index={0}
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                }
                title="Curiosity First"
                description="We question assumptions, explore possibilities, and never settle for 'good enough.'"
              />
              <CorePrinciple
                index={1}
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }
                title="Obsessive Focus"
                description="We sweat the details others miss. Every interaction, every pixel, every millisecond matters."
              />
              <CorePrinciple
                index={2}
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                title="Collaboration"
                description="Our best work happens when diverse perspectives collide. Clients become partners."
              />
              <CorePrinciple
                index={3}
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                title="Bias for Action"
                description="We ship, learn, iterate. Speed and quality aren't mutually exclusive—they're mandatory."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="journey-section py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: Timeline */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-12">
                Our Path of Progress
              </h2>
              <div className="space-y-0">
                <Milestone
                  year="2023"
                  title="The Hustle Begins"
                  description="Started as freelancers, grinding on Social Media Marketing (SMM) and helping small businesses build their digital presence."
                />
                <Milestone
                  year="2023"
                  title="MVP Builders"
                  description="Transitioned to building MVPs for startups and businesses. Late nights, endless coffee, and relentless iteration—we helped ideas become real products."
                />
                <Milestone
                  year="2024"
                  title="Growing as a Team"
                  description="Started working as a proper team, building brands, crafting designs, and taking on enterprise-level backends, AI/ML solutions, and sales automations."
                />
                <Milestone
                  year="2025"
                  title="Agency Launch"
                  description="Officially launched Make Us Live as a full-service creative & technology studio. From freelancers to founders—ready to take it to another level."
                  isLast
                />
              </div>
            </div>

            {/* Right: Vision Statement */}
            <div className="lg:sticky lg:top-32">
              <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/20 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <p className="text-sm font-medium text-gold tracking-wider uppercase mb-4">Where We&apos;re Headed</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-text mb-6 leading-tight">
                    We built this from nothing. Now we&apos;re building it for you.
                  </h3>
                  <p className="text-text-muted leading-relaxed mb-8">
                    From late-night freelance gigs to enterprise AI systems—we&apos;ve done the work.
                    SEO, sales automations, ML models, stunning designs—we don&apos;t just talk,
                    we deliver. 2025 is our year to scale this properly.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {['A', 'R', 'V'].map((initial, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold/60 border-2 border-bg flex items-center justify-center text-sm font-bold text-bg"
                        >
                          {initial}
                        </div>
                      ))}
                    </div>
                    <p className="text-text-muted text-sm">The founding team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section py-20 md:py-32 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">The Founders</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-6">
              Meet the Makers
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Three builders united by a shared vision: to create technology that empowers and inspires.
            </p>
          </div>

          {/* Team Grid - 3 Founders */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <TeamCard
              name="Abhishek Jha"
              role="The Generalist"
              initial="A"
              quote="The best solutions emerge when you understand every layer—from business strategy to the last pixel."
            />
            <TeamCard
              name="Rishi Soni"
              role="Tech Master"
              initial="R"
              quote="Code is poetry. Apps should feel like magic—seamless, fast, and delightful."
            />
            <TeamCard
              name="Vikramaditya Jha"
              role="Strategy & Content"
              initial="V"
              quote="Markets move on stories. We craft narratives that resonate and strategies that scale."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-6">
            Ready to Build Something<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)' }}>
              Remarkable?
            </span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto mb-10">
            Whether you have a clear vision or just an idea, we&apos;d love to hear from you.
            Let&apos;s explore what we can create together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className={cn(
                'group inline-flex items-center gap-2 px-8 py-4 rounded-xl',
                'bg-gradient-to-r from-gold to-gold-dark text-bg font-semibold',
                'transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gold/20'
              )}
            >
              Start a Conversation
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/work"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-4 rounded-xl',
                'border border-white/20 text-text font-medium',
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

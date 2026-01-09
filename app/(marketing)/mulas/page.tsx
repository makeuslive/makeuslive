'use client'

import Link from 'next/link'
import { ArrowRight } from '@/components/ui'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

// Core services data
const CORE_SERVICES = [
    {
        id: 'systems',
        title: 'Systems & Automation',
        description: 'Sales workflows, CRM, WhatsApp automation, lead management, and internal tools.',
        features: ['Sales pipelines', 'CRM setup', 'WhatsApp automation', 'Internal dashboards'],
        href: '/custom-software',
    },
    {
        id: 'build',
        title: 'MVP & Custom Development',
        description: 'MVPs that validate ideas. Custom software that solves specific problems.',
        features: ['Rapid MVPs', 'Custom software', 'System extensions', 'Domain-specific tools'],
        href: '/mvp-development',
    },
]

// Supporting capabilities
const SUPPORTING = [
    { title: 'Web Apps', description: 'Dashboards, portals, admin panels', href: '/web-design' },
    { title: 'Mobile Apps', description: 'iOS and Android system interfaces', href: '/app-development' },
    { title: 'UI/UX Design', description: 'Workflow clarity and usability', href: '/ui-ux-design' },
]

// How it works steps
const HOW_IT_WORKS = [
    { step: 1, title: 'Understand', description: 'We learn your workflows, pain points, and goals.' },
    { step: 2, title: 'Design', description: 'We map systems and plan implementation.' },
    { step: 3, title: 'Build', description: 'We build, test, and deploy working systems.' },
    { step: 4, title: 'Evolve', description: 'We support, maintain, and expand as you grow.' },
]

export default function MulasPage() {
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const ctx = gsap.context(() => {
            // Enhanced hero animation with scale and rotation
            gsap.from('.hero-animate', {
                y: 80,
                opacity: 0,
                scale: 0.95,
                rotationX: 5,
                duration: 1,
                stagger: 0.12,
                ease: 'power4.out',
            })

            // Hero parallax - more pronounced upward movement with scale
            gsap.to('.hero-content', {
                y: -120,
                scale: 0.98,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            })

            // Background gradient parallax with enhanced movement
            gsap.to('.hero-gradient', {
                y: 150,
                opacity: 0,
                scale: 1.1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.8,
                },
            })

            // Section animations with enhanced parallax and scale
            gsap.utils.toArray('.section-animate').forEach((element: any, index) => {
                // Fade in animation
                gsap.from(element, {
                    y: 80,
                    opacity: 0,
                    scale: 0.96,
                    duration: 1,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse',
                    },
                })

                // Enhanced parallax with subtle rotation
                gsap.to(element, {
                    y: -50,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.2,
                    },
                })
            })

            // Core service cards - alternating parallax with scale and tilt
            gsap.utils.toArray('.service-card').forEach((card: any, index) => {
                const direction = index % 2 === 0 ? -40 : 40
                const rotation = index % 2 === 0 ? -1 : 1

                // Parallax movement
                gsap.to(card, {
                    y: direction,
                    rotationY: rotation,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5,
                    },
                })

                // Hover-like scale on scroll
                gsap.fromTo(card,
                    { scale: 0.98 },
                    {
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 80%',
                            end: 'top 50%',
                            scrub: 1,
                        },
                    }
                )
            })

            // Supporting cards - wave parallax with stagger and scale
            gsap.utils.toArray('.supporting-card').forEach((card: any, index) => {
                const yMovement = -25 * (index + 1)

                gsap.to(card, {
                    y: yMovement,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.supporting-section',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.3,
                    },
                })

                // Individual card scale animation
                gsap.fromTo(card,
                    { scale: 0.95, opacity: 0.8 },
                    {
                        scale: 1,
                        opacity: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            end: 'top 60%',
                            scrub: 1,
                        },
                    }
                )
            })

            // Process steps - enhanced wave with rotation and scale
            gsap.utils.toArray('.process-step').forEach((step: any, index) => {
                const yMovement = -15 * (4 - index)
                const rotation = (index - 1.5) * 2 // Creates subtle rotation wave

                gsap.to(step, {
                    y: yMovement,
                    rotationZ: rotation,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.process-section',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 0.8,
                    },
                })

                // Staggered fade-in with bounce
                gsap.from(step, {
                    scale: 0.8,
                    opacity: 0,
                    y: 40,
                    duration: 0.8,
                    ease: 'back.out(1.4)',
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                    delay: index * 0.1,
                })
            })

            // Final CTA - enhanced parallax with scale
            gsap.to('.final-cta', {
                y: -60,
                scale: 1.02,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.final-cta-section',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.3,
                },
            })

            // CTA button pulse animation
            gsap.from('.cta-button', {
                scale: 0.9,
                opacity: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.6)',
                scrollTrigger: {
                    trigger: '.cta-button',
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                },
            })
        }, section)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={sectionRef} className="min-h-screen">
            {/* Hero Section */}
            <section className="hero-section relative pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden">
                {/* Background gradient */}
                <div className="hero-gradient absolute inset-0 bg-gradient-to-b from-gold/[0.03] via-transparent to-transparent pointer-events-none" />

                <div className="hero-content max-w-7xl mx-auto px-6 md:px-8">
                    <div className="max-w-4xl">
                        {/* Badge */}
                        <div className="hero-animate inline-flex items-center gap-3 mb-8">
                            <span className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold/80">
                                Enterprise Platform
                            </span>
                        </div>

                        {/* Main heading */}
                        <h1 className="hero-animate text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.05]">
                            <span className="text-white">What is </span>
                            <span className="bg-gradient-to-r from-white via-gold/90 to-gold bg-clip-text text-transparent">
                                MULAS
                            </span>
                            <span className="text-white">?</span>
                        </h1>

                        {/* Description */}
                        <p className="hero-animate text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mb-6">
                            MULAS is an enterprise operating system. It's how we build, implement, and support internal systems for businesses.
                        </p>

                        <p className="hero-animate text-base md:text-lg text-white/40 leading-relaxed max-w-2xl mb-10">
                            Instead of fragmented tools, MULAS provides one coherent layer: sales automation, CRM, internal tools, custom software—all built with domain expertise and real support.
                        </p>

                        {/* CTAs */}
                        <div className="hero-animate flex flex-wrap gap-4">
                            <Link
                                href="/contact"
                                className={cn(
                                    'group inline-flex items-center gap-3 px-8 py-4 rounded-xl',
                                    'bg-gradient-to-r from-gold to-gold-dark text-bg font-semibold',
                                    'transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gold/20'
                                )}
                            >
                                Talk to Us
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/services"
                                className={cn(
                                    'inline-flex items-center gap-3 px-8 py-4 rounded-xl',
                                    'border border-white/20 text-white font-medium',
                                    'transition-all duration-300 hover:border-gold/40 hover:bg-white/5'
                                )}
                            >
                                See All Services
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Services Section */}
            <section className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    {/* Section Header */}
                    <div className="section-animate text-center mb-16">
                        <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Core Services</p>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Two Ways to Start
                        </h2>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
                            Some teams start with systems. Some start with custom builds. Both paths lead to long-term MULAS systems.
                        </p>
                    </div>

                    {/* Core Services Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {CORE_SERVICES.map((service) => (
                            <div
                                key={service.id}
                                className="service-card section-animate group relative p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-gold/30 transition-all duration-300"
                            >
                                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                                <p className="text-white/50 mb-6">{service.description}</p>

                                <ul className="space-y-3 mb-8">
                                    {service.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-white/70">
                                            <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center">
                                                <Check size={12} className="text-gold" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={service.href}
                                    className="inline-flex items-center gap-2 text-gold font-medium group-hover:gap-3 transition-all"
                                >
                                    Learn more <ArrowRight size={16} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supporting Capabilities */}
            <section className="supporting-section py-20 md:py-32 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="section-animate text-center mb-12">
                        <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Supporting Capabilities</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            System Surfaces
                        </h2>
                        <p className="text-white/50 max-w-xl mx-auto">
                            Web, mobile, and design that serve your systems—not the other way around.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {SUPPORTING.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="supporting-card section-animate group p-6 rounded-xl border border-white/10 hover:border-gold/30 bg-white/[0.02] transition-all duration-300"
                            >
                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gold transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-white/50 text-sm">{item.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="process-section py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="section-animate text-center mb-16">
                        <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Process</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            How It Works
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {HOW_IT_WORKS.map((step) => (
                            <div key={step.step} className="process-step section-animate text-center">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                                    <span className="text-gold font-bold">{step.step}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                                <p className="text-white/50 text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta-section py-20 md:py-32">
                <div className="final-cta max-w-3xl mx-auto px-6 md:px-8 text-center">
                    <h2 className="section-animate text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Build Your System?
                    </h2>
                    <p className="section-animate text-white/50 text-lg mb-10 max-w-xl mx-auto">
                        Tell us what you're trying to build or fix. We'll respond with honest feedback.
                    </p>
                    <Link
                        href="/contact"
                        className={cn(
                            'cta-button section-animate group inline-flex items-center gap-3 px-10 py-5 rounded-xl',
                            'bg-gradient-to-r from-gold to-gold-dark text-bg font-semibold text-lg',
                            'transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gold/20'
                        )}
                    >
                        Talk to Us
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="section-animate text-white/30 text-sm mt-6">
                        No commitment · We'll get back within 24 hours
                    </p>
                </div>
            </section>
        </div>
    )
}

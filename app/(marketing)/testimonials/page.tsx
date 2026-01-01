'use client'

import { memo, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { ArrowRight } from '@/components/ui'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

interface Testimonial {
    id: string
    quote: string
    author: string
    role: string
    company: string
    industry: string
    rating: number
    avatar?: string
    featured?: boolean
}

// Fallback testimonials data
const TESTIMONIALS: Testimonial[] = [
    {
        id: 'testimonial-1',
        quote: 'MakeUsLive transformed our digital presence completely. Their attention to detail and innovative approach exceeded our expectations. The team delivered on time and the results speak for themselves.',
        author: 'Sarah Chen',
        role: 'CEO',
        company: 'TechStart Inc.',
        industry: 'SaaS',
        rating: 5,
        featured: true,
    },
    {
        id: 'testimonial-2',
        quote: 'Working with MakeUsLive was a game-changer for our startup. They delivered a product that truly represents our brand vision and helped us scale from 0 to 50K users in 6 months.',
        author: 'Michael Torres',
        role: 'Founder',
        company: 'Bloom Studio',
        industry: 'E-commerce',
        rating: 5,
        featured: true,
    },
    {
        id: 'testimonial-3',
        quote: "The team's expertise in AI integration helped us automate processes we thought were impossible. Our customer service efficiency improved by 340% within the first quarter.",
        author: 'Emily Watson',
        role: 'CTO',
        company: 'DataFlow',
        industry: 'Fintech',
        rating: 5,
        featured: true,
    },
    {
        id: 'testimonial-4',
        quote: 'Exceptional quality and professionalism. They understood our vision from day one and executed it flawlessly. Highly recommend for any serious project.',
        author: 'David Park',
        role: 'Product Lead',
        company: 'InnovateCo',
        industry: 'Healthcare',
        rating: 5,
    },
    {
        id: 'testimonial-5',
        quote: "The design system they built for us has saved countless hours and maintained consistency across all our products. It's become the foundation of everything we build.",
        author: 'Lisa Johnson',
        role: 'Design Director',
        company: 'Scale Labs',
        industry: 'Technology',
        rating: 5,
    },
    {
        id: 'testimonial-6',
        quote: 'From initial concept to final deployment, the Make Us Live team showed exceptional technical prowess and creative problem-solving. Our mobile app now has a 4.8 star rating.',
        author: 'Raj Patel',
        role: 'Co-founder',
        company: 'HealthTech Solutions',
        industry: 'Healthcare',
        rating: 5,
    },
]

// Testimonial Card Component
const TestimonialCard = memo(({ testimonial, index }: { testimonial: Testimonial; index: number }) => (
    <div
        className={cn(
            'testimonial-card group relative p-6 md:p-8 rounded-3xl overflow-hidden',
            'border border-white/10 bg-white/[0.02] backdrop-blur-sm',
            'transition-all duration-500 hover:border-gold/30 hover:bg-white/[0.04]',
            testimonial.featured && 'md:col-span-2'
        )}
    >
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>

            {/* Quote */}
            <blockquote className="text-text text-lg md:text-xl leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center text-lg font-bold text-bg">
                    {testimonial.author[0]}
                </div>
                <div>
                    <p className="font-semibold text-text">{testimonial.author}</p>
                    <p className="text-text-muted text-sm">
                        {testimonial.role}, {testimonial.company}
                    </p>
                </div>
                {/* Industry Badge */}
                <span className="ml-auto px-3 py-1 text-xs rounded-full bg-white/10 text-text-muted border border-white/10">
                    {testimonial.industry}
                </span>
            </div>
        </div>
    </div>
))
TestimonialCard.displayName = 'TestimonialCard'

// Stats component
const stats = [
    { value: '50+', label: 'Projects Delivered' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '4.9', label: 'Average Rating' },
    { value: '100%', label: 'On-Time Delivery' },
]

export default function TestimonialsPage() {
    const pageRef = useRef<HTMLDivElement>(null)
    const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS)

    useEffect(() => {
        // Could fetch testimonials from API here
        // For now using fallback data
    }, [])

    useEffect(() => {
        const page = pageRef.current
        if (!page) return

        const ctx = gsap.context(() => {
            // Hero animations
            gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
            gsap.from('.hero-title', { y: 60, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
            gsap.from('.hero-subtitle', { y: 40, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' })

            // Stats
            document.querySelectorAll('.stat-item').forEach((el, i) => {
                gsap.fromTo(el,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        delay: 0.6 + i * 0.1,
                        ease: 'power3.out',
                    }
                )
            })

            // Testimonial cards
            document.querySelectorAll('.testimonial-card').forEach((el, i) => {
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
                            start: 'top 90%',
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
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Badge */}
                    <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                        <span className="text-sm font-medium text-text-muted tracking-wide">Client Stories</span>
                    </div>

                    {/* Title */}
                    <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text leading-[1.05] mb-6 max-w-4xl">
                        What Our{' '}
                        <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)' }}>
                            Clients Say
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="hero-subtitle text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl mb-12">
                        Don&apos;t just take our word for it. Hear from the founders, CTOs, and product leaders
                        who trusted us to bring their vision to life.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={stat.label} className="stat-item text-center md:text-left">
                                <p className="text-3xl md:text-4xl font-bold text-gold mb-1">{stat.value}</p>
                                <p className="text-text-muted text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-20 md:py-32">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-6">
                        Ready to Join Our{' '}
                        <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)' }}>
                            Success Stories?
                        </span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-xl mx-auto mb-10">
                        Let&apos;s discuss how we can help bring your vision to life with the same
                        dedication and excellence our clients have come to expect.
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
                            Start Your Project
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

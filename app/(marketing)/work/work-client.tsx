'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button, TechIcon } from '@/components/ui'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Work } from '@/lib/data/work'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const CATEGORIES = ['All', 'Enterprise Platform', 'Mobile Safety', 'Production Mobile App', 'AI & Automation', 'E-Commerce', 'Healthcare Tech']

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
    return (
        <span className="tabular-nums font-bold">
            {value}{suffix}
        </span>
    )
}

// Premium work card component
function WorkCard({ work, index, isFeatured = false }: { work: Work; index: number; isFeatured?: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null)

    return (
        <div
            ref={cardRef}
            className={cn(
                'work-card group relative block overflow-hidden',
                'rounded-[2rem] md:rounded-[2.5rem]',
                'bg-[#0a0a0a] border border-white/[0.08]',
                'transition-all duration-700 ease-out',
                'hover:border-white/20 hover:shadow-2xl hover:shadow-white/[0.03]',
                'hover:-translate-y-1',
                isFeatured ? 'md:col-span-2 md:row-span-2' : ''
            )}
        >
            {/* Gradient overlay on hover */}
            <div className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700',
                'bg-gradient-to-br',
                work.gradient || 'from-gold/10 to-transparent'
            )} />

            {/* Top accent line */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative p-8 md:p-10 h-full flex flex-col min-h-[380px]">
                {/* Header row */}
                <div className="flex items-start justify-between mb-6">
                    <span className={cn(
                        'inline-flex items-center gap-2 px-4 py-1.5',
                        'text-[11px] font-semibold uppercase tracking-[0.2em]',
                        'bg-white/[0.05] backdrop-blur-sm rounded-full',
                        'text-white/60 border border-white/[0.08]',
                        'group-hover:bg-white/[0.08] group-hover:text-white/80',
                        'transition-all duration-500'
                    )}>
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        {work.category}
                    </span>

                    {work.year && (
                        <span className="text-[11px] font-mono text-white/30 tracking-wider">
                            {work.year}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className={cn(
                    'font-bold text-white mb-4 leading-[1.15]',
                    'group-hover:text-white transition-colors duration-300',
                    isFeatured ? 'text-3xl md:text-4xl' : 'text-2xl md:text-[1.75rem]'
                )}>
                    {work.title}
                </h3>

                {/* Description */}
                <p className={cn(
                    'text-white/50 leading-relaxed mb-8 flex-grow',
                    'group-hover:text-white/70 transition-colors duration-500',
                    isFeatured ? 'text-base md:text-lg' : 'text-[15px]',
                    'line-clamp-3'
                )}>
                    {work.description}
                </p>

                {/* Stats highlight */}
                {work.stats && (
                    <div className={cn(
                        'mb-8 p-5 rounded-2xl',
                        'bg-white/[0.03] border border-white/[0.06]',
                        'group-hover:bg-white/[0.05] group-hover:border-white/[0.1]',
                        'transition-all duration-500'
                    )}>
                        <div className={cn(
                            'text-gold mb-1',
                            isFeatured ? 'text-4xl md:text-5xl' : 'text-3xl'
                        )}>
                            <AnimatedCounter value={work.stats.metric} />
                        </div>
                        <div className="text-[11px] text-white/40 uppercase tracking-[0.15em] font-medium">
                            {work.stats.label}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {work.tags && work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {work.tags.slice(0, 4).map((tag, idx) => (
                            <span
                                key={idx}
                                className={cn(
                                    'px-3 py-1.5 text-[11px] font-medium',
                                    'bg-white/[0.04] rounded-lg',
                                    'text-white/50 border border-white/[0.06]',
                                    'group-hover:bg-white/[0.06] group-hover:text-white/70',
                                    'transition-all duration-300',
                                    'flex items-center gap-1.5'
                                )}
                            >
                                <TechIcon name={tag} size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                {tag}
                            </span>
                        ))}
                        {work.tags.length > 4 && (
                            <span className={cn(
                                'px-3 py-1.5 text-[11px] font-medium',
                                'bg-gold/10 rounded-lg',
                                'text-gold/80 border border-gold/20'
                            )}>
                                +{work.tags.length - 4}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Decorative corner accent */}
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className={cn(
                    'absolute bottom-0 right-0 w-full h-full',
                    'bg-gradient-to-tl from-gold/5 to-transparent',
                    'rounded-tl-[3rem]'
                )} />
            </div>
        </div>
    )
}

export default function WorkClient({ initialWorks }: { initialWorks: Work[] }) {
    const works = initialWorks
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const sectionRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)

    // Filter works by category
    const filteredWorks = useMemo(() => {
        if (selectedCategory === 'All') return works
        return works.filter(work => work.category === selectedCategory)
    }, [works, selectedCategory])

    // GSAP animations
    useEffect(() => {
        if (!sectionRef.current) return

        const ctx = gsap.context(() => {
            // Animate header
            if (headerRef.current) {
                gsap.fromTo(
                    headerRef.current.children,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'power3.out',
                    }
                )
            }

            // Animate cards with stagger
            const cards = sectionRef.current?.querySelectorAll('.work-card')
            cards?.forEach((card: Element, index: number) => {
                gsap.fromTo(
                    card,
                    { y: 60, opacity: 0, scale: 0.98 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.7,
                        delay: 0.2 + index * 0.08,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 90%',
                            toggleActions: 'play none none none',
                        },
                    }
                )
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [filteredWorks])

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Hero Section */}
            <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.02] via-transparent to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div ref={headerRef} className="max-w-4xl">
                        {/* Eyebrow */}
                        <div className="inline-flex items-center gap-3 mb-8">
                            <span className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold/80">
                                Portfolio
                            </span>
                        </div>

                        {/* Main heading with gradient */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.05]">
                            <span className="text-white">Our </span>
                            <span className="bg-gradient-to-r from-white via-gold/90 to-gold bg-clip-text text-transparent">
                                Work
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl">
                            Explore Make Us Live's portfolio of successful projects.
                            Each project reflects our commitment to excellence and innovation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters */}
            {works.length > 0 && (
                <section className="relative z-10 border-b border-white/[0.06]">
                    <div className="max-w-7xl mx-auto px-6 md:px-8">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-6 -mx-6 px-6 md:mx-0 md:px-0">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={cn(
                                        'px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap',
                                        'transition-all duration-300',
                                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50',
                                        selectedCategory === category
                                            ? 'bg-white text-[#050505] shadow-lg shadow-white/10'
                                            : 'bg-white/[0.04] text-white/60 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white/80'
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Works Grid */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    {filteredWorks.length > 0 ? (
                        <div
                            ref={sectionRef}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                        >
                            {filteredWorks.map((work, index) => (
                                <WorkCard
                                    key={work.id}
                                    work={work}
                                    index={index}
                                    isFeatured={index === 0 && selectedCategory === 'All'}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                                <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">No works found</h3>
                            <p className="text-white/50 mb-8 max-w-md mx-auto">
                                We don't have any works in this category yet.
                            </p>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="px-6 py-3 rounded-full bg-white text-[#050505] font-medium hover:bg-white/90 transition-colors"
                            >
                                View All Works
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            {filteredWorks.length > 0 && (
                <section className="py-20 md:py-32">
                    <div className="max-w-7xl mx-auto px-6 md:px-8">
                        <div className={cn(
                            'relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem]',
                            'bg-gradient-to-br from-white/[0.03] to-transparent',
                            'border border-white/[0.08]',
                            'p-12 md:p-16 lg:p-20'
                        )}>
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gold/10 to-transparent rounded-full blur-3xl opacity-50" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gold/5 to-transparent rounded-full blur-2xl" />

                            <div className="relative z-10 max-w-2xl mx-auto text-center">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                    Ready to Start Your Project?
                                </h2>
                                <p className="text-lg text-white/50 mb-10 leading-relaxed">
                                    Let Make Us Live bring your vision to life.
                                    Get in touch and let's discuss how we can help.
                                </p>
                                <Link href="/contact">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="text-base px-10 py-4 rounded-full"
                                    >
                                        Start Your Project
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

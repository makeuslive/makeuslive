'use client'

import { memo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { ArrowRight, TechIcon } from '@/components/ui'
import type { Service } from '@/lib/data/services'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

// Service Card Component
const ServiceCard = memo(({ service }: { service: Service }) => {
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

export default function ServicesClient({ services }: { services: Service[] }) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const ctx = gsap.context(() => {
            // Service cards
            const cards = container.querySelectorAll('.service-card')
            cards.forEach((el, i) => {
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
        }, container)
        // If I want to animate hero elements, I should probably NOT scope to containerRef if they are outside.
        // Or, move Hero into this component? No, we want Hero text to be server rendered.
        // I will use `document` context or just not scope to `container` for the hero parts?
        // Actually, `gsap.from('.services-hero-badge')` will search document if not scoped.
        // But `gsap.context(..., container)` scopes selectors to container.
        // So if Hero is outside, it won't find it.
        // I will modify the context to NOT supply scope for the Hero parts, or just let the Client Component WRAP the hero as well?
        // Wrapping the whole page in Client Component defeats the purpose of "Server Component".
        // Better approach: Use a separate `HeroAnimations` client component, OR just let `ServicesClient` handle the cards, and maybe a small script for Hero?
        // Or, just accept that Hero is static (or simple CSS animation) and Cards are GSAP.
        // The original code had complex GSAP.
        // I'll try to target `document.body` or just not scope the Hero parts.

        // Mouse tracking for glow effect
        const handleMouseMove = (e: MouseEvent) => {
            const cards = container.querySelectorAll('.service-card')
            cards.forEach((card) => {
                const rect = (card as HTMLElement).getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width) * 100
                const y = ((e.clientY - rect.top) / rect.height) * 100
                    ; (card as HTMLElement).style.setProperty('--mouse-x', `${x}%`)
                    ; (card as HTMLElement).style.setProperty('--mouse-y', `${y}%`)
            })
        }
        // Listen on window or container? Original was page.
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            ctx.revert()
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
            ))}
        </div>
    )
}

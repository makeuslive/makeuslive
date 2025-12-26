'use client'

import { memo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { COPY } from '@/lib/constants'
import { Button, ArrowRight } from '@/components/ui'
import { GlobalGreeting } from './global-greeting'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface HeroProps {
  className?: string
}

export const Hero = memo<HeroProps>(({ className }) => {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      // Tagline fade up (after greeting starts)
      gsap.from('.hero-tagline', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 1.2,
        ease: 'power3.out',
      })

      // CTA fade up
      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 1.6,
        ease: 'power3.out',
      })

      // Background parallax on scroll
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Greeting parallax on scroll
      gsap.to('.hero-greeting-wrapper', {
        yPercent: 40,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })

      // Scroll indicator fade out
      gsap.to('.scroll-indicator', {
        opacity: 0,
        y: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '20% top',
          scrub: true,
        },
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative min-h-screen overflow-hidden',
        'flex items-center justify-center',
        'will-change-transform',
        className
      )}
    >
      {/* Background with Video */}
      <div className="hero-bg absolute inset-0 -z-10 bg-bg">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full opacity-50"
        >
          <source src="/images/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-bg/80" />

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
        {/* Global Greeting (replaces static नमस्ते) */}
        <div className="hero-greeting-wrapper">
          <GlobalGreeting className="mb-8" />
        </div>

        {/* Tagline */}
        <p
          className={cn(
            'hero-tagline',
            'text-xl md:text-2xl lg:text-3xl',
            'font-bold italic text-text-muted',
            'max-w-3xl mx-auto mb-10',
            'drop-shadow-lg'
          )}
        >
          {COPY.hero.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            rightIcon={
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={20}
              />
            }
            className="group"
          >
            {COPY.hero.cta}
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-text-dim">
          <span className="text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-text-dim/50 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-gold rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
})

Hero.displayName = 'Hero'

'use client'

import { memo, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { COPY } from '@/lib/constants'
import { QuoteIcon } from '@/components/ui'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface TestimonialsProps {
  className?: string
}

// Star rating component
const StarRating = memo(({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={cn(
          'w-4 h-4',
          i < rating ? 'text-gold fill-gold' : 'text-text-dim/30'
        )}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
))
StarRating.displayName = 'StarRating'

// Testimonial Card Component
const TestimonialCard = memo(({ testimonial }: { testimonial: (typeof COPY.testimonials.items)[number] }) => (
  <div
    className={cn(
      'testimonial-card flex-shrink-0',
      'w-[380px] md:w-[420px]',
      'rounded-2xl p-6 md:p-8',
      'bg-card-light',
      'border border-white/10',
      'shadow-card',
      'select-none'
    )}
  >
    {/* Industry Tag + Rating */}
    <div className="flex items-center justify-between mb-4">
      <span className="inline-flex px-3 py-1 rounded-full bg-bg/10 text-xs font-medium text-bg/70">
        {testimonial.industry}
      </span>
      {'rating' in testimonial && (
        <StarRating rating={testimonial.rating} />
      )}
    </div>

    {/* Quote Icon */}
    <QuoteIcon size={28} className="text-gold/40 mb-4" />

    {/* Quote */}
    <blockquote className="text-bg/80 mb-6 leading-relaxed text-sm md:text-base line-clamp-4">
      &ldquo;{testimonial.quote}&rdquo;
    </blockquote>

    {/* Author */}
    <div className="flex items-center gap-3 pt-4 border-t border-bg/10">
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-bg font-bold text-base shadow-lg">
        {testimonial.author.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-bg text-sm">
          {testimonial.author}
        </p>
        <p className="text-bg/60 text-xs">{testimonial.role}</p>
      </div>
    </div>
  </div>
))
TestimonialCard.displayName = 'TestimonialCard'

export const Testimonials = memo<TestimonialsProps>(({ className }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from('.testimonials-header', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      })

      // Marquee fade in
      gsap.from('.testimonials-marquee', {
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.testimonials-marquee',
          start: 'top 85%',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  // Double the items for seamless infinite scroll
  const testimonialItems = COPY.testimonials.items
  const duplicatedItems = [...testimonialItems, ...testimonialItems]

  return (
    <section
      ref={sectionRef}
      className={cn('section relative overflow-hidden', className)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="testimonials-header text-center mb-12 md:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-medium text-gold">
              {COPY.testimonials.badge}
            </span>
          </div>

          <h2 className="section-heading text-text">
            {COPY.testimonials.heading}
          </h2>
        </div>
      </div>

      {/* Horizontal Infinite Scroll Marquee - Full Width */}
      <div
        ref={marqueeRef}
        className="testimonials-marquee relative w-full overflow-hidden py-4"
      >
        {/* Gradient Masks for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        {/* Scrolling Container */}
        <div className="marquee-track flex gap-6 animate-marquee hover:[animation-play-state:paused]">
          {duplicatedItems.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.id}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  )
})

Testimonials.displayName = 'Testimonials'

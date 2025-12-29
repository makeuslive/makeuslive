'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { COPY } from '@/lib/constants'
import { QuoteIcon } from '@/components/ui'
import { TestimonialItem } from '@/types'

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

const TestimonialCard = memo(({ testimonial }: { testimonial: TestimonialItem }) => (
  <div
    className={cn(
      'testimonial-card flex-shrink-0',
      'w-[72vw] max-w-[260px] sm:w-[300px] md:w-[360px]',
      'rounded-2xl',
      'bg-card-light',
      'border border-white/10',
      'shadow-lg',
      'select-none',
      'overflow-hidden'
    )}
  >
    {/* Top gradient accent */}
    <div className="h-1 bg-gradient-to-r from-gold via-gold-dark to-gold/50" />

    <div className="p-3.5 sm:p-5">
      {/* Quote Icon + Rating Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
          <QuoteIcon size={20} className="text-gold" />
        </div>
        {'rating' in testimonial && (
          <StarRating rating={testimonial.rating} />
        )}
      </div>

      {/* Quote - compact for mobile */}
      <blockquote className="text-bg/85 mb-3 sm:mb-5 leading-snug sm:leading-relaxed text-xs sm:text-sm font-medium line-clamp-3 sm:line-clamp-4">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author section - compact */}
      <div className="flex items-center gap-2 sm:gap-3 pt-2.5 sm:pt-4 border-t border-bg/10">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-bg font-bold text-xs sm:text-sm shadow-md flex-shrink-0">
          {testimonial.author.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-bg text-[11px] sm:text-sm truncate">
            {testimonial.author}
          </p>
          <p className="text-bg/60 text-[9px] sm:text-xs truncate">{testimonial.role}</p>
        </div>
      </div>
    </div>
  </div>
))
TestimonialCard.displayName = 'TestimonialCard'

export const Testimonials = memo<TestimonialsProps>(({ className }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<TestimonialItem[]>(COPY.testimonials.items as unknown as TestimonialItem[]) // Fallback

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials')
        const data = await res.json()
        if (data.success && data.data && data.data.length > 0) {
          setItems(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error)
      }
    }
    fetchTestimonials()
  }, [])

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
  const duplicatedItems = [...items, ...items]

  return (
    <section
      ref={sectionRef}
      className={cn('section relative overflow-hidden py-24 md:py-32', className)}
    >
      {/* Background decoration - smaller on mobile */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-gold/5 rounded-full blur-2xl md:blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-32 md:w-64 h-32 md:h-64 bg-gold/3 rounded-full blur-2xl md:blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="testimonials-header text-center mb-12 md:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="text-sm font-semibold text-white/70 tracking-wide">
              {COPY.testimonials.badge}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[1.1]">
            {COPY.testimonials.heading}
          </h2>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
            What our clients say about working with us
          </p>
        </div>
      </div>

      {/* Horizontal Scroll - Touch scrollable on mobile, auto-animate on desktop */}
      <div
        ref={marqueeRef}
        className="testimonials-marquee relative w-full overflow-x-auto md:overflow-hidden py-4 no-scrollbar"
      >
        {/* Gradient Masks - sticky so they stay fixed during scroll */}
        <div className="sticky left-0 top-0 bottom-0 w-12 sm:w-20 md:w-40 bg-gradient-to-r from-bg via-bg/80 to-transparent z-10 pointer-events-none h-full float-left -mr-12 sm:-mr-20 md:-mr-40" />
        <div className="sticky right-0 top-0 bottom-0 w-12 sm:w-20 md:w-40 bg-gradient-to-l from-bg via-bg/80 to-transparent z-10 pointer-events-none h-full float-right -ml-12 sm:-ml-20 md:-ml-40" />

        {/* Scrolling Container - manual scroll on mobile, auto-animate on desktop */}
        <div className="marquee-track flex gap-4 md:gap-6 md:animate-marquee md:hover:[animation-play-state:paused] px-4 md:px-0">
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

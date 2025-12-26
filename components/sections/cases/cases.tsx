'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { COPY } from '@/lib/constants'
import { ArrowRight } from '@/components/ui'
import { CaseItem } from '@/types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface CasesProps {
  className?: string
}

export const Cases = memo<CasesProps>(({ className }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  const [works, setWorks] = useState<CaseItem[]>(COPY.cases.items as unknown as CaseItem[]) // Default to static, replace with API
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await fetch('/api/works')
        const data = await res.json()
        if (data.success && data.data && data.data.length > 0) {
          setWorks(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch works:', error)
      } finally {
        setLoading(false)
      }
    }

    // Seed and fetch
    fetch('/api/seed').then(() => fetchWorks())
  }, [])

  // Duplicate items for infinite scroll effect (ensure we have enough items)
  const itemsToDisplay = works.length > 0 ? works : COPY.cases.items
  const duplicatedItems = [...itemsToDisplay, ...itemsToDisplay]

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from('.cases-header', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      })

      // Infinite horizontal scroll animation
      const cards = gsap.utils.toArray('.case-card')
      const totalWidth = track.scrollWidth / 2 // Half because we duplicated

      animationRef.current = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        duration: 60, // 60 seconds for full cycle
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => {
            return parseFloat(x) % totalWidth
          }),
        },
      })

      // Parallax effect on scroll
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.to('.case-card', {
            rotateY: self.progress * 5 - 2.5,
            duration: 0.3,
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  // Pause/Resume on hover
  useEffect(() => {
    if (animationRef.current) {
      if (isPaused) {
        animationRef.current.pause()
      } else {
        animationRef.current.play()
      }
    }
  }, [isPaused])

  return (
    <section
      ref={sectionRef}
      id="works"
      className={cn('section relative overflow-hidden', className)}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="cases-header text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-medium text-gold">
              {COPY.cases.badge}
            </span>
          </div>

          <h2 className="section-heading text-text mb-4">
            {COPY.cases.heading}
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
            {COPY.cases.subheading}
          </p>
        </div>
      </div>

      {/* Infinite Scroll Track */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient masks for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div
          ref={trackRef}
          className="flex gap-6 py-4"
          style={{ width: 'fit-content' }}
        >
          {duplicatedItems.map((caseItem, index) => (
            <div
              key={`${caseItem.id}-${index}`}
              className={cn(
                'case-card group relative flex-shrink-0',
                'w-[350px] md:w-[400px] h-[280px] md:h-[320px]',
                'rounded-2xl overflow-hidden',
                'bg-card border border-border/20',
                'cursor-pointer transition-all duration-500 ease-out-expo',
                'hover:border-gold/30 hover:scale-[1.02]',
                'will-change-transform'
              )}
              style={{ perspective: '1000px' }}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-bg-dark" />

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/10 to-transparent" />

              {/* Content */}
              <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  {/* Category tag */}
                  <span className="inline-flex px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-text-muted">
                    {caseItem.category}
                  </span>

                  {/* Stats badge */}
                  {'stats' in caseItem && caseItem.stats && (
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gold">
                        {caseItem.stats.metric}
                      </span>
                      <span className="block text-xs text-text-dim">
                        {caseItem.stats.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom row */}
                <div>
                  {/* Tags */}
                  {'tags' in caseItem && caseItem.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {caseItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-gold/10 text-xs text-gold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title + Arrow */}
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-xl text-text mb-1">
                        {caseItem.title}
                      </h3>
                      {'description' in caseItem && (
                        <p className="text-sm text-text-muted line-clamp-2">
                          {caseItem.description}
                        </p>
                      )}
                    </div>

                    {/* Arrow CTA */}
                    <div className="flex-shrink-0 p-3 rounded-full bg-white/5 group-hover:bg-gold group-hover:text-bg transition-all duration-300 transform group-hover:scale-110">
                      <ArrowRight
                        size={20}
                        className="group-hover:-rotate-45 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* View All CTA */}
      <div className="text-center mt-12">
        <a
          href="/works"
          className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors font-medium group"
        >
          View All Projects
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </a>
      </div>
    </section>
  )
})

Cases.displayName = 'Cases'

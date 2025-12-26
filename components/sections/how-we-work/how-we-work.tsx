'use client'

import { memo, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { COPY } from '@/lib/constants'
import { Icon } from '@/components/ui'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface HowWeWorkProps {
  className?: string
}

export const HowWeWork = memo<HowWeWorkProps>(({ className }) => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from('.process-header', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      })

      // Steps stagger animation
      const steps = gsap.utils.toArray('.process-step')
      steps.forEach((step, index) => {
        const element = step as HTMLElement
        
        gsap.from(element, {
          x: index % 2 === 0 ? -60 : 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
          },
        })

        // Number counter animation
        const numberEl = element.querySelector('.step-number')
        if (numberEl) {
          gsap.from(numberEl, {
            innerText: 0,
            duration: 1.5,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
            },
          })
        }
      })

      // Connecting line animation
      gsap.from('.process-line', {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.process-steps',
          start: 'top 70%',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={cn('section relative bg-gradient-section', className)}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="process-header text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-medium text-gold">{COPY.howWeWork.badge}</span>
          </div>
          
          <h2 className="section-heading text-text">
            {COPY.howWeWork.heading}
          </h2>
        </div>

        {/* Process Steps */}
        <div className="process-steps relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="process-line absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent hidden md:block" />

          {/* Steps */}
          <div className="space-y-12 md:space-y-24">
            {COPY.howWeWork.steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'process-step relative',
                  'flex flex-col md:flex-row items-start md:items-center gap-6',
                  index % 2 === 1 && 'md:flex-row-reverse'
                )}
              >
                {/* Content Card */}
                <div className={cn(
                  'flex-1 p-6 md:p-8 rounded-2xl',
                  'bg-card/50 backdrop-blur-sm border border-border/20',
                  'transition-all duration-500 hover:border-gold/30',
                  index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                )}>
                  {/* Step Number */}
                  <span className="step-number inline-block text-5xl md:text-6xl font-bold text-gold/20 mb-4">
                    {step.number}
                  </span>
                  
                  <h3 className="text-2xl font-bold text-text mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Center Icon */}
                <div className="relative z-10 flex-shrink-0 order-first md:order-none">
                  <div className={cn(
                    'w-16 h-16 rounded-full',
                    'bg-gradient-to-br from-gold to-gold-dark',
                    'flex items-center justify-center',
                    'shadow-lg shadow-gold/20',
                    'transition-transform duration-500 hover:scale-110'
                  )}>
                    <Icon name={step.icon} size={28} className="text-bg" />
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

HowWeWork.displayName = 'HowWeWork'


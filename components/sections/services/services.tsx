'use client'

import { memo, useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { GlassEffect } from '@/components/effects/glass-effect'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ServicesProps {
  className?: string
}

// Service data with different images and quotes
const SERVICES_DATA = [
  {
    id: 'design',
    title: 'Product Design & Branding',
    image: '/images/services-art.png',
    quote: 'Make people feel the product before they use it.',
  },
  {
    id: 'development',
    title: 'Web & Mobile Development',
    image: '/images/services-art.png',
    quote: 'Build experiences that scale and perform beautifully.',
  },
  {
    id: 'ai',
    title: 'AI & Automation',
    image: '/images/services-art.png',
    quote: 'Intelligent systems that learn and adapt to your needs.',
  },
  {
    id: 'marketing',
    title: 'Marketing & Content',
    image: '/images/services-art.png',
    quote: 'Stories that connect, content that converts.',
  },
]

export const Services = memo<ServicesProps>(({ className }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null) // Ref for parallax BG
  const [activeService, setActiveService] = useState(0)

  const handleServiceClick = useCallback((index: number) => {
    if (index === activeService) return

    // Animate image transition
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setActiveService(index)
          gsap.to(imageRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
          })
        },
      })
    } else {
      setActiveService(index)
    }
  }, [activeService])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Set initial visible states to prevent hiding
      gsap.set('.services-section-header', { opacity: 1, y: 0 })
      gsap.set('.services-glass-container', { opacity: 1, y: 0 })
      gsap.set('.service-item', { opacity: 1, x: 0 })
      gsap.set('.services-image-panel', { opacity: 1, x: 0 })

      // Section header animation
      gsap.from('.services-section-header', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Glass container animation
      gsap.from('.services-glass-container', {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-glass-container',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      // Service items stagger - ensure all are visible
      gsap.from('.service-item', {
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-list',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      // Image panel animation
      gsap.from('.services-image-panel', {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-image-panel',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
      // Background Parallax
      gsap.fromTo(bgRef.current,
        { y: -50, scale: 1.1 },
        {
          y: 50,
          scale: 1.1, // Maintain scale to avoid edges showing
          ease: 'none',
          scrollTrigger: {
            trigger: '.services-container-wrapper',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      )

    }, section)

    return () => ctx.revert()
  }, [])

  const currentService = SERVICES_DATA[activeService]

  return (
    <section
      ref={sectionRef}
      id="services"
      className={cn('relative py-12 md:py-16 lg:py-20 xl:py-32 overflow-visible', className)}
      style={{ scrollMarginTop: '80px', scrollSnapAlign: 'start', zIndex: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="services-section-header text-center mb-8 md:mb-12 lg:mb-16 relative z-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-bold text-text leading-tight">
            What We Help You Build.
          </h2>
        </div>

        {/* Container with background image and glass overlay */}
        <div className="services-container-wrapper relative rounded-[30px] overflow-hidden min-h-[500px] md:min-h-[550px] lg:min-h-[611px] z-10">
          {/* Background Image Layer - Parallax Enabled */}
          <div ref={bgRef} className="absolute inset-x-0 -top-[10%] -bottom-[10%] z-0">
            <Image
              src="/images/services-art.png"
              alt="Services Background Art"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* WebGL Glass Effect Overlay - Figma Glass settings */}
          <div className="services-glass-container absolute inset-0 rounded-[30px] z-[1] overflow-hidden">
            <GlassEffect
              config={{
                frost: 100,
                refraction: 100,
                depth: 55,
                lightAngle: -30,
                lightIntensity: 0.4,
                dispersion: 100,
                backgroundColor: 'rgba(6, 6, 6, 0.5)',
              }}
            />
          </div>

          {/* Content Grid - On top of glass */}
          <div className="relative grid lg:grid-cols-2 min-h-[500px] md:min-h-[550px] lg:min-h-[611px] z-[2]">
            {/* Left Column - Text Content */}
            <div className="p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-center relative z-[3]">
              {/* Heading */}
              <div className="mb-6 md:mb-8 lg:mb-10">
                <h3
                  className="text-xl md:text-2xl lg:text-3xl xl:text-[36px] font-bold text-text leading-tight mb-3 md:mb-4"
                  style={{ textShadow: '0 4px 4px rgba(0,0,0,0.25)' }}
                >
                  We design, build, & scale<br className="hidden md:block" />
                  with AI at the core
                </h3>
                <p
                  className="text-sm md:text-base lg:text-lg text-[#CCC9C9] leading-relaxed max-w-md"
                  style={{ textShadow: '0 4px 4px rgba(0,0,0,0.25)' }}
                >
                  We partner with founders and teams to build brands, design software, and deploy AI systems that solve real business problems.
                </p>
              </div>

              {/* Interactive Services List - Fixed visibility with proper spacing */}
              <div className="services-list space-y-0 pl-4 flex flex-col justify-start min-h-[160px] md:min-h-[176px] relative z-[4]">
                {SERVICES_DATA.map((service, index) => (
                  <div
                    key={service.id}
                    className="service-item-wrapper relative mb-0"
                  >
                    <button
                      onClick={() => handleServiceClick(index)}
                      className={cn(
                        'service-item w-full text-left py-2 md:py-3 transition-all duration-300',
                        'text-text text-base md:text-lg lg:text-xl font-medium',
                        'hover:text-gold relative block',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded',
                        'min-h-[40px] md:min-h-[44px] flex items-center'
                      )}
                      style={{ textShadow: '0 4px 4px rgba(0,0,0,0.25)' }}
                    >
                      <span className={cn(
                        'relative inline-block transition-colors duration-300',
                        activeService === index ? 'text-text' : 'text-text/70'
                      )}>
                        {service.title}
                      </span>
                      {/* Gold underline for active */}
                      <div
                        className={cn(
                          'absolute bottom-0 left-0 h-[2px] bg-gold-dark transition-all duration-500',
                          activeService === index ? 'w-[249px] opacity-100' : 'w-0 opacity-0'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Clean Image Panel (No Glass Morphism) */}
            <div className="services-image-panel relative p-4 md:p-6 lg:p-8 flex items-center justify-center z-[3]">
              <div
                ref={imageRef}
                className="relative w-full max-w-[679px] aspect-square lg:aspect-[679/499] rounded-[14px] overflow-hidden"
                style={{
                  boxShadow: '16px 14px 24px rgba(0,0,0,0.44)',
                }}
              >
                {/* Dynamic Background Image - Clean, no blur */}
                <Image
                  src={currentService.image}
                  alt={currentService.title}
                  fill
                  className="object-cover transition-opacity duration-300"
                />

                {/* Subtle dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Quote at bottom - Clean text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 z-10">
                  <p
                    className="text-lg md:text-xl lg:text-2xl xl:text-[28px] font-medium text-text italic leading-tight"
                    style={{ textShadow: '0 4px 8px rgba(0,0,0,0.8)' }}
                  >
                    {currentService.quote}
                  </p>
                </div>

                {/* Service indicator dots */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  {SERVICES_DATA.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleServiceClick(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all duration-300',
                        activeService === index
                          ? 'bg-gold scale-125'
                          : 'bg-white/30 hover:bg-white/50'
                      )}
                      aria-label={`View ${SERVICES_DATA[index].title}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

Services.displayName = 'Services'

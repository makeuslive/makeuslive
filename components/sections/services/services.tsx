'use client'

import { memo, useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

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
  const [activeService, setActiveService] = useState(0)

  const handleServiceClick = useCallback((index: number) => {
    if (index === activeService) return
    setActiveService(index)
  }, [activeService])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
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

      // Service items stagger
      gsap.from('.service-item-wrapper', {
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-list',
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      })
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

        {/* Unified Container: Glass and Image Merged */}
        <div
          className="relative rounded-[30px] overflow-hidden min-h-[500px] md:min-h-[550px] lg:min-h-[611px] z-10 shadow-card transition-all duration-500 group"
        >
          {/* Dynamic Background Image - Covers entire container */}
          <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
            {SERVICES_DATA.map((service, index) => (
              <div
                key={service.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-in-out",
                  activeService === index ? "opacity-100" : "opacity-0"
                )}
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Unified Glass Gradient Overlay - Left to Right Fade */}
          {/* This creates the "Glass Text Panel" flowing into "Clear Image" */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: `linear-gradient(90deg, 
                rgba(5, 5, 5, 0.9) 0%, 
                rgba(5, 5, 5, 0.7) 40%, 
                rgba(5, 5, 5, 0.2) 70%, 
                transparent 100%)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              maskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 55%, transparent 100%)' // Mask the blur so right side is crisp
            }}
          />

          {/* Dark gradient for text readability without blur on the left */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          {/* Content Grid */}
          <div className="relative grid lg:grid-cols-2 min-h-[500px] md:min-h-[550px] lg:min-h-[611px] z-[2]">
            {/* Left Column - Text Content */}
            <div className="p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-center relative z-[3]">
              {/* Heading */}
              <div className="mb-6 md:mb-8 lg:mb-10">
                <h3
                  className="text-xl md:text-2xl lg:text-3xl xl:text-[36px] font-bold text-text leading-tight mb-3 md:mb-4 bg-clip-text"
                >
                  We design, build, & scale<br className="hidden md:block" />
                  with AI at the core
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-[#CCC9C9] leading-relaxed max-w-md">
                  We partner with founders and teams to build brands, design software, and deploy AI systems that solve real business problems.
                </p>
              </div>

              {/* Interactive Services List */}
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
                        'text-base md:text-lg lg:text-xl font-medium relative block',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded',
                        'min-h-[40px] md:min-h-[44px] flex items-center',
                        activeService === index ? 'text-text translate-x-2' : 'text-text/50 hover:text-text/80'
                      )}
                    >
                      <span className="relative z-10">{service.title}</span>
                      {/* Active Indicator Line */}
                      <div
                        className={cn(
                          'absolute left-[-16px] top-1/2 -translate-y-1/2 w-[3px] bg-gold rounded-full transition-all duration-300',
                          activeService === index ? 'h-6 opacity-100' : 'h-0 opacity-0'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Transparent Area + Quote */}
            <div className="services-image-panel relative p-4 md:p-6 lg:p-8 flex flex-col justify-end items-end z-[3]">
              {/* Clean area showing the background image */}

              {/* Floating Glass Quote Card */}
              <div className="relative max-w-sm mb-8 mr-4 md:mr-8 p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-glass transform transition-all duration-500 hover:scale-105">
                <p className="text-lg md:text-xl font-medium text-text italic leading-tight">
                  "{currentService.quote}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

Services.displayName = 'Services'

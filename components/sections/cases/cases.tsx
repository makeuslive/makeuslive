'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { COPY } from '@/lib/constants'
import { CaseItem } from '@/types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface CasesProps {
  className?: string
}

// Fallback case studies with enhanced data
const FALLBACK_CASES = [
  {
    id: 'case-1',
    title: 'Internal Ticket & SLA Management System',
    category: 'Enterprise Platform',
    description: 'Production-ready workflow platform managing tickets, projects, and SLA commitments across engineering and operations teams.',
    stats: { metric: 'Multi-Team', label: 'Daily Operations' },
    tags: ['FastAPI', 'MongoDB', 'Next.js', 'TypeScript', 'JWT Auth'],
    gradient: 'from-blue-500/20 to-indigo-600/20',
    accentColor: 'blue',
  },
  {
    id: 'case-2',
    title: 'Real-Time Distraction Alert Mobile App',
    category: 'Mobile Safety',
    description: 'Production-grade mobile app detecting user distraction near roadways with intelligent safety alerts.',
    stats: { metric: 'Real-Time', label: 'Background Ops' },
    tags: ['Flutter', 'Background Services', 'Geofencing', 'Activity Recognition'],
    gradient: 'from-orange-500/20 to-red-600/20',
    accentColor: 'orange',
  },
  {
    id: 'case-3',
    title: 'DocIt – Secure Document Locker',
    category: 'Production Mobile App',
    description: 'Live on Google Play with 10K+ downloads and 4.4★ rating. Secure document locker with offline access.',
    stats: { metric: '10K+', label: 'Active Users' },
    tags: ['Flutter', 'Secure Storage', 'Offline-First', 'Document Scanning'],
    gradient: 'from-emerald-500/20 to-teal-600/20',
    accentColor: 'emerald',
    link: 'https://play.google.com/store/apps/details?id=com.docit.app',
  },
]

export const Cases = memo<CasesProps>(({ className }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  const [works, setWorks] = useState<CaseItem[]>(FALLBACK_CASES as unknown as CaseItem[])
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

    fetch('/api/seed').then(() => fetchWorks())
  }, [])

  const itemsToDisplay = works.length > 0 ? works : FALLBACK_CASES
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

      // Infinite horizontal scroll
      const totalWidth = track.scrollWidth / 2

      animationRef.current = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        duration: 50,
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (animationRef.current) {
      isPaused ? animationRef.current.pause() : animationRef.current.play()
    }
  }, [isPaused])

  return (
    <section
      ref={sectionRef}
      id="works"
      className={cn('section relative overflow-hidden py-24 md:py-32', className)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Enhanced Header */}
        <div className="cases-header mb-16 md:mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-white/70 tracking-wide">Production Portfolio</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-[1.1]">
            Real Work,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold">
              Real Impact
            </span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-3xl mb-8">
            Production systems solving real business problems. From enterprise platforms to mobile apps with thousands of users—every project is built to last.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-white/50">Production-Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-white/50">10K+ Real Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-white/50">4.4★ Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Scroll Track */}
      <div
        className="relative overflow-x-auto md:overflow-hidden no-scrollbar"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-40 bg-gradient-to-r from-bg via-bg/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-40 bg-gradient-to-l from-bg via-bg/80 to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 py-4 px-4 md:px-8"
          style={{ width: 'fit-content' }}
        >
          {duplicatedItems.map((caseItem, index) => (
            <div
              key={`${caseItem.id}-${index}`}
              className={cn(
                'case-card group relative flex-shrink-0',
                'w-[320px] sm:w-[380px] md:w-[450px] min-h-[380px] sm:min-h-[420px] md:min-h-[480px]',
                'rounded-2xl md:rounded-3xl overflow-hidden',
                'bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]',
                'border border-white/10',
                'cursor-pointer transition-all duration-700 ease-out',
                'hover:border-white/20 hover:scale-[1.02]',
                'shadow-xl hover:shadow-2xl'
              )}
            >
              {/* Background gradient */}
              <div className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-40 group-hover:opacity-60 transition-opacity duration-700',
                'gradient' in caseItem ? caseItem.gradient : 'from-gold/10 to-amber-500/5'
              )} />

              {/* Mesh gradient overlay */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.2) 0%, transparent 50%),
                                   radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)`
                }}
              />

              {/* Content */}
              <div className="relative z-10 h-full p-6 sm:p-7 md:p-8 flex flex-col justify-between">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    {/* Live badge for DocIt */}
                    {'link' in caseItem && caseItem.link && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-emerald-400 text-xs font-semibold">LIVE ON PLAY STORE</span>
                      </div>
                    )}

                    {/* Category */}
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                      {caseItem.category}
                    </span>
                  </div>

                  {/* Stats */}
                  {'stats' in caseItem && caseItem.stats && (
                    <div className="text-right px-3 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <span className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-white block">
                        {caseItem.stats.metric}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                        {caseItem.stats.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom */}
                <div>
                  {/* Tags */}
                  {'tags' in caseItem && caseItem.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {caseItem.tags.slice(0, 4).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/60 hover:border-gold/30 hover:text-gold/80 transition-colors duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-bold text-xl sm:text-2xl md:text-3xl text-white mb-2 leading-tight group-hover:text-gold/90 transition-colors duration-300">
                    {caseItem.title}
                  </h3>

                  {'description' in caseItem && (
                    <p className="text-sm md:text-base text-white/50 leading-relaxed line-clamp-2">
                      {caseItem.description}
                    </p>
                  )}

                  {/* Bottom link */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    {'link' in caseItem && caseItem.link ? (
                      <a
                        href={caseItem.link as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>View on Play Store</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
                        <span>Enterprise Project</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom message */}
      <div className="text-center mt-12 md:mt-16">
        <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white/50 text-sm">
            Every project tells a story of solving real problems
          </p>
          <span className="text-gold text-sm font-semibold flex items-center gap-2">
            More projects in development
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  )
})

Cases.displayName = 'Cases'

'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Work {
  id: string
  title: string
  category: string
  description: string
  image?: string
  stats?: {
    metric: string
    label: string
  }
  tags?: string[]
  gradient?: string
}

// Fallback works to display when database is empty
const FALLBACK_WORKS: Work[] = [
  {
    id: 'case-1',
    title: 'Internal Ticket & SLA Management System',
    category: 'Enterprise Platform',
    description: 'Production-ready workflow platform managing tickets, projects, and SLA commitments across engineering and operations teams. Built with FastAPI, MongoDB, and Next.js.',
    stats: { metric: 'Multi-Team', label: 'Daily Operations' },
    tags: ['FastAPI', 'MongoDB', 'Next.js', 'TypeScript', 'JWT Auth'],
    gradient: 'from-blue-500/20 to-indigo-600/20',
  },
  {
    id: 'case-2',
    title: 'Real-Time Distraction Alert Mobile App',
    category: 'Mobile Safety',
    description: 'Production-grade mobile app detecting user distraction near roadways with intelligent safety alerts. Features background processing and geofencing.',
    stats: { metric: 'Real-Time', label: 'Background Ops' },
    tags: ['Flutter', 'Background Services', 'Geofencing', 'Activity Recognition'],
    gradient: 'from-orange-500/20 to-red-600/20',
  },
  {
    id: 'case-3',
    title: 'DocIt – Secure Document Locker',
    category: 'Production Mobile App',
    description: 'Live on Google Play with 10K+ downloads and 4.4★ rating. Secure document locker with offline access and advanced encryption.',
    stats: { metric: '10K+', label: 'Active Users' },
    tags: ['Flutter', 'Secure Storage', 'Offline-First', 'Document Scanning'],
    gradient: 'from-emerald-500/20 to-teal-600/20',
  },
  {
    id: 'case-4',
    title: 'AI-Powered Content Generation Platform',
    category: 'AI & Automation',
    description: 'Enterprise-grade content generation platform leveraging LLMs for automated content creation, SEO optimization, and multi-channel distribution.',
    stats: { metric: '95%', label: 'Time Saved' },
    tags: ['OpenAI', 'LLM Integration', 'Next.js', 'Vector DB'],
    gradient: 'from-purple-500/20 to-pink-600/20',
  },
  {
    id: 'case-5',
    title: 'E-Commerce Platform with AI Recommendations',
    category: 'E-Commerce',
    description: 'Full-stack e-commerce solution with AI-powered product recommendations, real-time inventory management, and seamless payment integration.',
    stats: { metric: '40%', label: 'Conversion Boost' },
    tags: ['Next.js', 'Stripe', 'Machine Learning', 'Redis'],
    gradient: 'from-cyan-500/20 to-blue-600/20',
  },
  {
    id: 'case-6',
    title: 'Healthcare Management System',
    category: 'Healthcare Tech',
    description: 'HIPAA-compliant healthcare management system with patient records, appointment scheduling, and telemedicine capabilities.',
    stats: { metric: '50K+', label: 'Patients Served' },
    tags: ['React', 'Node.js', 'HIPAA Compliance', 'WebRTC'],
    gradient: 'from-green-500/20 to-emerald-600/20',
  },
]

const CATEGORIES = ['All', 'Enterprise Platform', 'Mobile Safety', 'Production Mobile App', 'AI & Automation', 'E-Commerce', 'Healthcare Tech']

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchWorks() {
      try {
        const response = await fetch('/api/works')
        const data = await response.json()
        
        if (data.success) {
          const fetchedWorks = data.data || []
          // Use fetched works if available, otherwise use fallback
          setWorks(fetchedWorks.length > 0 ? fetchedWorks : FALLBACK_WORKS)
        } else {
          // On error, use fallback works
          setWorks(FALLBACK_WORKS)
        }
      } catch (err) {
        console.error('Error fetching works:', err)
        // On error, use fallback works
        setWorks(FALLBACK_WORKS)
      } finally {
        setLoading(false)
      }
    }

    fetchWorks()
  }, [])

  // Filter works by category
  const filteredWorks = useMemo(() => {
    if (selectedCategory === 'All') return works
    return works.filter(work => work.category === selectedCategory)
  }, [works, selectedCategory])

  // Animate cards on scroll
  useEffect(() => {
    if (!sectionRef.current || loading) return

    const cards = sectionRef.current.querySelectorAll('.work-card')
    cards.forEach((card: Element, index: number) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [loading, filteredWorks])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-white pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-24">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center animate-spin">
              <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-white/70">Loading works...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg text-white pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-24">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Works</h2>
            <p className="text-white/70 mb-8">{error}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-white pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="text-gold text-sm font-medium tracking-wider uppercase">Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-white to-gold bg-clip-text text-transparent">
            Our Works
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Explore our portfolio of successful projects and case studies. Each project represents our commitment to excellence and innovation.
          </p>
        </div>

        {/* Category Filters */}
        {works.length > 0 && (
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  'focus-ring',
                  selectedCategory === category
                    ? 'bg-gold text-bg shadow-lg shadow-gold/20'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Works Grid */}
        {filteredWorks.length > 0 ? (
          <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredWorks.map((work) => (
              <Link
                key={work.id}
                href={`/case-studies/${work.id}`}
                className={cn(
                  'work-card group relative overflow-hidden rounded-2xl',
                  'bg-gradient-to-br from-white/5 to-white/[0.02]',
                  'border border-white/10 backdrop-blur-sm',
                  'hover:border-gold/50 hover:shadow-2xl hover:shadow-gold/10',
                  'transition-all duration-500 hover:-translate-y-2',
                  'focus-ring'
                )}
              >
                {/* Gradient Overlay */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                  work.gradient || 'from-gold/10 to-amber-500/5'
                )} />

                {/* Image */}
                {work.image ? (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={cn(
                      'absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/40 to-transparent',
                      work.gradient || 'from-gold/20 to-amber-500/10'
                    )} />
                  </div>
                ) : (
                  <div className={cn(
                    'relative h-56 overflow-hidden',
                    'bg-gradient-to-br',
                    work.gradient || 'from-gold/20 to-amber-500/10'
                  )}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-10 h-10 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="relative p-6">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-gold uppercase tracking-wider bg-gold/10 rounded-full">
                      {work.category}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-gold transition-colors duration-300">
                    {work.title}
                  </h3>
                  <p className="text-white/70 text-sm md:text-base mb-5 line-clamp-3 leading-relaxed">
                    {work.description}
                  </p>

                  {/* Stats */}
                  {work.stats && (
                    <div className="mb-5 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-3xl font-bold text-gold mb-1">{work.stats.metric}</div>
                      <div className="text-xs text-white/60 uppercase tracking-wider">{work.stats.label}</div>
                    </div>
                  )}

                  {/* Tags */}
                  {work.tags && work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {work.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs rounded-lg bg-white/10 text-white/80 border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                      {work.tags.length > 4 && (
                        <span className="px-3 py-1 text-xs rounded-lg bg-gold/20 text-gold border border-gold/30">
                          +{work.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* View More */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-gold text-sm font-semibold group-hover:gap-2 transition-all flex items-center">
                      View Case Study
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold/20 to-amber-500/10 flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No Works in This Category</h3>
            <p className="text-white/70 mb-8 text-lg max-w-md mx-auto">
              We don't have any works in this category yet. Try selecting a different category or check back soon!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-6 py-3 rounded-lg bg-gold text-bg font-semibold hover:bg-gold-dark transition-colors"
              >
                View All Works
              </button>
              <Link href="/contact">
                <Button variant="glass">Get in Touch</Button>
              </Link>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {filteredWorks.length > 0 && (
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-gold/10 via-amber-500/10 to-gold/10 rounded-3xl p-8 md:p-12 border border-gold/20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Let's work together to bring your vision to life. Get in touch and let's discuss how we can help.
              </p>
              <Link href="/contact">
                <Button variant="primary" size="lg" className="text-lg px-8 py-4">
                  Start Your Project
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


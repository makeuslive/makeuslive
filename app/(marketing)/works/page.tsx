'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

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

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWorks() {
      try {
        const response = await fetch('/api/works')
        const data = await response.json()
        
        if (data.success) {
          setWorks(data.data || [])
        } else {
          setError(data.error || 'Failed to load works')
        }
      } catch (err) {
        console.error('Error fetching works:', err)
        setError('Failed to load works. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchWorks()
  }, [])

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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Works</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Explore our portfolio of successful projects and case studies
          </p>
        </div>

        {/* Works Grid */}
        {works.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {works.map((work) => (
              <Link
                key={work.id}
                href={`/case-studies/${work.id}`}
                className={cn(
                  'group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10',
                  'hover:border-gold/50 hover:bg-white/10 transition-all duration-300',
                  'focus-ring'
                )}
              >
                {/* Image */}
                {work.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={cn(
                      'absolute inset-0 bg-gradient-to-br opacity-60',
                      work.gradient || 'from-gold/20 to-amber-500/10'
                    )} />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gold uppercase tracking-wider">
                      {work.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors">
                    {work.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">
                    {work.description}
                  </p>

                  {/* Stats */}
                  {work.stats && (
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-gold">{work.stats.metric}</div>
                      <div className="text-xs text-white/60">{work.stats.label}</div>
                    </div>
                  )}

                  {/* Tags */}
                  {work.tags && work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {work.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                      {work.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/70">
                          +{work.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* View More */}
                  <div className="flex items-center text-gold text-sm font-medium group-hover:gap-2 transition-all">
                    View Case Study
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Works Available</h3>
            <p className="text-white/70 mb-8">
              We're currently updating our portfolio. Please check back soon!
            </p>
            <Link href="/contact">
              <Button variant="primary">Get in Touch</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}


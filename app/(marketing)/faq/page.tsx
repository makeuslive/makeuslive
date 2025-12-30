'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Accordion } from '@/components/ui/accordion'
import type { AccordionItem } from '@/components/ui/accordion'
import { formatDisplayDate } from '@/lib/date-utils'
import { Input } from '@/components/ui'
import { cn } from '@/lib/utils'

// FAQ Data - This would typically come from CMS
const FAQ_DATA: AccordionItem[] = [
  {
    id: 'faq-1',
    question: 'What services does Make Us Live offer?',
    answer: 'We offer a comprehensive range of digital services including AI-powered products, design systems, web development, mobile applications, and technical consulting. Our team specializes in creating scalable, high-performance solutions tailored to your business needs.',
    category: 'services',
  },
  {
    id: 'faq-2',
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on scope and complexity. A typical web project takes 4-8 weeks, while mobile apps may take 6-12 weeks. We provide detailed timelines during the discovery phase and keep you updated throughout the project.',
    category: 'services',
  },
  {
    id: 'faq-3',
    question: 'Do you work with startups?',
    answer: 'Yes! We love working with startups and have experience helping early-stage companies build their first products. We offer flexible engagement models and can work within various budget constraints.',
    category: 'general',
  },
  {
    id: 'faq-4',
    question: 'What technologies do you use?',
    answer: 'We use modern, proven technologies including Next.js, React, TypeScript, Node.js, Python, React Native, and various AI/ML frameworks. We choose the best stack for each project based on requirements.',
    category: 'technical',
  },
  {
    id: 'faq-5',
    question: 'How do you ensure project quality?',
    answer: 'We follow a rigorous process including code reviews, automated testing, performance optimization, and regular client check-ins. All projects go through multiple quality assurance stages before launch.',
    category: 'process',
  },
  {
    id: 'faq-6',
    question: 'Can you help with existing projects?',
    answer: 'Absolutely! We provide technical consulting, code audits, refactoring services, and can take over maintenance of existing projects. We work with your current team and codebase.',
    category: 'services',
  },
]

const CATEGORIES = ['All', 'services', 'technical', 'process', 'general'] as const

const LAST_UPDATED = new Date('2025-12-27')

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({})

  // Debounced search
  const debouncedQuery = useDebounce(searchQuery, 300)

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let filtered = FAQ_DATA

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // Filter by search query
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [debouncedQuery, selectedCategory])

  // Handle helpful vote
  const handleHelpfulVote = useCallback((itemId: string, isHelpful: boolean) => {
    setHelpfulVotes((prev) => ({ ...prev, [itemId]: isHelpful }))

    // Track analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
      gtag('event', 'faq_helpful_vote', {
        faq_id: itemId,
        yes_no: isHelpful ? 'yes' : 'no',
      })
    }
  }, [])

  // Handle accordion toggle
  const handleToggle = useCallback((id: string, isOpen: boolean) => {
    if (isOpen) {
      // Track analytics when FAQ is opened
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
        const item = FAQ_DATA.find((item) => item.id === id)
        gtag('event', 'faq_item_open', {
          id,
          category: item?.category || 'unknown',
        })
      }
    }
  }, [])

  // Track search
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    if (value && typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
      gtag('event', 'faq_search', {
        query: value,
      })
    }
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/60 text-lg">
            Find answers to common questions about our services and processes
          </p>
          <p className="text-white/40 text-sm mt-4">
            Last updated: {formatDisplayDate(LAST_UPDATED)}
          </p>
        </header>

        {/* Search */}
        <div className="mb-8">
          <Input
            type="search"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
            aria-label="Search FAQ"
          />
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-gold/50',
                  selectedCategory === category
                    ? 'bg-gold text-bg'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                )}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {debouncedQuery && (
          <p className="text-white/60 text-sm mb-4">
            Found {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'}
          </p>
        )}

        {/* FAQ Accordion */}
        {filteredFAQs.length > 0 ? (
          <Accordion
            items={filteredFAQs}
            onToggle={handleToggle}
            className="mb-12"
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-white/60 text-lg mb-2">No results found</p>
            <p className="text-white/40 text-sm">
              Try adjusting your search or category filter
            </p>
          </div>
        )}

        {/* Helpful Voting */}
        {filteredFAQs.length > 0 && (
          <div className="mt-12 p-6 rounded-lg bg-white/5 border border-white/10">
            <p className="text-white/60 text-sm mb-4">
              Was this helpful? Let us know by voting on individual questions above.
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 text-center p-8 rounded-lg bg-gradient-to-br from-gold/10 to-transparent border border-gold/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-white/60 mb-6">
            Can't find what you're looking for? Get in touch and we'll help you out.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 rounded-lg bg-gold text-bg font-semibold hover:bg-gold-dark transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}


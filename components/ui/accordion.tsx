'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface AccordionItem {
  id: string
  question: string
  answer: string
  category?: string
}

interface AccordionProps {
  items: AccordionItem[]
  defaultOpenId?: string
  onToggle?: (id: string, isOpen: boolean) => void
  className?: string
}

/**
 * WCAG-compliant Accordion Component
 * Deep-linkable via URL hash
 */
export function Accordion({ items, defaultOpenId, onToggle, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    defaultOpenId ? new Set([defaultOpenId]) : new Set()
  )

  // Handle deep linking via URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove #
      if (hash) {
        const item = items.find((item) => item.id === hash)
        if (item && !openIds.has(item.id)) {
          setOpenIds((prev) => new Set([...prev, item.id]))
          // Scroll to item after a brief delay to ensure it's rendered
          setTimeout(() => {
            const element = document.getElementById(hash)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              element.focus()
            }
          }, 100)
        }
      }
    }

    // Check hash on mount
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [items, openIds])

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
        onToggle?.(id, false)
      } else {
        newSet.add(id)
        onToggle?.(id, true)
      }
      return newSet
    })
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id)
        return (
          <AccordionItem
            key={item.id}
            item={item}
            isOpen={isOpen}
            onToggle={() => toggleItem(item.id)}
          />
        )
      })}
    </div>
  )
}

interface AccordionItemProps {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
}

function AccordionItem({ item, isOpen, onToggle }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <div
      id={item.id}
      className="border border-white/10 rounded-lg bg-white/5 overflow-hidden"
    >
      <h3>
        <button
          ref={buttonRef}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${item.id}-content`}
          className={cn(
            'w-full px-6 py-4 flex items-center justify-between',
            'text-left text-white font-semibold',
            'hover:bg-white/5 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-inset'
          )}
        >
          <span>{item.question}</span>
          <svg
            className={cn(
              'w-5 h-5 text-gold transition-transform duration-200 flex-shrink-0 ml-4',
              isOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </h3>
      <div
        id={`${item.id}-content`}
        ref={contentRef}
        role="region"
        aria-labelledby={`${item.id}-button`}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-6 py-4 text-white/60 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  )
}


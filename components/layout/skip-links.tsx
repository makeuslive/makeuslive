'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Skip Links Component
 * Provides keyboard navigation shortcuts for accessibility (WCAG 2.2 AA)
 */
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:z-[100] focus-within:top-4 focus-within:left-4">
      <nav aria-label="Skip navigation links">
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              href="#main-content"
              className={cn(
                'block px-4 py-2 rounded-lg',
                'bg-gold text-bg font-semibold',
                'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg',
                'transition-all'
              )}
            >
              Skip to main content
            </Link>
          </li>
          <li>
            <Link
              href="#navigation"
              className={cn(
                'block px-4 py-2 rounded-lg',
                'bg-gold text-bg font-semibold',
                'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg',
                'transition-all'
              )}
            >
              Skip to navigation
            </Link>
          </li>
          <li>
            <Link
              href="#footer"
              className={cn(
                'block px-4 py-2 rounded-lg',
                'bg-gold text-bg font-semibold',
                'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg',
                'transition-all'
              )}
            >
              Skip to footer
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}


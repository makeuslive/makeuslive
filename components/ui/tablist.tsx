'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

export interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TablistProps {
  tabs: Tab[]
  defaultTab?: string
  syncWithHash?: boolean
  className?: string
  onTabChange?: (tabId: string) => void
}

/**
 * WCAG-compliant ARIA Tablist Component
 * Full keyboard navigation and URL hash sync
 */
export function Tablist({
  tabs,
  defaultTab,
  syncWithHash = false,
  className,
  onTabChange,
}: TablistProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || '')
  const [focusedIndex, setFocusedIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Sync with URL hash
  useEffect(() => {
    if (syncWithHash && typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1)
      if (hash) {
        const tab = tabs.find((t) => t.id === hash)
        if (tab) {
          setActiveTab(tab.id)
          setFocusedIndex(tabs.indexOf(tab))
        }
      }
    }
  }, [syncWithHash, tabs])

  // Update URL hash when tab changes
  useEffect(() => {
    if (syncWithHash && typeof window !== 'undefined') {
      const newHash = `#${activeTab}`
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash)
      }
    }
  }, [activeTab, syncWithHash])

  const handleTabClick = (tabId: string, index: number) => {
    setActiveTab(tabId)
    setFocusedIndex(index)
    onTabChange?.(tabId)

    // Track analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
      gtag('event', 'services_tab_select', {
        category: tabId,
      })
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let newIndex = index

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        newIndex = (index + 1) % tabs.length
        break
      case 'ArrowLeft':
        e.preventDefault()
        newIndex = (index - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        e.preventDefault()
        newIndex = 0
        break
      case 'End':
        e.preventDefault()
        newIndex = tabs.length - 1
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        handleTabClick(tabs[index].id, index)
        return
      default:
        return
    }

    setFocusedIndex(newIndex)
    tabRefs.current[newIndex]?.focus()
  }

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex gap-2 border-b border-white/10 mb-6"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el
            }}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => handleTabClick(tab.id, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'px-6 py-3 border-b-2 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-bg',
              activeTab === tab.id
                ? 'border-gold text-gold'
                : 'border-transparent text-white/60 hover:text-white hover:border-white/20'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${tab.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${tab.id}-tab`}
          hidden={activeTab !== tab.id}
          className={activeTab === tab.id ? 'block' : 'hidden'}
        >
          {activeTab === tab.id && tab.content}
        </div>
      ))}
    </div>
  )
}


'use client'

import { useState, useEffect, useRef } from 'react'
import type { ScrollDirection } from '@/types'

/**
 * Hook to track scroll direction
 */
export function useScrollDirection(threshold = 10): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(null)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const updateScrollDir = () => {
      const scrollY = window.scrollY

      if (Math.abs(scrollY - lastScrollY.current) < threshold) {
        ticking.current = false
        return
      }

      setDirection(scrollY > lastScrollY.current ? 'down' : 'up')
      lastScrollY.current = scrollY > 0 ? scrollY : 0
      ticking.current = false
    }

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDir)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return direction
}

/**
 * Hook to get current scroll position
 */
export function useScrollPosition(): { x: number; y: number } {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setPosition({
        x: window.scrollX,
        y: window.scrollY,
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial position

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return position
}

/**
 * Hook to check if scrolled past a threshold
 */
export function useIsScrolled(threshold = 50): boolean {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return isScrolled
}


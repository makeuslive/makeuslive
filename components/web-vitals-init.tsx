'use client'

import { useEffect } from 'react'
import { initWebVitals } from '@/lib/web-vitals'

/**
 * Initialize Web Vitals monitoring on client side
 */
export function WebVitalsInit() {
  useEffect(() => {
    initWebVitals()
  }, [])

  return null
}


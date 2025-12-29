/**
 * Core Web Vitals Monitoring
 * Field targets per PRD:
 * - LCP < 2.5s
 * - INP ≤ 200ms (replaced FID on Mar 12, 2024)
 * - CLS < 0.1
 */

import { onCLS, onINP, onLCP, Metric } from 'web-vitals'

export interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  id: string
  delta: number
  navigationType: string
}

/**
 * Field targets per PRD
 */
const FIELD_TARGETS = {
  LCP: 2500, // 2.5s in milliseconds
  INP: 200, // 200ms
  CLS: 0.1, // 0.1
} as const

/**
 * Determine rating based on field targets
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const target = FIELD_TARGETS[name as keyof typeof FIELD_TARGETS]
  if (!target) return 'good'

  if (name === 'CLS') {
    // CLS: good < 0.1, needs-improvement < 0.25, poor >= 0.25
    if (value < 0.1) return 'good'
    if (value < 0.25) return 'needs-improvement'
    return 'poor'
  } else {
    // LCP/INP: good < target, needs-improvement < target * 1.5, poor >= target * 1.5
    if (value < target) return 'good'
    if (value < target * 1.5) return 'needs-improvement'
    return 'poor'
  }
}

/**
 * Report Web Vital to analytics
 */
function reportWebVital(metric: Metric) {
  const rating = getRating(metric.name, metric.value)

  // Send to Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
      metric_id: metric.id,
      metric_value: metric.value,
      metric_rating: rating,
      metric_delta: metric.delta,
      navigation_type: metric.navigationType,
    })
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating,
      target: FIELD_TARGETS[metric.name as keyof typeof FIELD_TARGETS],
    })
  }

  // Alert if poor rating (regression)
  if (rating === 'poor') {
    console.warn(`[Web Vitals] Poor ${metric.name} detected:`, metric.value)
    // In production, you might send to error tracking service
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return

  try {
    onCLS(reportWebVital)
    onINP(reportWebVital)
    onLCP(reportWebVital)
  } catch (error) {
    console.error('Failed to initialize Web Vitals:', error)
  }
}

/**
 * Get current Web Vitals thresholds
 */
export function getWebVitalsTargets() {
  return FIELD_TARGETS
}


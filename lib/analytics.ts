/**
 * Structured Analytics Events
 * Per PRD mapping - all events sanitized (no PII)
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Track home pillar click
 */
export function trackHomePillarClick(pillarId: string, placement: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'home_pillar_click', {
      pillar_id: pillarId,
      placement,
    })
  }
}

/**
 * Track services tab selection
 */
export function trackServicesTabSelect(category: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'services_tab_select', {
      category,
    })
  }
}

/**
 * Track FAQ search
 */
export function trackFAQSearch(query: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'faq_search', {
      query, // No PII - just search terms
    })
  }
}

/**
 * Track FAQ item open
 */
export function trackFAQItemOpen(id: string, category?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'faq_item_open', {
      id,
      category: category || 'unknown',
    })
  }
}

/**
 * Track FAQ helpful vote
 */
export function trackFAQHelpfulVote(id: string, yesNo: 'yes' | 'no') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'faq_helpful_vote', {
      id,
      yes_no: yesNo,
    })
  }
}

/**
 * Track case study download
 */
export function trackCaseStudyDownload(slug: string, version: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'case_study_download', {
      slug,
      version,
    })
  }
}

/**
 * Track case study open
 */
export function trackCaseStudyOpen(slug: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'case_study_open', {
      slug,
    })
  }
}

/**
 * Track contact form submit (sanitized - no email)
 */
export function trackContactSubmit(pillar: string, timestamp: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'contact_submit', {
      pillar,
      ts: timestamp,
    })
  }
}

/**
 * Track newsletter submit (sanitized - no email)
 */
export function trackNewsletterSubmit(emailValid: boolean, timestamp: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'newsletter_submit', {
      email_valid: emailValid,
      ts: timestamp,
    })
  }
}

/**
 * Track career application submit
 */
export function trackCareerApplySubmit(roleId: string, timestamp: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'career_apply_submit', {
      role_id: roleId,
      ts: timestamp,
    })
  }
}

/**
 * Track settings privacy withdrawal
 */
export function trackSettingsPrivacyWithdraw(type: string, timestamp: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'settings_privacy_withdraw', {
      type,
      ts: timestamp,
    })
  }
}

/**
 * Track billing cancel
 */
export function trackBillingCancel(planId?: string, reason?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'billing_cancel_complete', {
      plan_id: planId || 'unknown',
      reason: reason || 'not_provided',
    })
  }
}


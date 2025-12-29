'use client'

import { useState, useEffect, useCallback } from 'react'
import { createContext, useContext } from 'react'
import { formatStorageDate, getCurrentStorageDate } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

/**
 * Consent Categories per PRD
 */
export type ConsentCategory = 'essential' | 'analytics' | 'marketing'

export interface ConsentPreferences {
  essential: boolean // Always true, cannot be disabled
  analytics: boolean
  marketing: boolean
}

export interface ConsentLog {
  timestamp: string // RFC-3339 + IANA TZ
  preferences: ConsentPreferences
  userAgent?: string
  ipAddress?: string
}

interface ConsentContextType {
  preferences: ConsentPreferences
  hasConsented: boolean
  updatePreferences: (prefs: Partial<ConsentPreferences>) => void
  acceptAll: () => void
  rejectAll: () => void
  showBanner: boolean
  setShowBanner: (show: boolean) => void
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined)

const CONSENT_STORAGE_KEY = 'makeuslive_consent_preferences'
const CONSENT_VERSION = '1.0'

/**
 * Consent Manager Component
 * DPDP/GDPR-compliant cookie consent manager
 */
export function ConsentManager({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  })
  const [hasConsented, setHasConsented] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Load saved preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.version === CONSENT_VERSION && parsed.preferences) {
          setPreferences(parsed.preferences)
          setHasConsented(true)
          return
        }
      } catch (e) {
        console.error('Failed to parse consent preferences', e)
      }
    }
    // Show banner if no consent saved
    setShowBanner(true)
  }, [])

  // Log consent to backend
  const logConsent = useCallback(async (prefs: ConsentPreferences) => {
    const log: ConsentLog = {
      timestamp: getCurrentStorageDate(),
      preferences: prefs,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
    }

    try {
      // Send to backend API for logging
      await fetch('/api/consent/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      })
    } catch (error) {
      console.error('Failed to log consent', error)
      // Non-blocking - continue even if logging fails
    }
  }, [])

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<ConsentPreferences>) => {
    const newPrefs: ConsentPreferences = {
      ...preferences,
      ...updates,
      essential: true, // Always true
    }
    setPreferences(newPrefs)
    setHasConsented(true)
    setShowBanner(false)
    setShowSettings(false)

    // Save to localStorage
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: CONSENT_VERSION,
        preferences: newPrefs,
        timestamp: getCurrentStorageDate(),
      })
    )

    // Log consent
    logConsent(newPrefs)

    // Trigger analytics initialization if analytics consent granted
    if (newPrefs.analytics && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('consent-granted', { detail: { category: 'analytics' } }))
    }
  }, [preferences, logConsent])

  const acceptAll = useCallback(() => {
    updatePreferences({
      essential: true,
      analytics: true,
      marketing: true,
    })
  }, [updatePreferences])

  const rejectAll = useCallback(() => {
    updatePreferences({
      essential: true,
      analytics: false,
      marketing: false,
    })
  }, [updatePreferences])

  const value: ConsentContextType = {
    preferences,
    hasConsented,
    updatePreferences,
    acceptAll,
    rejectAll,
    showBanner,
    setShowBanner,
  }

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {showBanner && (
        <ConsentBanner
          preferences={preferences}
          onAcceptAll={acceptAll}
          onRejectAll={rejectAll}
          onShowSettings={() => setShowSettings(true)}
          onClose={() => setShowBanner(false)}
        />
      )}
      {showSettings && (
        <ConsentSettings
          preferences={preferences}
          onUpdate={updatePreferences}
          onClose={() => setShowSettings(false)}
        />
      )}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  const context = useContext(ConsentContext)
  if (!context) {
    throw new Error('useConsent must be used within ConsentManager')
  }
  return context
}

/**
 * Consent Banner - Initial consent request
 */
function ConsentBanner({
  preferences,
  onAcceptAll,
  onRejectAll,
  onShowSettings,
  onClose,
}: {
  preferences: ConsentPreferences
  onAcceptAll: () => void
  onRejectAll: () => void
  onShowSettings: () => void
  onClose: () => void
}) {
  return (
    <div
      role="dialog"
      aria-labelledby="consent-banner-title"
      aria-describedby="consent-banner-description"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-bg/95 backdrop-blur-xl border-t border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 id="consent-banner-title" className="text-white font-semibold mb-2">
              Cookie Consent
            </h3>
            <p id="consent-banner-description" className="text-white/60 text-sm leading-relaxed">
              We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts.
              You can manage your preferences at any time. Essential cookies are required for the site to function.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onRejectAll}
              className="px-6 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              Reject All
            </button>
            <button
              onClick={onShowSettings}
              className="px-6 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              Customize
            </button>
            <button
              onClick={onAcceptAll}
              className="px-6 py-2.5 rounded-lg bg-gold text-bg text-sm font-semibold hover:bg-gold-dark transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Consent Settings - Granular control
 */
function ConsentSettings({
  preferences,
  onUpdate,
  onClose,
}: {
  preferences: ConsentPreferences
  onUpdate: (prefs: Partial<ConsentPreferences>) => void
  onClose: () => void
}) {
  const [localPrefs, setLocalPrefs] = useState<ConsentPreferences>(preferences)

  const handleToggle = (category: ConsentCategory) => {
    if (category === 'essential') return // Cannot disable essential
    
    setLocalPrefs((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleSave = () => {
    onUpdate(localPrefs)
  }

  const categories: Array<{
    key: ConsentCategory
    title: string
    description: string
    required?: boolean
  }> = [
    {
      key: 'essential',
      title: 'Essential Cookies',
      description: 'Required for the website to function. Cannot be disabled.',
      required: true,
    },
    {
      key: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website (Google Analytics, Microsoft Clarity).',
    },
    {
      key: 'marketing',
      title: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements and track campaign performance.',
    },
  ]

  return (
    <div
      role="dialog"
      aria-labelledby="consent-settings-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-bg border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="consent-settings-title" className="text-2xl font-bold text-white">
            Cookie Preferences
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
            aria-label="Close settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {categories.map((category) => (
            <div
              key={category.key}
              className="p-4 rounded-lg border border-white/10 bg-white/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{category.title}</h3>
                    {category.required && (
                      <span className="text-xs px-2 py-0.5 rounded bg-gold/20 text-gold">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-white/50 text-sm">{category.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrefs[category.key]}
                    onChange={() => handleToggle(category.key)}
                    disabled={category.required}
                    className="sr-only peer"
                    aria-label={`${category.title} cookies`}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-lg bg-gold text-bg font-semibold hover:bg-gold-dark transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}


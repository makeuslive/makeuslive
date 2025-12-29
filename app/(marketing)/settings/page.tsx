'use client'

import { useState } from 'react'
import { useConsent } from '@/components/consent/consent-manager'
import { formatDisplayDate } from '@/lib/date-utils'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { preferences, updatePreferences, setShowBanner } = useConsent()
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'billing' | 'notifications'>('profile')

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Settings</h1>
          <p className="text-white/60 text-lg">
            Manage your account preferences and privacy settings
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-8 border-b border-white/10">
          <nav className="flex gap-4" role="tablist" aria-label="Settings sections">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'privacy', label: 'Privacy' },
              { id: 'billing', label: 'Billing' },
              { id: 'notifications', label: 'Notifications' },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'px-4 py-3 border-b-2 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-gold/50',
                  activeTab === tab.id
                    ? 'border-gold text-gold'
                    : 'border-transparent text-white/60 hover:text-white hover:border-white/20'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Panels */}
        <div>
          {/* Profile Panel */}
          {activeTab === 'profile' && (
            <div
              id="profile-panel"
              role="tabpanel"
              aria-labelledby="profile-tab"
              className="space-y-6"
            >
              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-4">Profile Information</h2>
                <p className="text-white/60 mb-6">
                  Profile management features coming soon. For now, please contact us to update your information.
                </p>
                <a
                  href="/contact"
                  className="inline-block px-6 py-3 rounded-lg bg-gold text-bg font-semibold hover:bg-gold-dark transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  Contact Us
                </a>
              </div>
            </div>
          )}

          {/* Privacy Panel */}
          {activeTab === 'privacy' && (
            <div
              id="privacy-panel"
              role="tabpanel"
              aria-labelledby="privacy-tab"
              className="space-y-6"
            >
              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-4">Privacy Settings</h2>
                <p className="text-white/60 mb-6">
                  Manage your cookie preferences and data privacy settings.
                </p>

                {/* Consent Withdrawal - ≤1 click as per PRD */}
                <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">Cookie Preferences</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Current preferences last updated: {formatDisplayDate(new Date())}
                  </p>
                  <Button
                    onClick={() => setShowBanner(true)}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    Manage Cookie Preferences
                  </Button>
                </div>

                {/* Current Preferences Display */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded bg-white/5">
                    <span className="text-white">Essential Cookies</span>
                    <span className="text-gold">Required</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-white/5">
                    <span className="text-white">Analytics Cookies</span>
                    <span className={preferences.analytics ? 'text-green-400' : 'text-white/40'}>
                      {preferences.analytics ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-white/5">
                    <span className="text-white">Marketing Cookies</span>
                    <span className={preferences.marketing ? 'text-green-400' : 'text-white/40'}>
                      {preferences.marketing ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-4">Data Rights</h2>
                <p className="text-white/60 mb-6">
                  Under DPDP Act 2023, GDPR, and CCPA, you have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/60 mb-6">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Withdraw consent at any time</li>
                  <li>Data portability</li>
                </ul>
                <a
                  href="/contact"
                  className="inline-block px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  Request Data Action
                </a>
              </div>
            </div>
          )}

          {/* Billing Panel */}
          {activeTab === 'billing' && (
            <div
              id="billing-panel"
              role="tabpanel"
              aria-labelledby="billing-tab"
              className="space-y-6"
            >
              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-4">Billing & Subscription</h2>
                <p className="text-white/60 mb-6">
                  Manage your subscription and billing information.
                </p>

                {/* Cancel Subscription - Parity of friction (≤2 clicks, equal prominence) */}
                <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">Cancel Subscription</h3>
                  <p className="text-white/60 text-sm mb-4">
                    You can cancel your subscription at any time. No questions asked.
                  </p>
                  <Button
                    onClick={() => {
                      // Track cancel attempt
                      if (typeof window !== 'undefined' && 'gtag' in window) {
                        const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
                        gtag('event', 'billing_cancel_click', {
                          step: 'initiated',
                        })
                      }
                      // In a real app, this would open a cancel flow
                      alert('Cancel flow would open here. This is a demo.')
                    }}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Panel */}
          {activeTab === 'notifications' && (
            <div
              id="notifications-panel"
              role="tabpanel"
              aria-labelledby="notifications-tab"
              className="space-y-6"
            >
              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-4">Notification Preferences</h2>
                <p className="text-white/60 mb-6">
                  Choose how you want to receive updates from us.
                </p>
                <p className="text-white/40 text-sm">
                  Notification preferences coming soon. For now, you can manage email preferences through our newsletter.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { useConsent } from '@/components/consent/consent-manager'

export function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID?: string }) {
    const { preferences, hasConsented } = useConsent()
    const [shouldLoad, setShouldLoad] = useState(false)

    useEffect(() => {
        // Only load if user has consented to analytics
        if (hasConsented && preferences.analytics) {
            setShouldLoad(true)
        }
    }, [hasConsented, preferences.analytics])

    // Also listen for consent-granted event
    useEffect(() => {
        const handleConsentGranted = (e: CustomEvent) => {
            if (e.detail?.category === 'analytics') {
                setShouldLoad(true)
            }
        }

        window.addEventListener('consent-granted', handleConsentGranted as EventListener)
        return () => {
            window.removeEventListener('consent-granted', handleConsentGranted as EventListener)
        }
    }, [])

    if (!GA_MEASUREMENT_ID || !shouldLoad) return null

    return (
        <>
            <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
            />
        </>
    )
}

'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { useConsent } from '@/components/consent/consent-manager'

export function MicrosoftClarity({ projectId }: { projectId?: string }) {
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

    if (!projectId || !shouldLoad) return null

    return (
        <Script
            id="microsoft-clarity"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
                __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
            }}
        />
    )
}

'use client'

import Script from 'next/script'

declare global {
    interface Window {
        Calendly?: {
            initBadgeWidget: (options: {
                url: string
                text: string
                color: string
                textColor: string
                branding: boolean
            }) => void
        }
    }
}

export function CalendlyWidget() {
    return (
        <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="lazyOnload"
            onLoad={() => {
                if (typeof window !== 'undefined' && window.Calendly) {
                    window.Calendly.initBadgeWidget({
                        url: 'https://calendly.com/thisistheorypro/30min?hide_event_type_details=1&hide_gdpr_banner=1',
                        text: 'Schedule time with me',
                        color: '#0069ff',
                        textColor: '#ffffff',
                        branding: true
                    })
                }
            }}
        />
    )
}

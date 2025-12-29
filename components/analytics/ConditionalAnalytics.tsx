'use client'

import { GoogleAnalytics } from './GoogleAnalytics'
import { MicrosoftClarity } from './MicrosoftClarity'

interface ConditionalAnalyticsProps {
  gaId?: string
  clarityId?: string
}

export function ConditionalAnalytics({ gaId, clarityId }: ConditionalAnalyticsProps) {
  return (
    <>
      <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />
      <MicrosoftClarity projectId={clarityId} />
    </>
  )
}


'use client'

import { type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { LenisProvider } from './lenis-provider'
import { GSAPProvider } from './gsap-provider'
import { GreetingProvider } from './greeting-provider'
import { LoadingProvider } from './loading-provider'
import { AuthProvider } from '@/lib/auth-context'
import { ConsentManager } from '@/components/consent/consent-manager'
import { ConditionalAnalytics } from '@/components/analytics/ConditionalAnalytics'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <ConsentManager>
      <ConditionalAnalytics
        gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-EC3FCCNML9'}
        clarityId={process.env.NEXT_PUBLIC_CLARITY_ID || 'urpwf3kysj'}
      />
      <AuthProvider>
        {isAdmin ? (
          // Admin routes don't need animation providers
          children
        ) : (
          // Public routes get full experience
          <GSAPProvider>
            <LenisProvider>
              <GreetingProvider>
                <LoadingProvider>{children}</LoadingProvider>
              </GreetingProvider>
            </LenisProvider>
          </GSAPProvider>
        )}
      </AuthProvider>
    </ConsentManager>
  )
}

'use client'

import type { ReactNode } from 'react'
import { LenisProvider } from './lenis-provider'
import { GSAPProvider } from './gsap-provider'
import { GreetingProvider } from './greeting-provider'
import { LoadingProvider } from './loading-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <GSAPProvider>
      <LenisProvider>
        <GreetingProvider>
          <LoadingProvider>{children}</LoadingProvider>
        </GreetingProvider>
      </LenisProvider>
    </GSAPProvider>
  )
}

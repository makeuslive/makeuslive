'use client'

import type { ReactNode } from 'react'
import { LenisProvider } from './lenis-provider'
import { GSAPProvider } from './gsap-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <GSAPProvider>
      <LenisProvider>{children}</LenisProvider>
    </GSAPProvider>
  )
}


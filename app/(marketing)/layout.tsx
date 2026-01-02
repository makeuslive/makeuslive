import type { ReactNode } from 'react'
import StarsCanvasWrapper from '@/components/canvas/stars-canvas-wrapper'

interface MarketingLayoutProps {
  children: ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <>
      <StarsCanvasWrapper />
      {children}
    </>
  )
}

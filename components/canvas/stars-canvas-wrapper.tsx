'use client'

import dynamic from 'next/dynamic'

// Lazy load heavy canvas with SSR disabled - must be in a Client Component
const StarsCanvas = dynamic(
    () => import('@/components/canvas/stars-canvas').then((mod) => mod.StarsCanvas),
    { ssr: false }
)

export default function StarsCanvasWrapper() {
    return <StarsCanvas />
}

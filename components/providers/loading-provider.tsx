'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { LoadingScreen } from '@/components/loading'
import { useGreeting } from './greeting-provider'

interface LoadingProviderProps {
    children: ReactNode
    minimumLoadTime?: number
}

export function LoadingProvider({
    children,
    minimumLoadTime = 2800
}: LoadingProviderProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [showContent, setShowContent] = useState(false)
    const { hasVisitedThisSession, setIsLoadingComplete, isHydrated } = useGreeting()

    useEffect(() => {
        // Wait for hydration before deciding to skip loading
        if (!isHydrated) return

        if (hasVisitedThisSession) {
            // Skip loading screen for return visits
            setIsLoading(false)
            setShowContent(true)
            setIsLoadingComplete(true)
        }
    }, [hasVisitedThisSession, setIsLoadingComplete, isHydrated])

    const handleLoadingComplete = () => {
        setIsLoading(false)
        // Small delay for smooth crossfade
        setTimeout(() => setShowContent(true), 50)
    }

    // Don't render anything until hydrated to prevent flash
    if (!isHydrated) {
        return (
            <div style={{ opacity: 0, visibility: 'hidden' }}>
                {children}
            </div>
        )
    }

    return (
        <>
            {isLoading && !hasVisitedThisSession && (
                <LoadingScreen
                    onLoadingComplete={handleLoadingComplete}
                    minimumLoadTime={minimumLoadTime}
                />
            )}
            <div
                style={{
                    opacity: showContent ? 1 : 0,
                    transition: 'opacity 0.6s ease-out',
                    visibility: showContent ? 'visible' : 'hidden',
                }}
            >
                {children}
            </div>
        </>
    )
}

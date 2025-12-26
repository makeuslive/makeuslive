'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface GreetingContextType {
    currentIndex: number
    setCurrentIndex: (index: number | ((prev: number) => number)) => void
    isLoadingComplete: boolean
    setIsLoadingComplete: (complete: boolean) => void
    hasVisitedThisSession: boolean
    isHydrated: boolean
}

const GreetingContext = createContext<GreetingContextType | null>(null)

export function GreetingProvider({ children }: { children: ReactNode }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLoadingComplete, setIsLoadingComplete] = useState(false)
    const [hasVisitedThisSession, setHasVisitedThisSession] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)

    // Check session storage after hydration to avoid mismatch
    useEffect(() => {
        const visited = sessionStorage.getItem('mul-visited') === 'true'
        setHasVisitedThisSession(visited)
        setIsHydrated(true)
    }, [])

    return (
        <GreetingContext.Provider
            value={{
                currentIndex,
                setCurrentIndex,
                isLoadingComplete,
                setIsLoadingComplete,
                hasVisitedThisSession,
                isHydrated
            }}
        >
            {children}
        </GreetingContext.Provider>
    )
}

export function useGreeting() {
    const context = useContext(GreetingContext)
    if (!context) {
        throw new Error('useGreeting must be used within a GreetingProvider')
    }
    return context
}

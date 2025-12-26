'use client'

import { memo, useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { useGreeting } from '@/components/providers/greeting-provider'
import { GLOBAL_GREETINGS } from '@/lib/greetings'

interface LoadingScreenProps {
    onLoadingComplete?: () => void
    minimumLoadTime?: number
    className?: string
}

export const LoadingScreen = memo<LoadingScreenProps>(({
    onLoadingComplete,
    minimumLoadTime = 2800,
    className
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLHeadingElement>(null)
    const langRef = useRef<HTMLSpanElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)

    const { currentIndex, setCurrentIndex, setIsLoadingComplete } = useGreeting()
    const [isExiting, setIsExiting] = useState(false)
    const [progress, setProgress] = useState(0)

    // Progress animation
    useEffect(() => {
        const startTime = Date.now()
        const duration = minimumLoadTime

        const updateProgress = () => {
            const elapsed = Date.now() - startTime
            const newProgress = Math.min((elapsed / duration) * 100, 100)
            setProgress(newProgress)

            if (newProgress < 100) {
                requestAnimationFrame(updateProgress)
            }
        }

        requestAnimationFrame(updateProgress)
    }, [minimumLoadTime])

    // Greeting text cycling animation
    useEffect(() => {
        const text = textRef.current
        const lang = langRef.current
        const glow = glowRef.current

        if (!text || !lang || !glow || isExiting) return

        // Initial state
        gsap.set([text, lang], { opacity: 1, scale: 1, y: 0 })

        // For first render - just wait then animate out
        if (currentIndex === 0) {
            const timer = setTimeout(() => {
                gsap.to([text, lang], {
                    opacity: 0,
                    y: -30,
                    scale: 0.85,
                    duration: 0.4,
                    ease: 'power2.in',
                    onComplete: () => setCurrentIndex(1)
                })
            }, 700)
            return () => clearTimeout(timer)
        }

        // For subsequent greetings - faster cycle during loading
        const tl = gsap.timeline({
            onComplete: () => {
                setCurrentIndex((currentIndex + 1) % GLOBAL_GREETINGS.length)
            }
        })

        tl.fromTo([text, lang],
            { opacity: 0, y: 30, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
        )
            .to(glow, {
                opacity: 0.8,
                scale: 1.3,
                duration: 0.5,
                yoyo: true,
                repeat: 1
            }, '-=0.3')
            .to({}, { duration: 0.4 }) // Hold - shorter during loading
            .to([text, lang], {
                opacity: 0,
                y: -30,
                scale: 0.85,
                duration: 0.4,
                ease: 'power2.in'
            })

        return () => { tl.kill() }
    }, [currentIndex, isExiting, setCurrentIndex])

    // Exit animation when loading complete
    const handleExit = useCallback(() => {
        if (isExiting) return
        setIsExiting(true)

        const container = containerRef.current
        const text = textRef.current
        const lang = langRef.current

        if (!container) return

        // Kill any existing animations on text
        gsap.killTweensOf([text, lang])

        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoadingComplete(true)
                sessionStorage.setItem('mul-visited', 'true')
                onLoadingComplete?.()
            }
        })

        // Animate the background out while keeping text visible
        // Text will continue in hero section
        tl.to('.loading-bg', {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut'
        })
            .to('.loading-progress', {
                opacity: 0,
                y: 20,
                duration: 0.4,
                ease: 'power2.in'
            }, '-=0.4')
            // Now fade the whole container after a brief pause
            .to(container, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.out'
            }, '+=0.1')
            .set(container, { display: 'none' })

    }, [isExiting, onLoadingComplete, setIsLoadingComplete])

    // Trigger exit when progress reaches 100
    useEffect(() => {
        if (progress >= 100 && !isExiting) {
            // Small delay to let the current animation finish
            const timer = setTimeout(handleExit, 200)
            return () => clearTimeout(timer)
        }
    }, [progress, isExiting, handleExit])

    const current = GLOBAL_GREETINGS[currentIndex]
    const isRTL = current.script === 'Arabic' || current.script === 'Hebrew'

    return (
        <div
            ref={containerRef}
            className={cn(
                'fixed inset-0 z-[9999]',
                'flex flex-col items-center justify-center',
                className
            )}
        >
            {/* Background - fades out first */}
            <div className="loading-bg absolute inset-0 bg-bg">
                {/* Radial gradient pulse */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(221,206,175,0.3) 0%, transparent 70%)',
                        animation: 'pulse 2s ease-in-out infinite'
                    }}
                />

                {/* Floating orbs */}
                <div
                    className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl"
                    style={{
                        background: 'linear-gradient(135deg, #DDCEAF 0%, #B8A88A 100%)',
                        animation: 'float 4s ease-in-out infinite'
                    }}
                />
                <div
                    className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-10 blur-3xl"
                    style={{
                        background: 'linear-gradient(225deg, #DDCEAF 0%, #9A8B6F 100%)',
                        animation: 'float 4s ease-in-out infinite',
                        animationDelay: '-2s'
                    }}
                />
            </div>

            {/* Greeting content - positioned to match hero location */}
            <div className="relative z-10">
                {/* Glow behind text */}
                <div
                    ref={glowRef}
                    className="absolute inset-0 -z-10 opacity-0"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(221,206,175,0.5) 0%, transparent 70%)',
                        filter: 'blur(50px)',
                        transform: 'scale(2)',
                    }}
                />

                {/* Main greeting text - matches hero styling */}
                <h1
                    ref={textRef}
                    className={cn(
                        'text-6xl sm:text-7xl md:text-8xl lg:text-[128px]',
                        'font-bold italic text-text',
                        'drop-shadow-2xl',
                        'select-none text-center',
                        isRTL ? 'direction-rtl' : ''
                    )}
                    style={{
                        textShadow: '0 0 60px rgba(221,206,175,0.5), 12px 10px 9px rgba(0,0,0,0.85)',
                    }}
                >
                    {current.text}
                </h1>

                {/* Language label - matches hero styling */}
                <span
                    ref={langRef}
                    className="block mt-6 text-center text-lg md:text-xl text-gold font-medium tracking-wide"
                >
                    {current.lang}
                </span>
            </div>

            {/* Progress bar */}
            <div className="loading-progress absolute bottom-16 left-1/2 -translate-x-1/2 w-48 sm:w-64">
                <div className="h-0.5 bg-text-dim/20 rounded-full overflow-hidden">
                    <div
                        ref={progressRef}
                        className="h-full bg-gradient-to-r from-gold/50 via-gold to-gold/50 rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="mt-3 text-center text-xs text-text-dim font-medium tracking-widest uppercase">
                    Loading Experience
                </p>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.3; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
        </div>
    )
})

LoadingScreen.displayName = 'LoadingScreen'

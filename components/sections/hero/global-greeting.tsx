'use client'

import { memo, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { GLOBAL_GREETINGS } from '@/lib/greetings'
import { useGreeting } from '@/components/providers/greeting-provider'

interface GlobalGreetingProps {
  className?: string
}

export const GlobalGreeting = memo<GlobalGreetingProps>(({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const langRef = useRef<HTMLSpanElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const {
    currentIndex,
    setCurrentIndex,
    isLoadingComplete,
    hasVisitedThisSession,
    isHydrated
  } = useGreeting()

  useEffect(() => {
    const text = textRef.current
    const lang = langRef.current
    const glow = glowRef.current

    if (!text || !lang || !glow || !isHydrated) return

    // If returning visitor (skip loading), show greeting immediately
    if (hasVisitedThisSession && currentIndex === 0) {
      gsap.set([text, lang], { opacity: 1, scale: 1, y: 0 })

      const timer = setTimeout(() => {
        gsap.to([text, lang], {
          opacity: 0,
          y: -20,
          scale: 0.9,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => setCurrentIndex(1)
        })
      }, 2000)
      return () => clearTimeout(timer)
    }

    // If coming from loading screen, continue the animation seamlessly
    if (isLoadingComplete) {
      // Animate in from loading transition
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentIndex((prev) => (prev + 1) % GLOBAL_GREETINGS.length)
        }
      })

      tl.fromTo([text, lang],
        { opacity: 0, y: 20, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      )
        .to(glow, {
          opacity: 0.6,
          scale: 1.2,
          duration: 0.8,
          yoyo: true,
          repeat: 1
        }, '-=0.5')
        .to({}, { duration: 2 }) // Hold - normal pace in hero
        .to([text, lang], {
          opacity: 0,
          y: -20,
          scale: 0.9,
          duration: 0.5,
          ease: 'power2.in'
        })

      return () => { tl.kill() }
    }

    // While loading screen is active, hide hero greeting
    gsap.set([text, lang], { opacity: 0 })

  }, [currentIndex, isLoadingComplete, hasVisitedThisSession, isHydrated, setCurrentIndex])

  const current = GLOBAL_GREETINGS[currentIndex]

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'will-change-transform',
        className
      )}
    >
      {/* Glow effect behind text */}
      <div
        ref={glowRef}
        className="absolute inset-0 -z-10 opacity-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(221,206,175,0.4) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Main greeting text */}
      <h1
        ref={textRef}
        className={cn(
          'text-6xl sm:text-7xl md:text-8xl lg:text-[128px]',
          'font-bold italic text-text',
          'drop-shadow-2xl',
          'select-none',
          // RTL support for Arabic/Hebrew/Urdu
          current.script === 'Arabic' || current.script === 'Hebrew'
            ? 'direction-rtl'
            : ''
        )}
        style={{
          textShadow: '0 0 60px rgba(221,206,175,0.5), 12px 10px 9px rgba(0,0,0,0.85)',
        }}
      >
        {current.text}
      </h1>

      {/* Language label - clean and minimal */}
      <span
        ref={langRef}
        className="mt-6 text-lg md:text-xl text-gold font-medium tracking-wide"
      >
        {current.lang}
      </span>
    </div>
  )
})

GlobalGreeting.displayName = 'GlobalGreeting'

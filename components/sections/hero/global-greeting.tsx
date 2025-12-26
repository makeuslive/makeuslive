'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'

/**
 * 20+ Global Greetings - Sorted by number of speakers
 */
const GLOBAL_GREETINGS = [
  { text: 'Hello', lang: 'English', script: 'Latin' },
  { text: '你好', lang: 'Mandarin', script: 'Hanzi' },
  { text: 'नमस्ते', lang: 'Hindi', script: 'Devanagari' },
  { text: 'Hola', lang: 'Spanish', script: 'Latin' },
  { text: 'مرحبا', lang: 'Arabic', script: 'Arabic' },
  { text: 'Bonjour', lang: 'French', script: 'Latin' },
  { text: 'হ্যালো', lang: 'Bengali', script: 'Bengali' },
  { text: 'Olá', lang: 'Portuguese', script: 'Latin' },
  { text: 'Привет', lang: 'Russian', script: 'Cyrillic' },
  { text: 'Halo', lang: 'Indonesian', script: 'Latin' },
  { text: 'سلام', lang: 'Urdu', script: 'Arabic' },
  { text: 'Hallo', lang: 'German', script: 'Latin' },
  { text: 'こんにちは', lang: 'Japanese', script: 'Hiragana' },
  { text: 'నమస్కారం', lang: 'Telugu', script: 'Telugu' },
  { text: 'Merhaba', lang: 'Turkish', script: 'Latin' },
  { text: '안녕하세요', lang: 'Korean', script: 'Hangul' },
  { text: 'Ciao', lang: 'Italian', script: 'Latin' },
  { text: 'สวัสดี', lang: 'Thai', script: 'Thai' },
  { text: 'Xin chào', lang: 'Vietnamese', script: 'Latin' },
  { text: 'Γεια σου', lang: 'Greek', script: 'Greek' },
  { text: 'שלום', lang: 'Hebrew', script: 'Hebrew' },
  { text: 'Sawubona', lang: 'Zulu', script: 'Latin' },
] as const

interface GlobalGreetingProps {
  className?: string
}

export const GlobalGreeting = memo<GlobalGreetingProps>(({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const langRef = useRef<HTMLSpanElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    const lang = langRef.current
    const glow = glowRef.current

    if (!container || !text || !lang || !glow) return

    // Master timeline that repeats infinitely
    const masterTL = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        setCurrentIndex((prev) => (prev + 1) % GLOBAL_GREETINGS.length)
      },
    })

    // Animation sequence for each greeting
    masterTL
      // 1. Fade in with scale
      .fromTo(
        text,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      // 2. Language label fade in
      .fromTo(
        lang,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        '-=0.4'
      )
      // 3. Glow pulse effect
      .to(
        glow,
        {
          opacity: 0.6,
          scale: 1.2,
          duration: 0.8,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1,
        },
        '-=0.2'
      )
      // 4. Hold for viewing
      .to({}, { duration: 2 })
      // 5. Fade out with scale
      .to(text, {
        opacity: 0,
        scale: 0.9,
        y: -20,
        duration: 0.6,
        ease: 'power2.in',
      })
      .to(
        lang,
        { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' },
        '-=0.4'
      )

    // Floating animation (continuous)
    gsap.to(container, {
      y: -15,
      duration: 3,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    })

    return () => {
      masterTL.kill()
      gsap.killTweensOf(container)
    }
  }, [])

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

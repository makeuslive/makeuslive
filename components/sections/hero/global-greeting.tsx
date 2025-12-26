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

    // Initial State: Ensure elements are visible (for LCP)
    gsap.set([text, lang], { opacity: 1, scale: 1, y: 0 })

    // Master timeline
    const masterTL = gsap.timeline({
      repeat: -1,
      // We don't need onRepeat here because we handle index updates manually in the loop
      // or we can structure differently. 
      // Better approach for React state + GSAP:
      // We rely on the timeline to animate ONE cycle, then update state, then run again?
      // No, that causes re-renders.
      // 
      // Alternative: Standard vanilla JS array loop inside GSAP?
      // Since we need to update React State (to change text), we must use `call()`.
    })

    // However, updating State updates DOM, which breaks GSAP refs if not careful.
    // Given the current structure uses a single ref `textRef` and swaps text via React state `currentIndex`.
    // The previous implementation worked because `onRepeat` updated the index, but that only happens after the whole timeline?
    // No, the previous timeline defined ONE animation cycle.

    // NEW STRATEGY for LCP:
    // 1. First "Hello" is static visible.
    // 2. Timeline starts with a delay (viewing time).
    // 3. Animate OUT current text.
    // 4. Update State (change text).
    // 5. Animate IN new text.

    const animateCycle = () => {
      // 1. Animate Out
      const tl = gsap.timeline({
        onComplete: () => {
          // Update text for next cycle
          setCurrentIndex((prev) => (prev + 1) % GLOBAL_GREETINGS.length)
        }
      })

      tl.to([text, lang], {
        opacity: 0,
        y: -20,
        scale: 0.9,
        duration: 0.5,
        ease: 'power2.in'
      })
    }

    // We need to coordinate the state update with the animation In.
    // React `useEffect` fires when `currentIndex` changes.
    // So we can split logic:

  }, [])

  // Effect to handle Entrance animation whenever index changes
  useEffect(() => {
    const text = textRef.current
    const lang = langRef.current
    const glow = glowRef.current

    if (!text || !lang || !glow) return

    // If it's the very first render (Hello), do NOT animate IN.
    // We want it visible immediately for LCP.
    if (currentIndex === 0) {
      // Just animate OUT after delay
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

    // For all other indices: Animate IN -> Hold -> Animate OUT
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
      .to({}, { duration: 2 }) // Hold
      .to([text, lang], {
        opacity: 0,
        y: -20,
        scale: 0.9,
        duration: 0.5,
        ease: 'power2.in'
      })

    return () => { tl.kill() }
  }, [currentIndex])

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

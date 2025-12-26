'use client'

import { memo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const Footer = memo(() => {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const ctx = gsap.context(() => {
      // Simple fade-in animation that plays once and doesn't reverse
      gsap.from('.footer-column', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footer,
          start: 'top 95%',
          toggleActions: 'play none none none', // Only play once, never reverse
        },
      })
    }, footer)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative bg-black/50 backdrop-blur-sm border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Single Row Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Brand & Copyright */}
          <div className="footer-column flex items-center gap-3">
            <span className="text-text font-semibold text-sm">MAKEUSLIVE</span>
            <span className="hidden md:block w-px h-4 bg-white/20" />
            <span className="text-text-muted text-xs">
              © {new Date().getFullYear()} All rights reserved
            </span>
          </div>

          {/* Center: Nav Links */}
          <nav className="footer-column flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-text-muted text-xs hover:text-text transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-text-muted text-xs hover:text-text transition-colors"
            >
              Terms
            </Link>
            <a
              href="mailto:hello@makeuslive.com"
              className="text-text-muted text-xs hover:text-gold transition-colors"
            >
              hello@makeuslive.com
            </a>
          </nav>

          {/* Right: Location */}
          <div className="footer-column text-text-muted text-xs">
            Bhopal, India
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

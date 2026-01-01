'use client'

import { memo, useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { COPY } from '@/lib/constants'
import { MenuIcon, CloseIcon, ArrowRight } from '@/components/ui'
import { SkipLinks } from './skip-links'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const Navbar = memo(() => {
  const navRef = useRef<HTMLElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const pathname = usePathname()

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const isActiveLink = useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/'
      return pathname.startsWith(href)
    },
    [pathname]
  )

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 50)

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        gsap.to(nav, { y: -100, duration: 0.5, ease: 'power3.out' })
      } else {
        gsap.to(nav, { y: 0, duration: 0.5, ease: 'power3.out' })
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  return (
    <>
      <SkipLinks />
      <nav
        id="navigation"
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'py-4'
        )}
        style={{
          transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease',
          backdropFilter: isScrolled ? 'blur(12px) saturate(180%)' : 'blur(0px)',
          WebkitBackdropFilter: isScrolled ? 'blur(12px) saturate(180%)' : 'blur(0px)',
          backgroundColor: isScrolled ? 'rgba(5, 5, 5, 0.7)' : 'transparent',
          boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.15)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Desktop: 3-column layout for true center alignment */}
          <div className="hidden md:grid md:grid-cols-3 items-center">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2 justify-self-start">
              <Image
                src="/images/logo.png"
                alt="MakeUsLive"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Center: Navigation Links */}
            <nav className="flex items-center justify-center gap-8">
              {COPY.nav.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'font-display transition-colors duration-300',
                    'relative py-1',
                    isActiveLink(link.href)
                      ? 'text-gold'
                      : 'text-gold/70 hover:text-gold',
                    'after:absolute after:bottom-0 after:left-0',
                    'after:h-0.5 after:bg-gold-dark',
                    'after:transition-all after:duration-300',
                    isActiveLink(link.href) ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: CTA Button */}
            <div className="justify-self-end">
              <Link
                href="/contact"
                className={cn(
                  'inline-flex items-center justify-center gap-2',
                  'rounded-full font-medium',
                  'transition-all duration-300 ease-out-expo',
                  'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-bg',
                  'bg-white text-bg hover:bg-text hover:scale-105 active:scale-95 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]', // primary variant
                  'px-4 py-2.5 text-sm min-h-[44px]', // sm size
                  'group'
                )}
              >
                {COPY.nav.cta}
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Mobile: Simple flex layout */}
          <div className="flex md:hidden items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="MakeUsLive"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 text-text hover:text-gold transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden',
          'bg-bg/95 backdrop-blur-xl',
          'transition-all duration-500 ease-out-expo',
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
          {COPY.nav.links.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className={cn(
                'font-display text-3xl transition-all duration-300',
                'transform',
                isActiveLink(link.href) ? 'text-gold' : 'text-gold/70',
                isMenuOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              )}
              style={{ transitionDelay: isMenuOpen ? `${index * 100}ms` : '0ms' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={closeMenu}
            className={cn(
              'mt-4 transition-all duration-300',
              isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
              'inline-flex items-center justify-center gap-2',
              'rounded-full font-medium',
              'transition-all duration-300 ease-out-expo',
              'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-bg',
              'bg-white text-bg hover:bg-text hover:scale-105 active:scale-95 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]', // primary variant
              'px-8 py-4 text-lg min-h-[48px]' // lg size
            )}
            style={{ transitionDelay: isMenuOpen ? '400ms' : '0ms' }}
          >
            {COPY.nav.cta}
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </>
  )
})

Navbar.displayName = 'Navbar'

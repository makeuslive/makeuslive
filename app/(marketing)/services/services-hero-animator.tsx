'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'

export default function ServicesHeroAnimator() {
    useEffect(() => {
        // Only run on client
        const ctx = gsap.context(() => {
            gsap.from('.services-hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
            gsap.from('.services-hero-title', { y: 60, opacity: 0, duration: 1, delay: 0.1, ease: 'power3.out' })
            gsap.from('.services-hero-subtitle', { y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' })
        })

        return () => ctx.revert()
    }, [])

    return null
}

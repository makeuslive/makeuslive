'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// Calendar icon component
const CalendarIcon = ({ size = 20 }: { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)

// Close icon component
const CloseIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

// External link icon component
const ExternalLinkIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
)

export const CALENDLY_URL = 'https://calendly.com/hello-makeuslive/new-meeting'

export function CalendlyWidget() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const pathname = usePathname()

    // Hide on admin pages
    const isAdminPage = pathname?.startsWith('/admin')

    // Show widget after a short delay for better UX
    useEffect(() => {
        if (isAdminPage) {
            setIsVisible(false)
            return
        }

        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 2000)

        return () => clearTimeout(timer)
    }, [isAdminPage])

    if (!isVisible || isAdminPage) return null

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence mode="wait">
                {isExpanded ? (
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                        className="relative"
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold-dark/20 to-gold/20 rounded-2xl blur-xl opacity-60" />

                        {/* Panel content */}
                        <div className="relative glass-card p-5 rounded-2xl min-w-[280px] border border-gold/20">
                            {/* Close button */}
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200"
                                aria-label="Close panel"
                            >
                                <CloseIcon />
                            </button>

                            {/* Header */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <span className="text-gold">
                                        <CalendarIcon />
                                    </span>
                                    Schedule a Call
                                </h3>
                                <p className="text-sm text-text-muted mt-1">
                                    20-minute call. No pitch.
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-3 mb-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-gold text-xs">✓</span>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        Understand what you need
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-gold text-xs">✓</span>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        Share how we can help
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-gold text-xs">✓</span>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        Decide if it's a fit
                                    </p>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <a
                                href={CALENDLY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-bg font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-gold/25 active:scale-[0.98]"
                            >
                                Pick a Time
                                <ExternalLinkIcon />
                            </a>

                            {/* Footer text */}
                            <p className="text-xs text-text-dim text-center mt-3">
                                20-30 min · No obligation
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        key="button"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                        onClick={() => setIsExpanded(true)}
                        className="group relative"
                        aria-label="Book a call"
                    >
                        {/* Pulse animation ring */}
                        <span className="absolute inset-0 rounded-full bg-gold/30 animate-ping opacity-75" />

                        {/* Glow effect */}
                        <span className="absolute -inset-1 bg-gradient-to-r from-gold to-gold-dark rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-300" />

                        {/* Button content */}
                        <span className="relative flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-gold to-gold-dark text-bg font-semibold shadow-lg shadow-gold/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-gold/30">
                            <CalendarIcon />
                            <span className="hidden sm:inline">Schedule a Call</span>
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}

// Exportable Book a Call button for use in other components (like Contact form)
export function BookCallButton({ className = '' }: { className?: string }) {
    return (
        <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-gold/20 to-gold-dark/20 border border-gold/30 text-gold font-medium transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:scale-[1.02] ${className}`}
        >
            <CalendarIcon size={18} />
            <span>Schedule a Call</span>
            <ExternalLinkIcon />
        </a>
    )
}

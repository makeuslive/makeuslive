'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// Calendar icon component
const CalendarIcon = () => (
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

// Mail icon component
const MailIcon = () => (
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
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
)

// Send icon component
const SendIcon = () => (
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
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
)

// Check icon component
const CheckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const CALENDLY_URL = 'https://calendly.com/hello-makeuslive/new-meeting'

type TabType = 'book' | 'contact'

export function CalendlyWidget() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>('book')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
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

    // Reset form when closing
    useEffect(() => {
        if (!isExpanded) {
            setTimeout(() => {
                setIsSubmitted(false)
                setFormData({ name: '', email: '', message: '' })
            }, 300)
        }
    }, [isExpanded])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setIsSubmitted(true)
            }
        } catch (error) {
            console.error('Failed to submit form:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

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
                        <div className="relative glass-card p-5 rounded-2xl min-w-[320px] max-w-[360px] border border-gold/20">
                            {/* Close button */}
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200 z-10"
                                aria-label="Close panel"
                            >
                                <CloseIcon />
                            </button>

                            {/* Tab switcher */}
                            <div className="flex gap-1 mb-4 bg-white/5 rounded-xl p-1">
                                <button
                                    onClick={() => setActiveTab('book')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'book'
                                            ? 'bg-gradient-to-r from-gold to-gold-dark text-bg'
                                            : 'text-text-muted hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <CalendarIcon />
                                    Book a Call
                                </button>
                                <button
                                    onClick={() => setActiveTab('contact')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'contact'
                                            ? 'bg-gradient-to-r from-gold to-gold-dark text-bg'
                                            : 'text-text-muted hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <MailIcon />
                                    Message
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'book' ? (
                                    <motion.div
                                        key="book"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/* Header */}
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-white">
                                                Schedule a Meeting
                                            </h3>
                                            <p className="text-sm text-text-muted mt-1">
                                                Book a free consultation call
                                            </p>
                                        </div>

                                        {/* Benefits */}
                                        <div className="space-y-2.5 mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-gold text-[10px]">✓</span>
                                                </div>
                                                <p className="text-sm text-text-muted">
                                                    Discuss your project requirements
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-gold text-[10px]">✓</span>
                                                </div>
                                                <p className="text-sm text-text-muted">
                                                    Get expert advice & solutions
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-gold text-[10px]">✓</span>
                                                </div>
                                                <p className="text-sm text-text-muted">
                                                    No commitment required
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
                                            Schedule Now
                                            <ExternalLinkIcon />
                                        </a>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="contact"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isSubmitted ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="py-8 text-center"
                                            >
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <span className="text-green-400">
                                                        <CheckIcon />
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-white mb-2">
                                                    Message Sent!
                                                </h3>
                                                <p className="text-sm text-text-muted">
                                                    We&apos;ll get back to you soon.
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <>
                                                {/* Header */}
                                                <div className="mb-4">
                                                    <h3 className="text-lg font-semibold text-white">
                                                        Send a Message
                                                    </h3>
                                                    <p className="text-sm text-text-muted mt-1">
                                                        We&apos;ll respond within 24 hours
                                                    </p>
                                                </div>

                                                {/* Contact Form */}
                                                <form onSubmit={handleSubmit} className="space-y-3">
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Your name"
                                                            required
                                                            value={formData.name}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, name: e.target.value })
                                                            }
                                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="email"
                                                            placeholder="Your email"
                                                            required
                                                            value={formData.email}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, email: e.target.value })
                                                            }
                                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                                                        />
                                                    </div>
                                                    <div>
                                                        <textarea
                                                            placeholder="How can we help?"
                                                            required
                                                            rows={3}
                                                            value={formData.message}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, message: e.target.value })
                                                            }
                                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-200 resize-none"
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-bg font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-gold/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Send Message
                                                                <SendIcon />
                                                            </>
                                                        )}
                                                    </button>
                                                </form>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
                            <span className="hidden sm:inline">Book a Call</span>
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}

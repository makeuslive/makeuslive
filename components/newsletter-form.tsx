'use client'

import { useState, FormEvent } from 'react'
import { cn } from '@/lib/utils'
import { formatDisplayDateTime } from '@/lib/date-utils'

export function NewsletterForm() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [subscribeTimestamp, setSubscribeTimestamp] = useState<string>('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        // Inline validation
        if (!email || !email.includes('@')) {
            setStatus('error')
            setMessage('Please enter a valid email address')
            return
        }

        setStatus('loading')

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (res.ok) {
                const timestamp = formatDisplayDateTime(new Date())
                setSubscribeTimestamp(timestamp)
                setStatus('success')
                setMessage(`Subscribed at ${timestamp}`)
                setEmail('')
                
                // Track analytics event (sanitized - no email)
                if (typeof window !== 'undefined' && 'gtag' in window) {
                    const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
                    gtag('event', 'newsletter_submit', {
                        email_valid: true,
                        ts: new Date().toISOString(),
                    })
                }
            } else if (res.status === 409) {
                setStatus('error')
                setMessage('You\'re already subscribed!')
            } else {
                setStatus('error')
                setMessage(data.error || 'Something went wrong. Please try again.')
            }
        } catch (error) {
            setStatus('error')
            setMessage('Something went wrong. Please try again.')
        }
    }

    return (
        <div className="relative z-10 text-center">


            {status === 'success' ? (
                <div className="flex items-center justify-center gap-2 text-green-400 font-medium py-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {message}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={status === 'loading'}
                        className={cn(
                            'flex-grow h-12 rounded-xl bg-white/5 px-5',
                            'text-white placeholder:text-white/40',
                            'border border-white/10',
                            'focus:outline-none focus:border-gold/50 transition-colors',
                            'disabled:opacity-50'
                        )}
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={cn(
                            'px-6 h-12 rounded-xl font-semibold',
                            'bg-gradient-to-r from-gold to-gold-dark text-bg',
                            'hover:scale-105 hover:shadow-xl hover:shadow-gold/20',
                            'transition-all duration-300',
                            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                        )}
                    >
                        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </form>
            )}

            {status === 'error' && (
                <p className="mt-4 text-red-400 text-sm">{message}</p>
            )}
        </div>
    )
}

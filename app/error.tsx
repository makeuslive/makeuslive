'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { formatDisplayDateTime } from '@/lib/date-utils'
import { Button } from '@/components/ui'

// Generate error ID
function generateErrorId(): string {
  return `ERR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const errorId = generateErrorId()
  const timestamp = formatDisplayDateTime(new Date())

  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error)
    }

    // TODO: Send error to error tracking service (e.g., Sentry)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-500 mb-4">500</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Something Went Wrong
          </h2>
          <p className="text-white/60 text-lg">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>
        </div>

        {/* Error Details */}
        <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10 text-left">
          <p className="text-white/40 text-sm mb-2">
            <strong className="text-white">Error ID:</strong> {errorId}
          </p>
          {error.digest && (
            <p className="text-white/40 text-sm mb-2">
              <strong className="text-white">Digest:</strong> {error.digest}
            </p>
          )}
          <p className="text-white/40 text-sm">
            <strong className="text-white">Timestamp:</strong> {timestamp}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="secondary">Go Home</Button>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="mb-8">
          <p className="text-white/60 mb-4">Or visit one of these pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              Services
            </Link>
            <Link
              href="/blog"
              className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Recovery Suggestions */}
        <div className="text-left max-w-md mx-auto p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-white font-semibold mb-2">What you can do:</h3>
          <ul className="text-white/60 text-sm space-y-1 list-disc list-inside">
            <li>Try refreshing the page</li>
            <li>Wait a few moments and try again</li>
            <li>Clear your browser cache</li>
            <li>Contact us if the problem persists</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


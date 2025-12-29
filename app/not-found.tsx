import Link from 'next/link'
import { formatDisplayDateTime } from '@/lib/date-utils'
import { Button } from '@/components/ui'

// Generate error ID
function generateErrorId(): string {
  return `ERR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

export default function NotFound() {
  const errorId = generateErrorId()
  const timestamp = formatDisplayDateTime(new Date())

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gold mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-white/60 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Error Details */}
        <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10 text-left">
          <p className="text-white/40 text-sm mb-2">
            <strong className="text-white">Error ID:</strong> {errorId}
          </p>
          <p className="text-white/40 text-sm">
            <strong className="text-white">Timestamp:</strong> {timestamp}
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <form
            action="/search"
            method="get"
            className="flex gap-3 max-w-md mx-auto"
          >
            <input
              type="search"
              name="q"
              placeholder="Search our site..."
              className="flex-1 h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors"
              aria-label="Search"
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </form>
        </div>

        {/* Navigation Links */}
        <div className="mb-8">
          <p className="text-white/60 mb-4">Or visit one of these pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              Home
            </Link>
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
            <li>Check the URL for typos</li>
            <li>Go back to the previous page</li>
            <li>Use the search box above</li>
            <li>Visit our homepage</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


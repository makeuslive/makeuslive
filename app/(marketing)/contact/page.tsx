import { Metadata } from 'next'
import { Contact } from '@/components/sections'
import { contactPageSchema } from '@/lib/schema/global'

export const metadata: Metadata = {
  title: 'Contact Make Us Live - AI & Web Development Agency',
  description: 'Get in touch with Make Us Live for AI products, web development, mobile apps, and design systems. Let\'s build something great together.',
  keywords: [
    'contact make us live',
    'hire web developer',
    'AI development agency',
    'mobile app development India',
    'creative agency contact',
  ],
  openGraph: {
    title: 'Contact Make Us Live | AI Product Development Agency',
    description: 'Ready to start your project? Contact Make Us Live - a creative digital agency specializing in AI, web development, and mobile apps.',
    url: 'https://www.makeuslive.com/contact',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.makeuslive.com/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Page-specific JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      {/* Hero Section - Optimized for less scrolling */}
      <section className="relative pt-28 md:pt-32 pb-8 md:pb-12 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.02] via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold/80">
                Contact
              </span>
            </div>

            {/* Main heading with gradient */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-[1.1]">
              <span className="text-white">Get in Touch with </span>
              <span className="bg-gradient-to-r from-white via-gold/90 to-gold bg-clip-text text-transparent">
                Make Us Live
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-white/50 leading-relaxed max-w-2xl">
              Have a project in mind? Make Us Live is here to help you build AI products, web applications, and digital experiences that stand out.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Component - without internal hero section padding */}
      <Contact className="pt-0" />
    </div>
  )
}

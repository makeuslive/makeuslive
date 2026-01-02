import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ALL_SERVICES } from '@/lib/data/services'
import { servicesPageSchema } from '@/lib/schema/global'
import ServicesClient from './services-client'
import ServicesHeroAnimator from './services-hero-animator'

export const metadata: Metadata = {
  title: 'Services | Make Us Live',
  description: 'Comprehensive digital solutions. From mobile apps to enterprise software, we design, build, and scale digital experiences.',
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Page-specific JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }}
      />
      <ServicesHeroAnimator />

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.02] via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="services-hero-badge inline-flex items-center gap-3 mb-8">
              <span className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold/80">
                What We Build
              </span>
            </div>

            {/* Main heading with gradient */}
            <h1 className="services-hero-title text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.05]">
              <span className="text-white">Services that </span>
              <span className="bg-gradient-to-r from-white via-gold/90 to-gold bg-clip-text text-transparent">
                Scale
              </span>
            </h1>

            {/* Subheading */}
            <p className="services-hero-subtitle text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mb-10">
              Make Us Live designs, builds, and scales digital experiences that captivate and convert. From mobile apps to enterprise software.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 services-hero-subtitle">
              <Link
                href="/contact"
                className={cn(
                  'group inline-flex items-center gap-3 px-8 py-4 rounded-xl',
                  'bg-gradient-to-r from-gold to-gold-dark text-bg font-semibold',
                  'transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gold/20'
                )}
              >
                Start a Project
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/work"
                className={cn(
                  'inline-flex items-center gap-3 px-8 py-4 rounded-xl',
                  'border border-white/20 text-white font-medium',
                  'transition-all duration-300 hover:border-gold/40 hover:bg-white/5'
                )}
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Our Expertise</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Comprehensive Digital Solutions
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Choose the service that fits your needs. Each one is crafted with expertise and delivered with excellence.
            </p>
          </div>

          {/* Services Grid Client Component */}
          <ServicesClient services={ALL_SERVICES} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold">
              Something Amazing
            </span>
            ?
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            Let's discuss your project. Make Us Live helps bring your vision to life.
          </p>
          <Link
            href="/contact"
            className={cn(
              'group inline-flex items-center gap-3 px-10 py-5 rounded-xl',
              'bg-white text-bg font-semibold text-lg',
              'transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20'
            )}
          >
            Get a Free Consultation
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}

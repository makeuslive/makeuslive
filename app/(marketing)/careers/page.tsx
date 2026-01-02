import { Suspense } from 'react'
import { Metadata } from 'next'
import { getJobs } from '@/lib/data/careers'
import CareersClient from './careers-client'

export const metadata: Metadata = {
  title: 'Careers | Make Us Live',
  description: 'Join our team at Make Us Live. We are building the future of digital experiences.',
}

export default async function CareerPage() {
  const jobs = await getJobs()

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join Our Team
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            We're building the future of digital experiences. Come help us shape it.
          </p>
        </header>

        {/* Perks Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Why Work With Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Remote First', description: 'Work from anywhere in the world' },
              { title: 'Competitive Pay', description: 'Fair compensation for great work' },
              { title: 'Growth Opportunities', description: 'Learn and grow with cutting-edge tech' },
              { title: 'Flexible Hours', description: "Work when you're most productive" },
              { title: 'Health Benefits', description: 'Comprehensive health insurance' },
              { title: 'Team Events', description: 'Regular team building and fun activities' },
            ].map((perk, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-white/5 border border-white/10"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{perk.title}</h3>
                <p className="text-white/60 text-sm">{perk.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* D&I Statement */}
        <section className="mb-16 p-8 rounded-lg bg-gradient-to-br from-gold/10 to-transparent border border-gold/20">
          <h2 className="text-2xl font-bold text-white mb-4">Diversity & Inclusion</h2>
          <p className="text-white/60 leading-relaxed">
            At Make Us Live, we believe that diverse teams create better products. We're committed to
            building an inclusive workplace where everyone can thrive, regardless of background,
            identity, or experience. We welcome applications from all qualified candidates.
          </p>
        </section>

        <Suspense fallback={
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-gold mx-auto"></div>
            <p className="text-white/60 mt-4">Loading positions...</p>
          </div>
        }>
          <CareersClient initialJobs={jobs} />
        </Suspense>
      </div>
    </div>
  )
}

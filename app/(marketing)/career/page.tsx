'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDisplayDate } from '@/lib/date-utils'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

// Mock job listings - would come from CMS/API
const JOB_LISTINGS = [
  {
    id: 'senior-frontend-engineer',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote / Bhopal, India',
    type: 'Full-time',
    description: 'We are looking for an experienced frontend engineer to join our team and help build amazing user experiences.',
    requirements: [
      '5+ years of experience with React/Next.js',
      'Strong TypeScript skills',
      'Experience with modern CSS frameworks',
      'Portfolio of high-quality work',
    ],
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote / Bhopal, India',
    type: 'Full-time',
    description: 'Join our design team to create beautiful, functional interfaces that users love.',
    requirements: [
      '3+ years of UI/UX design experience',
      'Proficiency in Figma',
      'Strong portfolio',
      'Understanding of design systems',
    ],
  },
]

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Product', 'Marketing'] as const
const LOCATIONS = ['All', 'Remote', 'Bhopal, India', 'Hybrid'] as const

export default function CareerPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All')
  const [selectedLocation, setSelectedLocation] = useState<string>('All')
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  const filteredJobs = JOB_LISTINGS.filter((job) => {
    if (selectedDepartment !== 'All' && job.department !== selectedDepartment) return false
    if (selectedLocation !== 'All' && !job.location.includes(selectedLocation)) return false
    return true
  })

  const displayedJob = selectedJob
    ? JOB_LISTINGS.find((job) => job.id === selectedJob)
    : null

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

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8">Open Roles</h2>
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-gold/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-white/60">
                        <span>{job.department}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <Link href={`/career/${job.id}`}>
                      <Button variant="primary">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-white/60 text-lg mb-2">No open positions match your filters</p>
              <p className="text-white/40 text-sm">
                Check back soon or contact us to learn about future opportunities
              </p>
            </div>
          )}
        </section>

        {/* Application Form (would be in detail page) */}
        {displayedJob && (
          <div className="mt-12 p-8 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Apply for {displayedJob.title}</h3>
            <p className="text-white/60 mb-6">
              Application form would be here. For now, please contact us at{' '}
              <a href="mailto:careers@makeuslive.com" className="text-gold hover:underline">
                careers@makeuslive.com
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


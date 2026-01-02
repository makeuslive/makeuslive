'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  salaryRange?: string
  resumeRequired: boolean
  portfolioRequired: boolean
  referenceWorkRequired: boolean
}

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Operations', 'Sales'] as const
const LOCATIONS = ['All', 'Remote', 'Bhopal, India', 'Hybrid'] as const

export default function CareerPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All')
  const [selectedLocation, setSelectedLocation] = useState<string>('All')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs')
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setJobs(data.data)
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter((job) => {
    if (selectedDepartment !== 'All' && job.department !== selectedDepartment) return false
    if (selectedLocation !== 'All' && !job.location.includes(selectedLocation)) return false
    return true
  })

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

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-gold mx-auto"></div>
              <p className="text-white/60 mt-4">Loading positions...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
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
                        {job.salaryRange && (
                          <>
                            <span>•</span>
                            <span className="text-gold">{job.salaryRange}</span>
                          </>
                        )}
                      </div>
                      {/* Application requirements badges */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.resumeRequired && (
                          <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded-md">Resume Required</span>
                        )}
                        {job.portfolioRequired && (
                          <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-md">Portfolio Required</span>
                        )}
                        {job.referenceWorkRequired && (
                          <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-md">Reference Work Required</span>
                        )}
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
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import type { Job } from '@/lib/data/careers'

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Operations', 'Sales'] as const
const LOCATIONS = ['All', 'Remote', 'Bhopal, India', 'Hybrid'] as const

export default function CareersClient({ initialJobs }: { initialJobs: Job[] }) {
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All')
    const [selectedLocation, setSelectedLocation] = useState<string>('All')

    const filteredJobs = initialJobs.filter((job) => {
        if (selectedDepartment !== 'All' && job.department !== selectedDepartment) return false
        if (selectedLocation !== 'All' && !job.location.includes(selectedLocation)) return false
        return true
    })

    return (
        <>
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
                                    <Link href={`/careers/${job.id}`}>
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
        </>
    )
}

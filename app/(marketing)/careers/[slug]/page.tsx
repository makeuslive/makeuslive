'use client'

import { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { formatDisplayDateTime } from '@/lib/date-utils'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

// Mock job data - would come from CMS/API
const JOB_DATA: Record<string, any> = {
  'senior-frontend-engineer': {
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
      'Experience with performance optimization',
    ],
    responsibilities: [
      'Build and maintain high-quality web applications',
      'Collaborate with design and backend teams',
      'Write clean, maintainable code',
      'Participate in code reviews',
    ],
  },
  'ui-ux-designer': {
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
    responsibilities: [
      'Design user interfaces and experiences',
      'Create design systems and component libraries',
      'Collaborate with engineering team',
      'Conduct user research',
    ],
  },
}

export default function CareerDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const job = JOB_DATA[slug]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
  })
  const [resume, setResume] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [submitTimestamp, setSubmitTimestamp] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!job) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Job Not Found</h1>
          <p className="text-white/60 mb-8">The job listing you're looking for doesn't exist.</p>
          <a href="/career" className="text-gold hover:underline">
            View All Openings
          </a>
        </div>
      </div>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx']
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowedTypes.includes(ext)) {
      alert('Please upload a PDF, DOC, or DOCX file')
      return
    }

    // Validate file size (≤10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setResume(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('submitting')

    try {
      // Simulate chunked upload with progress
      if (resume) {
        setIsUploading(true)
        setUploadProgress(0)

        // Simulate chunked upload
        const chunkSize = 1024 * 1024 // 1MB chunks
        const totalChunks = Math.ceil(resume.size / chunkSize)

        for (let i = 0; i < totalChunks; i++) {
          await new Promise((resolve) => setTimeout(resolve, 200))
          setUploadProgress(((i + 1) / totalChunks) * 100)
        }

        setIsUploading(false)
      }

      // Submit application
      const response = await fetch('/api/career/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: slug,
          ...formData,
          resumeUploaded: !!resume,
        }),
      })

      if (response.ok) {
        const timestamp = formatDisplayDateTime(new Date())
        setSubmitTimestamp(timestamp)
        setSubmitStatus('success')

        // Track analytics
        if (typeof window !== 'undefined' && 'gtag' in window) {
          const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
          gtag('event', 'career_apply_submit', {
            role_id: slug,
            ts: new Date().toISOString(),
          })
        }
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Application submission error:', error)
      setSubmitStatus('error')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Job Header */}
        <header className="mb-12">
          <a
            href="/career"
            className="text-gold hover:underline text-sm mb-4 inline-block"
          >
            ← Back to Careers
          </a>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-4 text-white/60">
            <span>{job.department}</span>
            <span>•</span>
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.type}</span>
          </div>
        </header>

        {/* Job Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">About the Role</h2>
          <p className="text-white/60 leading-relaxed mb-6">{job.description}</p>

          <h3 className="text-xl font-semibold text-white mb-3">Responsibilities</h3>
          <ul className="list-disc list-inside space-y-2 text-white/60 mb-6">
            {job.responsibilities?.map((resp: string, index: number) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold text-white mb-3">Requirements</h3>
          <ul className="list-disc list-inside space-y-2 text-white/60">
            {job.requirements?.map((req: string, index: number) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </section>

        {/* Application Form */}
        <section className="p-8 rounded-lg bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-6">Apply for This Position</h2>

          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Application Submitted!</h3>
              {submitTimestamp && (
                <p className="text-gold/80 text-sm mb-4">
                  Submitted at {submitTimestamp}
                </p>
              )}
              <p className="text-white/60 mb-6">
                We've received your application and will review it shortly. You'll receive a confirmation email shortly.
              </p>
              <Button onClick={() => window.location.reload()} variant="primary">
                Apply for Another Position
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Resume (PDF/DOC/DOCX, ≤10MB) *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  {resume ? resume.name : 'Choose File'}
                </button>
                {isUploading && (
                  <div className="mt-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                        role="progressbar"
                        aria-valuenow={uploadProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-live="polite"
                        aria-label={`Upload progress: ${Math.round(uploadProgress)}%`}
                      />
                    </div>
                    <p className="text-white/60 text-sm mt-1" aria-live="polite">
                      Uploading... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={submitStatus === 'submitting' || isUploading}
                className="w-full"
              >
                {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Application'}
              </Button>

              {submitStatus === 'error' && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Please try again or contact us directly.
                </p>
              )}
            </form>
          )}
        </section>
      </div>
    </div>
  )
}


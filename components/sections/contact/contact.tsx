'use client'

import { memo, useEffect, useRef, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { COPY } from '@/lib/constants'
import { contactFormSchema, type ContactFormData } from '@/lib/validations'
import { formatDisplayDateTime } from '@/lib/date-utils'
import {
  Button,
  Input,
  Textarea,
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  Confetti,
} from '@/components/ui'
import { BookCallButton } from '@/components/calendly-widget'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type FormStep = 'form' | 'submitting' | 'success' | 'error'

interface ContactProps {
  className?: string
}

// Allowed file types for attachments
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.zip', '.rar']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 5

const MAX_TOTAL_SIZE = 12 * 1024 * 1024 // 12MB

export const Contact = memo<ContactProps>(({ className }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<FormStep>('form')
  const [showConfetti, setShowConfetti] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [submitTimestamp, setSubmitTimestamp] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const pathname = usePathname()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      website: '',
      phone: '',
      message: '',
    },
  })

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFileError(null)

    // Validate file count
    if (attachments.length + files.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} files allowed`)
      return
    }

    let validFiles: File[] = []
    let currentTotalSize = attachments.reduce((acc, file) => acc + file.size, 0)

    // Validate each file and total size
    for (const file of files) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()

      if (!ALLOWED_FILE_TYPES.includes(ext)) {
        setFileError(`File type ${ext} not allowed. Allowed: ${ALLOWED_FILE_TYPES.join(', ')}`)
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File ${file.name} exceeds 10MB limit`)
        return
      }

      if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
        setFileError(`Total file size cannot exceed 12MB`)
        return
      }

      currentTotalSize += file.size
      validFiles.push(file)
    }

    setAttachments(prev => [...prev, ...validFiles])
    // Reset input so same file can be selected again
    if (e.target) e.target.value = ''
  }, [attachments])

  // Remove a file from attachments
  const removeFile = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
    setFileError(null)
  }, [])

  // Shake animation for form errors
  const shakeForm = useCallback(() => {
    if (!formRef.current) return
    gsap.to(formRef.current, {
      keyframes: [
        { x: -10 },
        { x: 10 },
        { x: -10 },
        { x: 10 },
        { x: 0 }
      ],
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [])

  // Handle form submission
  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      if (!agreedToTerms) {
        setFileError('Please agree to the terms and privacy policy')
        shakeForm()
        return
      }

      setStep('submitting')

      try {
        // Determine pillar from pathname or referrer
        const pillar = pathname?.includes('/services') ? 'services'
          : pathname?.includes('/blog') ? 'content'
            : pathname?.includes('/about') ? 'system'
              : 'system' // default

        // Create FormData with all fields and files
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('website', data.website || '')
        formData.append('phone', data.phone || '')
        formData.append('message', data.message)
        formData.append('agreedToTerms', String(agreedToTerms))
        formData.append('pillar', pillar) // Add pillar routing tag

        // Append all attachments
        attachments.forEach((file) => {
          formData.append('attachments', file)
        })

        const response = await fetch('/api/contact', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          const errorMsg = result.error || 'Submission failed'
          setErrorMessage(errorMsg)
          throw new Error(errorMsg)
        }

        // Set timestamp for success message
        const timestamp = formatDisplayDateTime(new Date())
        setSubmitTimestamp(timestamp)
        setStep('success')
        setShowConfetti(true)
        reset()
        setAttachments([])
        setAgreedToTerms(false)
        setTimeout(() => setShowConfetti(false), 5000)

        // Track analytics event (sanitized - no PII)
        if (typeof window !== 'undefined' && 'gtag' in window) {
          const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
          gtag('event', 'contact_submit', {
            pillar,
            ts: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error('Form submission error:', error)
        // If error message wasn't set from API response, use the error object
        if (!errorMessage) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred. Please try again.'
          )
        }
        setStep('error')
      }
    },
    [reset, attachments, agreedToTerms, shakeForm]
  )

  const onError = useCallback(() => {
    shakeForm()
  }, [shakeForm])

  const handleRetry = useCallback(() => {
    setStep('form')
  }, [])

  const handleReset = useCallback(() => {
    setStep('form')
    reset()
    setAttachments([])
    setAgreedToTerms(false)
    setFileError(null)
    setErrorMessage(null)
  }, [reset])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.contact-header', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      })

      gsap.from('.contact-info', {
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-content',
          start: 'top 80%',
        },
      })

      gsap.from('.form-field', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.contact-form',
          start: 'top 80%',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Confetti isActive={showConfetti} />

      <section
        ref={sectionRef}
        id="contact"
        className={cn('relative py-10 md:py-16', className)}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Main Glass Container matching Services section design */}
          <div
            className="relative rounded-[30px] overflow-hidden"
          >
            {/* Background image - contact us.png */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/contact us.png"
                alt="Creative studio workspace"
                fill
                className="object-cover"
              />
            </div>

            {/* Glass Morphism Overlay - Inline styles for guaranteed blur */}
            <div
              className="absolute inset-0 rounded-[30px]"
              style={{
                zIndex: 1,
                backdropFilter: 'blur(9px) saturate(193%)',
                WebkitBackdropFilter: 'blur(9px) saturate(193%)',
                backgroundColor: 'rgba(14, 17, 17, 0.7)',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.125)',
              }}
            />

            {/* Subtle gradient overlay for additional depth and light angle simulation */}
            <div
              className="absolute inset-0 rounded-[30px] z-[1] pointer-events-none"
              style={{
                background: `
                  linear-gradient(
                    135deg, 
                    rgba(255, 255, 255, 0.03) 0%, 
                    transparent 40%,
                    transparent 60%, 
                    rgba(0, 0, 0, 0.15) 100%
                  )
                `,
              }}
            />

            <div className="relative p-8 md:p-12 lg:p-16 z-[2]">
              {/* Content Grid */}
              <div className="contact-content grid lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Left: Contact Info */}
                <div className="contact-info">
                  {/* Header */}
                  <div className="contact-header mb-10 lg:mb-12">
                    {/* Decorative accent line */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="w-8 sm:w-10 md:w-12 h-[2px] bg-gradient-to-r from-gold to-gold/50 rounded-full" />
                      <span className="text-gold/90 text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase">
                        Get in Touch
                      </span>
                    </div>

                    {/* Main Heading - H2 since hero has the H1 */}
                    <h2 className="text-[26px] sm:text-[30px] md:text-[36px] lg:text-[44px] xl:text-[48px] font-bold leading-[1.1] mb-6 sm:mb-8">
                      <span className="text-text block">Let&apos;s Build Something</span>
                      <span
                        className="block mt-1 sm:mt-2 bg-clip-text text-transparent"
                        style={{
                          backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)',
                        }}
                      >
                        That Works
                      </span>
                    </h2>

                    {/* Description with better styling */}
                    <p className="text-sm sm:text-base md:text-lg text-[#ADA6A6] leading-relaxed max-w-md relative pl-3 sm:pl-4 border-l-2 border-gold/30">
                      Make Us Live is ready to hear your idea, product, or challenge. We&apos;ll take a look and respond thoughtfully.
                    </p>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-0 mt-12">
                    <a
                      href={`mailto:${COPY.contact.info.email}`}
                      className="flex items-center gap-3 py-3 text-text hover:text-gold transition-colors group"
                    >
                      <EmailIcon size={24} className="text-text" />
                      <span className="text-base md:text-lg">{COPY.contact.info.email}</span>
                    </a>

                    <a
                      href="tel:+919755825190"
                      className="flex items-center gap-3 py-3 text-text hover:text-gold transition-colors group"
                    >
                      <PhoneIcon size={24} className="text-text" />
                      <span className="text-base md:text-lg">+91 9755825190</span>
                    </a>

                    <div className="flex items-center gap-3 py-3 text-text">
                      <LocationIcon size={24} className="text-text" />
                      <span className="text-base md:text-lg">Bhopal (M.P)</span>
                    </div>
                  </div>

                  {/* Book a Call CTA */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-sm text-text-muted mb-4">
                      Prefer a quick conversation? Book a call with our team.
                    </p>
                    <BookCallButton className="w-full" />
                  </div>
                </div>

                {/* Right: Contact Form */}
                <div className="contact-form">
                  {step === 'success' ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center animate-scale-in">
                        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-semibold text-text mb-2">Message Sent!</h4>
                      {submitTimestamp && (
                        <p className="text-gold/80 text-sm mb-2">
                          Submitted at {submitTimestamp}
                        </p>
                      )}
                      <p className="text-text-muted mb-8">We&apos;ll get back to you within 24 hours.</p>
                      <Button variant="glass" onClick={handleReset}>Send Another Message</Button>
                    </div>
                  ) : step === 'error' ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-semibold text-text mb-2">Something went wrong</h4>
                      <p className="text-text-muted mb-4">
                        {errorMessage || 'Please try again or contact us directly.'}
                      </p>
                      {errorMessage && (
                        <p className="text-text-dim text-sm mb-8">
                          If this problem persists, please contact us directly at{' '}
                          <a href="mailto:hello@makeuslive.com" className="text-gold hover:underline">
                            hello@makeuslive.com
                          </a>
                        </p>
                      )}
                      {!errorMessage && (
                        <p className="text-text-muted mb-8">Please try again or contact us directly.</p>
                      )}
                      <div className="flex gap-4 justify-center">
                        <Button variant="primary" onClick={handleRetry}>Try Again</Button>
                        <Button variant="glass" onClick={() => (window.location.href = `mailto:${COPY.contact.info.email}`)}>Email Us</Button>
                      </div>
                    </div>
                  ) : (
                    <form
                      ref={formRef}
                      onSubmit={handleSubmit(onSubmit, onError)}
                      className="space-y-4"
                    >
                      {/* Name Field */}
                      <div className="form-field">
                        <Input
                          {...register('name')}
                          id="contact-name"
                          label="Name"
                          placeholder="Enter your name"
                          error={errors.name?.message}
                        />
                      </div>

                      {/* Website Field */}
                      <div className="form-field">
                        <Input
                          {...register('website')}
                          id="contact-website"
                          type="url"
                          label="Website"
                          placeholder="Enter URL"
                          error={errors.website?.message}
                        />
                      </div>

                      {/* Email & Phone Row */}
                      <div className="form-field grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          {...register('email')}
                          id="contact-email"
                          type="email"
                          label="Email"
                          placeholder="Enter email"
                          error={errors.email?.message}
                        />
                        <Input
                          {...register('phone')}
                          id="contact-phone"
                          type="tel"
                          label="Phone"
                          placeholder="Enter number"
                          error={errors.phone?.message}
                        />
                      </div>

                      {/* Message Field */}
                      <div className="form-field">
                        <Textarea
                          {...register('message')}
                          id="contact-message"
                          label="Message"
                          placeholder="Type your message"
                          error={errors.message?.message}
                          rows={4}
                        />
                      </div>

                      {/* File Attachment Field */}
                      <div className="form-field">
                        <label className="block text-sm font-medium text-text mb-2">
                          Attachments <span className="text-text-muted">(optional)</span>
                        </label>
                        <div
                          className={cn(
                            'relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer',
                            'transition-colors duration-200',
                            'border-white/20 hover:border-gold/50',
                            'bg-white/5 hover:bg-white/10'
                          )}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept={ALLOWED_FILE_TYPES.join(',')}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm text-text-muted">
                              Click to upload BRD, documents, or reference files
                            </p>
                            <p className="text-xs text-text-dim">
                              PDF, DOC, DOCX, PPT, XLS, TXT, ZIP (max 10MB each, up to 5 files)
                            </p>
                          </div>
                        </div>

                        {/* File List */}
                        {attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {attachments.map((file, index) => (
                              <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="text-sm text-text truncate">{file.name}</span>
                                  <span className="text-xs text-text-muted flex-shrink-0">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* File Error */}
                        {fileError && (
                          <p className="mt-2 text-sm text-red-400">{fileError}</p>
                        )}
                      </div>

                      {/* Submit Row */}
                      <div className="form-field flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                        {/* Checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="w-3 h-3 rounded-sm border border-[#636363] bg-transparent checked:bg-gold appearance-none cursor-pointer"
                          />
                          <span className="text-sm text-text">
                            I agree with terms of use and privacy policy
                          </span>
                        </label>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={step === 'submitting'}
                          className={cn(
                            'px-6 py-2 rounded-lg',
                            'text-white font-medium',
                            'transition-all duration-300',
                            'border border-white/25',
                            'hover:border-white/50 hover:scale-105',
                            'disabled:opacity-50 disabled:hover:scale-100'
                          )}
                          style={{
                            background: 'rgba(228, 228, 228, 0.19)',
                            backdropFilter: 'blur(42px)',
                          }}
                        >
                          {step === 'submitting' ? 'Sending...' : 'Send message'}
                        </button>
                      </div>

                      {isDirty && !isValid && (
                        <p className="text-center text-sm text-text-dim pt-2">
                          Please fill in all required fields correctly
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >
    </>
  )
})

Contact.displayName = 'Contact'

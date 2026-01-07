'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'
import type { Form, FormField } from '@/lib/form-schema'

interface FormRendererProps {
    form: Form
}

type FormStep = 'form' | 'submitting' | 'success' | 'error'

export function FormRenderer({ form }: FormRendererProps) {
    const [step, setStep] = useState<FormStep>('form')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [files, setFiles] = useState<Record<string, File[]>>({})

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    const onSubmit = useCallback(
        async (data: Record<string, unknown>) => {
            setStep('submitting')
            setErrorMessage(null)

            try {
                const formData = new FormData()

                // Add all form fields
                Object.entries(data).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach((v) => formData.append(key, v))
                    } else if (value !== undefined && value !== null) {
                        formData.append(key, String(value))
                    }
                })

                // Add file fields
                Object.entries(files).forEach(([fieldId, fileList]) => {
                    fileList.forEach((file) => formData.append(fieldId, file))
                })

                const response = await fetch(`/api/forms/${form.slug}/submissions`, {
                    method: 'POST',
                    body: formData,
                })

                const result = await response.json()

                if (!response.ok || !result.success) {
                    throw new Error(result.error || 'Submission failed')
                }

                // Check for redirect
                if (result.redirectUrl) {
                    window.location.href = result.redirectUrl
                    return
                }

                setStep('success')
                reset()
                setFiles({})
            } catch (error) {
                console.error('Form submission error:', error)
                setErrorMessage(
                    error instanceof Error ? error.message : 'An error occurred. Please try again.'
                )
                setStep('error')
            }
        },
        [form.slug, files, reset]
    )

    const handleFileChange = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || [])
        setFiles((prev) => ({ ...prev, [fieldId]: newFiles }))
    }

    const handleRetry = () => {
        setStep('form')
        setErrorMessage(null)
    }

    const handleNewResponse = () => {
        setStep('form')
        reset()
        setFiles({})
    }

    // Success state
    if (step === 'success') {
        return (
            <div className="text-center py-12 animate-scale-in">
                {/* Success animation */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
                <p className="text-white/60 mb-10 max-w-sm mx-auto leading-relaxed">
                    {form.settings.successMessage}
                </p>
                <button
                    onClick={handleNewResponse}
                    className="px-8 py-3.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-white/20"
                >
                    Submit Another Response
                </button>
            </div>
        )
    }

    // Error state
    if (step === 'error') {
        return (
            <div className="text-center py-12 animate-scale-in">
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full bg-red-500/20" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Oops!</h3>
                <p className="text-white/60 mb-10 max-w-sm mx-auto leading-relaxed">
                    {errorMessage || 'Something went wrong. Please try again.'}
                </p>
                <button
                    onClick={handleRetry}
                    className="px-8 py-3.5 font-semibold text-black rounded-xl transition-all duration-300 bg-gradient-to-r from-gold to-gold/90 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {form.fields.map((field, index) => (
                <div
                    key={field.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <FieldRenderer
                        field={field}
                        register={register}
                        error={errors[field.id]?.message as string | undefined}
                        files={files[field.id] || []}
                        onFileChange={(e) => handleFileChange(field.id, e)}
                    />
                </div>
            ))}

            {/* Submit Button */}
            <div className="pt-6">
                <button
                    type="submit"
                    disabled={step === 'submitting'}
                    className={cn(
                        'w-full py-4 px-6 rounded-xl font-bold text-black text-lg',
                        'transition-all duration-300',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'bg-gradient-to-r from-gold via-gold/95 to-gold',
                        'hover:shadow-xl hover:shadow-gold/25 hover:-translate-y-0.5',
                        'active:translate-y-0'
                    )}
                >
                    {step === 'submitting' ? (
                        <span className="flex items-center justify-center gap-3">
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Submitting...
                        </span>
                    ) : (
                        form.settings.submitButtonText || 'Submit'
                    )}
                </button>
            </div>
        </form>
    )
}

interface FieldRendererProps {
    field: FormField
    register: ReturnType<typeof useForm>['register']
    error?: string
    files: File[]
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function FieldRenderer({ field, register, error, files, onFileChange }: FieldRendererProps) {
    const baseInputClass = cn(
        'w-full px-5 py-4 rounded-xl',
        'bg-white/[0.03] border border-white/10',
        'text-white placeholder:text-white/30',
        'focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:bg-white/[0.05]',
        'transition-all duration-200',
        error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
    )

    const labelClass = 'block text-white font-medium mb-2.5 text-[15px]'

    switch (field.type) {
        case 'heading':
            return (
                <div className="pt-6 pb-2">
                    <h3 className="text-xl font-bold text-white">{field.label}</h3>
                </div>
            )

        case 'paragraph':
            return (
                <p className="text-white/50 leading-relaxed">{field.label}</p>
            )

        case 'text':
        case 'email':
        case 'phone':
            return (
                <div className="group">
                    <label className={labelClass}>
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <input
                        type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                        placeholder={field.placeholder}
                        {...register(field.id, { required: field.required && 'This field is required' })}
                        className={baseInputClass}
                    />
                    {field.helperText && <p className="mt-2 text-sm text-white/40">{field.helperText}</p>}
                    {error && (
                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </p>
                    )}
                </div>
            )

        case 'textarea':
            return (
                <div className="group">
                    <label className={labelClass}>
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <textarea
                        placeholder={field.placeholder}
                        rows={5}
                        {...register(field.id, { required: field.required && 'This field is required' })}
                        className={cn(baseInputClass, 'resize-none')}
                    />
                    {field.helperText && <p className="mt-2 text-sm text-white/40">{field.helperText}</p>}
                    {error && (
                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </p>
                    )}
                </div>
            )

        case 'select':
            return (
                <div className="group">
                    <label className={labelClass}>
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <div className="relative">
                        <select
                            {...register(field.id, { required: field.required && 'Please select an option' })}
                            className={cn(baseInputClass, 'appearance-none cursor-pointer pr-12')}
                        >
                            <option value="" className="bg-gray-900">{field.placeholder || 'Select an option'}</option>
                            {(field.options || []).map((option, i) => (
                                <option key={i} value={option} className="bg-gray-900">{option}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    {field.helperText && <p className="mt-2 text-sm text-white/40">{field.helperText}</p>}
                    {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                </div>
            )

        case 'radio':
            return (
                <div className="group">
                    <label className={labelClass}>
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <div className="space-y-3 mt-1">
                        {(field.options || []).map((option, i) => (
                            <label
                                key={i}
                                className="flex items-center gap-4 cursor-pointer group/option p-3 -mx-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="relative">
                                    <input
                                        type="radio"
                                        value={option}
                                        {...register(field.id, { required: field.required && 'Please select an option' })}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 rounded-full border-2 border-white/20 peer-checked:border-gold peer-checked:bg-gold transition-all" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <div className="w-2 h-2 rounded-full bg-black" />
                                    </div>
                                </div>
                                <span className="text-white/70 group-hover/option:text-white transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {field.helperText && <p className="mt-3 text-sm text-white/40">{field.helperText}</p>}
                    {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                </div>
            )

        case 'checkbox':
            return (
                <div className="group">
                    <label className={labelClass}>
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <div className="space-y-3 mt-1">
                        {(field.options || []).map((option, i) => (
                            <label
                                key={i}
                                className="flex items-center gap-4 cursor-pointer group/option p-3 -mx-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        {...register(field.id)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 rounded-md border-2 border-white/20 peer-checked:border-gold peer-checked:bg-gold transition-all" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-white/70 group-hover/option:text-white transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {field.helperText && <p className="mt-3 text-sm text-white/40">{field.helperText}</p>}
                    {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                </div>
            )

        case 'file':
            return (
                <div className="group">
                    <label className={labelClass}>
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <div
                        className={cn(
                            'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer',
                            'border-white/10 hover:border-gold/40 bg-white/[0.02] hover:bg-white/[0.04]',
                            'transition-all duration-200 group/upload'
                        )}
                        onClick={() => document.getElementById(`file-${field.id}`)?.click()}
                    >
                        <input
                            id={`file-${field.id}`}
                            type="file"
                            multiple
                            onChange={onFileChange}
                            className="hidden"
                        />
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center group-hover/upload:bg-gold/10 transition-colors">
                            <svg className="w-7 h-7 text-white/30 group-hover/upload:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <p className="text-white/50 text-sm mb-1">
                            <span className="text-gold font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-white/30 text-xs">PNG, JPG, PDF up to 10MB</p>
                    </div>
                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {files.map((file, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm bg-white/[0.03] rounded-lg px-4 py-3 border border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-white/80 truncate flex-1">{file.name}</span>
                                    <span className="text-white/30 text-xs">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {field.helperText && <p className="mt-3 text-sm text-white/40">{field.helperText}</p>}
                    {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                </div>
            )

        default:
            return null
    }
}

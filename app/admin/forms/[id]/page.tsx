'use client'

import { useState, useCallback, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
    FIELD_TYPE_META,
    FIELD_TYPES,
    createEmptyField,
    type FormField,
    type FormSettings,
    type FieldType,
    type Form,
} from '@/lib/form-schema'

interface PageProps {
    params: Promise<{ id: string }>
}

export default function EditFormPage({ params }: PageProps) {
    const { id } = use(params)
    const router = useRouter()
    const { user } = useAuth()

    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [slug, setSlug] = useState('')
    const [fields, setFields] = useState<FormField[]>([])
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
    const [settings, setSettings] = useState<FormSettings>({
        submitButtonText: 'Submit',
        successMessage: 'Thank you! Your response has been recorded.',
        redirectUrl: '',
        notifyEmails: [],
        isActive: true,
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [notifyEmailInput, setNotifyEmailInput] = useState('')
    const [showPreview, setShowPreview] = useState(false)

    const selectedField = fields.find((f) => f.id === selectedFieldId) || null

    // Load form data
    useEffect(() => {
        const loadForm = async () => {
            if (!user) return

            try {
                const token = await user.getIdToken()
                const response = await fetch(`/api/forms/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const data = await response.json()
                if (data.success && data.form) {
                    const form: Form = data.form
                    setTitle(form.title)
                    setDescription(form.description || '')
                    setSlug(form.slug)
                    setFields(form.fields || [])
                    setSettings(form.settings)
                } else {
                    setError('Form not found')
                }
            } catch (err) {
                setError('Failed to load form')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadForm()
    }, [id, user])

    // Add a new field
    const addField = (type: FieldType) => {
        const newField = createEmptyField(type, fields.length)
        setFields([...fields, newField])
        setSelectedFieldId(newField.id)
    }

    // Update a field
    const updateField = (fieldId: string, updates: Partial<FormField>) => {
        setFields(fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)))
    }

    // Delete a field
    const deleteField = (fieldId: string) => {
        setFields(fields.filter((f) => f.id !== fieldId))
        if (selectedFieldId === fieldId) {
            setSelectedFieldId(null)
        }
    }

    // Move field up/down
    const moveField = (fieldId: string, direction: 'up' | 'down') => {
        const index = fields.findIndex((f) => f.id === fieldId)
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === fields.length - 1)
        ) {
            return
        }
        const newFields = [...fields]
        const swapIndex = direction === 'up' ? index - 1 : index + 1
            ;[newFields[index], newFields[swapIndex]] = [newFields[swapIndex], newFields[index]]
        newFields.forEach((f, i) => (f.order = i))
        setFields(newFields)
    }

    // Duplicate a field
    const duplicateField = (fieldId: string) => {
        const field = fields.find((f) => f.id === fieldId)
        if (!field) return
        const newField = createEmptyField(field.type, fields.length)
        Object.assign(newField, { ...field, id: newField.id, label: `${field.label} (Copy)` })
        setFields([...fields, newField])
        setSelectedFieldId(newField.id)
    }

    // Add notify email
    const addNotifyEmail = () => {
        const email = notifyEmailInput.trim()
        if (email && !settings.notifyEmails.includes(email)) {
            setSettings({ ...settings, notifyEmails: [...settings.notifyEmails, email] })
            setNotifyEmailInput('')
        }
    }

    // Remove notify email
    const removeNotifyEmail = (email: string) => {
        setSettings({
            ...settings,
            notifyEmails: settings.notifyEmails.filter((e) => e !== email),
        })
    }

    // Save the form
    const handleSave = async () => {
        if (!user) return
        if (!title.trim()) {
            setError('Form title is required')
            return
        }
        if (!slug.trim()) {
            setError('Form slug is required')
            return
        }

        setSaving(true)
        setError(null)

        try {
            const token = await user.getIdToken()
            const response = await fetch(`/api/forms/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    slug,
                    fields,
                    settings,
                }),
            })

            const data = await response.json()
            if (data.success) {
                router.push('/admin/forms')
            } else {
                setError(data.error || 'Failed to update form')
            }
        } catch (err) {
            setError('Failed to update form')
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Top Bar */}
            <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin/forms')}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Edit Form</h1>
                            <p className="text-sm text-gray-500">{title || 'Untitled Form'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowPreview(true)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Preview form"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => router.push('/admin/forms')}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
                {error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Main Content - Same as new page */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Field Palette */}
                <div className="w-64 shrink-0 bg-white border-r border-gray-200 overflow-y-auto p-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Add Fields</h3>

                    {['basic', 'choice', 'content', 'advanced'].map((category) => (
                        <div key={category} className="mb-4">
                            <p className="text-xs text-gray-500 mb-2 capitalize">{category}</p>
                            <div className="space-y-1">
                                {FIELD_TYPES.filter((t) => FIELD_TYPE_META[t].category === category).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => addField(type)}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors text-left"
                                    >
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={FIELD_TYPE_META[type].icon} />
                                        </svg>
                                        {FIELD_TYPE_META[type].label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Center - Form Canvas */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-2xl mx-auto">
                        {/* Form Header */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Form Title"
                                className="w-full text-2xl font-bold text-gray-900 border-0 border-b-2 border-transparent focus:border-blue-500 focus:outline-none pb-2 mb-3"
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Form description (optional)"
                                rows={2}
                                className="w-full text-gray-600 border-0 focus:outline-none resize-none"
                            />
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-sm text-gray-500">URL:</span>
                                <code className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">/forms/</code>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    placeholder="form-slug"
                                    className="text-sm text-blue-600 border-0 border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Fields */}
                        {fields.length === 0 ? (
                            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                                <p className="text-gray-500">Click a field type from the left to add it</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        onClick={() => setSelectedFieldId(field.id)}
                                        className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${selectedFieldId === field.id
                                            ? 'border-blue-500 ring-2 ring-blue-100'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center gap-2 pt-1">
                                                <div className="cursor-move text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                                    </svg>
                                                </div>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={FIELD_TYPE_META[field.type].icon} />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-gray-900">{field.label}</span>
                                                    {field.required && <span className="text-red-500 text-sm">*</span>}
                                                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                        {FIELD_TYPE_META[field.type].label}
                                                    </span>
                                                </div>
                                                {field.helperText && <p className="text-sm text-gray-500">{field.helperText}</p>}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); moveField(field.id, 'up'); }} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); moveField(field.id, 'down'); }} disabled={index === fields.length - 1} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); duplicateField(field.id); }} className="p-1.5 text-gray-400 hover:text-gray-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); deleteField(field.id); }} className="p-1.5 text-red-400 hover:text-red-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Field Editor */}
                <div className="w-80 shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
                    {selectedField ? (
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Edit Field</h3>
                                <button onClick={() => setSelectedFieldId(null)} className="p-1 text-gray-400 hover:text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                    <input type="text" value={selectedField.label} onChange={(e) => updateField(selectedField.id, { label: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                {!['heading', 'paragraph', 'checkbox', 'radio'].includes(selectedField.type) && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                                        <input type="text" value={selectedField.placeholder || ''} onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                )}
                                {!['heading', 'paragraph'].includes(selectedField.type) && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Helper Text</label>
                                            <input type="text" value={selectedField.helperText || ''} onChange={(e) => updateField(selectedField.id, { helperText: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-sm font-medium text-gray-700">Required</span>
                                            <button onClick={() => updateField(selectedField.id, { required: !selectedField.required })} className={`relative w-11 h-6 rounded-full transition-colors ${selectedField.required ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${selectedField.required ? 'translate-x-5' : ''}`} />
                                            </button>
                                        </div>
                                    </>
                                )}
                                {['select', 'checkbox', 'radio'].includes(selectedField.type) && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                                        <div className="space-y-2">
                                            {(selectedField.options || []).map((option, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <input type="text" value={option} onChange={(e) => { const newOptions = [...(selectedField.options || [])]; newOptions[i] = e.target.value; updateField(selectedField.id, { options: newOptions }); }} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                                    <button onClick={() => updateField(selectedField.id, { options: (selectedField.options || []).filter((_, j) => j !== i) })} className="p-1.5 text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                                                </div>
                                            ))}
                                            <button onClick={() => updateField(selectedField.id, { options: [...(selectedField.options || []), `Option ${(selectedField.options || []).length + 1}`] })} className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors">+ Add Option</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-4">Form Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Submit Button Text</label>
                                    <input type="text" value={settings.submitButtonText} onChange={(e) => setSettings({ ...settings, submitButtonText: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Success Message</label>
                                    <textarea value={settings.successMessage} onChange={(e) => setSettings({ ...settings, successMessage: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URL (optional)</label>
                                    <input type="url" value={settings.redirectUrl || ''} onChange={(e) => setSettings({ ...settings, redirectUrl: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notification Emails</label>
                                    <div className="flex gap-2 mb-2">
                                        <input type="email" value={notifyEmailInput} onChange={(e) => setNotifyEmailInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNotifyEmail()} placeholder="email@example.com" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        <button onClick={addNotifyEmail} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Add</button>
                                    </div>
                                    {settings.notifyEmails.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {settings.notifyEmails.map((email) => (
                                                <span key={email} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                                                    {email}
                                                    <button onClick={() => removeNotifyEmail(email)} className="text-blue-400 hover:text-blue-600"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Form Active</span>
                                        <p className="text-xs text-gray-500">Accept new submissions</p>
                                    </div>
                                    <button onClick={() => setSettings({ ...settings, isActive: !settings.isActive })} className={`relative w-11 h-6 rounded-full transition-colors ${settings.isActive ? 'bg-green-600' : 'bg-gray-200'}`}>
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.isActive ? 'translate-x-5' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="relative w-full max-w-2xl my-8">
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="text-center mb-4">
                            <span className="text-white/60 text-sm">Form Preview</span>
                        </div>
                        <div
                            className="rounded-[30px] overflow-hidden"
                            style={{
                                backdropFilter: 'blur(9px) saturate(193%)',
                                WebkitBackdropFilter: 'blur(9px) saturate(193%)',
                                backgroundColor: 'rgba(14, 17, 17, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.125)',
                            }}
                        >
                            <div className="p-8 md:p-12">
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-[2px] bg-gradient-to-r from-yellow-500 to-yellow-500/50 rounded-full" />
                                        <span className="text-yellow-500/90 text-xs font-semibold tracking-[0.15em] uppercase">Form</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                        {title || 'Untitled Form'}
                                    </h2>
                                    {description && <p className="text-gray-400">{description}</p>}
                                </div>
                                <div className="space-y-6">
                                    {fields.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No fields added yet</p>
                                    ) : (
                                        fields.map((field) => (
                                            <PreviewField key={field.id} field={field} />
                                        ))
                                    )}
                                </div>
                                {fields.length > 0 && (
                                    <div className="mt-8">
                                        <button
                                            type="button"
                                            className="w-full py-3 px-6 rounded-lg font-semibold text-black bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 shadow-lg"
                                        >
                                            {settings.submitButtonText || 'Submit'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Preview Field Component
function PreviewField({ field }: { field: FormField }) {
    const baseInputClass = "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40"

    switch (field.type) {
        case 'heading':
            return <h3 className="text-xl font-semibold text-white pt-4">{field.label}</h3>
        case 'paragraph':
            return <p className="text-gray-400">{field.label}</p>
        case 'text':
        case 'email':
        case 'phone':
            return (
                <div>
                    <label className="block text-white font-medium mb-2">
                        {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <input type="text" placeholder={field.placeholder || ''} disabled className={baseInputClass} />
                    {field.helperText && <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>}
                </div>
            )
        case 'textarea':
            return (
                <div>
                    <label className="block text-white font-medium mb-2">
                        {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <textarea placeholder={field.placeholder || ''} rows={4} disabled className={`${baseInputClass} resize-none`} />
                    {field.helperText && <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>}
                </div>
            )
        case 'select':
            return (
                <div>
                    <label className="block text-white font-medium mb-2">
                        {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <select disabled className={`${baseInputClass} appearance-none`}>
                        <option>{field.placeholder || 'Select an option'}</option>
                        {(field.options || []).map((opt, i) => <option key={i}>{opt}</option>)}
                    </select>
                    {field.helperText && <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>}
                </div>
            )
        case 'radio':
            return (
                <div>
                    <label className="block text-white font-medium mb-3">
                        {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <div className="space-y-2">
                        {(field.options || []).map((opt, i) => (
                            <label key={i} className="flex items-center gap-3">
                                <input type="radio" disabled className="w-4 h-4" />
                                <span className="text-white/80">{opt}</span>
                            </label>
                        ))}
                    </div>
                    {field.helperText && <p className="mt-2 text-sm text-gray-500">{field.helperText}</p>}
                </div>
            )
        case 'checkbox':
            return (
                <div>
                    <label className="block text-white font-medium mb-3">
                        {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <div className="space-y-2">
                        {(field.options || []).map((opt, i) => (
                            <label key={i} className="flex items-center gap-3">
                                <input type="checkbox" disabled className="w-4 h-4 rounded" />
                                <span className="text-white/80">{opt}</span>
                            </label>
                        ))}
                    </div>
                    {field.helperText && <p className="mt-2 text-sm text-gray-500">{field.helperText}</p>}
                </div>
            )
        case 'file':
            return (
                <div>
                    <label className="block text-white font-medium mb-2">
                        {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                        <svg className="w-8 h-8 mx-auto text-white/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-white/60 text-sm">Click to upload files</p>
                    </div>
                    {field.helperText && <p className="mt-2 text-sm text-gray-500">{field.helperText}</p>}
                </div>
            )
        default:
            return null
    }
}

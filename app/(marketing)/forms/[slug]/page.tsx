import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/mongodb'
import { FormRenderer } from '@/components/forms'
import type { Form } from '@/lib/form-schema'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params

    try {
        const collection = await getCollection('forms')
        const form = await collection.findOne({ slug, 'settings.isActive': true })

        if (!form) {
            return {
                title: 'Form Not Found | Make Us Live',
            }
        }

        return {
            title: `${form.title} | Make Us Live`,
            description: form.description || `Fill out the ${form.title} form.`,
            robots: 'noindex, nofollow', // Forms typically shouldn't be indexed
        }
    } catch {
        return {
            title: 'Form | Make Us Live',
        }
    }
}

export default async function PublicFormPage({ params }: PageProps) {
    const { slug } = await params

    // Fetch the form
    let form: Form | null = null
    try {
        const collection = await getCollection('forms')
        const doc = await collection.findOne({ slug })

        if (doc) {
            form = {
                ...doc,
                _id: doc._id.toString(),
            } as Form
        }
    } catch (error) {
        console.error('Error fetching form:', error)
    }

    // 404 if not found or inactive
    if (!form || !form.settings?.isActive) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div
                    className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(221,206,175,0.15) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                    }}
                />
                <div
                    className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                    }}
                />
            </div>

            {/* Form Container */}
            <div className="relative z-10 px-4 pt-24 pb-16">
                <div className="max-w-2xl mx-auto">
                    {/* Glass Card */}
                    <div
                        className="relative rounded-[32px] overflow-hidden animate-scale-in"
                        style={{
                            backdropFilter: 'blur(20px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                            backgroundColor: 'rgba(10, 12, 14, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
                        }}
                    >
                        {/* Premium top border gradient */}
                        <div
                            className="absolute top-0 left-0 right-0 h-[1px]"
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(221,206,175,0.5) 30%, rgba(221,206,175,0.8) 50%, rgba(221,206,175,0.5) 70%, transparent 100%)',
                            }}
                        />

                        {/* Gradient overlay for depth */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: `linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.2) 100%)`,
                            }}
                        />

                        <div className="relative p-8 md:p-12 lg:p-14 z-10">
                            {/* Form Header */}
                            <div className="mb-10">
                                {/* Decorative accent line */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div
                                        className="w-12 h-[2px] rounded-full"
                                        style={{
                                            background: 'linear-gradient(90deg, rgba(221,206,175,1) 0%, rgba(221,206,175,0.3) 100%)',
                                        }}
                                    />
                                    <span className="text-gold/80 text-xs font-semibold tracking-[0.2em] uppercase">
                                        Form
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                    {form.title}
                                </h1>

                                {/* Description */}
                                {form.description && (
                                    <p className="text-white/60 leading-relaxed text-lg">
                                        {form.description}
                                    </p>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5" />
                                </div>
                            </div>

                            {/* Form Renderer */}
                            <FormRenderer form={form} />
                        </div>
                    </div>

                    {/* Branding */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-white/25">
                            Powered by{' '}
                            <a
                                href="https://makeuslive.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold/40 hover:text-gold/70 transition-colors font-medium"
                            >
                                MakeUsLive
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

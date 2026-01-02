'use client'

import { memo, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { TechIcon } from '@/components/ui'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

interface ServiceHubProps {
    slug: string
    badge: string
    headline: string
    subheadline: string
    description: string
    primaryCTA: string
    stats?: {
        value: string
        label: string
    }[]
    tools?: {
        name: string
        icon: string
    }[]
    features: {
        icon: string
        title: string
        description: string
    }[]
    process: {
        step: number
        title: string
        description: string
    }[]
    faqs: {
        question: string
        answer: string
    }[]
    relatedServices: {
        title: string
        href: string
    }[]
}

export const ServiceHub = memo<ServiceHubProps>(({
    badge,
    headline,
    subheadline,
    description,
    primaryCTA,
    stats = [
        { value: '60%', label: 'Faster Delivery' },
        { value: '40%', label: 'Cost Reduction' },
        { value: '95%', label: 'Client Satisfaction' },
    ],
    tools = [
        { name: 'Figma', icon: 'figma' },
        { name: 'Framer', icon: 'framer' },
        { name: 'Next.js', icon: 'nextjs' },
        { name: 'React Native', icon: 'reactnative' },
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'Python', icon: 'python' },
        { name: 'Java', icon: 'java' },
        { name: 'Flutter', icon: 'flutter' },
        { name: 'n8n', icon: 'n8n' },
        { name: 'RAGs', icon: 'rags' },
        { name: 'Automations', icon: 'automations' },
    ],
    features,
    process,
    faqs,
    relatedServices,
}) => {
    const sectionRef = useRef<HTMLElement>(null)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const ctx = gsap.context(() => {
            // Hero text animation
            gsap.fromTo(
                '.hero-animate',
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power4.out' }
            )

            // Stats counter animation
            gsap.fromTo(
                '.stat-card',
                { y: 40, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: '.stats-section', start: 'top 85%' },
                }
            )

            // Feature cards
            gsap.fromTo(
                '.feature-card',
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.08,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: '.features-section', start: 'top 80%' },
                }
            )

            // Process timeline
            gsap.fromTo(
                '.process-item',
                { x: -60, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: '.process-section', start: 'top 80%' },
                }
            )
        }, section)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="relative overflow-hidden">
            {/* Hero Section - Unico Style */}
            <div className="relative min-h-screen flex items-center pt-32 pb-20">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-bg via-bg to-black/40" />
                    <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Content */}
                        <div className="order-2 lg:order-1">
                            <div className="hero-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                                </span>
                                <span className="text-sm font-medium text-gold tracking-wide uppercase">{badge}</span>
                            </div>

                            <h1 className="hero-animate text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
                                {headline.split(' ').slice(0, -1).join(' ')}{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-400 to-gold">
                                    {headline.split(' ').slice(-1)}
                                </span>
                            </h1>

                            <p className="hero-animate text-xl md:text-2xl text-white/60 mb-6 max-w-xl leading-relaxed">
                                {subheadline}
                            </p>

                            <p className="hero-animate text-lg text-white/40 mb-10 max-w-lg">
                                {description}
                            </p>

                            <div className="hero-animate flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gold text-bg font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:scale-105"
                                >
                                    <span className="relative z-10">{primaryCTA}</span>
                                    <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                    <div className="absolute inset-0 bg-gradient-to-r from-gold to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <Link
                                    href="/work"
                                    className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                                >
                                    View Case Studies
                                </Link>
                            </div>
                        </div>

                        {/* Right - Stats Bento Grid */}
                        <div className="order-1 lg:order-2 stats-section">
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((stat, i) => (
                                    <div
                                        key={i}
                                        className={`stat-card p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-gold/30 transition-all duration-500 ${i === 0 ? 'col-span-2' : ''
                                            }`}
                                    >
                                        <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-2">{stat.value}</div>
                                        <div className="text-lg text-white/60">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Tools Row */}
                            <div className="mt-8">
                                <p className="text-sm text-white/40 mb-4 uppercase tracking-wider">Technologies We Use</p>
                                <div className="flex flex-wrap gap-3">
                                    {tools.map((tool, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-gold/30 transition-colors"
                                        >
                                            <TechIcon name={tool.icon} size={20} className="text-white/70 group-hover:text-gold transition-colors" />
                                            <span className="text-sm text-white/70">{tool.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Marquee Section - Mitchy Style */}
            <div className="py-8 border-y border-white/10 bg-white/[0.02] overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-8 mx-4">
                            {['Web Design', 'App Development', 'UI/UX', 'AI Solutions', 'Custom Software', 'MVP Development'].map((item, j) => (
                                <span key={j} className="flex items-center gap-4 text-lg text-white/40">
                                    <span className="w-2 h-2 rounded-full bg-gold" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section - Split Design */}
            <div className="features-section py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                        {/* Left Sticky Header */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
                            <span className="text-sm font-medium text-gold uppercase tracking-wider">What We Deliver</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
                                Comprehensive Solutions for Your Business
                            </h2>
                            <p className="text-lg text-white/50 mb-8">
                                Every project is tailored to your unique needs, backed by years of experience and cutting-edge technology.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 text-gold font-medium hover:gap-3 transition-all"
                            >
                                Discuss Your Project
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>

                        {/* Right Feature Cards */}
                        <div className="lg:col-span-8">
                            <div className="grid sm:grid-cols-2 gap-6">
                                {features.map((feature, i) => (
                                    <div
                                        key={i}
                                        className="feature-card group p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-500"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-300">
                                            <div className="text-gold">
                                                <TechIcon name={feature.icon} size={32} className="opacity-80" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                        <p className="text-white/50 leading-relaxed">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Process Section - Timeline Style */}
            <div className="process-section py-24 md:py-32 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-sm font-medium text-gold uppercase tracking-wider">Our Process</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                            From Idea to Launch
                        </h2>
                        <p className="text-lg text-white/50">
                            A proven methodology that transforms your vision into reality
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {process.map((step, i) => (
                            <div key={i} className="process-item relative flex gap-8 pb-12 last:pb-0">
                                {/* Timeline Line */}
                                {i !== process.length - 1 && (
                                    <div className="absolute left-7 top-16 w-[2px] h-[calc(100%-48px)] bg-gradient-to-b from-gold/50 to-transparent" />
                                )}

                                {/* Step Number */}
                                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gold text-bg font-bold text-xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                                    {step.step}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-2">
                                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-white/50 leading-relaxed text-lg">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section - Clean Accordion */}
            <div className="py-24 md:py-32">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-sm font-medium text-gold uppercase tracking-wider">FAQ</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl border transition-all duration-300 ${openFaq === i
                                    ? 'border-gold/30 bg-gold/5'
                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center transition-transform duration-300 ${openFaq === i ? 'rotate-180 bg-gold/10' : ''}`}>
                                        <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                                    <p className="px-6 pb-6 text-white/50 leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Related Services */}
            <div className="py-16 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <span className="text-sm text-white/40 uppercase tracking-wider">Explore More</span>
                            <h3 className="text-2xl font-bold text-white mt-1">Related Services</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {relatedServices.map((service, i) => (
                                <Link
                                    key={i}
                                    href={service.href}
                                    className="px-6 py-3 rounded-full border border-white/10 text-white/70 hover:border-gold/30 hover:text-gold hover:bg-gold/5 transition-all duration-300"
                                >
                                    {service.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 md:py-32 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent" />

                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Ready to Build Something{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-400">
                            Amazing
                        </span>
                        ?
                    </h2>
                    <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto">
                        Let&apos;s discuss your project. Make Us Live helps bring your vision to reality.
                    </p>
                    <Link
                        href="/contact"
                        className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-bg font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:scale-105"
                    >
                        <span className="relative z-10">Get a Free Consultation</span>
                        <svg className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
})

ServiceHub.displayName = 'ServiceHub'

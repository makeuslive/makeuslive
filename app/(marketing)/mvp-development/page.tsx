'use client'

import { ServiceHub } from '@/components/sections/service-hub'

const mvpData = {
    slug: 'mvp-development',
    badge: 'MVP Development',
    headline: 'Build Your MVP',
    subheadline: 'Go from idea to launched product in weeks, not months.',
    description: 'Validate your concept with real users before investing heavily. We build MVPs that test your hypothesis and set the foundation for scale.',
    primaryCTA: 'Get in Touch',
    features: [
        {
            icon: 'rocket',
            title: 'Rapid Development',
            description: 'Go from concept to launched product in 4-8 weeks with our streamlined process.',
        },
        {
            icon: 'lightbulb',
            title: 'Idea Validation',
            description: 'Test your assumptions with real users before committing to full development.',
        },
        {
            icon: 'trending',
            title: 'Investor Ready',
            description: 'Professional products that help you pitch and raise funding confidently.',
        },
        {
            icon: 'bar-chart',
            title: 'Analytics Built-In',
            description: 'Track user behavior from day one to make data-driven product decisions.',
        },
        {
            icon: 'automation',
            title: 'Scalable Foundation',
            description: 'Built with production-quality code that scales as you grow.',
        },
        {
            icon: 'brain',
            title: 'Startup Expertise',
            description: 'We understand the startup journey—budget constraints, pivots, and the need for speed.',
        },
    ],
    process: [
        { step: 1, title: 'Discovery Sprint', description: 'One week to understand your idea, users, and success metrics.' },
        { step: 2, title: 'Prioritize Features', description: 'Identify the core features that test your hypothesis.' },
        { step: 3, title: 'Design & Prototype', description: 'Quick wireframes and visual designs for user validation.' },
        { step: 4, title: 'Build MVP', description: '4-6 weeks of focused development on core functionality.' },
        { step: 5, title: 'Launch & Learn', description: 'Soft launch, gather feedback, and iterate based on data.' },
    ],
    faqs: [
        { question: 'How much does MVP development cost?', answer: 'Our MVP packages start at $2,000 for simple applications to $50,000+ for more complex products. We focus on building just enough to validate your concept.' },
        { question: 'How fast can you build an MVP?', answer: 'Most MVPs are completed in 4-8 weeks. Simple products can launch in 3 weeks, while complex ones may take 10-12 weeks.' },
        { question: 'What happens after the MVP launches?', answer: 'We help you analyze user feedback and data, then iterate or scale based on what you learn. Many clients continue working with us long-term.' },
        { question: 'Can the MVP code scale to a full product?', answer: 'Yes! We build MVPs with production-quality code using Next.js, React Native, and other scalable technologies. No throwaway code.' },
        { question: 'Do you help with fundraising?', answer: 'While we\'re not investors, many of our MVP clients have successfully raised funding with the products we built. We can advise on positioning and pitch decks.' },
    ],
    relatedServices: [
        { title: 'Web Design', href: '/web-design' },
        { title: 'App Development', href: '/app-development' },
        { title: 'UI/UX Design', href: '/ui-ux-design' },
        { title: 'Custom Software', href: '/custom-software' },
    ],
}

export default function MVPPage() {
    return <ServiceHub {...mvpData} />
}

'use client'

import { ServiceHub } from '@/components/sections/service-hub'

const webDesignData = {
    slug: 'web-design',
    badge: 'Web Design Services',
    headline: 'Web Design That Converts',
    subheadline: 'We design stunning, high-performance websites that turn visitors into customers.',
    description: 'From startups to enterprises, we create custom web designs that perfectly represent your brand while driving measurable business results.',
    primaryCTA: 'Get a Free Design Consultation',
    features: [
        {
            icon: 'palette',
            title: 'Custom Design',
            description: 'Bespoke designs tailored to your brand identity. No templates, no shortcuts—every pixel crafted for you.',
        },
        {
            icon: 'smartphone',
            title: 'Responsive & Mobile-First',
            description: 'Websites that look stunning and perform flawlessly on every device, from phones to desktops.',
        },
        {
            icon: 'zap',
            title: 'Performance Optimized',
            description: 'Lightning-fast load times with Core Web Vitals optimization for better SEO and user experience.',
        },
        {
            icon: 'trending',
            title: 'Conversion Focused',
            description: 'Every design decision backed by UX research to maximize engagement and conversions.',
        },
        {
            icon: 'search',
            title: 'SEO-Ready',
            description: 'Built with search engines in mind—semantic HTML, structured data, and optimized content.',
        },
        {
            icon: 'code',
            title: 'CMS Integration',
            description: 'Easy content management with headless CMS solutions like Sanity, Contentful, or Strapi.',
        },
    ],
    process: [
        {
            step: 1,
            title: 'Discovery & Strategy',
            description: 'We dive deep into your business, audience, and goals. Through workshops and research, we understand what success looks like.',
        },
        {
            step: 2,
            title: 'Wireframing & UX',
            description: 'Before any visual design, we map out user journeys and create wireframes to ensure optimal information architecture.',
        },
        {
            step: 3,
            title: 'Visual Design',
            description: 'Our designers create stunning visuals that capture your brand essence. Every element is intentional and on-brand.',
        },
        {
            step: 4,
            title: 'Development',
            description: 'We build your site using modern tech (Next.js, TypeScript) for maximum performance and maintainability.',
        },
        {
            step: 5,
            title: 'Launch & Optimize',
            description: 'We deploy, monitor, and continuously optimize based on real user data and analytics.',
        },
    ],
    faqs: [
        {
            question: 'How much does custom web design cost?',
            answer: 'Custom web design projects typically range from $5,000 to $50,000+ depending on complexity, features, and scope. We provide detailed quotes after understanding your specific requirements.',
        },
        {
            question: 'How long does it take to design a website?',
            answer: 'A typical web design project takes 4-12 weeks from discovery to launch. Complex projects with custom features may take longer. We provide detailed timelines during our initial consultation.',
        },
        {
            question: 'Do you design responsive websites?',
            answer: 'Yes! All our websites are designed mobile-first and fully responsive. They work seamlessly across all devices including phones, tablets, laptops, and desktops.',
        },
        {
            question: 'What makes Make Us Live different from other web design agencies?',
            answer: "We combine stunning design with conversion optimization. Every design decision is backed by data and UX research. Plus, we don't just design—we build production-ready websites with Next.js.",
        },
        {
            question: 'Do you offer ongoing maintenance?',
            answer: 'Absolutely! We offer flexible maintenance packages including updates, security monitoring, performance optimization, and content updates.',
        },
        {
            question: 'Can you redesign my existing website?',
            answer: 'Yes! We specialize in website redesigns that improve both aesthetics and performance while maintaining SEO equity and minimizing disruption.',
        },
    ],
    relatedServices: [
        { title: 'UI/UX Design', href: '/ui-ux-design' },
        { title: 'App Development', href: '/app-development' },
        { title: 'Custom Software', href: '/custom-software' },
        { title: 'MVP Development', href: '/mvp-development' },
    ],
}

export default function WebDesignPage() {
    return <ServiceHub {...webDesignData} />
}

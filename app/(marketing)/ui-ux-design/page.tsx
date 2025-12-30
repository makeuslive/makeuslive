'use client'

import { ServiceHub } from '@/components/sections/service-hub'

const uiuxData = {
    slug: 'ui-ux-design',
    badge: 'UI UX Design Agency',
    headline: 'Design That Delights',
    subheadline: 'We create intuitive, beautiful interfaces that users love and businesses rely on.',
    description: 'Research-driven UX design combined with stunning visual interfaces. From user research to design systems, we craft experiences that convert.',
    primaryCTA: 'Start a Design Project',
    features: [
        {
            icon: 'search',
            title: 'User Research',
            description: 'Deep user research to understand behaviors, needs, and pain points that inform every design decision.',
        },
        {
            icon: 'trending',
            title: 'UX Strategy',
            description: 'Strategic UX planning including user journeys, information architecture, and conversion optimization.',
        },
        {
            icon: 'pencil',
            title: 'Wireframing',
            description: 'Low-fidelity wireframes and prototypes to validate concepts before visual design.',
        },
        {
            icon: 'palette',
            title: 'Visual Design',
            description: 'Pixel-perfect interfaces with consistent design language and attention to detail.',
        },
        {
            icon: 'figma',
            title: 'Design Systems',
            description: 'Scalable design systems and component libraries for consistent, efficient design.',
        },
        {
            icon: 'brain',
            title: 'Usability Testing',
            description: 'Real user testing to validate designs and identify improvements before development.',
        },
    ],
    process: [
        { step: 1, title: 'Research', description: 'User interviews, competitive analysis, and persona development.' },
        { step: 2, title: 'Strategy', description: 'Define user journeys, information architecture, and success metrics.' },
        { step: 3, title: 'Wireframe', description: 'Low-fidelity prototypes to validate layout and user flows.' },
        { step: 4, title: 'Design', description: 'High-fidelity visual designs with motion and interaction specs.' },
        { step: 5, title: 'Test & Iterate', description: 'User testing, refinement, and handoff with design systems.' },
    ],
    faqs: [
        { question: 'What is the difference between UI and UX design?', answer: 'UX (User Experience) focuses on how a product works and how easy it is to use. UI (User Interface) focuses on how it looks. We do both to create products that are both beautiful and functional.' },
        { question: 'How much does UI/UX design cost?', answer: 'UI/UX design projects typically range from $8,000 to $80,000+ depending on scope. A simple website redesign differs from a full SaaS product design. We provide detailed quotes.' },
        { question: 'Do you create design systems?', answer: 'Yes! We build comprehensive design systems with component libraries, style guides, and documentation that scale with your product.' },
        { question: 'How do you approach user research?', answer: 'We use various methods including user interviews, surveys, analytics analysis, and competitive research to understand your users deeply.' },
    ],
    relatedServices: [
        { title: 'Web Design', href: '/web-design' },
        { title: 'App Development', href: '/app-development' },
        { title: 'MVP Development', href: '/mvp-development' },
        { title: 'Custom Software', href: '/custom-software' },
    ],
}

export default function UIUXPage() {
    return <ServiceHub {...uiuxData} />
}

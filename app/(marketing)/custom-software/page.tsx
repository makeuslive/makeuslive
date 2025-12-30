'use client'

import { ServiceHub } from '@/components/sections/service-hub'

const customSoftwareData = {
    slug: 'custom-software',
    badge: 'Enterprise Solutions',
    headline: 'Software Built for Your Business',
    subheadline: 'We develop custom software solutions that solve your unique business challenges.',
    description: 'From ERP systems to CRM platforms, we build enterprise-grade software that scales with your growth and integrates with your existing systems.',
    primaryCTA: 'Discuss Your Requirements',
    features: [
        {
            icon: 'building',
            title: 'ERP Development',
            description: 'Custom ERP systems that unify your operations, from inventory to finance to HR.',
        },
        {
            icon: 'phone', // or message-circle
            title: 'CRM Solutions',
            description: 'Tailored CRM platforms that help you manage relationships and close more deals.',
        },
        {
            icon: 'refresh-cw', // or link
            title: 'System Integration',
            description: 'Connect your tools and platforms for seamless data flow across your organization.',
        },
        {
            icon: 'settings', // or cpu
            title: 'Process Automation',
            description: 'Automate repetitive tasks and workflows to boost efficiency and reduce errors.',
        },
        {
            icon: 'bar-chart',
            title: 'Business Intelligence',
            description: 'Data dashboards and analytics tools that turn data into actionable insights.',
        },
        {
            icon: 'lock',
            title: 'Enterprise Security',
            description: 'Bank-level security with encryption, access controls, and compliance features.',
        },
    ],
    process: [
        { step: 1, title: 'Requirements Analysis', description: 'Deep dive into your business processes, pain points, and objectives.' },
        { step: 2, title: 'System Architecture', description: 'Design scalable, secure architecture that meets current and future needs.' },
        { step: 3, title: 'Agile Development', description: 'Iterative development with regular demos and feedback integration.' },
        { step: 4, title: 'Integration', description: 'Connect with your existing systems, databases, and third-party services.' },
        { step: 5, title: 'Training & Support', description: 'User training, documentation, and ongoing maintenance support.' },
    ],
    faqs: [
        { question: 'How much does custom software development cost?', answer: 'Custom software projects range from $30,000 to $500,000+ depending on complexity. We provide detailed estimates after understanding your specific requirements and scope.' },
        { question: 'How long does it take to build custom software?', answer: 'Typically 3-12 months depending on complexity. We use agile methodology with regular releases so you see progress throughout.' },
        { question: 'Can you integrate with our existing systems?', answer: 'Absolutely! We specialize in integrating with existing ERP, CRM, accounting, and other business systems via APIs and custom connectors.' },
        { question: 'Do you provide ongoing support?', answer: 'Yes! We offer various support packages including bug fixes, updates, monitoring, and feature enhancements after launch.' },
    ],
    relatedServices: [
        { title: 'Web Design', href: '/web-design' },
        { title: 'App Development', href: '/app-development' },
        { title: 'MVP Development', href: '/mvp-development' },
        { title: 'UI/UX Design', href: '/ui-ux-design' },
    ],
}

export default function CustomSoftwarePage() {
    return <ServiceHub {...customSoftwareData} />
}

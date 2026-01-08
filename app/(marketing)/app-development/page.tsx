'use client'

import { ServiceHub } from '@/components/sections/service-hub'

const appDevData = {
    slug: 'app-development',
    badge: 'Mobile Apps',
    headline: 'Mobile Apps',
    subheadline: 'iOS and Android apps that work well and look good.',
    description: 'From concept to App Store, we build mobile apps that engage users and grow your business.',
    primaryCTA: 'Get in Touch',
    features: [
        {
            icon: 'smartphone',
            title: 'iOS Development',
            description: 'Native iOS apps built with Swift for optimal performance and seamless Apple ecosystem integration.',
        },
        {
            icon: 'android',
            title: 'Android Development',
            description: 'Native Android apps using Kotlin for smooth experiences across all Android devices.',
        },
        {
            icon: 'zap',
            title: 'Cross-Platform',
            description: 'React Native and Flutter apps that share code while delivering native-like performance.',
        },
        {
            icon: 'plug',
            title: 'API Integration',
            description: 'Seamless integration with third-party services, payment gateways, and backend systems.',
        },
        {
            icon: 'lock',
            title: 'Security First',
            description: 'Enterprise-grade security with encryption, secure authentication, and data protection.',
        },
        {
            icon: 'trending',
            title: 'Analytics & Insights',
            description: 'Built-in analytics to understand user behavior and optimize app performance.',
        },
    ],
    process: [
        { step: 1, title: 'Discovery', description: 'We understand your vision, target users, and business objectives.' },
        { step: 2, title: 'Design', description: 'UI/UX design that balances beauty with usability and accessibility.' },
        { step: 3, title: 'Development', description: 'Agile development with regular builds and feedback cycles.' },
        { step: 4, title: 'Testing', description: 'Comprehensive QA across devices, OS versions, and use cases.' },
        { step: 5, title: 'Launch', description: 'App Store optimization and submission with ongoing support.' },
    ],
    faqs: [
        { question: 'How much does app development cost?', answer: 'Mobile app development typically ranges from $20,000 for a simple app to $150,000+ for complex enterprise solutions. We provide detailed estimates based on your specific requirements.' },
        { question: 'Should I build native or cross-platform?', answer: 'It depends on your needs. Native offers best performance, while cross-platform (React Native/Flutter) reduces development time and cost. We help you make the right choice.' },
        { question: 'How long does it take to build an app?', answer: 'A typical mobile app takes 3-6 months from concept to launch. Complex apps may take 6-12 months. We provide realistic timelines during planning.' },
        { question: 'Do you handle App Store submission?', answer: 'Yes! We handle the entire submission process for both Apple App Store and Google Play Store, including ASO optimization.' },
    ],
    relatedServices: [
        { title: 'Web Design', href: '/web-design' },
        { title: 'UI/UX Design', href: '/ui-ux-design' },
        { title: 'MVP Development', href: '/mvp-development' },
        { title: 'Custom Software', href: '/custom-software' },
    ],
}

export default function AppDevelopmentPage() {
    return <ServiceHub {...appDevData} />
}

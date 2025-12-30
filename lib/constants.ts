/**
 * Design Tokens - Extracted from Figma
 * Single source of truth for all design values
 */
export const TOKENS = {
  colors: {
    bg: '#050505',
    bgDark: '#030014',
    text: '#e0e0e0',
    textMuted: '#cdcccc',
    textDim: '#8f8f8f',
    gold: '#ddceaf',
    goldDark: '#d2ae4a',
    card: '#0e1a1e',
    cardLight: '#f8f6f0',
    border: '#4b4b4b',
    glass: 'rgba(6,6,6,0.5)',
  },
  shadows: {
    text: '12px 10px 9px rgba(0,0,0,0.85)',
    card: '16px 14px 24px rgba(0,0,0,0.44)',
    glass: '0 8px 32px rgba(0,0,0,0.4)',
  },
  blur: {
    glass: '100px',
    nav: '12px',
  },
  timing: {
    ease: 'power3.out',
    easeIn: 'power2.in',
    easeInOut: 'power2.inOut',
    duration: {
      fast: 0.3,
      normal: 0.6,
      slow: 1.2,
    },
    stagger: 0.1,
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const

/**
 * Copy - All text content in one place
 */
export const COPY = {
  brand: {
    name: 'Make Us Live',
    tagline: 'Where Ideas Come Alive',
    email: 'hello@makeuslive.com',
    phone: '+91 98765 43210',
    location: 'Bhopal, MP, India',
  },
  nav: {
    links: [
      { label: 'Work', href: '/work' },
      { label: 'Services', href: '/services' },
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' },
    ],
    cta: 'Get in Touch',
  },
  hero: {
    greeting: 'नमस्ते',
    tagline: 'We build Products, Systems and Stories that scale.',
    cta: 'Explore Our Work',
  },
  services: {
    badge: 'Our Services',
    heading: 'What We Help You Build.',
    subheading: 'We design, build, & scale with AI at the core',
    description:
      'From concept to launch, we craft digital experiences that captivate and convert. Our team combines cutting-edge technology with creative vision.',
    items: [
      {
        id: 'ai-products',
        title: 'AI-Powered Products',
        subtitle: 'Intelligence at Scale',
        description: 'From intelligent agents to predictive analytics, we create AI systems that solve real business problems and drive measurable results.',
        icon: 'brain',
        gradient: 'from-indigo-500/20 to-purple-600/20',
        stats: ['10x faster', '95% accuracy', '24/7 uptime'],
      },
      {
        id: 'design-systems',
        title: 'Design Systems',
        subtitle: 'Brands that Convert',
        description: 'Component libraries, design tokens, and Figma-to-code pipelines that grow with your product and maintain consistency at scale.',
        icon: 'palette',
        gradient: 'from-emerald-500/20 to-teal-600/20',
        stats: ['100+ components', 'Zero design debt', 'Live sync'],
      },
      {
        id: 'web-development',
        title: 'Web Development',
        subtitle: 'Performance First',
        description: 'Modern, performant websites and web applications built with Next.js, React, and cutting-edge technologies.',
        icon: 'code',
        gradient: 'from-blue-500/20 to-cyan-600/20',
        stats: ['98+ Lighthouse', '60fps guaranteed', 'SEO optimized'],
      },
      {
        id: 'mobile-apps',
        title: 'Mobile Applications',
        subtitle: 'Native Experience',
        description: 'Cross-platform mobile apps with React Native that feel native and perform exceptionally on iOS and Android.',
        icon: 'rocket',
        gradient: 'from-orange-500/20 to-red-600/20',
        stats: ['iOS + Android', 'Offline-first', 'Push notifications'],
      },
      {
        id: 'growth-strategy',
        title: 'Growth Strategy',
        subtitle: 'Data-Driven Results',
        description: 'Strategic consulting and implementation to scale your digital presence with measurable outcomes.',
        icon: 'trending',
        gradient: 'from-pink-500/20 to-rose-600/20',
        stats: ['3x conversion', 'A/B tested', 'Analytics driven'],
      },
      {
        id: 'consulting',
        title: 'Technical Consulting',
        subtitle: 'Expert Guidance',
        description: 'Architecture reviews, code audits, and strategic technical guidance from senior engineers.',
        icon: 'lightbulb',
        gradient: 'from-yellow-500/20 to-amber-600/20',
        stats: ['Senior engineers', 'Code reviews', 'Best practices'],
      },
    ],
    quote: '"Innovation distinguishes between a leader and a follower."',
    quoteAuthor: '— Steve Jobs',
  },
  cases: {
    badge: 'Case Studies',
    heading: 'Real Work, Real Impact',
    subheading: 'Production systems solving real business problems',
    items: [
      {
        id: 'case-1',
        title: 'Internal Ticket & SLA Management System',
        category: 'Enterprise Platform',
        description: 'Production-ready internal workflow platform built to manage tickets, projects, and SLA commitments across multi-role engineering and operations teams.',
        image: '/images/case-1.jpg',
        stats: { metric: 'Multi-Team', label: 'Operations Platform' },
        tags: ['FastAPI', 'MongoDB', 'Next.js', 'TypeScript', 'JWT Auth'],
        gradient: 'from-blue-500/20 to-indigo-600/20',
      },
      {
        id: 'case-2',
        title: 'Real-Time Distraction Alert Mobile App',
        category: 'Mobile Safety',
        description: 'Production-grade mobile application detecting user distraction near roadways with intelligent safety alerts, running reliably under strict mobile OS constraints.',
        image: '/images/case-2.jpg',
        stats: { metric: 'Real-Time', label: 'Safety System' },
        tags: ['Flutter', 'Background Services', 'GPS', 'Activity Recognition'],
        gradient: 'from-orange-500/20 to-red-600/20',
      },
      {
        id: 'case-3',
        title: 'DocIt – Secure Document Locker',
        category: 'Production Mobile App',
        description: 'Live on Google Play with 10K+ downloads and 4.4★ rating. Secure document locker with offline access, scanning, and long-term reliability.',
        image: '/images/case-3.jpg',
        stats: { metric: '10K+', label: 'Active Downloads' },
        tags: ['Flutter', 'Secure Storage', 'Offline-First', 'Document Scanning'],
        gradient: 'from-emerald-500/20 to-teal-600/20',
      },
    ],
  },
  testimonials: {
    badge: 'Testimonials',
    heading: 'What Our Clients Say',
    items: [
      {
        id: 'testimonial-1',
        quote: 'MakeUsLive transformed our digital presence completely. Their attention to detail and innovative approach exceeded our expectations. The team delivered on time and the results speak for themselves.',
        author: 'Sarah Chen',
        role: 'CEO, TechStart Inc.',
        industry: 'SaaS',
        rating: 5,
        avatar: '/images/avatars/sarah.jpg',
      },
      {
        id: 'testimonial-2',
        quote: 'Working with MakeUsLive was a game-changer for our startup. They delivered a product that truly represents our brand vision and helped us scale from 0 to 50K users in 6 months.',
        author: 'Michael Torres',
        role: 'Founder, Bloom Studio',
        industry: 'E-commerce',
        rating: 5,
        avatar: '/images/avatars/michael.jpg',
      },
      {
        id: 'testimonial-3',
        quote: "The team's expertise in AI integration helped us automate processes we thought were impossible. Our customer service efficiency improved by 340% within the first quarter.",
        author: 'Emily Watson',
        role: 'CTO, DataFlow',
        industry: 'Fintech',
        rating: 5,
        avatar: '/images/avatars/emily.jpg',
      },
      {
        id: 'testimonial-4',
        quote: 'Exceptional quality and professionalism. They understood our vision from day one and executed it flawlessly. Highly recommend for any serious project.',
        author: 'David Park',
        role: 'Product Lead, InnovateCo',
        industry: 'Healthcare',
        rating: 5,
        avatar: '/images/avatars/david.jpg',
      },
      {
        id: 'testimonial-5',
        quote: "The design system they built for us has saved countless hours and maintained consistency across all our products. It's become the foundation of everything we build.",
        author: 'Lisa Johnson',
        role: 'Design Director, Scale Labs',
        industry: 'Technology',
        rating: 5,
        avatar: '/images/avatars/lisa.jpg',
      },
    ],
  },
  howWeWork: {
    badge: 'Our Process',
    heading: 'How We Work',
    subheading: 'A proven methodology that delivers results',
    steps: [
      {
        id: 'step-1',
        number: '01',
        title: 'Discover',
        description: 'We dive deep into your business, goals, and challenges. Through workshops and research, we understand what success looks like for you.',
        icon: 'lightbulb',
        duration: '1-2 weeks',
      },
      {
        id: 'step-2',
        number: '02',
        title: 'Design',
        description: 'Our designers create stunning visuals and intuitive interfaces. Every pixel is intentional, every interaction meaningful.',
        icon: 'pencil',
        duration: '2-4 weeks',
      },
      {
        id: 'step-3',
        number: '03',
        title: 'Develop',
        description: 'Our engineers build robust, scalable solutions using cutting-edge technology. Clean code, tested thoroughly, deployed confidently.',
        icon: 'code',
        duration: '4-8 weeks',
      },
      {
        id: 'step-4',
        number: '04',
        title: 'Deploy',
        description: 'We launch, monitor, and optimize. Our partnership continues as we help you iterate based on real user feedback and data.',
        icon: 'rocket',
        duration: 'Ongoing',
      },
    ],
  },
  contact: {
    badge: 'Get In Touch',
    heading: "Let's Build Something Amazing",
    subheading: "Ready to transform your ideas into reality? Let's talk.",
    info: {
      email: 'hello@makeuslive.com',
      phone: '+91 98765 43210',
      location: 'Bhopal, Madhya Pradesh, India',
    },
    form: {
      name: { label: 'Your Name', placeholder: 'John Doe' },
      email: { label: 'Email Address', placeholder: 'john@example.com' },
      website: { label: 'Website (optional)', placeholder: 'https://yoursite.com' },
      phone: { label: 'Phone (optional)', placeholder: '+1 (555) 000-0000' },
      message: { label: 'Your Message', placeholder: 'Tell us about your project...' },
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Message sent successfully!',
      error: 'Something went wrong. Please try again.',
    },
  },
  about: {
    badge: 'About Us',
    heading: 'Engineers + Designers Building the Future',
    subheading: 'A passionate team dedicated to crafting exceptional digital experiences',
    mission: 'We believe technology should empower, not complicate. Our mission is to build products that people love to use.',
    values: [
      { title: 'Quality First', description: 'We never compromise on quality. Every line of code, every pixel matters.' },
      { title: 'User Focused', description: 'We design for real people with real needs, not just stakeholders.' },
      { title: 'Transparent', description: 'Honest communication, realistic timelines, no hidden surprises.' },
      { title: 'Innovative', description: 'We stay ahead of trends while focusing on what actually works.' },
    ],
    team: [
      { name: 'Abhishek Jha', role: 'The Generalist', image: '/images/team/abhishek.jpg' },
      { name: 'Rishi Soni', role: 'Tech Master', image: '/images/team/rishi.jpg' },
      { name: 'Vikramaditya Jha', role: 'Strategy & Content', image: '/images/team/vikramaditya.jpg' },
    ],
  },
  footer: {
    sections: [
      {
        title: 'Company',
        items: [
          { label: 'About', href: '/about' },
          { label: 'Services', href: '/services' },
          { label: 'Works', href: '/works' },
          { label: 'Blog', href: '/blog' },
          { label: 'Careers', href: '/careers' },
        ],
      },
      {
        title: 'Services',
        items: [
          { label: 'AI Products', href: '/services#ai' },
          { label: 'Design Systems', href: '/services#design' },
          { label: 'Web Development', href: '/services#web' },
          { label: 'Mobile Apps', href: '/services#mobile' },
          { label: 'Consulting', href: '/services#consulting' },
        ],
      },
      {
        title: 'Reach Out',
        items: [
          'hello@makeuslive.com',
          '+91 98765 43210',
          'Bhopal, MP, India',
        ],
      },
    ],
    social: [
      { name: 'Twitter', href: 'https://twitter.com/makeuslivee', icon: 'twitter' },
      { name: 'LinkedIn', href: 'https://linkedin.com/company/makeuslivee', icon: 'linkedin' },
      { name: 'GitHub', href: 'https://github.com/makeuslivee', icon: 'github' },
      { name: 'Dribbble', href: 'https://dribbble.com/makeuslivee', icon: 'dribbble' },
      { name: 'Instagram', href: 'https://instagram.com/makeuslivee', icon: 'instagram' },
      { name: 'Facebook', href: 'https://facebook.com/makeuslivee', icon: 'facebook' },
      { name: 'YouTube', href: 'https://youtube.com/@makeuslivee', icon: 'youtube' },
    ],
    copyright: '© 2025 MakeUsLive. All rights reserved.',
    tagline: 'Built with ❤️ by Engineers + Designers',
  },
} as const

/**
 * Animation configurations for GSAP
 */
export const ANIMATIONS = {
  fadeUp: {
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0 },
    duration: 0.8,
    ease: 'power3.out',
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 0.6,
    ease: 'power2.out',
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    duration: 1.2,
    ease: 'power3.out',
  },
  slideLeft: {
    from: { opacity: 0, x: 100 },
    to: { opacity: 1, x: 0 },
    duration: 0.8,
    ease: 'power3.out',
  },
  slideRight: {
    from: { opacity: 0, x: -100 },
    to: { opacity: 1, x: 0 },
    duration: 0.8,
    ease: 'power3.out',
  },
  stagger: {
    amount: 0.4,
    from: 'start',
    ease: 'power2.out',
  },
  scrollTrigger: {
    start: 'top 85%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
  },
} as const

export type ServiceItem = (typeof COPY.services.items)[number]
export type CaseItem = (typeof COPY.cases.items)[number]
export type TestimonialItem = (typeof COPY.testimonials.items)[number]
export type StepItem = (typeof COPY.howWeWork.steps)[number]

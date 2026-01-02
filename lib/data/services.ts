export interface Service {
  slug: string
  title: string
  tagline: string
  description: string
  icon: string
  features: string[]
  stats: { value: string; label: string }
  gradient: string
  iconGradient: string
  size: 'large' | 'medium'
}

export const ALL_SERVICES: Service[] = [
  {
    slug: 'app-development',
    title: 'Mobile App Development',
    tagline: 'Apps That Users Love',
    description: 'High-performance iOS, Android, and cross-platform apps built with React Native & Flutter. From concept to App Store.',
    icon: 'smartphone',
    features: ['iOS Development', 'Android Development', 'React Native', 'Flutter'],
    stats: { value: '4.9★', label: 'App Store Rating' },
    gradient: 'from-blue-600/30 via-cyan-600/20 to-transparent',
    iconGradient: 'from-blue-500 to-cyan-600',
    size: 'large',
  },
  {
    slug: 'web-design',
    title: 'Web Design & Development',
    tagline: 'Websites That Convert',
    description: 'Modern, performant websites built with Next.js and React. SEO-optimized, mobile-first designs that drive results.',
    icon: 'code',
    features: ['Next.js', 'React', 'SEO Optimization', 'Performance'],
    stats: { value: '98+', label: 'Lighthouse Score' },
    gradient: 'from-emerald-600/30 via-teal-600/20 to-transparent',
    iconGradient: 'from-emerald-500 to-teal-600',
    size: 'medium',
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    tagline: 'Designs That Delight',
    description: 'User research, wireframing, and beautiful interfaces. Design systems that scale with your product.',
    icon: 'palette',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    stats: { value: '95%', label: 'User Satisfaction' },
    gradient: 'from-purple-600/30 via-pink-600/20 to-transparent',
    iconGradient: 'from-purple-500 to-pink-600',
    size: 'medium',
  },
  {
    slug: 'mvp-development',
    title: 'MVP Development',
    tagline: 'Launch Fast, Learn Faster',
    description: 'Validate your idea with a lean MVP in 4-8 weeks. Scalable foundation that grows with your success.',
    icon: 'rocket',
    features: ['Rapid Development', 'Idea Validation', 'Investor Ready', 'Scalable'],
    stats: { value: '4-8', label: 'Weeks to Launch' },
    gradient: 'from-orange-600/30 via-red-600/20 to-transparent',
    iconGradient: 'from-orange-500 to-red-600',
    size: 'medium',
  },
  {
    slug: 'custom-software',
    title: 'Custom Software',
    tagline: 'Enterprise Solutions',
    description: 'Tailored ERP, CRM, and business management systems. Enterprise-grade solutions that integrate seamlessly.',
    icon: 'building',
    features: ['ERP Systems', 'CRM Solutions', 'System Integration', 'Automation'],
    stats: { value: '24/7', label: 'Support' },
    gradient: 'from-yellow-600/30 via-amber-600/20 to-transparent',
    iconGradient: 'from-yellow-500 to-amber-600',
    size: 'medium',
  },
]

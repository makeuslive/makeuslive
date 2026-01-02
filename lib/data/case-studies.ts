export interface CaseStudy {
  slug: string
  title: string
  client: string
  sector: string
  challenge: string
  solution: string
  results: {
    metric: string
    label: string
    methodology: string
  }[]
  methodology: string
  testimonial?: {
    quote: string
    author: string
    company: string
  }
  pdfVersion: string
  pdfLastUpdated: Date
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  'internal-ticket-sla-system': {
    slug: 'internal-ticket-sla-system',
    title: 'Internal Ticket & SLA Management System',
    client: 'Enterprise Client',
    sector: 'Technology',
    challenge: 'The client needed a comprehensive system to manage internal tickets, projects, and SLA commitments across multiple engineering and operations teams.',
    solution: 'We built a production-ready workflow platform using FastAPI, MongoDB, and Next.js. The system includes real-time notifications, automated SLA tracking, and comprehensive reporting.',
    results: [
      { metric: '95%', label: 'SLA Compliance Rate', methodology: 'Measured against defined SLA targets over 6 months' },
      { metric: '40%', label: 'Faster Ticket Resolution', methodology: 'Compared to previous manual process' },
      { metric: 'Multi-Team', label: 'Daily Operations', methodology: 'Serving 5+ teams simultaneously' },
    ],
    methodology: 'Results measured over 6 months of production use. SLA compliance tracked against defined targets. Resolution time compared to baseline manual process.',
    testimonial: {
      quote: 'The system has transformed how we manage internal operations. The automated SLA tracking alone has saved us countless hours.',
      author: 'Engineering Director',
      company: 'Enterprise Client',
    },
    pdfVersion: '1.0',
    pdfLastUpdated: new Date('2025-12-15'),
  },
  'realtime-distraction-alert': {
    slug: 'realtime-distraction-alert',
    title: 'Real-Time Distraction Alert Mobile App',
    client: 'Safety Tech Startup',
    sector: 'Mobile Safety',
    challenge: 'Building a mobile app that detects user distraction near roadways and provides intelligent safety alerts in real-time.',
    solution: 'Developed a production-grade mobile app using Flutter with background services, geofencing, and activity recognition. The app runs efficiently in the background while maintaining battery life.',
    results: [
      { metric: 'Real-Time', label: 'Background Operations', methodology: 'Continuous monitoring with minimal battery impact' },
      { metric: '99.9%', label: 'Uptime', methodology: 'Measured over 3 months of production use' },
    ],
    methodology: 'Uptime measured via monitoring services. Battery impact tested across multiple devices over 30-day periods.',
    testimonial: {
      quote: 'The app works seamlessly in the background and has helped prevent numerous potential accidents.',
      author: 'Product Manager',
      company: 'Safety Tech Startup',
    },
    pdfVersion: '1.0',
    pdfLastUpdated: new Date('2025-11-20'),
  },
}

export function getCaseStudy(slug: string): CaseStudy | null {
  return CASE_STUDIES[slug] || null
}

export function getAllCaseStudies(): CaseStudy[] {
  return Object.values(CASE_STUDIES)
}

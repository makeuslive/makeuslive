/**
 * Global JSON-LD Schema
 * 
 * This file contains ONLY schemas that apply globally to every page:
 * - Organization (core brand identity)
 * - WebSite (search action, publisher)
 * 
 * Page-specific schemas (LocalBusiness, Services, FAQ) belong in their respective pages.
 */

export const globalJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // Organization - Core Brand Identity
    {
      '@type': 'Organization',
      '@id': 'https://www.makeuslive.com/#organization',
      name: 'MakeUsLive',
      legalName: 'MakeUsLive',
      alternateName: ['Make Us Live', 'Make Us Live Agency', 'MUL Studio'],
      url: 'https://www.makeuslive.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.makeuslive.com/images/biglogo.png',
        width: 512,
        height: 512,
      },
      image: 'https://www.makeuslive.com/images/biglogo.png',
      description:
        'Make Us Live is a creative technology studio specializing in AI-powered products, web development, mobile apps, and design systems.',
      slogan: 'Design. Think. Build. Automate.',
      email: 'hello@makeuslive.com',
      foundingDate: '2025',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bhopal',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://twitter.com/makeuslivee',
        'https://linkedin.com/company/makeuslivee',
        'https://github.com/makeuslivee',
        'https://instagram.com/makeuslivee',
      ],
      founder: [
        {
          '@type': 'Person',
          name: 'Abhishek Jha',
          jobTitle: 'Co-Founder',
        },
        {
          '@type': 'Person',
          name: 'Rishi Soni',
          jobTitle: 'Co-Founder',
        },
        {
          '@type': 'Person',
          name: 'Vikramaditya Jha',
          jobTitle: 'Co-Founder',
        },
      ],
      knowsAbout: [
        'Artificial Intelligence',
        'Web Development',
        'Mobile App Development',
        'UI/UX Design',
        'Design Systems',
      ],
    },
    // WebSite - Search Action
    {
      '@type': 'WebSite',
      '@id': 'https://www.makeuslive.com/#website',
      url: 'https://www.makeuslive.com',
      name: 'Make Us Live',
      description: 'Premium AI & Digital Agency',
      publisher: { '@id': 'https://www.makeuslive.com/#organization' },
      inLanguage: 'en-US',
    },
  ],
}

/**
 * Services Page Schema
 * Use in: app/(marketing)/services/page.tsx
 */
export const servicesPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://www.makeuslive.com/services#service',
  name: 'MakeUsLive Digital Services',
  url: 'https://www.makeuslive.com/services',
  provider: { '@id': 'https://www.makeuslive.com/#organization' },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'United Kingdom' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI & Data Science',
          description: 'Custom AI solutions, machine learning, and LLM integration.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Development',
          description: 'Modern web applications with Next.js and React.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Mobile App Development',
          description: 'Cross-platform mobile apps with React Native and Flutter.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'UI/UX Design',
          description: 'User research, wireframing, and design systems.',
        },
      },
    ],
  },
}

/**
 * Contact Page Schema (LocalBusiness)
 * Use in: app/(marketing)/contact/page.tsx
 */
export const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.makeuslive.com/contact#localbusiness',
  name: 'MakeUsLive',
  image: 'https://www.makeuslive.com/images/biglogo.png',
  url: 'https://www.makeuslive.com',
  telephone: '+91-98765-43210',
  email: 'hello@makeuslive.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bhopal',
    addressRegion: 'Madhya Pradesh',
    postalCode: '462001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 23.2599,
    longitude: 77.4126,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
}

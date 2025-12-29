import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Works - Portfolio & Case Studies | MakeUsLive',
  description: 'Explore our portfolio of successful projects, case studies, and digital solutions. See how we help businesses transform their ideas into reality.',
  openGraph: {
    title: 'Our Works - Portfolio & Case Studies | MakeUsLive',
    description: 'Explore our portfolio of successful projects and case studies.',
    url: 'https://makeuslive.com/works',
    type: 'website',
  },
  alternates: {
    canonical: 'https://makeuslive.com/works',
  },
}

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


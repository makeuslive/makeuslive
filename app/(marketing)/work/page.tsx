import { Suspense } from 'react'
import { Metadata } from 'next'
import { getWorks } from '@/lib/data/work'
import WorkClient from './work-client'

export const metadata: Metadata = {
  title: 'Our Work | Make Us Live',
  description: 'Explore our portfolio of successful projects. From enterprise platforms to mobile apps, see how we deliver excellence and innovation.',
}

export default async function WorksPage() {
  const works = await getWorks()

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <WorkClient initialWorks={works} />
    </Suspense>
  )
}

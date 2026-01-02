import { Suspense } from 'react'
import { Metadata } from 'next'
import { getBlogPosts } from '@/lib/data/blog'
import BlogClient from './blog-client'

export const metadata: Metadata = {
  title: 'Blog | Make Us Live',
  description: 'Insights and stories from the team at Make Us Live. Explore the latest in technology, design, and innovation.',
}

export default async function BlogPage() {
  // Fetch initial posts on the server (page 1, published, etc.)
  const { posts, pagination } = await getBlogPosts({
    status: 'published',
    page: 1,
    limit: 10 // Match the client's default expectation or config
  })

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <BlogClient initialPosts={posts} pagination={pagination} />
    </Suspense>
  )
}

import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { COPY } from '@/lib/constants'

export async function GET() {
  try {
    // 1. Seed Works
    const worksCollection = await getCollection('works')
    const worksCount = await worksCollection.countDocuments()
    
    if (worksCount === 0) {
      await worksCollection.insertMany(COPY.cases.items)
    }

    // 2. Seed Testimonials
    const testimonialsCollection = await getCollection('testimonials')
    const testimonialsCount = await testimonialsCollection.countDocuments()

    if (testimonialsCount === 0) {
      await testimonialsCollection.insertMany(COPY.testimonials.items)
    }

    // 3. Seed Posts (Mock data since constants doesn't have posts yet)
    const postsCollection = await getCollection('posts')
    const postsCount = await postsCollection.countDocuments()

    if (postsCount === 0) {
      const mockPosts = [
        {
          id: 'post-1',
          title: 'The Future of AI in Web Development',
          excerpt: 'How artificial intelligence is reshaping the way we build and interact with the web.',
          date: '2025-01-15',
          author: { name: 'Abhishek Jha', avatar: '/images/team/abhishek.jpg' },
          image: '/images/blog/ai-future.jpg',
          category: 'Technology',
          slug: 'future-of-ai-web-development'
        },
        {
          id: 'post-2',
          title: 'Building Scalable Design Systems',
          excerpt: 'A comprehensive guide to creating design systems that grow with your product.',
          date: '2025-01-10',
          author: { name: 'Rishi Soni', avatar: '/images/team/rishi.jpg' },
          image: '/images/blog/design-systems.jpg',
          category: 'Design',
          slug: 'building-scalable-design-systems'
        },
        {
          id: 'post-3',
          title: 'Next.js 15: What to Expect',
          excerpt: 'Breaking down the new features and improvements in the latest Next.js release.',
          date: '2024-12-28',
          author: { name: 'Vikramaditya Jha', avatar: '/images/team/vikramaditya.jpg' },
          image: '/images/blog/nextjs-15.jpg',
          category: 'Development',
          slug: 'nextjs-15-what-to-expect'
        }
      ]
      await postsCollection.insertMany(mockPosts)
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      stats: {
        works: await worksCollection.countDocuments(),
        testimonials: await testimonialsCollection.countDocuments(),
        posts: await postsCollection.countDocuments()
      }
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}

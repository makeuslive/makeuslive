import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getBlogPostBySlug } from '@/lib/data/blog'
import BlogPostClient from './blog-post-client'

interface BlogPostPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getBlogPostBySlug(slug)

    if (!post) {
        return {
            title: 'Post Not Found',
        }
    }

    return {
        title: `${post.title} | Make Us Live`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [post.author?.name || 'Make Us Live'],
            images: post.featuredImage ? [{ url: post.featuredImage }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: post.featuredImage ? [post.featuredImage] : [],
        },
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = await getBlogPostBySlug(slug)

    if (!post) {
        notFound()
    }

    // Check if post is published (unless in preview mode or similar - for now strict check)
    // The API route had logic for this, but our data fetcher returns whatever is in DB
    // We should add status check here if we want to restrict access
    if (post.status !== 'published') {
        notFound()
    }

    return (
        <Suspense fallback={
            <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    <p className="text-white/50 text-sm">Loading article...</p>
                </div>
            </div>
        }>
            <BlogPostClient post={post} />
        </Suspense>
    )
}

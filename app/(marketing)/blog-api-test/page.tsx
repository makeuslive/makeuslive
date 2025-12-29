'use client'

import { useEffect, useState } from 'react'

export default function BlogAPITestPage() {
    const [results, setResults] = useState<any>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const testAPI = async () => {
            setLoading(true)
            const tests: any = {}

            try {
                // Test 1: Get all blog posts
                const res1 = await fetch('/api/blog')
                tests.allPosts = await res1.json()

                // Test 2: Get posts with category filter
                const res2 = await fetch('/api/blog?category=Design')
                tests.designPosts = await res2.json()

                // Test 3: Get featured posts
                const res3 = await fetch('/api/blog/featured?limit=3')
                tests.featuredPosts = await res3.json()

                // Test 4: Get categories
                const res4 = await fetch('/api/blog/categories')
                tests.categories = await res4.json()

                // Test 5: Get single post (if available)
                if (tests.allPosts?.data?.posts?.[0]?.slug) {
                    const slug = tests.allPosts.data.posts[0].slug
                    const res5 = await fetch(`/api/blog/${slug}`)
                    tests.singlePost = await res5.json()
                }

                setResults(tests)
            } catch (error) {
                console.error('API Test Error:', error)
                setResults({ error: String(error) })
            } finally {
                setLoading(false)
            }
        }

        testAPI()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60">Testing Blog API Endpoints...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-gold">Blog REST API Test Results</h1>

                <div className="space-y-8">
                    {/* Test 1: All Posts */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                            <span className="text-gold">1.</span>
                            GET /api/blog
                            {results.allPosts?.success && (
                                <span className="text-sm text-green-400 ml-2">✓ Success</span>
                            )}
                        </h2>
                        <div className="bg-black/50 rounded p-4 overflow-auto max-h-96">
                            <pre className="text-xs text-white/80">
                                {JSON.stringify(results.allPosts, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Test 2: Category Filter */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                            <span className="text-gold">2.</span>
                            GET /api/blog?category=Design
                            {results.designPosts?.success && (
                                <span className="text-sm text-green-400 ml-2">✓ Success</span>
                            )}
                        </h2>
                        <div className="bg-black/50 rounded p-4 overflow-auto max-h-96">
                            <pre className="text-xs text-white/80">
                                {JSON.stringify(results.designPosts, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Test 3: Featured Posts */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                            <span className="text-gold">3.</span>
                            GET /api/blog/featured?limit=3
                            {results.featuredPosts?.success && (
                                <span className="text-sm text-green-400 ml-2">✓ Success</span>
                            )}
                        </h2>
                        <div className="bg-black/50 rounded p-4 overflow-auto max-h-96">
                            <pre className="text-xs text-white/80">
                                {JSON.stringify(results.featuredPosts, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Test 4: Categories */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                            <span className="text-gold">4.</span>
                            GET /api/blog/categories
                            {results.categories?.success && (
                                <span className="text-sm text-green-400 ml-2">✓ Success</span>
                            )}
                        </h2>
                        <div className="bg-black/50 rounded p-4 overflow-auto max-h-96">
                            <pre className="text-xs text-white/80">
                                {JSON.stringify(results.categories, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Test 5: Single Post */}
                    {results.singlePost && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                <span className="text-gold">5.</span>
                                GET /api/blog/[slug]
                                {results.singlePost?.success && (
                                    <span className="text-sm text-green-400 ml-2">✓ Success</span>
                                )}
                            </h2>
                            <div className="bg-black/50 rounded p-4 overflow-auto max-h-96">
                                <pre className="text-xs text-white/80">
                                    {JSON.stringify(results.singlePost, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="mt-8 bg-gold/10 border border-gold/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Test Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/30 rounded p-4 text-center">
                            <div className="text-2xl font-bold text-gold mb-1">
                                {Object.keys(results).filter(k => results[k]?.success).length}
                            </div>
                            <div className="text-xs text-white/60 uppercase">Passed</div>
                        </div>
                        <div className="bg-black/30 rounded p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                                {Object.keys(results).length}
                            </div>
                            <div className="text-xs text-white/60 uppercase">Total Tests</div>
                        </div>
                        <div className="bg-black/30 rounded p-4 text-center">
                            <div className="text-2xl font-bold text-green-400 mb-1">
                                {results.allPosts?.data?.pagination?.totalCount || 0}
                            </div>
                            <div className="text-xs text-white/60 uppercase">Total Posts</div>
                        </div>
                        <div className="bg-black/30 rounded p-4 text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-1">
                                {results.categories?.data?.length - 1 || 0}
                            </div>
                            <div className="text-xs text-white/60 uppercase">Categories</div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <a
                        href="/blog"
                        className="inline-block px-6 py-3 bg-gold text-bg font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                    >
                        View Blog Page
                    </a>
                </div>
            </div>
        </div>
    )
}

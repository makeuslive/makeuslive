'use client'

import Link from 'next/link'

// Dashboard stat card component
function StatCard({
    title,
    value,
    icon,
    href,
    change,
}: {
    title: string
    value: string | number
    icon: string
    href: string
    change?: string
}) {
    return (
        <Link
            href={href}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-gold/30 hover:bg-white/[0.07] transition-all group"
        >
            <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{icon}</span>
                {change && (
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                        {change}
                    </span>
                )}
            </div>
            <p className="text-3xl font-bold text-white mb-1 group-hover:text-gold transition-colors">
                {value}
            </p>
            <p className="text-sm text-gray-400">{title}</p>
        </Link>
    )
}

// Quick action button component
function QuickAction({
    label,
    icon,
    href,
}: {
    label: string
    icon: string
    href: string
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-gold/30 hover:bg-white/[0.07] transition-all"
        >
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-medium text-white">{label}</span>
        </Link>
    )
}

export default function AdminDashboard() {
    // These would be fetched from Firebase in production
    const stats = {
        testimonials: 5,
        works: 6,
        unreadContacts: 3,
        blogPosts: 3,
        subscribers: 0,
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back! 👋</h2>
                <p className="text-gray-400">Here&apos;s what&apos;s happening with your site today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Testimonials"
                    value={stats.testimonials}
                    icon="💬"
                    href="/admin/testimonials"
                />
                <StatCard
                    title="Portfolio Works"
                    value={stats.works}
                    icon="🎨"
                    href="/admin/works"
                />
                <StatCard
                    title="Unread Messages"
                    value={stats.unreadContacts}
                    icon="📬"
                    href="/admin/contacts"
                    change="3 new"
                />
                <StatCard
                    title="Newsletter Subs"
                    value={stats.subscribers}
                    icon="📧"
                    href="/admin/newsletter"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <QuickAction label="Add Testimonial" icon="➕" href="/admin/testimonials/new" />
                    <QuickAction label="Add Work" icon="🖼️" href="/admin/works/new" />
                    <QuickAction label="New Blog Post" icon="✍️" href="/admin/blog/new" />
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Getting Started</h3>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="space-y-4 text-sm text-gray-400">
                        <p className="flex items-start gap-3">
                            <span className="text-gold">1.</span>
                            <span>
                                <strong className="text-white">Set up Firebase:</strong> Copy the environment
                                variables from <code className="text-gold">.env.firebase.example</code> to{' '}
                                <code className="text-gold">.env.local</code>
                            </span>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="text-gold">2.</span>
                            <span>
                                <strong className="text-white">Create admin user:</strong> Go to Firebase Console →
                                Authentication → Add User
                            </span>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="text-gold">3.</span>
                            <span>
                                <strong className="text-white">Start adding content:</strong> Use the sidebar to
                                manage testimonials, works, and blog posts
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

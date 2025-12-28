'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/lib/auth-context'

// Sidebar navigation items
const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
    { href: '/admin/works', label: 'Works', icon: '🎨' },
    { href: '/admin/contacts', label: 'Contact Forms', icon: '📬' },
    { href: '/admin/blog', label: 'Blog Posts', icon: '📝' },
    { href: '/admin/newsletter', label: 'Newsletter', icon: '📧' },
]

function AdminLayoutContent({ children }: { children: ReactNode }) {
    const { user, loading, signOut } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!loading && !user && pathname !== '/admin/login') {
            router.push('/admin/login')
        }
    }, [user, loading, router, pathname])

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        )
    }

    // If on login page, don't show layout
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    // If not authenticated, show nothing (redirect will happen)
    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex relative z-[100] isolate">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0f0f0f] border-r border-white/10 flex flex-col fixed h-screen z-[100]">
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white">MakeUsLive</span>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-gold/10 text-gold border border-gold/20'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        {item.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* User / Logout */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center text-black font-bold text-sm">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto ml-64">
                {/* Top Header */}
                <header className="h-16 bg-[#0f0f0f] border-b border-white/10 flex items-center justify-between px-6">
                    <h1 className="text-lg font-semibold text-white">
                        {navItems.find((item) => item.href === pathname)?.label || 'Admin'}
                    </h1>
                    <Link
                        href="/"
                        target="_blank"
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        View Site →
                    </Link>
                </header>

                {/* Page Content */}
                <div className="p-6">{children}</div>
            </main>
        </div>
    )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AuthProvider>
    )
}

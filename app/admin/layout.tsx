'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/lib/auth-context'

// Sidebar navigation items
const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/blog', label: 'Blog Posts', icon: '📝' },
    { href: '/admin/works', label: 'Works', icon: '🎨' },
    { href: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
    { href: '/admin/contacts', label: 'Contacts', icon: '📬' },
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-blue-600"></div>
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
        <div className="min-h-screen bg-gray-50 flex relative z-[100] isolate">
            {/* Sidebar - Light Mode */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-screen z-[100] shadow-sm">
                {/* Logo */}
                <div className="p-5 border-b border-gray-100">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <div>
                            <span className="text-lg font-bold text-gray-900">MakeUsLive</span>
                            <span className="text-xs text-gray-400 block -mt-0.5">CMS</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 overflow-y-auto">
                    <ul className="space-y-0.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/admin' && pathname?.startsWith(item.href))
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="text-base">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* User / Logout */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {user.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto ml-64">
                {/* Top Header */}
                <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-semibold text-gray-900">
                            {navItems.find((item) => item.href === pathname)?.label ||
                                pathname?.includes('/blog/') ? 'Blog Editor' : 'Admin'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                        >
                            View Site
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 bg-gray-50 min-h-[calc(100vh-3.5rem)]">{children}</div>
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

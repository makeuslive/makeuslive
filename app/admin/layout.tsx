'use client'

import { ReactNode, useEffect, useState } from 'react'
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
    const [collapsed, setCollapsed] = useState(false)

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
            <aside
                className={`bg-white border-r border-gray-200 flex flex-col fixed h-screen z-[100] shadow-sm transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'
                    }`}
            >
                {/* Logo & Toggle */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <Link href="/admin" className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-white font-bold text-sm">M</span>
                        </div>
                        {!collapsed && (
                            <div>
                                <span className="text-lg font-bold text-gray-900 leading-tight block">MakeUsLive</span>
                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block">Admin Panel</span>
                            </div>
                        )}
                    </Link>
                    {!collapsed && (
                        <button
                            onClick={() => setCollapsed(true)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 overflow-y-auto">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/admin' && pathname?.startsWith(item.href))
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        title={collapsed ? item.label : ''}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${isActive
                                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                                            } ${collapsed ? 'justify-center' : ''}`}
                                    >
                                        <span className="text-lg shrink-0">{item.icon}</span>
                                        {!collapsed && <span className="truncate">{item.label}</span>}

                                        {collapsed && isActive && (
                                            <div className="absolute left-20 bg-gray-900 text-white text-xs px-2 py-1 rounded ml-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                                {item.label}
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Collapse Button (Bottom - when collapsed) */}
                {collapsed && (
                    <div className="p-3 border-t border-gray-100 flex justify-center">
                        <button
                            onClick={() => setCollapsed(false)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* User / Logout */}
                {!collapsed && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm shrink-0">
                                {user.email?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-2 justify-center"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="truncate">Sign Out</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${collapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                {/* Top Header */}
                <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                            {navItems.find((item) => item.href === pathname)?.label ||
                                pathname?.includes('/blog/') ? 'Blog Editor' : 'Admin Dashboard'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border border-gray-200 hover:border-blue-200"
                        >
                            <span>View Site</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

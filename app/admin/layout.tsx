'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, signOut } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Load collapsed state from local storage
    useEffect(() => {
        const saved = localStorage.getItem('admin_sidebar_collapsed')
        if (saved) setIsCollapsed(JSON.parse(saved))
    }, [])

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    const toggleCollapse = () => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        localStorage.setItem('admin_sidebar_collapsed', JSON.stringify(newState))
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Blog Posts', href: '/admin/blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
        { name: 'Work', href: '/admin/work', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Jobs', href: '/admin/jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { name: 'Testimonials', href: '/admin/testimonials', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z' },
        { name: 'Contacts', href: '/admin/contacts', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { name: 'Newsletter', href: '/admin/newsletter', icon: 'M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76' },
    ]

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/admin/login')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    // Don't show sidebar on login page
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? 'w-20' : 'w-64'
                    } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className={`h-16 flex items-center border-b border-gray-100 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
                    <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0 shadow-sm shadow-blue-200">
                            M
                        </div>
                        {!isCollapsed && (
                            <span className="font-bold text-gray-900 text-lg tracking-tight whitespace-nowrap">MakeUsLive</span>
                        )}
                    </Link>
                    {!isCollapsed && (
                        <button onClick={toggleCollapse} className="text-gray-400 hover:text-gray-600 transition-colors hidden lg:block">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                </div>

                {isCollapsed && (
                    <button onClick={toggleCollapse} className="w-full flex justify-center py-4 text-gray-400 hover:text-gray-600 transition-colors hidden lg:flex border-b border-gray-50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </button>
                )}

                <div className="flex-1 flex flex-col justify-between py-6 overflow-y-auto">
                    <div className={isCollapsed ? 'px-2' : 'px-4'}>
                        {!isCollapsed && <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">CMS</div>}
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                                            ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            } ${isCollapsed ? 'justify-center' : ''}`}
                                        title={isCollapsed ? item.name : undefined}
                                    >
                                        <svg className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                        {!isCollapsed && <span>{item.name}</span>}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    <div className={isCollapsed ? 'px-2' : 'px-4'}>
                        {!isCollapsed && <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2 mt-6">Account</div>}
                        <div className={`flex ${isCollapsed ? 'flex-col items-center gap-4' : 'flex-col gap-2'}`}>
                            <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 ${isCollapsed ? 'justify-center w-full aspect-square p-0' : ''}`}>
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 ring-2 ring-white">
                                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                {!isCollapsed && (
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-medium text-gray-900 truncate max-w-[140px]">{user?.email}</p>
                                        <p className="text-[10px] text-gray-500">Admin</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleSignOut}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full ${isCollapsed ? 'justify-center' : ''}`}
                                title="Sign Out"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {!isCollapsed && <span>Sign Out</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="font-semibold text-gray-900">Admin</span>
                    <div className="w-10" /> {/* Spacer */}
                </header>

                <div className="flex-1 overflow-hidden bg-gray-50 relative">
                    {children}
                </div>
            </main>
        </div>
    )
}

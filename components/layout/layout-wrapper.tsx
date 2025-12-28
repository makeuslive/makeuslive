'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface LayoutWrapperProps {
    children: ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith('/admin')

    if (isAdminRoute) {
        // Admin routes get their own layout - don't render public navbar/footer
        return <>{children}</>
    }

    return (
        <>
            {/* Navigation */}
            <Navbar />

            {/* Main content */}
            <main className="relative z-10">{children}</main>

            {/* Footer */}
            <Footer />
        </>
    )
}

'use client'

import { memo } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { iconMap } from './icons'
import {
    Smartphone,
    Zap,
    PlugZap,
    Lock,
    BarChart3,
    Search,
    Database,
    Cpu,
    Layers,
    Layout,
    MessageSquare,
    Bot,
    Building,
    Settings,
    RefreshCw
} from 'lucide-react'

interface IconProps {
    className?: string
    size?: number
}

// Logo image paths mapping
const logoImageMap: Record<string, string> = {
    figma: '/images/logos/figma.png',
    flutter: '/images/logos/flutter.png',
    n8n: '/images/logos/n8n.png',
    nodejs: '/images/logos/nodejs.png',
    nextjs: '/images/logos/nextjs.png',
    python: '/images/logos/python.png',
    react: '/images/logos/react.png',
    reactnative: '/images/logos/react.png', // Using React logo for React Native
    django: '/images/logos/django.png',
    langchain: '/images/logos/langchain.png',
    springboot: '/images/logos/springboot.png',
    java: '/images/logos/springboot.png', // Using Spring Boot logo for Java
}

// Framer Logo (SVG fallback - no PNG available)
export const FramerIcon = memo(({ className, size = 24 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
    </svg>
))
FramerIcon.displayName = 'FramerIcon'

// Next.js Logo (SVG fallback - no PNG available)
export const NextjsIcon = memo(({ className, size = 24 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M64 0C28.66 0 0 28.66 0 64s28.66 64 64 64 64-28.66 64-64S99.34 0 64 0zm38.7 94.6L54.1 36.1V82h-6.7V31.5h6.1l42.6 54.3V31.5h6.7v63.1h-6.1zM82.8 82l-9.3-11.8 4.5-5.7 13.5 17.5h-8.7z" />
    </svg>
))
NextjsIcon.displayName = 'NextjsIcon'

// RAGs (Retrieval-Augmented Generation) - Custom SVG
export const RagIcon = memo(({ className, size = 24 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M4 6V18C4 19.1046 7.58172 20 12 20C16.4183 20 20 19.1046 20 18V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 6C4 7.10457 7.58172 8 12 8C16.4183 8 20 7.10457 20 6C20 4.89543 16.4183 4 12 4C7.58172 4 4 4.89543 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 12C4 13.1046 7.58172 14 12 14C16.4183 14 20 13.1046 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 11V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 13L12 11L9 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
))
RagIcon.displayName = 'RagIcon'

// Automations - Custom SVG
export const AutomationIcon = memo(({ className, size = 24 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M12 8V4M12 20V16M20 12H16M8 12H4M17.657 6.343L14.828 9.172M9.172 14.828L6.343 17.657M17.657 17.657L14.828 14.828M9.172 9.172L6.343 6.343" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
))
AutomationIcon.displayName = 'AutomationIcon'

// TypeScript Logo (SVG fallback - no PNG available)
export const TypescriptIcon = memo(({ className, size = 24 }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M1.125 0C.502 0 0 .502 0 1.125V22.875C0 23.498.502 24 1.125 24H22.875C23.498 24 24 23.498 24 22.875V1.125C24 .502 23.498 0 22.875 0H1.125ZM17.4373 9.2604H19.0393V14.1333C19.0393 15.0601 18.8105 15.8283 18.3533 16.4373C17.8961 17.0463 17.1519 17.3512 16.12 17.3512C15.5458 17.3512 15.0117 17.2021 14.5176 16.9038V15.5191C14.9517 15.7861 15.394 15.9196 15.8444 15.9196C16.4107 15.9196 16.8208 15.7533 17.075 15.4211C17.3292 15.0888 17.4563 14.5936 17.4563 13.9355V9.2604H17.4373ZM10.5654 9.2604L13.1553 9.2604V10.6508H11.859V17.1601H10.2796V10.6508H8.9833V9.2604H11.5732" />
    </svg>
))
TypescriptIcon.displayName = 'TypescriptIcon'

// Tech Icon Map - using SVG fallbacks for logos without PNGs
export const techIconMap: Record<string, React.FC<IconProps>> = {
    framer: FramerIcon,
    nextjs: NextjsIcon,
    typescript: TypescriptIcon,
    rags: RagIcon,
    automations: AutomationIcon,
    smartphone: (props: IconProps) => <Smartphone {...props} />,
    android: (props: IconProps) => <Bot {...props} />,
    zap: (props: IconProps) => <Zap {...props} />,
    plug: (props: IconProps) => <PlugZap {...props} />,
    lock: (props: IconProps) => <Lock {...props} />,
    'bar-chart': (props: IconProps) => <BarChart3 {...props} />,
    search: (props: IconProps) => <Search {...props} />,
    database: (props: IconProps) => <Database {...props} />,
    cpu: (props: IconProps) => <Cpu {...props} />,
    layers: (props: IconProps) => <Layers {...props} />,
    layout: (props: IconProps) => <Layout {...props} />,
    message: (props: IconProps) => <MessageSquare {...props} />,
    email: (props: IconProps) => <MessageSquare {...props} />,
    automation: AutomationIcon,
    building: (props: IconProps) => <Building {...props} />,
    settings: (props: IconProps) => <Settings {...props} />,
    'refresh-cw': (props: IconProps) => <RefreshCw {...props} />,
    phone: (props: IconProps) => <Smartphone {...props} />,
}

// Map common tech names to their icons
const fallbackMap: Record<string, string> = {
    design: 'palette',
    development: 'code',
    uxresearch: 'search',
    animation: 'rocket',
    ai: 'brain',
    technology: 'cpu',
}

// Tech Icon Component - now uses PNG images when available
export const TechIcon = memo(({ name, size = 24, className, ...props }: IconProps & { name: string }) => {
    if (!name) return null

    const cleanName = name.toLowerCase().replace(/\s+/g, '')

    // Check if we have a PNG logo for this tech
    const logoPath = logoImageMap[cleanName]
    if (logoPath) {
        return (
            <div className={cn('relative inline-block', className)} style={{ width: size, height: size }}>
                <Image
                    src={logoPath}
                    alt={name}
                    width={size}
                    height={size}
                    className="object-contain"
                />
            </div>
        )
    }

    // Fall back to SVG icons
    let IconComponent = techIconMap[cleanName]

    // Try fallback mapping
    if (!IconComponent && fallbackMap[cleanName]) {
        IconComponent = techIconMap[fallbackMap[cleanName]]
    }

    // Try global icon map
    if (!IconComponent && iconMap[cleanName]) {
        IconComponent = iconMap[cleanName]
    }

    // Final check for common name variations
    if (!IconComponent) {
        if (cleanName.includes('next')) IconComponent = NextjsIcon
        else if (cleanName.includes('node')) {
            // Use PNG for Node.js
            return (
                <div className={cn('relative inline-block', className)} style={{ width: size, height: size }}>
                    <Image
                        src="/images/logos/nodejs.png"
                        alt={name}
                        width={size}
                        height={size}
                        className="object-contain"
                    />
                </div>
            )
        }
        else if (cleanName.includes('react')) {
            // Use PNG for React
            return (
                <div className={cn('relative inline-block', className)} style={{ width: size, height: size }}>
                    <Image
                        src="/images/logos/react.png"
                        alt={name}
                        width={size}
                        height={size}
                        className="object-contain"
                    />
                </div>
            )
        }
        else if (cleanName.includes('flutter')) {
            // Use PNG for Flutter
            return (
                <div className={cn('relative inline-block', className)} style={{ width: size, height: size }}>
                    <Image
                        src="/images/logos/flutter.png"
                        alt={name}
                        width={size}
                        height={size}
                        className="object-contain"
                    />
                </div>
            )
        }
        else if (cleanName.includes('python')) {
            // Use PNG for Python
            return (
                <div className={cn('relative inline-block', className)} style={{ width: size, height: size }}>
                    <Image
                        src="/images/logos/python.png"
                        alt={name}
                        width={size}
                        height={size}
                        className="object-contain"
                    />
                </div>
            )
        }
        else if (cleanName.includes('java')) {
            // Use PNG for Java (Spring Boot logo)
            return (
                <div className={cn('relative inline-block', className)} style={{ width: size, height: size }}>
                    <Image
                        src="/images/logos/springboot.png"
                        alt={name}
                        width={size}
                        height={size}
                        className="object-contain"
                    />
                </div>
            )
        }
        else if (cleanName.includes('figma')) {
            // Use PNG for Figma
            return (
                <div className={cn('relative inline-block', className)} style={{ width: size, height: size }}>
                    <Image
                        src="/images/logos/figma.png"
                        alt={name}
                        width={size}
                        height={size}
                        className="object-contain"
                    />
                </div>
            )
        }
        else if (cleanName.includes('framer')) IconComponent = FramerIcon
        else if (cleanName.includes('n8n')) {
            // Use PNG for n8n
            return (
                <div className={cn('relative inline-block', className)} style={{ width: size, height: size }}>
                    <Image
                        src="/images/logos/n8n.png"
                        alt={name}
                        width={size}
                        height={size}
                        className="object-contain"
                    />
                </div>
            )
        }
        else if (cleanName.includes('typescript')) IconComponent = TypescriptIcon
        else if (cleanName.includes('rag')) IconComponent = RagIcon
        else if (cleanName.includes('auto')) IconComponent = AutomationIcon
        else if (cleanName === 'palette') IconComponent = ({ size, className }: IconProps) => <Layout size={size} className={className} />
        else if (cleanName === 'code') IconComponent = ({ size, className }: IconProps) => <Cpu size={size} className={className} />
    }

    if (!IconComponent) {
        // If it looks like an emoji, render it
        if (name.length <= 2 || /[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(name)) {
            return <span style={{ fontSize: size }} className={className}>{name}</span>
        }
        return null
    }

    return <IconComponent size={size} className={className} {...props} />
})
TechIcon.displayName = 'TechIcon'

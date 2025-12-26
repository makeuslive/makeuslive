'use client'

import { forwardRef, memo } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'dark' | 'light'
  padding?: 'sm' | 'md' | 'lg' | 'none'
  hover?: boolean
  children: React.ReactNode
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const GlassCard = memo(
  forwardRef<HTMLDivElement, GlassCardProps>(
    (
      {
        className,
        variant = 'dark',
        padding = 'md',
        hover = true,
        children,
        ...props
      },
      ref
    ) => {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-2xl',
            // Professional border with stroke
            'border-[1.5px] border-[#4B4B4B]',
            'transition-all duration-500 ease-out-expo',
            // Variant styles
            variant === 'dark' && [
              'bg-card/80 backdrop-blur-sm',
              hover && 'hover:border-gold/40 hover:scale-[1.02]',
            ],
            variant === 'light' && [
              'bg-card-light',
              hover && 'hover:scale-[1.02]',
            ],
            // Padding
            paddingClasses[padding],
            // Shadow
            'shadow-card',
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }
  )
)

GlassCard.displayName = 'GlassCard'

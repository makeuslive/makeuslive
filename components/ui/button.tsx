'use client'

import { forwardRef, memo } from 'react'
import { cn } from '@/lib/utils'
import type { ButtonProps } from '@/types'

const buttonVariants = {
  primary: 'bg-white text-bg hover:bg-text hover:scale-105 active:scale-95 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]',
  secondary: 'bg-transparent border border-border text-text hover:bg-white/5 hover:border-gold/50',
  ghost: 'bg-transparent text-text hover:bg-white/5',
  glass: 'glass text-text hover:bg-white/10 hover:scale-105 active:scale-95',
}

const buttonSizes = {
  sm: 'px-4 py-2.5 text-sm min-h-[44px]',
  md: 'px-6 py-3 text-base min-h-[44px]',
  lg: 'px-8 py-4 text-lg min-h-[48px]',
}

const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        className,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        leftIcon,
        rightIcon,
        children,
        disabled,
        ...props
      },
      ref
    ) => {
      return (
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center gap-2',
            'rounded-full font-medium',
            'transition-all duration-300 ease-out-expo',
            'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-bg',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            buttonVariants[variant],
            buttonSizes[size],
            className
          )}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <>
              {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
              {children}
              {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </>
          )}
        </button>
      )
    }
  )
)

Button.displayName = 'Button'

export { Button, buttonVariants, buttonSizes }


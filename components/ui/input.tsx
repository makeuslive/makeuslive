'use client'

import { forwardRef, memo, useId } from 'react'
import { cn } from '@/lib/utils'
import type { InputProps, TextareaProps } from '@/types'

/**
 * Professional Input Component
 * Based on Figma specs: 1.5px stroke, #4B4B4B border, 8px radius
 */
const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, id: propId, ...props }, ref) => {
      const generatedId = useId()
      const id = propId || generatedId

      return (
        <div className="w-full">
          {label && (
            <label
              htmlFor={id}
              className="block text-base font-medium text-text mb-2"
            >
              {label}
            </label>
          )}
          <div className="relative">
            <input
              ref={ref}
              id={id}
              className={cn(
                // Base styles matching Figma
                'w-full h-12 rounded-lg bg-transparent px-5 py-3',
                'text-white text-base placeholder:text-white/60',
                // Border - 1.5px stroke #4B4B4B
                'border-[1.5px] border-[#4B4B4B]',
                // Focus states
                'transition-all duration-300',
                'focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30',
                // Drop shadow as per Figma
                'shadow-[0_4px_4px_rgba(0,0,0,0.25)]',
                // Error state
                error && 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30',
                className
              )}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
              {...props}
            />
          </div>
          {error && (
            <p id={`${id}-error`} className="mt-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p id={`${id}-helper`} className="mt-2 text-sm text-text-dim">
              {helperText}
            </p>
          )}
        </div>
      )
    }
  )
)

Input.displayName = 'Input'

/**
 * Professional Textarea Component
 * Based on Figma specs: 1.5px stroke, #4B4B4B border, 8px radius
 */
const Textarea = memo(
  forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, id: propId, rows = 5, ...props }, ref) => {
      const generatedId = useId()
      const id = propId || generatedId

      return (
        <div className="w-full">
          {label && (
            <label
              htmlFor={id}
              className="block text-base font-medium text-text mb-2"
            >
              {label}
            </label>
          )}
          <div className="relative">
            <textarea
              ref={ref}
              id={id}
              rows={rows}
              className={cn(
                // Base styles matching Figma
                'w-full min-h-[120px] rounded-lg bg-transparent px-5 py-4',
                'text-white text-base placeholder:text-white/60',
                // Border - 1.5px stroke #4B4B4B
                'border-[1.5px] border-[#4B4B4B]',
                // Focus states
                'transition-all duration-300 resize-none',
                'focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30',
                // Error state
                error && 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30',
                className
              )}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
              {...props}
            />
          </div>
          {error && (
            <p id={`${id}-error`} className="mt-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p id={`${id}-helper`} className="mt-2 text-sm text-text-dim">
              {helperText}
            </p>
          )}
        </div>
      )
    }
  )
)

Textarea.displayName = 'Textarea'

export { Input, Textarea }

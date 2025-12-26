import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

/**
 * Common component props with className support
 */
export interface BaseProps {
  className?: string
  children?: ReactNode
}

/**
 * Section component props
 */
export interface SectionProps extends BaseProps {
  id?: string
}

/**
 * Button component props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

/**
 * Input component props
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

/**
 * Textarea component props
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

/**
 * Glass card component props
 */
export interface GlassCardProps extends BaseProps {
  variant?: 'default' | 'dark' | 'light'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

/**
 * Navigation link
 */
export interface NavLink {
  label: string
  href: string
}

/**
 * Service item from constants
 */
export interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
}

/**
 * Case study item
 */
export interface CaseItem {
  id: string
  title: string
  category: string
  image: string
}

/**
 * Testimonial item
 */
export interface TestimonialItem {
  id: string
  quote: string
  author: string
  role: string
  industry: string
}

/**
 * Process step item
 */
export interface StepItem {
  id: string
  number: string
  title: string
  description: string
  icon: string
}

/**
 * Contact form data
 */
export interface ContactFormData {
  name: string
  email: string
  website?: string
  phone?: string
  message: string
}

/**
 * Animation state
 */
export interface AnimationState {
  isInView: boolean
  hasAnimated: boolean
}

/**
 * Scroll direction
 */
export type ScrollDirection = 'up' | 'down' | null

/**
 * Breakpoint values
 */
export interface Breakpoints {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}


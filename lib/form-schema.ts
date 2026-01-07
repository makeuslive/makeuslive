import { z } from 'zod'
import { ObjectId } from 'mongodb'

// ============================================
// Form Field Types
// ============================================

export const FIELD_TYPES = [
  'text',
  'email',
  'phone',
  'textarea',
  'select',
  'checkbox',
  'radio',
  'file',
  'heading',
  'paragraph',
] as const

export type FieldType = typeof FIELD_TYPES[number]

// ============================================
// Zod Schemas for Validation
// ============================================

export const fieldValidationSchema = z.object({
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
})

export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(FIELD_TYPES),
  label: z.string().min(1, 'Label is required'),
  placeholder: z.string().optional(),
  helperText: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // For select, checkbox, radio
  validation: fieldValidationSchema.optional(),
  order: z.number(),
})

export const formSettingsSchema = z.object({
  submitButtonText: z.string().default('Submit'),
  successMessage: z.string().default('Thank you! Your response has been recorded.'),
  redirectUrl: z.string().url().optional().or(z.literal('')),
  notifyEmails: z.array(z.string().email()).default([]),
  isActive: z.boolean().default(true),
})

export const formSchema = z.object({
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  fields: z.array(formFieldSchema).default([]),
  settings: formSettingsSchema,
})

export const createFormSchema = formSchema

export const updateFormSchema = formSchema.partial().extend({
  slug: z.string()
    .min(1)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
})

// ============================================
// TypeScript Types (derived from Zod)
// ============================================

export type FieldValidation = z.infer<typeof fieldValidationSchema>
export type FormField = z.infer<typeof formFieldSchema>
export type FormSettings = z.infer<typeof formSettingsSchema>
export type FormData = z.infer<typeof formSchema>

// Full Form document (with MongoDB _id and timestamps)
export interface Form extends FormData {
  _id: ObjectId | string
  createdAt: Date
  updatedAt: Date
}

// Form submission file attachment
export interface SubmissionFile {
  fieldId: string
  filename: string
  contentType: string
  size: number
  data: string // Base64 encoded
}

// Form submission document
export interface FormSubmission {
  _id?: ObjectId | string
  formId: ObjectId | string
  formSlug: string
  data: Record<string, unknown>
  files?: SubmissionFile[]
  metadata: {
    ip?: string
    userAgent?: string
    submittedAt: Date
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Generate a unique field ID
 */
export function generateFieldId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Create a new empty field with defaults
 */
export function createEmptyField(type: FieldType, order: number): FormField {
  const baseField: FormField = {
    id: generateFieldId(),
    type,
    label: getDefaultLabel(type),
    placeholder: '',
    helperText: '',
    required: false,
    order,
  }

  // Add options for choice fields
  if (type === 'select' || type === 'checkbox' || type === 'radio') {
    baseField.options = ['Option 1', 'Option 2']
  }

  return baseField
}

/**
 * Get default label for a field type
 */
function getDefaultLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    text: 'Text Field',
    email: 'Email Address',
    phone: 'Phone Number',
    textarea: 'Long Answer',
    select: 'Dropdown',
    checkbox: 'Checkboxes',
    radio: 'Multiple Choice',
    file: 'File Upload',
    heading: 'Section Heading',
    paragraph: 'Description Text',
  }
  return labels[type]
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
}

/**
 * Build dynamic Zod schema from form field definitions
 * Used for runtime validation of form submissions
 */
export function buildDynamicFormSchema(fields: FormField[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const schemaShape: Record<string, z.ZodTypeAny> = {}

  for (const field of fields) {
    // Skip non-input fields
    if (field.type === 'heading' || field.type === 'paragraph') {
      continue
    }

    let fieldSchema: z.ZodTypeAny

    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email('Please enter a valid email address')
        break

      case 'phone':
        fieldSchema = z.string().regex(
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
          'Please enter a valid phone number'
        )
        break

      case 'checkbox':
        fieldSchema = z.array(z.string())
        break

      case 'file':
        // File fields are handled separately
        fieldSchema = z.any()
        break

      case 'textarea':
      case 'text':
      case 'select':
      case 'radio':
      default:
        fieldSchema = z.string()
        break
    }

    // Apply validation rules
    if (field.validation) {
      if (fieldSchema instanceof z.ZodString) {
        if (field.validation.minLength) {
          fieldSchema = fieldSchema.min(
            field.validation.minLength,
            `Minimum ${field.validation.minLength} characters required`
          )
        }
        if (field.validation.maxLength) {
          fieldSchema = fieldSchema.max(
            field.validation.maxLength,
            `Maximum ${field.validation.maxLength} characters allowed`
          )
        }
        if (field.validation.pattern) {
          fieldSchema = fieldSchema.regex(
            new RegExp(field.validation.pattern),
            'Invalid format'
          )
        }
      }
    }

    // Handle required vs optional
    if (!field.required) {
      if (field.type === 'checkbox') {
        fieldSchema = fieldSchema.optional().default([])
      } else {
        fieldSchema = fieldSchema.optional().or(z.literal(''))
      }
    }

    schemaShape[field.id] = fieldSchema
  }

  return z.object(schemaShape)
}

/**
 * Field type metadata for the form builder UI
 */
export const FIELD_TYPE_META: Record<FieldType, {
  label: string
  icon: string
  category: 'basic' | 'choice' | 'content' | 'advanced'
  description: string
}> = {
  text: {
    label: 'Short Text',
    icon: 'M3 5h12M3 10h18M3 15h12',
    category: 'basic',
    description: 'Single line text input',
  },
  email: {
    label: 'Email',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    category: 'basic',
    description: 'Email address with validation',
  },
  phone: {
    label: 'Phone',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    category: 'basic',
    description: 'Phone number input',
  },
  textarea: {
    label: 'Long Text',
    icon: 'M4 6h16M4 10h16M4 14h10M4 18h10',
    category: 'basic',
    description: 'Multi-line text area',
  },
  select: {
    label: 'Dropdown',
    icon: 'M19 9l-7 7-7-7',
    category: 'choice',
    description: 'Single selection dropdown',
  },
  checkbox: {
    label: 'Checkboxes',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    category: 'choice',
    description: 'Multiple selection checkboxes',
  },
  radio: {
    label: 'Multiple Choice',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    category: 'choice',
    description: 'Single selection radio buttons',
  },
  file: {
    label: 'File Upload',
    icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    category: 'advanced',
    description: 'File attachment upload',
  },
  heading: {
    label: 'Heading',
    icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
    category: 'content',
    description: 'Section heading text',
  },
  paragraph: {
    label: 'Paragraph',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    category: 'content',
    description: 'Descriptive paragraph text',
  },
}

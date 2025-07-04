import { z } from 'zod'

// Common validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

// String utilities
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ')
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Number utilities
export const isValidRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

// Zod validation helpers
export const createValidationMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown): { success: true; data: T } | { success: false; error: string } => {
    try {
      const validatedData = schema.parse(data)
      return { success: true, data: validatedData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          success: false, 
          error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        }
      }
      return { success: false, error: 'Validation failed' }
    }
  }
}

// Safe parse helper
export const safeValidate = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data)
  if (result.success) {
    return { data: result.data, error: null }
  }
  return { 
    data: null, 
    error: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
  }
}
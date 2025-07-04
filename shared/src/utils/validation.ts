import { z } from 'zod'

// Common validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateMacAddress = (mac: string): boolean => {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  return macRegex.test(mac)
}

export const validateTemperature = (temp: number): boolean => {
  return temp >= -50 && temp <= 100
}

export const validateHumidity = (humidity: number): boolean => {
  return humidity >= 0 && humidity <= 100
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
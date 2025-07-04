import { z } from 'zod'

// User types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['ADMIN', 'USER']),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type User = z.infer<typeof UserSchema>

// Auth types
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
})

export type LoginRequest = z.infer<typeof LoginSchema>
export type RegisterRequest = z.infer<typeof RegisterSchema>

export interface AuthResponse {
  user: User
  token: string
}
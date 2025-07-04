import { z } from 'zod'

// Base user schema - can be extended per project
export const BaseUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type BaseUser = z.infer<typeof BaseUserSchema>

// Common role types - extend as needed
export const RoleSchema = z.enum(['ADMIN', 'USER'])
export type Role = z.infer<typeof RoleSchema>

// User with role - most common pattern
export const UserSchema = BaseUserSchema.extend({
  role: RoleSchema.default('USER')
})

export type User = z.infer<typeof UserSchema>

// Authentication schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6)
})

export const ResetPasswordSchema = z.object({
  email: z.string().email()
})

// Type inference
export type LoginRequest = z.infer<typeof LoginSchema>
export type RegisterRequest = z.infer<typeof RegisterSchema>
export type ChangePasswordRequest = z.infer<typeof ChangePasswordSchema>
export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>

// Common auth response patterns
export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface TokenPayload {
  userId: string
  email: string
  role: Role
  iat?: number
  exp?: number
}
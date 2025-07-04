import { z } from 'zod'

// Device types
export const DeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  macAddress: z.string(),
  userId: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Device = z.infer<typeof DeviceSchema>

// Sensor Data types
export const SensorDataSchema = z.object({
  id: z.number(),
  temperature: z.number(),
  humidity: z.number(),
  timestamp: z.date(),
  deviceId: z.string()
})

export type SensorData = z.infer<typeof SensorDataSchema>

// API Request/Response types
export const CreateDeviceSchema = z.object({
  name: z.string().min(1),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
})

export const SensorDataCreateSchema = z.object({
  temperature: z.number().min(-50).max(100),
  humidity: z.number().min(0).max(100),
  deviceId: z.string()
})

export type CreateDeviceRequest = z.infer<typeof CreateDeviceSchema>
export type SensorDataCreateRequest = z.infer<typeof SensorDataCreateSchema>

// Real-time data types
export interface IoTMessage {
  type: 'sensor_data' | 'device_status' | 'ac_control'
  deviceId: string
  data: any
  timestamp: Date
}

export interface ACControlCommand {
  power: boolean
  temperature: number
  mode: 'cool' | 'heat' | 'auto'
  fanSpeed: 'low' | 'medium' | 'high' | 'auto'
}
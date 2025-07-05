export interface SensorData {
  timestamp: string
  temperature: number
  humidity: number
  status: 'normal' | 'warning' | 'critical'
}

export interface CurrentSensorData extends SensorData {
  temperatureSetpoint: number
  acStatus: 'on' | 'off'
  mode: 'auto' | 'manual'
}
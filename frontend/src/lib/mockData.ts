import { format, subHours } from 'date-fns'
import { getSensorStatus } from '@/lib/thresholdUtils'
import { defaultSettings } from '@/types/settings'
import type { SensorData, CurrentSensorData } from '@/types/sensor'

// Generate mock historical data for the last 24 hours
export const generateMockHistoryData = (hours: number = 24): SensorData[] => {
  const data: SensorData[] = []
  const now = new Date()
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = subHours(now, i)
    
    // Generate realistic temperature (20-35°C with some variation)
    const baseTemp = 25 + Math.sin(i * 0.5) * 5 // Simulates daily temperature cycle
    const temperature = Number((baseTemp + (Math.random() - 0.5) * 4).toFixed(1))
    
    // Generate realistic humidity (40-80% with inverse correlation to temperature)
    const baseHumidity = 70 - (temperature - 25) * 2
    const humidity = Number((baseHumidity + (Math.random() - 0.5) * 10).toFixed(1))
    
    // Determine status based on dynamic thresholds
    const status = getSensorStatus(temperature, humidity, defaultSettings.thresholds)
    
    data.push({
      timestamp: format(timestamp, 'yyyy-MM-dd HH:mm:ss'),
      temperature,
      humidity,
      status
    })
  }
  
  return data
}

// Current sensor data
export const mockCurrentData: CurrentSensorData = {
  timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  temperature: 26.5,
  humidity: 62.3,
  status: 'normal',
  temperatureSetpoint: 25.0,
  acStatus: 'on',
  mode: 'auto'
}

// Mock historical data
export const mockHistoryData = generateMockHistoryData(24)

// Update current data every few seconds (for demo)
export const updateMockCurrentData = (): CurrentSensorData => {
  const variation = (Math.random() - 0.5) * 0.5
  const newTemp = Number((mockCurrentData.temperature + variation).toFixed(1))
  const newHumidity = Number((mockCurrentData.humidity + (Math.random() - 0.5) * 2).toFixed(1))
  
  const status = getSensorStatus(newTemp, newHumidity, defaultSettings.thresholds)
  
  return {
    ...mockCurrentData,
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    temperature: newTemp,
    humidity: Math.max(20, Math.min(90, newHumidity)),
    status
  }
}
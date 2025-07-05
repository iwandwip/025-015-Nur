import type { ThresholdSettings } from '@/types/settings'

// Get temperature icon based on threshold settings
export const getTemperatureIcon = (temperature: number, settings: ThresholdSettings) => {
  if (temperature <= settings.temperature.icons.cold) return '❄️'
  if (temperature > settings.temperature.icons.hot) return '🔥'
  return '✅'
}

// Get temperature color based on threshold settings
export const getTemperatureColor = (temperature: number, settings: ThresholdSettings) => {
  if (temperature <= settings.temperature.icons.cold) return 'text-blue-600'
  if (temperature > settings.temperature.icons.hot) return 'text-red-600'
  return 'text-green-600'
}

// Get humidity icon based on threshold settings
export const getHumidityIcon = (humidity: number, settings: ThresholdSettings) => {
  if (humidity < settings.humidity.icons.dry) return '🏜️'
  if (humidity > settings.humidity.icons.wet) return '💧'
  return '✅'
}

// Get humidity color based on threshold settings
export const getHumidityColor = (humidity: number, settings: ThresholdSettings) => {
  if (humidity < settings.humidity.icons.dry) return 'text-yellow-600'
  if (humidity > settings.humidity.icons.wet) return 'text-blue-600'
  return 'text-green-600'
}

// Get status based on temperature and humidity thresholds
export const getSensorStatus = (
  temperature: number, 
  humidity: number, 
  settings: ThresholdSettings
): 'normal' | 'warning' | 'critical' => {
  const tempCritical = temperature <= settings.temperature.status.criticalMin || 
                      temperature >= settings.temperature.status.criticalMax
  const tempWarning = temperature <= settings.temperature.status.warningMin || 
                     temperature >= settings.temperature.status.warningMax
  
  const humidCritical = humidity <= settings.humidity.status.criticalMin || 
                       humidity >= settings.humidity.status.criticalMax
  const humidWarning = humidity <= settings.humidity.status.warningMin || 
                      humidity >= settings.humidity.status.warningMax

  if (tempCritical || humidCritical) return 'critical'
  if (tempWarning || humidWarning) return 'warning'
  return 'normal'
}

// Get readable threshold range for display
export const getThresholdRangeText = (settings: ThresholdSettings) => {
  return {
    temperature: {
      normal: `${settings.temperature.status.warningMin + 1}°C - ${settings.temperature.status.warningMax - 1}°C`,
      warning: `${settings.temperature.status.warningMin}°C - ${settings.temperature.status.warningMax}°C`,
      critical: `≤${settings.temperature.status.criticalMin}°C or ≥${settings.temperature.status.criticalMax}°C`
    },
    humidity: {
      normal: `${settings.humidity.status.warningMin + 1}% - ${settings.humidity.status.warningMax - 1}%`,
      warning: `${settings.humidity.status.warningMin}% - ${settings.humidity.status.warningMax}%`,
      critical: `≤${settings.humidity.status.criticalMin}% or ≥${settings.humidity.status.criticalMax}%`
    }
  }
}
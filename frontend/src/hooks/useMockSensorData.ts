import { useState, useEffect } from 'react'
import { mockCurrentData, mockHistoryData, updateMockCurrentData } from '@/lib/mockData'
import type { CurrentSensorData, SensorData } from '@/types/sensor'

export const useMockSensorData = () => {
  const [currentData, setCurrentData] = useState<CurrentSensorData>(mockCurrentData)
  const [historyData] = useState<SensorData[]>(mockHistoryData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Update current data every 3 seconds to simulate real-time updates
    const updateInterval = setInterval(() => {
      setCurrentData(updateMockCurrentData())
    }, 3000)

    return () => {
      clearTimeout(loadingTimer)
      clearInterval(updateInterval)
    }
  }, [])

  return {
    currentData,
    historyData,
    isLoading,
    refetch: () => {
      setCurrentData(updateMockCurrentData())
    }
  }
}
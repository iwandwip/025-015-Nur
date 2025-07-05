import { useState, useEffect } from 'react'
import { defaultSettings, type DeveloperSettings } from '@/types/settings'

const SETTINGS_STORAGE_KEY = 'smart-ac-developer-settings'

export const useSettings = () => {
  const [settings, setSettings] = useState<DeveloperSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        const parsedSettings = JSON.parse(stored)
        // Merge with defaults to ensure all properties exist
        setSettings({ ...defaultSettings, ...parsedSettings })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = (newSettings: DeveloperSettings) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings))
      setSettings(newSettings)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  // Update specific setting category
  const updateSettings = (category: keyof DeveloperSettings, updates: Partial<DeveloperSettings[keyof DeveloperSettings]>) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        ...updates
      }
    }
    saveSettings(newSettings)
  }

  // Reset to defaults
  const resetSettings = () => {
    localStorage.removeItem(SETTINGS_STORAGE_KEY)
    setSettings(defaultSettings)
  }

  // Export settings
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `smart-ac-settings-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Import settings
  const importSettings = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          // Validate and merge with defaults
          const validatedSettings = { ...defaultSettings, ...importedSettings }
          saveSettings(validatedSettings)
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  return {
    settings,
    isLoading,
    updateSettings,
    saveSettings,
    resetSettings,
    exportSettings,
    importSettings
  }
}
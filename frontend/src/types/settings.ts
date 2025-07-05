export interface ThresholdSettings {
  temperature: {
    icons: {
      cold: number      // Below this = ❄️
      hot: number       // Above this = 🔥
    }
    status: {
      warningMin: number    // Below this = warning
      warningMax: number    // Above this = warning
      criticalMin: number   // Below this = critical
      criticalMax: number   // Above this = critical
    }
  }
  humidity: {
    icons: {
      dry: number       // Below this = 🏜️
      wet: number       // Above this = 💧
    }
    status: {
      warningMin: number    // Below this = warning
      warningMax: number    // Above this = warning
      criticalMin: number   // Below this = critical
      criticalMax: number   // Above this = critical
    }
  }
}

export interface SystemSettings {
  refreshInterval: number       // seconds
  dataRetentionHours: number   // hours to keep historical data
  autoRefresh: boolean
  notifications: boolean
  debugMode: boolean
  maxDataPoints: number        // maximum points to show in charts
}

export interface DeveloperSettings {
  thresholds: ThresholdSettings
  system: SystemSettings
  api: {
    baseUrl: string
    timeout: number
    retryAttempts: number
  }
  ui: {
    animationSpeed: number      // milliseconds
    theme: 'light' | 'dark' | 'system'
    compactMode: boolean
    showDebugInfo: boolean
  }
}

export const defaultSettings: DeveloperSettings = {
  thresholds: {
    temperature: {
      icons: {
        cold: 20,
        hot: 25
      },
      status: {
        warningMin: 18,
        warningMax: 30,
        criticalMin: 15,
        criticalMax: 35
      }
    },
    humidity: {
      icons: {
        dry: 40,
        wet: 70
      },
      status: {
        warningMin: 30,
        warningMax: 80,
        criticalMin: 20,
        criticalMax: 90
      }
    }
  },
  system: {
    refreshInterval: 3,
    dataRetentionHours: 168, // 7 days
    autoRefresh: true,
    notifications: true,
    debugMode: false,
    maxDataPoints: 100
  },
  api: {
    baseUrl: 'http://localhost:3001',
    timeout: 5000,
    retryAttempts: 3
  },
  ui: {
    animationSpeed: 300,
    theme: 'system',
    compactMode: false,
    showDebugInfo: false
  }
}
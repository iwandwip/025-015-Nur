// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh'
  },
  DEVICES: {
    LIST: '/devices',
    CREATE: '/devices',
    GET: (id: string) => `/devices/${id}`,
    UPDATE: (id: string) => `/devices/${id}`,
    DELETE: (id: string) => `/devices/${id}`
  },
  SENSOR_DATA: {
    LIST: '/sensor-data',
    CREATE: '/sensor-data',
    BY_DEVICE: (deviceId: string) => `/sensor-data/device/${deviceId}`
  }
} as const

// IoT constants
export const IOT_CONFIG = {
  SERIAL: {
    BAUDRATE: 115200,
    DATA_BITS: 8,
    STOP_BITS: 1,
    PARITY: 'none' as const
  },
  SENSOR: {
    READ_INTERVAL: 5000, // 5 seconds
    TEMPERATURE_RANGE: { min: -50, max: 100 },
    HUMIDITY_RANGE: { min: 0, max: 100 }
  },
  AC_CONTROL: {
    TEMPERATURE_RANGE: { min: 16, max: 30 },
    FAN_SPEEDS: ['low', 'medium', 'high', 'auto'] as const,
    MODES: ['cool', 'heat', 'auto'] as const
  }
} as const

// WebSocket events
export const WS_EVENTS = {
  SENSOR_DATA: 'sensor_data',
  DEVICE_STATUS: 'device_status',
  AC_CONTROL: 'ac_control',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect'
} as const

// Default values
export const DEFAULTS = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100
  },
  JWT: {
    EXPIRES_IN: '7d'
  }
} as const
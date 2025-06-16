export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DeviceCreateInput {
  name: string;
  location: string;
  type?: string;
}

export interface MeasurementCreateInput {
  temperature: number;
  humidity: number;
  acState?: boolean;
  acTemperature?: number;
  deviceId: string;
}

export interface AlertCreateInput {
  type: AlertType;
  message: string;
  severity?: AlertSeverity;
  deviceId: string;
}

export type AlertType = 
  | 'HIGH_TEMP' 
  | 'LOW_TEMP' 
  | 'HIGH_HUMIDITY' 
  | 'LOW_HUMIDITY' 
  | 'DEVICE_OFFLINE';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface ConfigurationInput {
  key: string;
  value: string;
  description?: string;
}
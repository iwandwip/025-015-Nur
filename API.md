# Temperature Monitoring System API Documentation

## Base URL
```
http://localhost:3001/api
```

## Response Format
All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

## Endpoints

### Health Check
Check API and database health status.

```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-16T10:00:00.000Z",
    "database": "connected",
    "stats": {
      "devices": 5,
      "measurements": 1000,
      "activeAlerts": 3
    }
  }
}
```

### Devices

#### List Devices
```http
GET /api/devices?page=1&pageSize=10&isActive=true&search=lab
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 10, max: 100)
- `isActive` (boolean): Filter by active status
- `search` (string): Search in name and location

#### Get Device
```http
GET /api/devices/{id}
```

#### Create Device
```http
POST /api/devices
Content-Type: application/json

{
  "name": "Lab Sensor 1",
  "location": "Laboratory Room A",
  "type": "ESP32"
}
```

#### Update Device
```http
PUT /api/devices/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "location": "Updated Location",
  "type": "ESP32",
  "isActive": true
}
```

#### Delete Device
```http
DELETE /api/devices/{id}
```

### Measurements

#### List Measurements
```http
GET /api/measurements?page=1&pageSize=10&deviceId={id}&startDate=2025-01-01&endDate=2025-12-31
```

**Query Parameters:**
- `page`, `pageSize`: Pagination
- `deviceId`: Filter by device
- `startDate`, `endDate`: Date range filter

#### Create Measurement
```http
POST /api/measurements
Content-Type: application/json

{
  "temperature": 25.5,
  "humidity": 65.2,
  "acState": true,
  "acTemperature": 24,
  "deviceId": "device-id"
}
```

### Alerts

#### List Alerts
```http
GET /api/alerts?page=1&pageSize=10&deviceId={id}&type=HIGH_TEMP&severity=warning&resolved=false
```

**Query Parameters:**
- `page`, `pageSize`: Pagination
- `deviceId`: Filter by device
- `type`: Alert type (HIGH_TEMP, LOW_TEMP, HIGH_HUMIDITY, LOW_HUMIDITY, DEVICE_OFFLINE)
- `severity`: Alert severity (info, warning, critical)
- `resolved`: Filter by resolution status

#### Get Alert
```http
GET /api/alerts/{id}
```

#### Create Alert
```http
POST /api/alerts
Content-Type: application/json

{
  "type": "HIGH_TEMP",
  "message": "Temperature exceeds threshold",
  "severity": "warning",
  "deviceId": "device-id"
}
```

#### Update Alert
```http
PUT /api/alerts/{id}
Content-Type: application/json

{
  "resolved": true
}
```

#### Delete Alert
```http
DELETE /api/alerts/{id}
```

### Configuration

#### List Configurations
```http
GET /api/config
```

#### Get Configuration
```http
GET /api/config?key=tempHigh
```

#### Create/Update Configuration
```http
POST /api/config
Content-Type: application/json

{
  "key": "tempHigh",
  "value": "28",
  "description": "High temperature threshold in Celsius"
}
```

#### Delete Configuration
```http
DELETE /api/config?key=tempHigh
```

### Statistics

#### Get Statistics
```http
GET /api/stats?period=24h&deviceId={id}
```

**Query Parameters:**
- `period`: Time period (1h, 24h, 7d, 30d)
- `deviceId`: Filter by device

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "24h",
    "deviceId": "device-id",
    "temperature": {
      "min": 18.5,
      "max": 28.3,
      "avg": 23.4,
      "current": 24.1
    },
    "humidity": {
      "min": 45,
      "max": 75,
      "avg": 60,
      "current": 62
    },
    "totalMeasurements": 288,
    "dataPoints": [...],
    "alerts": [...]
  }
}
```

## Error Codes

- `400` - Bad Request (invalid input)
- `404` - Resource not found
- `500` - Internal server error

## Testing

### Using VS Code REST Client
1. Install the REST Client extension
2. Open `test/api.test.http`
3. Click "Send Request" on any request

### Using Node.js Script
```bash
node test/api-test.js
```

### Using cURL
```bash
# Health check
curl http://localhost:3001/api/health

# Create device
curl -X POST http://localhost:3001/api/devices \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Device","location":"Test Lab"}'

# Get measurements
curl http://localhost:3001/api/measurements?page=1&pageSize=10
```
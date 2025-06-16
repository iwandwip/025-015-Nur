/**
 * API Testing Script
 * Run with: node test/api-test.js
 */

const baseUrl = 'http://localhost:3001/api';
let deviceId = null;
let alertId = null;

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    console.error(`❌ ${options.method || 'GET'} ${endpoint} - Status: ${response.status}`);
    console.error('Response:', data);
    throw new Error(data.error || 'Request failed');
  }
  
  console.log(`✅ ${options.method || 'GET'} ${endpoint} - Status: ${response.status}`);
  return data;
}

// Test functions
async function testHealthCheck() {
  console.log('\n🧪 Testing Health Check...');
  const result = await apiRequest('/health');
  console.log('Health status:', result.data.status);
}

async function testDevices() {
  console.log('\n🧪 Testing Device APIs...');
  
  // Create device
  const createResult = await apiRequest('/devices', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Device',
      location: 'Test Lab'
    })
  });
  deviceId = createResult.data.id;
  console.log('Created device:', deviceId);
  
  // Get all devices
  await apiRequest('/devices');
  
  // Get specific device
  await apiRequest(`/devices/${deviceId}`);
  
  // Update device
  await apiRequest(`/devices/${deviceId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: 'Updated Test Device',
      location: 'Updated Test Lab',
      isActive: true
    })
  });
}

async function testMeasurements() {
  console.log('\n🧪 Testing Measurement APIs...');
  
  // Create normal measurement
  await apiRequest('/measurements', {
    method: 'POST',
    body: JSON.stringify({
      temperature: 24.5,
      humidity: 60,
      acState: true,
      acTemperature: 23,
      deviceId
    })
  });
  
  // Create high temperature measurement (should trigger alert)
  await apiRequest('/measurements', {
    method: 'POST',
    body: JSON.stringify({
      temperature: 31.5,
      humidity: 75,
      deviceId
    })
  });
  
  // Get measurements
  const measurements = await apiRequest('/measurements');
  console.log(`Found ${measurements.data.total} measurements`);
  
  // Get measurements for device
  await apiRequest(`/measurements?deviceId=${deviceId}`);
}

async function testAlerts() {
  console.log('\n🧪 Testing Alert APIs...');
  
  // Get all alerts
  const alerts = await apiRequest('/alerts');
  console.log(`Found ${alerts.data.total} alerts`);
  
  if (alerts.data.data.length > 0) {
    alertId = alerts.data.data[0].id;
    
    // Get specific alert
    await apiRequest(`/alerts/${alertId}`);
    
    // Resolve alert
    await apiRequest(`/alerts/${alertId}`, {
      method: 'PUT',
      body: JSON.stringify({ resolved: true })
    });
  }
  
  // Create manual alert
  await apiRequest('/alerts', {
    method: 'POST',
    body: JSON.stringify({
      type: 'DEVICE_OFFLINE',
      message: 'Device has not reported in 10 minutes',
      severity: 'warning',
      deviceId
    })
  });
}

async function testConfiguration() {
  console.log('\n🧪 Testing Configuration APIs...');
  
  // Create configurations
  const configs = [
    { key: 'tempHigh', value: '28', description: 'High temperature threshold' },
    { key: 'tempLow', value: '18', description: 'Low temperature threshold' },
    { key: 'humidityHigh', value: '80', description: 'High humidity threshold' },
    { key: 'humidityLow', value: '30', description: 'Low humidity threshold' }
  ];
  
  for (const config of configs) {
    await apiRequest('/config', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }
  
  // Get all configurations
  await apiRequest('/config');
  
  // Get specific configuration
  await apiRequest('/config?key=tempHigh');
}

async function testStatistics() {
  console.log('\n🧪 Testing Statistics APIs...');
  
  // Get stats for different periods
  const periods = ['1h', '24h', '7d', '30d'];
  
  for (const period of periods) {
    const stats = await apiRequest(`/stats?period=${period}`);
    console.log(`Stats for ${period}:`, {
      measurements: stats.data.totalMeasurements,
      tempAvg: stats.data.temperature.avg?.toFixed(2),
      humidityAvg: stats.data.humidity.avg?.toFixed(2)
    });
  }
  
  // Get stats for specific device
  await apiRequest(`/stats?deviceId=${deviceId}&period=24h`);
}

async function testErrorHandling() {
  console.log('\n🧪 Testing Error Handling...');
  
  try {
    // Invalid measurement data
    await apiRequest('/measurements', {
      method: 'POST',
      body: JSON.stringify({
        temperature: 'invalid',
        humidity: 60,
        deviceId
      })
    });
  } catch (error) {
    console.log('Expected error for invalid data:', error.message);
  }
  
  try {
    // Non-existent device
    await apiRequest('/measurements', {
      method: 'POST',
      body: JSON.stringify({
        temperature: 25,
        humidity: 60,
        deviceId: 'non-existent'
      })
    });
  } catch (error) {
    console.log('Expected error for non-existent device:', error.message);
  }
}

async function cleanup() {
  console.log('\n🧹 Cleaning up test data...');
  
  if (deviceId) {
    await apiRequest(`/devices/${deviceId}`, { method: 'DELETE' });
    console.log('Deleted test device and related data');
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log(`Testing against: ${baseUrl}`);
  
  try {
    await testHealthCheck();
    await testDevices();
    await testMeasurements();
    await testAlerts();
    await testConfiguration();
    await testStatistics();
    await testErrorHandling();
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  } finally {
    await cleanup();
  }
}

// Run tests
runTests().catch(console.error);
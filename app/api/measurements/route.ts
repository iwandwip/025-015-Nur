import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, paginatedResponse, validatePaginationParams, handleApiError } from '@/lib/api-utils';
import { MeasurementCreateInput } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = validatePaginationParams(searchParams);
    const deviceId = searchParams.get('deviceId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const where: any = {};
    
    if (deviceId) {
      where.deviceId = deviceId;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }
    
    const [measurements, total] = await Promise.all([
      prisma.measurement.findMany({
        where,
        include: {
          device: {
            select: {
              id: true,
              name: true,
              location: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: pageSize
      }),
      prisma.measurement.count({ where })
    ]);
    
    return paginatedResponse(measurements, total, page, pageSize);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body: MeasurementCreateInput = await request.json();
    
    if (typeof body.temperature !== 'number' || typeof body.humidity !== 'number') {
      return errorResponse('Temperature and humidity must be numbers', 400);
    }
    
    if (!body.deviceId) {
      return errorResponse('Device ID is required', 400);
    }
    
    // Check if device exists
    const device = await prisma.device.findUnique({
      where: { id: body.deviceId }
    });
    
    if (!device) {
      return errorResponse('Device not found', 404);
    }
    
    // Create measurement and update device lastSeen
    const [measurement] = await prisma.$transaction([
      prisma.measurement.create({
        data: {
          temperature: body.temperature,
          humidity: body.humidity,
          acState: body.acState || false,
          acTemperature: body.acTemperature,
          deviceId: body.deviceId
        },
        include: {
          device: true
        }
      }),
      prisma.device.update({
        where: { id: body.deviceId },
        data: { lastSeen: new Date() }
      })
    ]);
    
    // Check for alert conditions
    await checkAlertConditions(measurement);
    
    return successResponse(measurement, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

async function checkAlertConditions(measurement: any) {
  const alerts = [];
  
  // Get configuration thresholds
  const configs = await prisma.configuration.findMany({
    where: {
      key: {
        in: ['tempHigh', 'tempLow', 'humidityHigh', 'humidityLow']
      }
    }
  });
  
  const thresholds = configs.reduce((acc, config) => {
    acc[config.key] = parseFloat(config.value);
    return acc;
  }, {} as Record<string, number>);
  
  // Set defaults if not configured
  const tempHigh = thresholds.tempHigh || 28;
  const tempLow = thresholds.tempLow || 18;
  const humidityHigh = thresholds.humidityHigh || 80;
  const humidityLow = thresholds.humidityLow || 30;
  
  // Check temperature
  if (measurement.temperature > tempHigh) {
    alerts.push({
      type: 'HIGH_TEMP',
      message: `Temperature ${measurement.temperature}°C exceeds threshold of ${tempHigh}°C`,
      severity: 'warning',
      deviceId: measurement.deviceId
    });
  } else if (measurement.temperature < tempLow) {
    alerts.push({
      type: 'LOW_TEMP',
      message: `Temperature ${measurement.temperature}°C below threshold of ${tempLow}°C`,
      severity: 'warning',
      deviceId: measurement.deviceId
    });
  }
  
  // Check humidity
  if (measurement.humidity > humidityHigh) {
    alerts.push({
      type: 'HIGH_HUMIDITY',
      message: `Humidity ${measurement.humidity}% exceeds threshold of ${humidityHigh}%`,
      severity: 'warning',
      deviceId: measurement.deviceId
    });
  } else if (measurement.humidity < humidityLow) {
    alerts.push({
      type: 'LOW_HUMIDITY',
      message: `Humidity ${measurement.humidity}% below threshold of ${humidityLow}%`,
      severity: 'warning',
      deviceId: measurement.deviceId
    });
  }
  
  // Create alerts if any
  if (alerts.length > 0) {
    await prisma.alert.createMany({
      data: alerts
    });
  }
}
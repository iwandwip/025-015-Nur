import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { successResponse, handleApiError } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const period = searchParams.get('period') || '24h';
    
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '1h':
        startDate.setHours(now.getHours() - 1);
        break;
      case '24h':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setDate(now.getDate() - 1);
    }
    
    const where: any = {
      createdAt: {
        gte: startDate
      }
    };
    
    if (deviceId) {
      where.deviceId = deviceId;
    }
    
    // Get measurements for statistics
    const measurements = await prisma.measurement.findMany({
      where,
      select: {
        temperature: true,
        humidity: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    if (measurements.length === 0) {
      return successResponse({
        period,
        deviceId,
        temperature: {
          min: null,
          max: null,
          avg: null,
          current: null
        },
        humidity: {
          min: null,
          max: null,
          avg: null,
          current: null
        },
        totalMeasurements: 0,
        dataPoints: []
      });
    }
    
    // Calculate statistics
    const temperatures = measurements.map(m => m.temperature);
    const humidities = measurements.map(m => m.humidity);
    
    const stats = {
      period,
      deviceId,
      temperature: {
        min: Math.min(...temperatures),
        max: Math.max(...temperatures),
        avg: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
        current: temperatures[temperatures.length - 1]
      },
      humidity: {
        min: Math.min(...humidities),
        max: Math.max(...humidities),
        avg: humidities.reduce((a, b) => a + b, 0) / humidities.length,
        current: humidities[humidities.length - 1]
      },
      totalMeasurements: measurements.length,
      dataPoints: measurements.map(m => ({
        temperature: m.temperature,
        humidity: m.humidity,
        timestamp: m.createdAt
      }))
    };
    
    // Get alert counts
    const alertCounts = await prisma.alert.groupBy({
      by: ['type', 'resolved'],
      where: {
        createdAt: {
          gte: startDate
        },
        ...(deviceId && { deviceId })
      },
      _count: true
    });
    
    stats.alerts = alertCounts;
    
    return successResponse(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
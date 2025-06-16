import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { successResponse, handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Get system stats
    const [deviceCount, measurementCount, activeAlerts] = await Promise.all([
      prisma.device.count(),
      prisma.measurement.count(),
      prisma.alert.count({
        where: { resolved: false }
      })
    ]);
    
    const status = {
      status: 'healthy',
      timestamp: new Date(),
      database: 'connected',
      stats: {
        devices: deviceCount,
        measurements: measurementCount,
        activeAlerts
      }
    };
    
    return successResponse(status);
  } catch (error) {
    return handleApiError({
      ...error,
      message: 'Health check failed'
    });
  }
}
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, paginatedResponse, validatePaginationParams, handleApiError } from '@/lib/api-utils';
import { AlertCreateInput } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = validatePaginationParams(searchParams);
    const deviceId = searchParams.get('deviceId');
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    const resolved = searchParams.get('resolved');
    
    const where: any = {};
    
    if (deviceId) {
      where.deviceId = deviceId;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (severity) {
      where.severity = severity;
    }
    
    if (resolved !== null) {
      where.resolved = resolved === 'true';
    }
    
    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
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
      prisma.alert.count({ where })
    ]);
    
    return paginatedResponse(alerts, total, page, pageSize);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body: AlertCreateInput = await request.json();
    
    if (!body.type || !body.message || !body.deviceId) {
      return errorResponse('Type, message, and deviceId are required', 400);
    }
    
    const alert = await prisma.alert.create({
      data: {
        type: body.type,
        message: body.message,
        severity: body.severity || 'warning',
        deviceId: body.deviceId
      },
      include: {
        device: true
      }
    });
    
    return successResponse(alert, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
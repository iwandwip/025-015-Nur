import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, paginatedResponse, validatePaginationParams, handleApiError } from '@/lib/api-utils';
import { DeviceCreateInput } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = validatePaginationParams(searchParams);
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');
    
    const where: any = {};
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { location: { contains: search } }
      ];
    }
    
    const [devices, total] = await Promise.all([
      prisma.device.findMany({
        where,
        include: {
          _count: {
            select: {
              measurements: true,
              alerts: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: pageSize
      }),
      prisma.device.count({ where })
    ]);
    
    return paginatedResponse(devices, total, page, pageSize);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body: DeviceCreateInput = await request.json();
    
    if (!body.name || !body.location) {
      return errorResponse('Name and location are required', 400);
    }
    
    const device = await prisma.device.create({
      data: {
        name: body.name,
        location: body.location,
        type: body.type || 'ESP32'
      }
    });
    
    return successResponse(device, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
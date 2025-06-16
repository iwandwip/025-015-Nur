import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const device = await prisma.device.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            measurements: true,
            alerts: true
          }
        },
        measurements: {
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        },
        alerts: {
          where: {
            resolved: false
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!device) {
      return errorResponse('Device not found', 404);
    }
    
    return successResponse(device);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const device = await prisma.device.update({
      where: { id: params.id },
      data: {
        name: body.name,
        location: body.location,
        type: body.type,
        isActive: body.isActive,
        lastSeen: body.lastSeen ? new Date(body.lastSeen) : undefined
      }
    });
    
    return successResponse(device);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return errorResponse('Device not found', 404);
    }
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.device.delete({
      where: { id: params.id }
    });
    
    return successResponse({ message: 'Device deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return errorResponse('Device not found', 404);
    }
    return handleApiError(error);
  }
}
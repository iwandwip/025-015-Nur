import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const alertId = parseInt(params.id);
    
    if (isNaN(alertId)) {
      return errorResponse('Invalid alert ID', 400);
    }
    
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: {
        device: true
      }
    });
    
    if (!alert) {
      return errorResponse('Alert not found', 404);
    }
    
    return successResponse(alert);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const alertId = parseInt(params.id);
    const body = await request.json();
    
    if (isNaN(alertId)) {
      return errorResponse('Invalid alert ID', 400);
    }
    
    const updateData: any = {};
    
    if (body.resolved !== undefined) {
      updateData.resolved = body.resolved;
      if (body.resolved) {
        updateData.resolvedAt = new Date();
      } else {
        updateData.resolvedAt = null;
      }
    }
    
    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: updateData,
      include: {
        device: true
      }
    });
    
    return successResponse(alert);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return errorResponse('Alert not found', 404);
    }
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const alertId = parseInt(params.id);
    
    if (isNaN(alertId)) {
      return errorResponse('Invalid alert ID', 400);
    }
    
    await prisma.alert.delete({
      where: { id: alertId }
    });
    
    return successResponse({ message: 'Alert deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return errorResponse('Alert not found', 404);
    }
    return handleApiError(error);
  }
}
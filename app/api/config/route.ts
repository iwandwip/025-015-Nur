import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';
import { ConfigurationInput } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (key) {
      const config = await prisma.configuration.findUnique({
        where: { key }
      });
      
      if (!config) {
        return errorResponse('Configuration not found', 404);
      }
      
      return successResponse(config);
    }
    
    const configurations = await prisma.configuration.findMany({
      orderBy: {
        key: 'asc'
      }
    });
    
    return successResponse(configurations);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body: ConfigurationInput = await request.json();
    
    if (!body.key || !body.value) {
      return errorResponse('Key and value are required', 400);
    }
    
    const config = await prisma.configuration.upsert({
      where: { key: body.key },
      update: {
        value: body.value,
        description: body.description
      },
      create: {
        key: body.key,
        value: body.value,
        description: body.description
      }
    });
    
    return successResponse(config, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return errorResponse('Key is required', 400);
    }
    
    await prisma.configuration.delete({
      where: { key }
    });
    
    return successResponse({ message: 'Configuration deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return errorResponse('Configuration not found', 404);
    }
    return handleApiError(error);
  }
}
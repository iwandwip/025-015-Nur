import { NextResponse } from 'next/server';
import { ApiResponse, PaginatedResponse } from './types';

export function successResponse<T>(data: T, status: number = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  return NextResponse.json(response, { status });
}

export function errorResponse(error: string, status: number = 500): NextResponse {
  const response: ApiResponse = {
    success: false,
    error
  };
  return NextResponse.json(response, { status });
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  status: number = 200
): NextResponse {
  const totalPages = Math.ceil(total / pageSize);
  const response: PaginatedResponse<T[]> = {
    success: true,
    data,
    total,
    page,
    pageSize,
    totalPages
  };
  return NextResponse.json(response, { status });
}

export function validatePaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '10')));
  const skip = (page - 1) * pageSize;
  
  return { page, pageSize, skip };
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }
  
  return errorResponse('An unexpected error occurred', 500);
}
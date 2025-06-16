import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const whereClause: any = {};
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }
    
    const measurements = await prisma.measurement.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Generate CSV
    const headers = ['Date', 'Time', 'Temperature (°C)', 'Humidity (%)'];
    const rows = measurements.map(m => [
      format(m.createdAt, 'dd/MM/yyyy'),
      format(m.createdAt, 'HH:mm:ss'),
      m.temperature.toString(),
      m.humidity.toString()
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="measurements_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting measurements:', error);
    return NextResponse.json(
      { error: 'Failed to export measurements' },
      { status: 500 }
    );
  }
}
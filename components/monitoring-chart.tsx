"use client"

import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area
} from "recharts";

interface MonitoringChartProps {
  data: any[];
}

export default function MonitoringChart({ data }: MonitoringChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="time" 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          yAxisId="temp"
          stroke="#6b7280"
          fontSize={12}
          domain={[20, 26]}
        />
        <YAxis 
          yAxisId="humidity"
          orientation="right"
          stroke="#9ca3af"
          fontSize={12}
          domain={[30, 60]}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: '1px solid #e5e7eb',
            borderRadius: '6px'
          }}
        />
        <Legend />
        <Area
          yAxisId="temp"
          type="monotone"
          dataKey="temperature"
          stroke="#6b7280"
          fillOpacity={1}
          fill="url(#temperatureGradient)"
          strokeWidth={2}
          name="Temperature (°C)"
        />
        <Area
          yAxisId="humidity"
          type="monotone"
          dataKey="humidity"
          stroke="#9ca3af"
          fillOpacity={1}
          fill="url(#humidityGradient)"
          strokeWidth={2}
          name="Humidity (%)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
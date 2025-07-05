import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { format, parseISO } from 'date-fns'
import type { SensorData } from '@/types/sensor'

interface TemperatureChartProps {
  data: SensorData[]
  setpoint?: number
}

export function TemperatureChart({ data, setpoint = 25 }: TemperatureChartProps) {
  const chartData = data.map(item => ({
    ...item,
    time: format(parseISO(item.timestamp), 'HH:mm'),
    formattedTime: format(parseISO(item.timestamp), 'MMM dd, HH:mm')
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium">{data.formattedTime}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm">Temperature: {data.temperature}°C</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span className="text-sm">Setpoint: {setpoint}°C</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 capitalize">
            Status: {data.status}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Temperature Trend (24h)
          <div className="flex items-center gap-4 text-sm font-normal">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Actual</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span>Setpoint</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12 }}
                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <ReferenceLine 
                y={setpoint} 
                stroke="#9CA3AF" 
                strokeDasharray="5 5"
                label={{ value: `Setpoint (${setpoint}°C)`, position: "topRight" }}
              />
              
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
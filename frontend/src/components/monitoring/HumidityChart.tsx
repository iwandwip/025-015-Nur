import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format, parseISO } from 'date-fns'
import type { SensorData } from '@/types/sensor'

interface HumidityChartProps {
  data: SensorData[]
}

export function HumidityChart({ data }: HumidityChartProps) {
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
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span className="text-sm">Humidity: {data.humidity}%</span>
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
          Humidity Trend (24h)
          <div className="flex items-center gap-2 text-sm font-normal">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-cyan-500 rounded"></div>
              <span>Relative Humidity</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="opacity-30" 
                animationDuration={800}
              />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
                animationDuration={800}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                label={{ value: '%', angle: -90, position: 'insideLeft' }}
                animationDuration={800}
              />
              <Tooltip 
                content={<CustomTooltip />}
                animationDuration={200}
                wrapperStyle={{
                  outline: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                }}
              />
              
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="#06B6D4"
                strokeWidth={2}
                fill="url(#colorHumidity)"
                dot={{ 
                  fill: '#06B6D4', 
                  strokeWidth: 2, 
                  r: 3,
                  style: { 
                    transition: 'all 0.3s ease',
                    filter: 'drop-shadow(0 2px 4px rgba(6, 182, 212, 0.3))'
                  }
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: '#06B6D4', 
                  strokeWidth: 2,
                  fill: '#ffffff',
                  style: {
                    filter: 'drop-shadow(0 4px 8px rgba(6, 182, 212, 0.4))',
                    transition: 'all 0.2s ease'
                  }
                }}
                animationDuration={1400}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
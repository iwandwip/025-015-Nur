import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, parseISO } from 'date-fns'
import { Download, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SensorData } from '@/types/sensor'

interface DataTableProps {
  data: SensorData[]
  onRefresh?: () => void
}

const statusColors = {
  normal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}

export function DataTable({ data, onRefresh }: DataTableProps) {
  const recentData = data.slice(-10).reverse() // Show last 10 entries, newest first

  const handleExport = () => {
    const csv = [
      ['No', 'Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Status'],
      ...recentData.map((item, index) => [
        recentData.length - index,
        format(parseISO(item.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        item.temperature,
        item.humidity,
        item.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sensor-data-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Sensor Data</CardTitle>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-sm">No</th>
                  <th className="text-left p-3 font-medium text-sm">Timestamp</th>
                  <th className="text-left p-3 font-medium text-sm">Temperature</th>
                  <th className="text-left p-3 font-medium text-sm">Humidity</th>
                  <th className="text-left p-3 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentData.map((item, index) => (
                  <tr key={`${item.timestamp}-${index}`} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="p-3 text-sm font-medium">
                      {recentData.length - index}
                    </td>
                    <td className="p-3 text-sm">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {format(parseISO(item.timestamp), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {format(parseISO(item.timestamp), 'HH:mm:ss')}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.temperature}°C</span>
                        <span className={cn(
                          "text-xs",
                          item.temperature > 25 ? "text-red-600" : 
                          item.temperature < 20 ? "text-blue-600" : "text-green-600"
                        )}>
                          {item.temperature > 25 ? '🔥' : 
                           item.temperature < 20 ? '❄️' : '✅'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.humidity}%</span>
                        <span className={cn(
                          "text-xs",
                          item.humidity > 70 ? "text-blue-600" : 
                          item.humidity < 40 ? "text-yellow-600" : "text-green-600"
                        )}>
                          {item.humidity > 70 ? '💧' : 
                           item.humidity < 40 ? '🏜️' : '✅'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      <Badge 
                        variant="secondary" 
                        className={cn("capitalize text-xs", statusColors[item.status])}
                      >
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {recentData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No data available</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Showing {recentData.length} most recent entries
        </div>
      </CardContent>
    </Card>
  )
}
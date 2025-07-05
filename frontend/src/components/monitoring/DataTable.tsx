import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExportDropdown } from '@/components/ui/export-dropdown'
import { format, parseISO, isAfter, subHours, subDays } from 'date-fns'
import { RefreshCw, ArrowUp, ArrowDown } from 'lucide-react'
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

type TimeFilter = 'all' | '1h' | '6h' | '24h' | '7d'
type SortOrder = 'newest' | 'oldest'

export function DataTable({ data, onRefresh }: DataTableProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [displayLimit, setDisplayLimit] = useState<number>(10)

  const filteredAndSortedData = useMemo(() => {
    const now = new Date()
    let filtered = data

    // Apply time filter
    switch (timeFilter) {
      case '1h':
        filtered = data.filter(item => isAfter(parseISO(item.timestamp), subHours(now, 1)))
        break
      case '6h':
        filtered = data.filter(item => isAfter(parseISO(item.timestamp), subHours(now, 6)))
        break
      case '24h':
        filtered = data.filter(item => isAfter(parseISO(item.timestamp), subDays(now, 1)))
        break
      case '7d':
        filtered = data.filter(item => isAfter(parseISO(item.timestamp), subDays(now, 7)))
        break
      case 'all':
      default:
        filtered = data
        break
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const timeA = parseISO(a.timestamp).getTime()
      const timeB = parseISO(b.timestamp).getTime()
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB
    })

    return sorted.slice(0, displayLimit)
  }, [data, timeFilter, sortOrder, displayLimit])

  const getTimeFilterLabel = (filter: TimeFilter): string => {
    switch (filter) {
      case '1h': return 'Last 1 Hour'
      case '6h': return 'Last 6 Hours'
      case '24h': return 'Last 24 Hours'
      case '7d': return 'Last 7 Days'
      case 'all': return 'All Data'
      default: return 'All Data'
    }
  }

  const toggleSort = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Sensor Data</CardTitle>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            )}
            <ExportDropdown 
              data={filteredAndSortedData}
              filename={`sensor-data-${timeFilter}`}
              timeFilter={getTimeFilterLabel(timeFilter)}
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time:</span>
            <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last 1 Hour</SelectItem>
                <SelectItem value="6h">Last 6 Hours</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort:</span>
            <Button variant="outline" size="sm" onClick={toggleSort} className="gap-2">
              {sortOrder === 'newest' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
              </span>
              <span className="sm:hidden">
                {sortOrder === 'newest' ? 'New' : 'Old'}
              </span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Show:</span>
            <Select value={displayLimit.toString()} onValueChange={(value: string) => setDisplayLimit(Number(value))}>
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                {filteredAndSortedData.map((item, index) => (
                  <tr key={`${item.timestamp}-${index}`} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="p-3 text-sm font-medium">
                      {index + 1}
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
          
          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No data available for the selected time range</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>
            Showing {filteredAndSortedData.length} of {data.length} entries
            {timeFilter !== 'all' && ` (${timeFilter} filter)`}
          </span>
          <span>
            Sorted by {sortOrder === 'newest' ? 'newest' : 'oldest'} first
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
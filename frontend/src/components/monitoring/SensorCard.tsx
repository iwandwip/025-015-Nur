import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Thermometer, Droplets, Power, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import numeral from 'numeral'

interface SensorCardProps {
  title: string
  value: number
  unit: string
  icon: 'temperature' | 'humidity' | 'power' | 'target'
  status?: 'normal' | 'warning' | 'critical'
  subtitle?: string
  trend?: 'up' | 'down' | 'stable'
}

const iconMap = {
  temperature: Thermometer,
  humidity: Droplets,
  power: Power,
  target: Target
}

const statusColors = {
  normal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}

export function SensorCard({ 
  title, 
  value, 
  unit, 
  icon, 
  status = 'normal', 
  subtitle,
  trend = 'stable'
}: SensorCardProps) {
  const Icon = iconMap[icon]
  const formattedValue = numeral(value).format('0.0')

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs md:text-sm font-medium">{title}</CardTitle>
        <Icon className={cn(
          "h-4 w-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110",
          status === 'normal' && "text-blue-600 group-hover:text-blue-700",
          status === 'warning' && "text-yellow-600 group-hover:text-yellow-700",
          status === 'critical' && "text-red-600 group-hover:text-red-700"
        )} />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-lg md:text-2xl font-bold truncate transition-all duration-300 group-hover:text-primary">
              {formattedValue}
              <span className="text-xs md:text-sm font-normal text-muted-foreground ml-1">
                {unit}
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>
            )}
          </div>
          
          <Badge 
            variant="secondary" 
            className={cn("capitalize text-xs flex-shrink-0", statusColors[status])}
          >
            {status}
          </Badge>
        </div>
        
        {trend && (
          <div className="flex items-center text-xs">
            <span className={cn(
              "flex items-center",
              trend === 'up' && "text-red-600",
              trend === 'down' && "text-blue-600",
              trend === 'stable' && "text-gray-600"
            )}>
              {trend === 'up' && '↗'}
              {trend === 'down' && '↘'}
              {trend === 'stable' && '→'}
              <span className="ml-1 hidden sm:inline">
                {trend === 'up' && 'Rising'}
                {trend === 'down' && 'Falling'}
                {trend === 'stable' && 'Stable'}
              </span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
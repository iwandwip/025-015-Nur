import { Header } from '@/components/layout/Header'
import { SensorCard } from '@/components/monitoring/SensorCard'
import { TemperatureChart } from '@/components/monitoring/TemperatureChart'
import { HumidityChart } from '@/components/monitoring/HumidityChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMockSensorData } from '@/hooks/useMockSensorData'
import { Power, Fan, Settings2 } from 'lucide-react'

export function Monitoring() {
  const { currentData, historyData, isLoading, refetch } = useMockSensorData()

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Monitoring Dashboard" />
        <div className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Monitoring Dashboard" onRefresh={refetch} />
      
      <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
        {/* Current Sensor Data Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <SensorCard
            title="Temperature"
            value={currentData.temperature}
            unit="°C"
            icon="temperature"
            status={currentData.status}
            subtitle="Current room temperature"
          />
          
          <SensorCard
            title="Humidity"
            value={currentData.humidity}
            unit="%"
            icon="humidity"
            status={currentData.status}
            subtitle="Relative humidity"
          />
          
          <SensorCard
            title="Setpoint"
            value={currentData.temperatureSetpoint}
            unit="°C"
            icon="target"
            status="normal"
            subtitle="Target temperature"
          />
          
          <SensorCard
            title="AC Status"
            value={currentData.acStatus === 'on' ? 1 : 0}
            unit={currentData.acStatus.toUpperCase()}
            icon="power"
            status={currentData.acStatus === 'on' ? 'normal' : 'warning'}
            subtitle={`Mode: ${currentData.mode}`}
          />
        </div>

        {/* AC Control Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <Power className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium">AC Power</p>
                  <Badge variant={currentData.acStatus === 'on' ? 'default' : 'secondary'}>
                    {currentData.acStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Fan className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">Operation Mode</p>
                  <Badge variant="outline">
                    {currentData.mode.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Settings2 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium">System Health</p>
                  <Badge variant="default" className="bg-green-600">
                    ONLINE
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Tabs defaultValue="temperature" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="temperature" className="text-xs md:text-sm">
              <span className="hidden sm:inline">Temperature Trends</span>
              <span className="sm:hidden">Temperature</span>
            </TabsTrigger>
            <TabsTrigger value="humidity" className="text-xs md:text-sm">
              <span className="hidden sm:inline">Humidity Trends</span>
              <span className="sm:hidden">Humidity</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="temperature" className="space-y-4">
            <TemperatureChart 
              data={historyData} 
              setpoint={currentData.temperatureSetpoint} 
            />
          </TabsContent>
          
          <TabsContent value="humidity" className="space-y-4">
            <HumidityChart data={historyData} />
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">AC turned on automatically</span>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Temperature exceeded setpoint</span>
                <span className="text-xs text-muted-foreground">5 min ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Setpoint updated to {currentData.temperatureSetpoint}°C</span>
                <span className="text-xs text-muted-foreground">15 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { Header } from '@/components/layout/Header'
import { SensorCard } from '@/components/monitoring/SensorCard'
import { TemperatureChart } from '@/components/monitoring/TemperatureChart'
import { HumidityChart } from '@/components/monitoring/HumidityChart'
import { DataTable } from '@/components/monitoring/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton, SkeletonCard, SkeletonChart, SkeletonTable } from '@/components/ui/enhanced-skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonitoringErrorBoundary, ChartErrorBoundary, TableErrorBoundary } from '@/components/error-boundary'
import { useMockSensorData } from '@/hooks/useMockSensorData'

export function Monitoring() {
  const { currentData, historyData, isLoading, refetch } = useMockSensorData()

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Monitoring Dashboard" />
        <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
          {/* Loading Sensor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>

          {/* Loading Tabs */}
          <div className="space-y-4">
            <div className="flex">
              <div className="grid w-full grid-cols-2 h-10 items-center justify-center rounded-md bg-muted p-1">
                <Skeleton className="h-8 w-full" animation="wave" />
                <Skeleton className="h-8 w-full" animation="wave" />
              </div>
            </div>
            <SkeletonChart />
          </div>

          {/* Loading Data Table */}
          <SkeletonTable />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Monitoring Dashboard" onRefresh={refetch} />
      
      <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
        {/* Current Sensor Data Cards */}
        <MonitoringErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
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
          </div>
        </MonitoringErrorBoundary>

        {/* Charts */}
        <ChartErrorBoundary>
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
              <div data-chart="temperature">
                <TemperatureChart 
                  data={historyData} 
                  setpoint={currentData.temperatureSetpoint} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="humidity" className="space-y-4">
              <div data-chart="humidity">
                <HumidityChart data={historyData} />
              </div>
            </TabsContent>
          </Tabs>
        </ChartErrorBoundary>

        {/* Data Table */}
        <TableErrorBoundary>
          <DataTable data={historyData} onRefresh={refetch} />
        </TableErrorBoundary>
      </div>
    </div>
  )
}
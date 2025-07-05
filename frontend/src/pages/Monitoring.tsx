import { Header } from '@/components/layout/Header'
import { SensorCard } from '@/components/monitoring/SensorCard'
import { TemperatureChart } from '@/components/monitoring/TemperatureChart'
import { HumidityChart } from '@/components/monitoring/HumidityChart'
import { DataTable } from '@/components/monitoring/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMockSensorData } from '@/hooks/useMockSensorData'

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

        {/* Data Table */}
        <DataTable data={historyData} onRefresh={refetch} />
      </div>
    </div>
  )
}
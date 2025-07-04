import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { SensorCard } from '@/components/monitoring/SensorCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useMockSensorData } from '@/hooks/useMockSensorData'
import { Power, Fan, Settings2, Thermometer, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'

export function Control() {
  const { currentData, refetch } = useMockSensorData()
  const [tempSetpoint, setTempSetpoint] = useState(currentData.temperatureSetpoint)
  const [acPower, setAcPower] = useState(currentData.acStatus === 'on')
  const [autoMode, setAutoMode] = useState(currentData.mode === 'auto')

  const handleTempChange = (change: number) => {
    const newTemp = Math.max(16, Math.min(30, tempSetpoint + change))
    setTempSetpoint(newTemp)
    toast.success(`Temperature setpoint updated to ${newTemp}°C`)
  }

  const handlePowerToggle = () => {
    if (autoMode) {
      toast.error('Cannot manually control AC power while in Auto mode')
      return
    }
    setAcPower(!acPower)
    toast.success(`AC ${!acPower ? 'turned on' : 'turned off'}`)
  }

  const handleModeToggle = () => {
    const newMode = !autoMode
    setAutoMode(newMode)
    
    if (newMode) {
      toast.success('Auto mode enabled - AC will be controlled automatically')
    } else {
      toast.success('Manual mode enabled - You can now control AC manually')
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="AC Control" onRefresh={refetch} />
      
      <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
        {/* Current Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <SensorCard
            title="Current Temp"
            value={currentData.temperature}
            unit="°C"
            icon="temperature"
            status={currentData.status}
            subtitle="Room temperature"
          />
          
          <SensorCard
            title="Setpoint"
            value={tempSetpoint}
            unit="°C"
            icon="target"
            status="normal"
            subtitle="Target temperature"
          />
          
          <SensorCard
            title="AC Status"
            value={acPower ? 1 : 0}
            unit={acPower ? "ON" : "OFF"}
            icon="power"
            status={acPower ? 'normal' : 'warning'}
            subtitle={`Mode: ${autoMode ? 'auto' : 'manual'}`}
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

        {/* Temperature Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Temperature Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleTempChange(-1)}
                disabled={tempSetpoint <= 16}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <div className="text-4xl font-bold">{tempSetpoint}°C</div>
                <p className="text-sm text-muted-foreground">Target Temperature</p>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleTempChange(1)}
                disabled={tempSetpoint >= 30}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Label htmlFor="temp-input" className="text-sm">Set to:</Label>
                <Input
                  id="temp-input"
                  type="number"
                  min="16"
                  max="30"
                  value={tempSetpoint}
                  onChange={(e) => setTempSetpoint(Number(e.target.value))}
                  className="w-20 text-center"
                />
                <span className="text-sm text-muted-foreground">°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AC Power & Mode Control */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Power Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Power className="h-5 w-5" />
                AC Power
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ac-power" className={autoMode ? 'text-muted-foreground' : ''}>
                    AC Power {autoMode && '(Auto Mode)'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {autoMode ? 'Controlled automatically' : 'Turn AC on or off'}
                  </p>
                </div>
                <Switch
                  id="ac-power"
                  checked={acPower}
                  onCheckedChange={handlePowerToggle}
                  disabled={autoMode}
                />
              </div>
              
              <div className={`text-center p-4 rounded-lg border ${autoMode ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}>
                <Power className={`h-8 w-8 mx-auto mb-2 ${acPower ? 'text-green-600' : 'text-gray-400'}`} />
                <p className="font-medium">
                  Status: <Badge variant={acPower ? 'default' : 'secondary'}>
                    {acPower ? 'ON' : 'OFF'}
                  </Badge>
                  {autoMode && (
                    <Badge variant="outline" className="ml-2 text-blue-600">
                      AUTO
                    </Badge>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mode Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fan className="h-5 w-5" />
                Operation Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-mode">Auto Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    {autoMode ? 'System controls AC automatically' : 'Manual control enabled'}
                  </p>
                </div>
                <Switch
                  id="auto-mode"
                  checked={autoMode}
                  onCheckedChange={handleModeToggle}
                />
              </div>
              
              <div className={`text-center p-4 rounded-lg border ${autoMode ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'}`}>
                <Fan className={`h-8 w-8 mx-auto mb-2 ${autoMode ? 'text-blue-600' : 'text-orange-600'}`} />
                <p className="font-medium">
                  Mode: <Badge variant="outline" className={autoMode ? 'text-blue-600 border-blue-600' : 'text-orange-600 border-orange-600'}>
                    {autoMode ? 'AUTO' : 'MANUAL'}
                  </Badge>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {autoMode ? 'AC power controlled by system' : 'Full manual control available'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
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
                  <Badge variant={acPower ? 'default' : 'secondary'}>
                    {acPower ? 'ON' : 'OFF'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Fan className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">Operation Mode</p>
                  <Badge variant="outline">
                    {autoMode ? 'AUTO' : 'MANUAL'}
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Quick Actions
              {autoMode && (
                <Badge variant="outline" className="text-blue-600">
                  Limited in Auto Mode
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setTempSetpoint(18)
                  toast.success('Cool mode activated (18°C)')
                }}
              >
                Cool (18°C)
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setTempSetpoint(22)
                  toast.success('Comfort mode activated (22°C)')
                }}
              >
                Comfort (22°C)
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setTempSetpoint(26)
                  toast.success('Eco mode activated (26°C)')
                }}
              >
                Eco (26°C)
              </Button>
              <Button 
                variant="outline"
                disabled={autoMode}
                onClick={() => {
                  if (autoMode) {
                    toast.error('Cannot turn off AC manually while in Auto mode')
                    return
                  }
                  setAcPower(false)
                  toast.success('AC turned off')
                }}
              >
                {autoMode ? 'Turn Off (Disabled)' : 'Turn Off'}
              </Button>
            </div>
            {autoMode && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Temperature setpoints can still be adjusted in Auto mode, but AC power is controlled automatically
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useSettings } from '@/hooks/useSettings'
import { 
  Settings, 
  Thermometer, 
  Droplets, 
  RefreshCw, 
  Download, 
  Upload, 
  RotateCcw,
  AlertTriangle,
  Code,
  Palette,
  Wifi
} from 'lucide-react'
import { toast } from 'sonner'

export function DeveloperSettings() {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSettings()
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = async () => {
    setIsResetting(true)
    try {
      resetSettings()
      toast.success('Settings reset to defaults')
    } catch (error) {
      toast.error('Failed to reset settings')
    } finally {
      setIsResetting(false)
    }
  }

  const handleExport = () => {
    try {
      exportSettings()
      toast.success('Settings exported successfully')
    } catch (error) {
      toast.error('Failed to export settings')
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    importSettings(file)
      .then(() => {
        toast.success('Settings imported successfully')
        event.target.value = '' // Reset file input
      })
      .catch(() => {
        toast.error('Failed to import settings')
        event.target.value = ''
      })
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Developer Settings" />
      
      <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">System Configuration</h2>
            <p className="text-muted-foreground">Advanced settings for developers and system administrators</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleReset}
              disabled={isResetting}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>

        <Tabs defaultValue="thresholds" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="thresholds">
              <Thermometer className="h-4 w-4 mr-2" />
              Thresholds
            </TabsTrigger>
            <TabsTrigger value="system">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="api">
              <Wifi className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger value="ui">
              <Palette className="h-4 w-4 mr-2" />
              Interface
            </TabsTrigger>
          </TabsList>

          {/* Thresholds Tab */}
          <TabsContent value="thresholds" className="space-y-6">
            {/* Temperature Thresholds */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Temperature Thresholds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Icon Thresholds */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Icon Display Ranges</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="temp-cold" className="w-20">Cold ❄️</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">≤</span>
                          <Input
                            id="temp-cold"
                            type="number"
                            value={settings.thresholds.temperature.icons.cold}
                            onChange={(e) => updateSettings('thresholds', {
                              temperature: {
                                ...settings.thresholds.temperature,
                                icons: {
                                  ...settings.thresholds.temperature.icons,
                                  cold: Number(e.target.value)
                                }
                              }
                            })}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">°C</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Label htmlFor="temp-hot" className="w-20">Hot 🔥</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">&gt;</span>
                          <Input
                            id="temp-hot"
                            type="number"
                            value={settings.thresholds.temperature.icons.hot}
                            onChange={(e) => updateSettings('thresholds', {
                              temperature: {
                                ...settings.thresholds.temperature,
                                icons: {
                                  ...settings.thresholds.temperature.icons,
                                  hot: Number(e.target.value)
                                }
                              }
                            })}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">°C</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                        Normal range ✅: {settings.thresholds.temperature.icons.cold + 1}°C - {settings.thresholds.temperature.icons.hot}°C
                      </div>
                    </div>
                  </div>

                  {/* Status Thresholds */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Status Alert Ranges</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Warning Range</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              value={settings.thresholds.temperature.status.warningMin}
                              onChange={(e) => updateSettings('thresholds', {
                                temperature: {
                                  ...settings.thresholds.temperature,
                                  status: {
                                    ...settings.thresholds.temperature.status,
                                    warningMin: Number(e.target.value)
                                  }
                                }
                              })}
                              className="w-16"
                            />
                            <span className="text-sm">-</span>
                            <Input
                              type="number"
                              value={settings.thresholds.temperature.status.warningMax}
                              onChange={(e) => updateSettings('thresholds', {
                                temperature: {
                                  ...settings.thresholds.temperature,
                                  status: {
                                    ...settings.thresholds.temperature.status,
                                    warningMax: Number(e.target.value)
                                  }
                                }
                              })}
                              className="w-16"
                            />
                            <span className="text-sm">°C</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm">Critical Range</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              value={settings.thresholds.temperature.status.criticalMin}
                              onChange={(e) => updateSettings('thresholds', {
                                temperature: {
                                  ...settings.thresholds.temperature,
                                  status: {
                                    ...settings.thresholds.temperature.status,
                                    criticalMin: Number(e.target.value)
                                  }
                                }
                              })}
                              className="w-16"
                            />
                            <span className="text-sm">-</span>
                            <Input
                              type="number"
                              value={settings.thresholds.temperature.status.criticalMax}
                              onChange={(e) => updateSettings('thresholds', {
                                temperature: {
                                  ...settings.thresholds.temperature,
                                  status: {
                                    ...settings.thresholds.temperature.status,
                                    criticalMax: Number(e.target.value)
                                  }
                                }
                              })}
                              className="w-16"
                            />
                            <span className="text-sm">°C</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                        Normal: {settings.thresholds.temperature.status.warningMin + 1}°C - {settings.thresholds.temperature.status.warningMax - 1}°C
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Humidity Thresholds */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  Humidity Thresholds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Icon Thresholds */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Icon Display Ranges</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="humid-dry" className="w-20">Dry 🏜️</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">&lt;</span>
                          <Input
                            id="humid-dry"
                            type="number"
                            value={settings.thresholds.humidity.icons.dry}
                            onChange={(e) => updateSettings('thresholds', {
                              humidity: {
                                ...settings.thresholds.humidity,
                                icons: {
                                  ...settings.thresholds.humidity.icons,
                                  dry: Number(e.target.value)
                                }
                              }
                            })}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Label htmlFor="humid-wet" className="w-20">Wet 💧</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">&gt;</span>
                          <Input
                            id="humid-wet"
                            type="number"
                            value={settings.thresholds.humidity.icons.wet}
                            onChange={(e) => updateSettings('thresholds', {
                              humidity: {
                                ...settings.thresholds.humidity,
                                icons: {
                                  ...settings.thresholds.humidity.icons,
                                  wet: Number(e.target.value)
                                }
                              }
                            })}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                        Normal range ✅: {settings.thresholds.humidity.icons.dry}% - {settings.thresholds.humidity.icons.wet}%
                      </div>
                    </div>
                  </div>

                  {/* Status Thresholds */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Status Alert Ranges</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Warning Range</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              value={settings.thresholds.humidity.status.warningMin}
                              onChange={(e) => updateSettings('thresholds', {
                                humidity: {
                                  ...settings.thresholds.humidity,
                                  status: {
                                    ...settings.thresholds.humidity.status,
                                    warningMin: Number(e.target.value)
                                  }
                                }
                              })}
                              className="w-16"
                            />
                            <span className="text-sm">-</span>
                            <Input
                              type="number"
                              value={settings.thresholds.humidity.status.warningMax}
                              onChange={(e) => updateSettings('thresholds', {
                                humidity: {
                                  ...settings.thresholds.humidity,
                                  status: {
                                    ...settings.thresholds.humidity.status,
                                    warningMax: Number(e.target.value)
                                  }
                                }
                              })}
                              className="w-16"
                            />
                            <span className="text-sm">%</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm">Critical Range</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              value={settings.thresholds.humidity.status.criticalMin}
                              onChange={(e) => updateSettings('thresholds', {
                                humidity: {
                                  ...settings.thresholds.humidity,
                                  status: {
                                    ...settings.thresholds.humidity.status,
                                    criticalMin: Number(e.target.value)
                                  }
                                }
                              })}
                              className="w-16"
                            />
                            <span className="text-sm">-</span>
                            <Input
                              type="number"
                              value={settings.thresholds.humidity.status.criticalMax}
                              onChange={(e) => updateSettings('thresholds', {
                                humidity: {
                                  ...settings.thresholds.humidity,
                                  status: {
                                    ...settings.thresholds.humidity.status,
                                    criticalMax: Number(e.target.value)
                                  }
                                }
                              })}
                              className="w-16"
                            />
                            <span className="text-sm">%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                        Normal: {settings.thresholds.humidity.status.warningMin + 1}% - {settings.thresholds.humidity.status.warningMax - 1}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                      <Input
                        id="refresh-interval"
                        type="number"
                        value={settings.system.refreshInterval}
                        onChange={(e) => updateSettings('system', {
                          refreshInterval: Number(e.target.value)
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="data-retention">Data Retention (hours)</Label>
                      <Input
                        id="data-retention"
                        type="number"
                        value={settings.system.dataRetentionHours}
                        onChange={(e) => updateSettings('system', {
                          dataRetentionHours: Number(e.target.value)
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-data-points">Max Chart Data Points</Label>
                      <Input
                        id="max-data-points"
                        type="number"
                        value={settings.system.maxDataPoints}
                        onChange={(e) => updateSettings('system', {
                          maxDataPoints: Number(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-refresh">Auto Refresh</Label>
                        <p className="text-sm text-muted-foreground">Automatically refresh data</p>
                      </div>
                      <Switch
                        id="auto-refresh"
                        checked={settings.system.autoRefresh}
                        onCheckedChange={(checked) => updateSettings('system', {
                          autoRefresh: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications">Notifications</Label>
                        <p className="text-sm text-muted-foreground">Show toast notifications</p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={settings.system.notifications}
                        onCheckedChange={(checked) => updateSettings('system', {
                          notifications: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="debug-mode">Debug Mode</Label>
                        <p className="text-sm text-muted-foreground">Show debug information</p>
                      </div>
                      <Switch
                        id="debug-mode"
                        checked={settings.system.debugMode}
                        onCheckedChange={(checked) => updateSettings('system', {
                          debugMode: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-base-url">Base URL</Label>
                  <Input
                    id="api-base-url"
                    value={settings.api.baseUrl}
                    onChange={(e) => updateSettings('api', {
                      baseUrl: e.target.value
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-timeout">Timeout (ms)</Label>
                    <Input
                      id="api-timeout"
                      type="number"
                      value={settings.api.timeout}
                      onChange={(e) => updateSettings('api', {
                        timeout: Number(e.target.value)
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-retry">Retry Attempts</Label>
                    <Input
                      id="api-retry"
                      type="number"
                      value={settings.api.retryAttempts}
                      onChange={(e) => updateSettings('api', {
                        retryAttempts: Number(e.target.value)
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* UI Tab */}
          <TabsContent value="ui" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Interface Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="animation-speed">Animation Speed (ms)</Label>
                      <Input
                        id="animation-speed"
                        type="number"
                        value={settings.ui.animationSpeed}
                        onChange={(e) => updateSettings('ui', {
                          animationSpeed: Number(e.target.value)
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={settings.ui.theme}
                        onValueChange={(value) => updateSettings('ui', {
                          theme: value as 'light' | 'dark' | 'system'
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="compact-mode">Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                      </div>
                      <Switch
                        id="compact-mode"
                        checked={settings.ui.compactMode}
                        onCheckedChange={(checked) => updateSettings('ui', {
                          compactMode: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-debug-info">Show Debug Info</Label>
                        <p className="text-sm text-muted-foreground">Display debug information in UI</p>
                      </div>
                      <Switch
                        id="show-debug-info"
                        checked={settings.ui.showDebugInfo}
                        onCheckedChange={(checked) => updateSettings('ui', {
                          showDebugInfo: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Warning */}
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Developer Settings</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  These settings are for advanced users and developers. Incorrect values may cause system instability or unexpected behavior. 
                  Make sure to backup your settings before making changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
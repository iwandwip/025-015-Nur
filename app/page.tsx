"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Thermometer, 
  Droplets, 
  Power, 
  Wifi, 
  Battery, 
  AlertTriangle,
  Activity,
  Download,
  Settings,
  TrendingUp,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [currentTemp, setCurrentTemp] = useState(23.2);
  const [currentHumidity, setCurrentHumidity] = useState(45.8);
  const [targetTemp, setTargetTemp] = useState(23.0);
  const [isACOn, setIsACOn] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  
  const tempTolerance = 1.0;
  const tempStatus = Math.abs(currentTemp - targetTemp) <= tempTolerance ? "normal" : "warning";
  const humidityStatus = currentHumidity >= 30 && currentHumidity <= 60 ? "normal" : "warning";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp(prev => prev + (Math.random() - 0.5) * 0.2);
      setCurrentHumidity(prev => prev + (Math.random() - 0.5) * 1);
      setLastUpdate(new Date().toLocaleTimeString());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const recentData = [
    { time: "14:55", temp: 23.1, humidity: 45.2, status: "normal" },
    { time: "14:50", temp: 23.3, humidity: 45.5, status: "normal" },
    { time: "14:45", temp: 23.0, humidity: 45.8, status: "normal" },
    { time: "14:40", temp: 22.9, humidity: 46.1, status: "normal" },
    { time: "14:35", temp: 23.2, humidity: 45.9, status: "normal" },
  ];

  const adjustTemp = (increment: boolean) => {
    setTargetTemp(prev => increment ? prev + 0.1 : prev - 0.1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-700">
      
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        
        <header className="text-center py-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    Lab Monitor
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    PT. Hervitama Indonesia
                  </p>
                </div>
              </div>
              
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Real-time Environmental Monitoring System for Calibration Laboratory
                <br />
                <span className="text-sm">ISO/IEC 17025:2017 Compliant</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm border-border/50">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Wifi className="w-4 h-4" />
              System Online
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
              <Battery className="w-4 h-4" />
              PLN Active
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 bg-gray-100 dark:bg-gray-800">
              Updated: {lastUpdate}
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent group-hover:from-blue-400/20 transition-colors duration-500"></div>
            <CardHeader className="pb-3 relative">
              <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                <div className="p-2 bg-blue-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Thermometer className="w-5 h-5 text-white" />
                </div>
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3">
                <div className="text-4xl font-bold text-blue-900 dark:text-blue-100 group-hover:scale-105 transition-transform duration-300">
                  {currentTemp.toFixed(1)}°C
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant={tempStatus === "normal" ? "default" : "destructive"}
                    className="text-xs font-medium shadow-sm"
                  >
                    {tempStatus === "normal" ? "✓ Normal" : "⚠ Warning"}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Target: {targetTemp.toFixed(1)}°C ±{tempTolerance}°C
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/50 dark:to-cyan-800/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent group-hover:from-cyan-400/20 transition-colors duration-500"></div>
            <CardHeader className="pb-3 relative">
              <CardTitle className="flex items-center gap-3 text-cyan-700 dark:text-cyan-300">
                <div className="p-2 bg-cyan-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                Humidity
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3">
                <div className="text-4xl font-bold text-cyan-900 dark:text-cyan-100 group-hover:scale-105 transition-transform duration-300">
                  {currentHumidity.toFixed(1)}%
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant={humidityStatus === "normal" ? "default" : "destructive"}
                    className="text-xs font-medium shadow-sm"
                  >
                    {humidityStatus === "normal" ? "✓ Normal" : "⚠ Warning"}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Range: 30-60%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/50 dark:to-emerald-800/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent group-hover:from-green-400/20 transition-colors duration-500"></div>
            <CardHeader className="pb-3 relative">
              <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 bg-green-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Power className="w-5 h-5 text-white" />
                </div>
                AC Status
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3">
                <div className="text-3xl font-bold text-green-900 dark:text-green-100 group-hover:scale-105 transition-transform duration-300">
                  {isACOn ? "ACTIVE" : "STANDBY"}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant={isACOn ? "default" : "secondary"}
                    className="text-xs font-medium shadow-sm"
                  >
                    {isACOn ? "🟢 Running" : "⚫ Stopped"}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Auto Mode
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/50 dark:to-pink-800/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent group-hover:from-purple-400/20 transition-colors duration-500"></div>
            <CardHeader className="pb-3 relative">
              <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
                <div className="p-2 bg-purple-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3">
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 group-hover:scale-105 transition-transform duration-300">
                  OPTIMAL
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="default" className="text-xs font-medium shadow-sm">
                    ✅ All Systems OK
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          <Card className="xl:col-span-2 hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader className="border-b border-gray-200/50 dark:border-gray-700/50">
              <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
                <TrendingUp className="w-6 h-6 text-indigo-500" />
                Recent Measurements
                <Badge variant="secondary" className="ml-auto text-xs">
                  Live Data
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {recentData.map((data, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {data.time.split(':')[1]}
                      </div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{data.time}</span>
                    </div>
                    <div className="flex gap-6">
                      <span className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                        <Thermometer className="w-4 h-4" />
                        {data.temp}°C
                      </span>
                      <span className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-medium">
                        <Droplets className="w-4 h-4" />
                        {data.humidity}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader className="border-b border-gray-200/50 dark:border-gray-700/50">
              <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
                <Settings className="w-6 h-6 text-indigo-500" />
                Control Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Target Temperature
                </label>
                <div className="flex items-center justify-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => adjustTemp(false)}
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors duration-300"
                  >
                    -
                  </Button>
                  <div className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 rounded-xl text-center min-w-[80px] font-bold text-lg border border-indigo-200 dark:border-indigo-700">
                    {targetTemp.toFixed(1)}°C
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => adjustTemp(true)}
                    className="hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors duration-300"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  AC Control
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant={isACOn ? "default" : "outline"} 
                    onClick={() => setIsACOn(true)}
                    className="transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    ON
                  </Button>
                  <Button 
                    variant={!isACOn ? "default" : "outline"} 
                    onClick={() => setIsACOn(false)}
                    className="transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    OFF
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data Log
                </Button>
                <Button variant="outline" className="w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300">
                  View Historical Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-xl">
          <CardHeader className="border-b border-green-200/50 dark:border-green-700/50">
            <CardTitle className="flex items-center gap-3 text-green-800 dark:text-green-200">
              <Shield className="w-6 h-6" />
              ISO/IEC 17025:2017 Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-green-200/50 dark:border-green-700/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">✓</div>
                <div className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">Temperature Control</div>
                <div className="text-sm text-green-600 dark:text-green-400">18-27°C Range Maintained</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Compliance: 100%</div>
              </div>
              <div className="group text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-green-200/50 dark:border-green-700/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">✓</div>
                <div className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">Data Integrity</div>
                <div className="text-sm text-green-600 dark:text-green-400">Continuous Logging Active</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Uptime: 99.9%</div>
              </div>
              <div className="group text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-green-200/50 dark:border-green-700/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">✓</div>
                <div className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">Alert System</div>
                <div className="text-sm text-green-600 dark:text-green-400">Real-time Monitoring</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Response: &lt; 1s</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
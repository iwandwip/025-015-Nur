"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Thermometer, 
  Droplets, 
  Wifi, 
  Activity,
  Download,
  Settings,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from 'next/dynamic';

// Lazy load chart component
const MonitoringChart = dynamic(() => import('@/components/monitoring-chart'), { 
  ssr: false,
  loading: () => <div className="h-80 w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded"></div>
});
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function Dashboard() {
  const [currentTemp, setCurrentTemp] = useState(23.2);
  const [currentHumidity, setCurrentHumidity] = useState(45.8);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/measurements?limit=20');
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        setTableData(result.data);
        
        // Prepare chart data from the last 10 measurements
        const chartItems = result.data.slice(0, 10).reverse().map((item: any) => ({
          time: format(new Date(item.createdAt), "HH:mm"),
          temperature: item.temperature,
          humidity: item.humidity
        }));
        setChartData(chartItems);
        
        // Set current values from the most recent measurement
        const latest = result.data[0];
        setCurrentTemp(latest.temperature);
        setCurrentHumidity(latest.humidity);
        setLastUpdate(format(new Date(latest.createdAt), "HH:mm:ss"));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Reduce interval to 30 seconds for less DB load
    const interval = setInterval(async () => {
      const newTemp = 23 + (Math.random() - 0.5) * 1;
      const newHumidity = 45 + (Math.random() - 0.5) * 5;
      
      // Save to database
      try {
        const response = await fetch('/api/measurements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            temperature: Number(newTemp.toFixed(1)),
            humidity: Number(newHumidity.toFixed(1)),
            deviceId: 'demo-device' // Add required deviceId
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          const savedMeasurement = result.data;
          
          setCurrentTemp(savedMeasurement.temperature);
          setCurrentHumidity(savedMeasurement.humidity);
          setLastUpdate(format(new Date(savedMeasurement.createdAt), "HH:mm:ss"));
          
          // Update chart data
          setChartData(prev => {
            const newData = [...prev.slice(-9), {
              time: format(new Date(savedMeasurement.createdAt), "HH:mm"),
              temperature: savedMeasurement.temperature,
              humidity: savedMeasurement.humidity
            }];
            return newData;
          });
          
          // Update table data
          setTableData(prev => [savedMeasurement, ...prev.slice(0, 19)]);
        }
      } catch (error) {
        console.error('Error saving measurement:', error);
      }
    }, 30000); // Changed from 5000 to 30000 (30 seconds)

    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        <header className="py-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-lg">
                  <Activity className="w-6 h-6 text-white dark:text-gray-900" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Lab Monitor
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    PT. Hervitama Indonesia
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Wifi className="w-3 h-3" />
                Online
              </Badge>
              <ThemeToggle />
              <Button variant="outline" size="icon" className="border-gray-300 dark:border-gray-700">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <Thermometer className="w-5 h-5" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {currentTemp.toFixed(1)}°C
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last update: {lastUpdate}
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <Droplets className="w-5 h-5" />
                Humidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {currentHumidity.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last update: {lastUpdate}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <TrendingUp className="w-5 h-5" />
              Real-time Monitoring Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <MonitoringChart data={chartData} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Calendar className="w-5 h-5" />
                Measurement History
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-300 dark:border-gray-700"
                onClick={() => {
                  window.location.href = '/api/measurements/export';
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Time</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Temperature (°C)</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Humidity (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-gray-900 dark:text-gray-100">
                        {format(new Date(row.createdAt), "HH:mm:ss")}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {format(new Date(row.createdAt), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100">
                        {row.temperature}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100">
                        {row.humidity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
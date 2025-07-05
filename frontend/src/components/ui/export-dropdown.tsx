import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileText, FileSpreadsheet, FileJson, Image, Loader2 } from 'lucide-react'
import { DataExporter } from '@/lib/exportUtils'
import type { SensorData } from '@/types/sensor'
import { toast } from 'sonner'

interface ExportDropdownProps {
  data: SensorData[]
  filename?: string
  timeFilter?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
}

export function ExportDropdown({ 
  data, 
  filename = 'sensor-data',
  timeFilter = '',
  size = 'sm',
  variant = 'outline'
}: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)

  const handleExport = async (format: string) => {
    if (data.length === 0) {
      toast.error('No data to export')
      return
    }

    setIsExporting(format)
    
    try {
      const options = {
        filename,
        timeFilter,
        includeCharts: format === 'pdf'
      }

      switch (format) {
        case 'csv':
          await DataExporter.exportToCSV(data, options)
          toast.success('CSV file downloaded successfully')
          break
        case 'xlsx':
          await DataExporter.exportToXLSX(data, options)
          toast.success('Excel file downloaded successfully')
          break
        case 'json':
          await DataExporter.exportToJSON(data, options)
          toast.success('JSON file downloaded successfully')
          break
        case 'pdf':
          await DataExporter.exportToPDF(data, options)
          toast.success('PDF report downloaded successfully')
          break
        default:
          throw new Error('Unsupported format')
      }
    } catch (error) {
      console.error('Export failed:', error)
      toast.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExporting(null)
    }
  }

  const exportOptions = [
    {
      format: 'csv',
      label: 'CSV File',
      description: 'Comma-separated values',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      format: 'xlsx',
      label: 'Excel File',
      description: 'Microsoft Excel format',
      icon: FileSpreadsheet,
      color: 'text-green-700'
    },
    {
      format: 'json',
      label: 'JSON File',
      description: 'JavaScript Object Notation',
      icon: FileJson,
      color: 'text-blue-600'
    },
    {
      format: 'pdf',
      label: 'PDF Report',
      description: 'Formatted report with charts',
      icon: FileText,
      color: 'text-red-600'
    }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={!!isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          <span className="hidden sm:inline">
            {isExporting ? 'Exporting...' : 'Export'}
          </span>
          <span className="sm:hidden">
            {isExporting ? '...' : 'Export'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Data ({data.length} records)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {exportOptions.map((option) => {
          const Icon = option.icon
          const isLoading = isExporting === option.format
          
          return (
            <DropdownMenuItem
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={!!isExporting}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className={`h-4 w-4 ${option.color}`} />
                )}
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          )
        })}
        {timeFilter && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs text-muted-foreground">
              Filter: {timeFilter}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
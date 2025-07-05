import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'
import { format, parseISO } from 'date-fns'
import type { SensorData } from '@/types/sensor'

export interface ExportOptions {
  filename?: string
  timeFilter?: string
  includeCharts?: boolean
}

export class DataExporter {
  static async exportToJSON(data: SensorData[], options: ExportOptions = {}) {
    const { filename = 'sensor-data', timeFilter = '' } = options
    
    const exportData = {
      exportDate: new Date().toISOString(),
      timeFilter,
      totalRecords: data.length,
      data: data.map(item => ({
        timestamp: item.timestamp,
        temperature: item.temperature,
        humidity: item.humidity,
        status: item.status
      }))
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    
    this.downloadFile(blob, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.json`)
  }

  static async exportToCSV(data: SensorData[], options: ExportOptions = {}) {
    const { filename = 'sensor-data' } = options
    
    const headers = ['No', 'Timestamp', 'Date', 'Time', 'Temperature (°C)', 'Humidity (%)', 'Status']
    const rows = data.map((item, index) => [
      index + 1,
      item.timestamp,
      format(parseISO(item.timestamp), 'yyyy-MM-dd'),
      format(parseISO(item.timestamp), 'HH:mm:ss'),
      item.temperature,
      item.humidity,
      item.status
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    this.downloadFile(blob, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`)
  }

  static async exportToXLSX(data: SensorData[], options: ExportOptions = {}) {
    const { filename = 'sensor-data', timeFilter = '' } = options
    
    // Create a new workbook
    const wb = XLSX.utils.book_new()
    
    // Prepare data for the main sheet
    const wsData = [
      ['Smart AC Control - Sensor Data Export'],
      ['Export Date:', format(new Date(), 'yyyy-MM-dd HH:mm:ss')],
      ['Time Filter:', timeFilter || 'All Data'],
      ['Total Records:', data.length],
      [''],
      ['No', 'Timestamp', 'Date', 'Time', 'Temperature (°C)', 'Humidity (%)', 'Status'],
      ...data.map((item, index) => [
        index + 1,
        item.timestamp,
        format(parseISO(item.timestamp), 'yyyy-MM-dd'),
        format(parseISO(item.timestamp), 'HH:mm:ss'),
        item.temperature,
        item.humidity,
        item.status
      ])
    ]

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    
    // Set column widths
    ws['!cols'] = [
      { width: 8 },  // No
      { width: 25 }, // Timestamp
      { width: 15 }, // Date
      { width: 12 }, // Time
      { width: 18 }, // Temperature
      { width: 15 }, // Humidity
      { width: 12 }  // Status
    ]

    // Style the header
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 5, c: C })
      if (!ws[cellAddress]) continue
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "FFFFAA00" } }
      }
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sensor Data')

    // Create summary sheet
    const summaryData = this.generateSummaryData(data)
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')

    // Write file
    XLSX.writeFile(wb, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
  }

  static async exportToPDF(data: SensorData[], options: ExportOptions = {}) {
    const { filename = 'sensor-data', timeFilter = '', includeCharts = false } = options
    
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.width
    
    // Title
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Smart AC Control - Sensor Data Report', pageWidth / 2, 20, { align: 'center' })
    
    // Metadata
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Export Date: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`, 20, 35)
    pdf.text(`Time Filter: ${timeFilter || 'All Data'}`, 20, 42)
    pdf.text(`Total Records: ${data.length}`, 20, 49)

    // Summary statistics
    const summary = this.calculateSummary(data)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Summary Statistics:', 20, 65)
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Average Temperature: ${summary.avgTemp}°C`, 25, 75)
    pdf.text(`Average Humidity: ${summary.avgHumidity}%`, 25, 82)
    pdf.text(`Temperature Range: ${summary.minTemp}°C - ${summary.maxTemp}°C`, 25, 89)
    pdf.text(`Humidity Range: ${summary.minHumidity}% - ${summary.maxHumidity}%`, 25, 96)

    // Data table
    const tableData = data.map((item, index) => [
      index + 1,
      format(parseISO(item.timestamp), 'yyyy-MM-dd'),
      format(parseISO(item.timestamp), 'HH:mm:ss'),
      `${item.temperature}°C`,
      `${item.humidity}%`,
      item.status
    ])

    autoTable(pdf, {
      head: [['No', 'Date', 'Time', 'Temperature', 'Humidity', 'Status']],
      body: tableData,
      startY: 110,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 110 }
    })

    // Include chart if requested
    if (includeCharts) {
      await this.addChartsToPDF(pdf)
    }

    pdf.save(`${filename}-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }

  private static generateSummaryData(data: SensorData[]) {
    const summary = this.calculateSummary(data)
    
    return [
      ['Smart AC Control - Data Summary'],
      [''],
      ['Metric', 'Value'],
      ['Total Records', data.length],
      ['Average Temperature', `${summary.avgTemp}°C`],
      ['Average Humidity', `${summary.avgHumidity}%`],
      ['Min Temperature', `${summary.minTemp}°C`],
      ['Max Temperature', `${summary.maxTemp}°C`],
      ['Min Humidity', `${summary.minHumidity}%`],
      ['Max Humidity', `${summary.maxHumidity}%`],
      ['Normal Status Count', summary.normalCount],
      ['Warning Status Count', summary.warningCount],
      ['Critical Status Count', summary.criticalCount]
    ]
  }

  private static calculateSummary(data: SensorData[]) {
    if (data.length === 0) {
      return {
        avgTemp: 0, avgHumidity: 0,
        minTemp: 0, maxTemp: 0,
        minHumidity: 0, maxHumidity: 0,
        normalCount: 0, warningCount: 0, criticalCount: 0
      }
    }

    const temperatures = data.map(d => d.temperature)
    const humidity = data.map(d => d.humidity)
    
    return {
      avgTemp: Number((temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)),
      avgHumidity: Number((humidity.reduce((a, b) => a + b, 0) / humidity.length).toFixed(1)),
      minTemp: Math.min(...temperatures),
      maxTemp: Math.max(...temperatures),
      minHumidity: Math.min(...humidity),
      maxHumidity: Math.max(...humidity),
      normalCount: data.filter(d => d.status === 'normal').length,
      warningCount: data.filter(d => d.status === 'warning').length,
      criticalCount: data.filter(d => d.status === 'critical').length
    }
  }

  private static async addChartsToPDF(pdf: jsPDF) {
    // Try to capture chart elements
    const chartElements = document.querySelectorAll('[data-chart]')
    
    for (let i = 0; i < chartElements.length; i++) {
      const element = chartElements[i] as HTMLElement
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2
        })
        
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 180
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        pdf.addPage()
        pdf.text(`Chart ${i + 1}`, 20, 20)
        pdf.addImage(imgData, 'PNG', 15, 30, imgWidth, imgHeight)
      } catch (error) {
        console.warn('Failed to capture chart:', error)
      }
    }
  }

  private static downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
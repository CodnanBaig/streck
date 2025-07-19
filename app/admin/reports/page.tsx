"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Filter,
  RefreshCw,
  Loader2,
  BarChart3
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminReports() {
  const { toast } = useToast()
  const [exporting, setExporting] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'all',
    reportType: 'all'
  })
  
  // Fetch stats on component mount
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/analytics?timeRange=30d')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const reportTypes = [
    {
      title: "Sales Report",
      description: "Comprehensive sales data with product details, quantities, and revenue",
      icon: DollarSign,
      color: "bg-green-500",
      type: "sales",
      fields: ["Date", "Order Number", "Customer", "Product", "Quantity", "Price", "Total"]
    },
    {
      title: "Orders Report", 
      description: "Complete order information with customer details and status tracking",
      icon: ShoppingCart,
      color: "bg-blue-500",
      type: "orders",
      fields: ["Order Number", "Customer", "Status", "Payment", "Total", "Items"]
    },
    {
      title: "Customer Report",
      description: "Customer database with order history and spending analysis",
      icon: Users,
      color: "bg-purple-500",
      type: "customers",
      fields: ["Name", "Email", "Phone", "Orders", "Total Spent", "Status"]
    },
    {
      title: "Product Report",
      description: "Product catalog with pricing, inventory, and performance metrics",
      icon: Package,
      color: "bg-orange-500",
      type: "products",
      fields: ["Name", "Category", "Product Type", "Price", "Stock", "Status", "Rating", "Sizes", "Colors", "Image Links"]
    }
  ]

  const handleExport = async (reportType: string) => {
    try {
      setExporting(reportType)
      const response = await fetch('/api/admin/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          filters: {
            startDate: filters.startDate,
            endDate: filters.endDate,
            status: filters.status === 'all' ? undefined : filters.status
          }
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || `${reportType}-report.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast({
          title: "Success!",
          description: `${reportType} report downloaded successfully!`,
        })
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export report",
      })
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-2">Generate and download business reports in CSV format</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchStats} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{stats.revenue.current.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.orders.current}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.customers.total}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.conversion.current}%</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-full ${report.color} text-white`}>
                      <report.icon className="w-6 h-6" />
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
                    <div className="flex flex-wrap gap-1">
                      {report.fields.map((field, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleExport(report.type)}
                    disabled={exporting === report.type}
                  >
                    {exporting === report.type ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {exporting === report.type ? "Exporting..." : "Export CSV"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Usage Guide */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Set Filters (Optional)</h4>
                  <p className="text-sm text-gray-600">Use the filters above to narrow down your data by date range and status.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Choose Report Type</h4>
                  <p className="text-sm text-gray-600">Select the type of report you need from the available options above.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Export CSV</h4>
                  <p className="text-sm text-gray-600">Click the "Export CSV" button to download your report. The file will be automatically saved to your downloads folder.</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Sales reports include detailed product-level data for analysis</li>
                  <li>• Customer reports show order history and spending patterns</li>
                  <li>• Use date filters to focus on specific time periods</li>
                  <li>• CSV files can be opened in Excel, Google Sheets, or any spreadsheet software</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
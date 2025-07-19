"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  RefreshCw
} from "lucide-react"

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  
  const reportTypes = [
    {
      title: "Sales Report",
      description: "Comprehensive sales data and trends",
      icon: DollarSign,
      color: "bg-green-500",
      lastGenerated: "2 hours ago",
      status: "ready"
    },
    {
      title: "Orders Report", 
      description: "Order status, fulfillment, and delivery metrics",
      icon: ShoppingCart,
      color: "bg-blue-500",
      lastGenerated: "1 day ago",
      status: "ready"
    },
    {
      title: "Customer Report",
      description: "Customer demographics and behavior analysis",
      icon: Users,
      color: "bg-purple-500",
      lastGenerated: "3 hours ago",
      status: "ready"
    },
    {
      title: "Product Performance",
      description: "Best sellers, inventory, and product insights",
      icon: Package,
      color: "bg-orange-500",
      lastGenerated: "5 hours ago",
      status: "ready"
    },
    {
      title: "Financial Summary",
      description: "Revenue, expenses, and profit analysis",
      icon: TrendingUp,
      color: "bg-indigo-500",
      lastGenerated: "Generating...",
      status: "processing"
    },
    {
      title: "Marketing Report",
      description: "Campaign performance and ROI metrics",
      icon: FileText,
      color: "bg-pink-500",
      lastGenerated: "Never",
      status: "pending"
    }
  ]

  const quickStats = [
    {
      label: "Total Reports Generated",
      value: "1,247",
      change: "+12%",
      period: "This month"
    },
    {
      label: "Most Downloaded",
      value: "Sales Report",
      change: "156 downloads",
      period: "This month"
    },
    {
      label: "Automated Reports",
      value: "8",
      change: "Active",
      period: "Running daily"
    },
    {
      label: "Storage Used",
      value: "2.4 GB",
      change: "67% of limit",
      period: "Total usage"
    }
  ]

  const recentReports = [
    {
      name: "Monthly Sales Summary - January 2024",
      type: "Sales",
      size: "2.4 MB",
      generated: "2024-01-31 09:15 AM",
      downloads: 23
    },
    {
      name: "Customer Acquisition Report - Q4 2023",
      type: "Customer",
      size: "1.8 MB", 
      generated: "2024-01-30 02:30 PM",
      downloads: 15
    },
    {
      name: "Product Performance - January 2024",
      type: "Product",
      size: "3.1 MB",
      generated: "2024-01-29 11:45 AM",
      downloads: 31
    },
    {
      name: "Orders Fulfillment Report - Week 4",
      type: "Orders",
      size: "1.2 MB",
      generated: "2024-01-28 04:20 PM",
      downloads: 8
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-2">Generate and download business reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-green-600">{stat.change}</span>
                    <span className="text-xs text-gray-500">{stat.period}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Types */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-full ${report.color} text-white`}>
                      <report.icon className="w-6 h-6" />
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Last generated: {report.lastGenerated}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={report.status === "processing"}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {report.status === "processing" ? "Generating..." : "Generate"}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Report Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Generated</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Downloads</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentReports.map((report, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{report.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{report.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{report.size}</td>
                      <td className="py-3 px-4 text-gray-600">{report.generated}</td>
                      <td className="py-3 px-4 text-gray-600">{report.downloads}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
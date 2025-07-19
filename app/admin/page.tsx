"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingBag, 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  FileText,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  pendingOrders: number
  lowStockProducts: number
  recentOrders: Array<{
    id: number
    orderNumber: string
    customerName: string
    total: number
    status: string
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    recentOrders: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Fetch orders
      const ordersResponse = await fetch('/api/orders')
      const orders = ordersResponse.ok ? await ordersResponse.json() : []
      
      // Fetch products
      const productsResponse = await fetch('/api/products')
      const products = productsResponse.ok ? await productsResponse.json() : []
      
      // Calculate stats
      const totalOrders = orders.length
      const totalRevenue = orders
        .filter((order: any) => order.status !== 'cancelled')
        .reduce((sum: number, order: any) => sum + order.total, 0)
      const pendingOrders = orders.filter((order: any) => order.status === 'pending').length
      const totalProducts = products.length
      const lowStockProducts = products.filter((product: any) => !product.inStock).length
      
      // Get recent orders (last 5)
      const recentOrders = orders
        .slice(0, 5)
        .map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt
        }))

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers: 892, // Mock data for now
        pendingOrders,
        lowStockProducts,
        recentOrders
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      processing: { color: "bg-blue-100 text-blue-800", label: "Processing" },
      shipped: { color: "bg-purple-100 text-purple-800", label: "Shipped" },
      delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const adminModules = [
    {
      title: "Products",
      description: "Manage your product catalog",
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-500",
      count: stats.totalProducts
    },
    {
      title: "Orders",
      description: "View and manage customer orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-green-500",
      count: stats.totalOrders
    },
    {
      title: "Customers",
      description: "Manage customer information",
      icon: Users,
      href: "/admin/customers",
      color: "bg-purple-500",
      count: stats.totalCustomers
    },
    {
      title: "Categories",
      description: "Organize your product categories",
      icon: ShoppingBag,
      href: "/admin/categories",
      color: "bg-orange-500"
    },
    {
      title: "Analytics",
      description: "View sales and performance data",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-indigo-500"
    },
    {
      title: "Reports",
      description: "Generate business reports",
      icon: FileText,
      href: "/admin/reports",
      color: "bg-red-500"
    },
    {
      title: "Settings",
      description: "Configure your store settings",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500"
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your STRECK store operations</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
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
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Pending Orders</p>
                    <p className="text-2xl font-bold text-yellow-900">{stats.pendingOrders}</p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                    Action Required
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-800">Low Stock Products</p>
                    <p className="text-2xl font-bold text-red-900">{stats.lowStockProducts}</p>
                  </div>
                  <Badge variant="secondary" className="bg-red-200 text-red-800">
                    Restock Needed
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Delivered Orders</p>
                    <p className="text-2xl font-bold text-green-900">
                      {stats.recentOrders.filter(order => order.status === 'delivered').length}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-200 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Success
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          {stats.recentOrders.length > 0 && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">{order.customerName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <p className="font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                          {getStatusBadge(order.status)}
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/admin/orders">
                      <Button variant="outline">
                        View All Orders
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Admin Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {adminModules.map((module) => (
              <Link key={module.title} href={module.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${module.color} text-white`}>
                        <module.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600">{module.description}</p>
                        {module.count && (
                          <p className="text-xs text-gray-500 mt-1">{module.count} items</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
  )
} 
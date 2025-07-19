import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/admin/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d' // 7d, 30d, 90d, 1y

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get current period data
    const currentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        },
        status: {
          not: 'cancelled'
        }
      },
      select: {
        total: true,
        status: true,
        createdAt: true
      }
    })

    // Get previous period data for comparison
    const previousStartDate = new Date(startDate)
    const previousEndDate = new Date(startDate)
    previousStartDate.setTime(startDate.getTime() - (now.getTime() - startDate.getTime()))

    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousStartDate,
          lte: previousEndDate
        },
        status: {
          not: 'cancelled'
        }
      },
      select: {
        total: true,
        status: true,
        createdAt: true
      }
    })

    // Calculate metrics
    const currentRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0)
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0)
    const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0

    const currentOrderCount = currentOrders.length
    const previousOrderCount = previousOrders.length
    const orderChange = previousOrderCount > 0 ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 : 0

    // Get customer metrics
    const currentCustomers = await prisma.customer.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        }
      }
    })

    const previousCustomers = await prisma.customer.count({
      where: {
        createdAt: {
          gte: previousStartDate,
          lte: previousEndDate
        }
      }
    })

    const customerChange = previousCustomers > 0 ? ((currentCustomers - previousCustomers) / previousCustomers) * 100 : 0

    // Get total customers and conversion rate
    const totalCustomers = await prisma.customer.count()
    const totalOrders = await prisma.order.count({
      where: {
        status: {
          not: 'cancelled'
        }
      }
    })
    const conversionRate = totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0

    // Get top products by revenue
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productName'],
      _sum: {
        total: true,
        quantity: true
      },
      orderBy: {
        _sum: {
          total: 'desc'
        }
      },
      take: 5
    })

    // Get top categories
    const topCategories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    })

    // Get recent activity
    const recentActivity = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true
      }
    })

    // Get order status distribution
    const orderStatusDistribution = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Get daily revenue for chart
    const dailyRevenue = await prisma.order.groupBy({
      by: ['createdAt'],
      _sum: {
        total: true
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        },
        status: {
          not: 'cancelled'
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        change: Math.round(revenueChange * 100) / 100
      },
      orders: {
        current: currentOrderCount,
        previous: previousOrderCount,
        change: Math.round(orderChange * 100) / 100
      },
      customers: {
        current: currentCustomers,
        previous: previousCustomers,
        change: Math.round(customerChange * 100) / 100,
        total: totalCustomers
      },
      conversion: {
        current: Math.round(conversionRate * 100) / 100,
        previous: 0, // Would need historical data for this
        change: 0
      },
      topProducts: topProducts.map(product => ({
        name: product.productName,
        sales: product._sum.quantity || 0,
        revenue: product._sum.total || 0
      })),
      topCategories: topCategories.map(category => ({
        name: category.category,
        products: category._count.id,
        sales: 0 // Would need to calculate from orders
      })),
      recentActivity: recentActivity.map(activity => ({
        action: "New order",
        details: `${activity.orderNumber} - ${activity.customerName}`,
        time: activity.createdAt,
        amount: activity.total
      })),
      orderStatusDistribution,
      dailyRevenue: dailyRevenue.map(day => ({
        date: day.createdAt,
        revenue: day._sum.total || 0
      })),
      timeRange
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
} 
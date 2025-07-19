import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/customers - List all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Get customers from the Customer table
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder as 'asc' | 'desc'
      }
    })

    // Process customers with order statistics
    let processedCustomers = customers.map(customer => {
      const totalOrders = customer.orders.length
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)
      const recentOrder = customer.orders.find(order => 
        new Date(order.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      )
      
      // Calculate status if not set
      let calculatedStatus = customer.status
      if (customer.status === 'active') {
        if (totalOrders === 1 && !recentOrder) {
          calculatedStatus = 'new'
        } else if (totalSpent > 10000) {
          calculatedStatus = 'vip'
        } else if (!recentOrder) {
          calculatedStatus = 'inactive'
        }
      }

      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        status: calculatedStatus,
        notes: customer.notes,
        totalOrders,
        totalSpent,
        joinDate: customer.createdAt,
        lastOrderDate: customer.orders.length > 0 
          ? customer.orders.reduce((latest, order) => 
              new Date(order.updatedAt) > new Date(latest) ? order.updatedAt : latest, 
              customer.orders[0].updatedAt
            )
          : customer.createdAt
      }
    })

    // Apply search filter
    if (search) {
      processedCustomers = processedCustomers.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply status filter
    if (status && status !== 'all') {
      processedCustomers = processedCustomers.filter(customer => customer.status === status)
    }

    return NextResponse.json(processedCustomers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      email,
      phone,
      address,
      status = 'active',
      notes
    } = body

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      )
    }

    // Check if customer already exists (by email)
    const existingCustomer = await prisma.customer.findUnique({
      where: { email }
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 400 }
      )
    }

    // Create new customer
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        status,
        notes
      }
    })

    return NextResponse.json({
      message: 'Customer created successfully',
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        status: customer.status,
        notes: customer.notes,
        joinDate: customer.createdAt,
        totalOrders: 0,
        totalSpent: 0
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
} 
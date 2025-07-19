import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/customers/[id] - Get single customer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid customer ID' },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Calculate customer statistics
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

    const customerData = {
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
        : customer.createdAt,
      orders: customer.orders
    }

    return NextResponse.json(customerData)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}

// PUT /api/customers/[id] - Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid customer ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    const {
      name,
      email,
      phone,
      address,
      status,
      notes
    } = body

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingCustomer.email) {
      const emailExists = await prisma.customer.findUnique({
        where: { email }
      })
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    const customer = await prisma.customer.update({
      where: { id },
      data: updateData,
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })

    // Calculate updated statistics
    const totalOrders = customer.orders.length
    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)

    const customerData = {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
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

    return NextResponse.json({
      message: 'Customer updated successfully',
      customer: customerData
    })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

// DELETE /api/customers/[id] - Delete customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid customer ID' },
        { status: 400 }
      )
    }

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true
      }
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Check if customer has orders
    if (existingCustomer.orders.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete customer with existing orders' },
        { status: 400 }
      )
    }

    await prisma.customer.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Customer deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    )
  }
} 
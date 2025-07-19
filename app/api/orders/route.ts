import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/orders - List all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const customerEmail = searchParams.get('customerEmail')
    const includeItems = searchParams.get('includeItems')

    const where: any = {}
    
    if (status) where.status = status
    if (paymentStatus) where.paymentStatus = paymentStatus
    if (customerEmail) where.customerEmail = customerEmail

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: includeItems === 'true' ? true : false,
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    })

    // Format response with item count
    const formattedOrders = orders.map(order => ({
      ...order,
      itemCount: order._count.items,
      _count: undefined
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod,
      shippingAddress
    } = body

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, customerPhone, customerAddress, items' },
        { status: 400 }
      )
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    // Generate order number
    const lastOrder = await prisma.order.findFirst({
      orderBy: { id: 'desc' }
    })

    const lastOrderNumber = lastOrder?.orderNumber || '#ORD-000'
    const lastNumber = parseInt(lastOrderNumber.replace('#ORD-', ''))
    const newOrderNumber = `#ORD-${String(lastNumber + 1).padStart(3, '0')}`

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber: newOrderNumber,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        subtotal: parseFloat(subtotal) || 0,
        tax: parseFloat(tax) || 0,
        shipping: parseFloat(shipping) || 0,
        total: parseFloat(total) || 0,
        paymentMethod: paymentMethod || 'COD',
        shippingAddress: shippingAddress || customerAddress,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            productPrice: parseFloat(item.productPrice),
            quantity: parseInt(item.quantity),
            total: parseFloat(item.total),
            productImage: item.productImage || '',
            productSize: item.productSize || null,
            productColor: item.productColor || null
          }))
        }
      },
      include: {
        items: true,
        _count: {
          select: {
            items: true
          }
        }
      }
    })

    // Format response
    const formattedOrder = {
      ...order,
      itemCount: order._count.items,
      _count: undefined
    }

    return NextResponse.json(formattedOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Order number already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
} 
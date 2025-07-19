import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/admin/reports/export - Export data to CSV
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reportType, filters = {} } = body

    let csvData = ''
    let filename = ''

    switch (reportType) {
      case 'orders':
        csvData = await generateOrdersCSV(filters)
        filename = `orders-report-${new Date().toISOString().split('T')[0]}.csv`
        break
      
      case 'products':
        csvData = await generateProductsCSV(filters)
        filename = `products-report-${new Date().toISOString().split('T')[0]}.csv`
        break
      
      case 'customers':
        csvData = await generateCustomersCSV(filters)
        filename = `customers-report-${new Date().toISOString().split('T')[0]}.csv`
        break
      
      case 'sales':
        csvData = await generateSalesCSV(filters)
        filename = `sales-report-${new Date().toISOString().split('T')[0]}.csv`
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        )
    }

    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error generating CSV report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

async function generateOrdersCSV(filters: any) {
  const where: any = {}
  
  if (filters.status) where.status = filters.status
  if (filters.startDate) where.createdAt = { gte: new Date(filters.startDate) }
  if (filters.endDate) where.createdAt = { ...where.createdAt, lte: new Date(filters.endDate) }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
      customer: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const headers = [
    'Order Number',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Status',
    'Payment Status',
    'Payment Method',
    'Subtotal',
    'Tax',
    'Shipping',
    'Total',
    'Items Count',
    'Created Date',
    'Updated Date'
  ].join(',')

  const rows = orders.map(order => [
    order.orderNumber,
    `"${order.customerName.replace(/"/g, '""')}"`,
    order.customerEmail,
    order.customerPhone,
    order.status,
    order.paymentStatus,
    order.paymentMethod,
    order.subtotal,
    order.tax,
    order.shipping,
    order.total,
    order.items.length,
    order.createdAt.toISOString(),
    order.updatedAt.toISOString()
  ].join(','))

  return [headers, ...rows].join('\n')
}

async function generateProductsCSV(filters: any) {
  const where: any = {}
  
  if (filters.status) where.status = filters.status
  if (filters.category) where.category = filters.category
  if (filters.productType) where.productType = filters.productType

  const products = await prisma.product.findMany({
    where,
    include: {
      categoryRef: true,
      productTypeRef: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const headers = [
    'ID',
    'Name',
    'Description',
    'Category',
    'Product Type',
    'Price',
    'Original Price',
    'Rating',
    'Reviews',
    'In Stock',
    'Status',
    'Featured',
    'Sizes',
    'Colors',
    'Images Count',
    'Image Links',
    'Created Date',
    'Updated Date'
  ].join(',')

  const rows = products.map(product => {
    // Parse JSON fields with error handling
    let sizes: string[] = []
    let colors: string[] = []
    let images: string[] = []
    
    try {
      sizes = JSON.parse(product.sizes || '[]')
    } catch (e) {
      console.warn(`Failed to parse sizes for product ${product.id}:`, e)
    }
    
    try {
      colors = JSON.parse(product.colors || '[]')
    } catch (e) {
      console.warn(`Failed to parse colors for product ${product.id}:`, e)
    }
    
    try {
      images = JSON.parse(product.images || '[]')
    } catch (e) {
      console.warn(`Failed to parse images for product ${product.id}:`, e)
    }
    
    return [
      product.id,
      `"${product.name.replace(/"/g, '""')}"`,
      `"${(product.description || '').replace(/"/g, '""')}"`,
      `"${(product.categoryRef?.name || product.category || '').replace(/"/g, '""')}"`,
      `"${(product.productTypeRef?.name || product.productType || '').replace(/"/g, '""')}"`,
      product.price,
      product.originalPrice || '',
      product.rating,
      product.reviews,
      product.inStock,
      product.status,
      product.featured,
      `"${sizes.join(', ').replace(/"/g, '""')}"`,
      `"${colors.join(', ').replace(/"/g, '""')}"`,
      images.length,
      `"${images.join('; ').replace(/"/g, '""')}"`,
      product.createdAt.toISOString(),
      product.updatedAt.toISOString()
    ].join(',')
  })

  return [headers, ...rows].join('\n')
}

async function generateCustomersCSV(filters: any) {
  const where: any = {}
  
  if (filters.status) where.status = filters.status
  if (filters.startDate) where.createdAt = { gte: new Date(filters.startDate) }
  if (filters.endDate) where.createdAt = { ...where.createdAt, lte: new Date(filters.endDate) }

  const customers = await prisma.customer.findMany({
    where,
    include: {
      orders: {
        select: {
          total: true,
          status: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Address',
    'Status',
    'Total Orders',
    'Total Spent',
    'Join Date',
    'Last Order Date',
    'Notes'
  ].join(',')

  const rows = customers.map(customer => {
    const totalOrders = customer.orders.length
    const totalSpent = customer.orders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0)
    const lastOrder = customer.orders.length > 0 
      ? customer.orders.reduce((latest, order) => 
          new Date(order.createdAt) > new Date(latest.createdAt) ? order : latest
        )
      : null

    return [
      customer.id,
      `"${customer.name.replace(/"/g, '""')}"`,
      customer.email,
      customer.phone,
      `"${(customer.address || '').replace(/"/g, '""')}"`,
      customer.status,
      totalOrders,
      totalSpent,
      customer.createdAt.toISOString(),
      lastOrder ? lastOrder.createdAt.toISOString() : '',
      `"${(customer.notes || '').replace(/"/g, '""')}"`
    ].join(',')
  })

  return [headers, ...rows].join('\n')
}

async function generateSalesCSV(filters: any) {
  const where: any = {
    status: {
      not: 'cancelled'
    }
  }
  
  if (filters.startDate) where.createdAt = { gte: new Date(filters.startDate) }
  if (filters.endDate) where.createdAt = { ...where.createdAt, lte: new Date(filters.endDate) }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const headers = [
    'Date',
    'Order Number',
    'Customer Name',
    'Product Name',
    'Quantity',
    'Unit Price',
    'Total',
    'Payment Method',
    'Status'
  ].join(',')

  const rows: string[] = []
  
  orders.forEach(order => {
    order.items.forEach(item => {
      rows.push([
        order.createdAt.toISOString().split('T')[0],
        order.orderNumber,
        `"${order.customerName.replace(/"/g, '""')}"`,
        `"${item.productName.replace(/"/g, '""')}"`,
        item.quantity,
        item.productPrice,
        item.total,
        order.paymentMethod,
        order.status
      ].join(','))
    })
  })

  return [headers, ...rows].join('\n')
} 
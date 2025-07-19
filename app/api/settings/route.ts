import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/settings - Get all settings
export async function GET(request: NextRequest) {
  try {
    // For now, we'll return default settings
    // In a real implementation, you'd store these in a settings table
    const defaultSettings = {
      // Store Information
      storeName: "STRECK",
      storeDescription: "Bold, chaotic, unapologetically desi streetwear for Gen Z rebels",
      storeEmail: "hello@streck.store",
      storePhone: "+91 98765 43210",
      storeAddress: "Mumbai, Maharashtra, India",
      
      // Notifications
      emailNotifications: true,
      orderNotifications: true,
      lowStockAlerts: true,
      customerNotifications: false,
      
      // Security
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: "30",
      
      // Display
      darkMode: false,
      compactView: false,
      showProductImages: true,
      itemsPerPage: "20",
      
      // Payment Settings
      paymentMethods: ["COD", "Online Payment", "UPI"],
      defaultCurrency: "INR",
      taxRate: "18",
      
      // Shipping Settings
      shippingMethods: ["Standard", "Express"],
      defaultShippingCost: "0",
      freeShippingThreshold: "1000",
      
      // Email Templates
      orderConfirmationSubject: "Order Confirmed - {orderNumber}",
      orderShippedSubject: "Your Order is on the way!",
      orderDeliveredSubject: "Order Delivered Successfully"
    }

    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['storeName', 'storeEmail', 'storePhone']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // In a real implementation, you'd save these to a settings table
    // For now, we'll just return success
    console.log('Settings updated:', body)

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: body
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

// POST /api/settings/backup - Create settings backup
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'backup') {
      // In a real implementation, you'd create a backup
      const backupData = {
        timestamp: new Date().toISOString(),
        settings: await prisma.order.findMany({
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            total: true,
            status: true,
            createdAt: true
          },
          take: 10 // Just for demo
        })
      }

      return NextResponse.json({
        message: 'Backup created successfully',
        backup: backupData
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating backup:', error)
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    )
  }
} 
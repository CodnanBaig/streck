import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/coupons/validate - Validate coupon code and calculate discount
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, subtotal, items = [] } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      )
    }

    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 404 }
      )
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'Coupon is not active' },
        { status: 400 }
      )
    }

    // Check validity period
    const now = new Date()
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json(
        { error: 'Coupon is not valid at this time' },
        { status: 400 }
      )
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: 'Coupon usage limit exceeded' },
        { status: 400 }
      )
    }

    // Check minimum order amount
    if (subtotal < coupon.minimumOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of ₹${coupon.minimumOrderAmount} required` },
        { status: 400 }
      )
    }

    // Check if coupon applies to specific categories/products
    let applicableSubtotal = subtotal
    if (coupon.appliesTo !== 'all' && coupon.applicableItems) {
      const applicableItems = JSON.parse(coupon.applicableItems)
      
      if (coupon.appliesTo === 'categories') {
        // Calculate subtotal for applicable categories only
        applicableSubtotal = items
          .filter((item: any) => applicableItems.includes(item.category))
          .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      } else if (coupon.appliesTo === 'products') {
        // Calculate subtotal for applicable products only
        applicableSubtotal = items
          .filter((item: any) => applicableItems.includes(item.id))
          .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      }
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = (applicableSubtotal * coupon.discountValue) / 100
    } else {
      discountAmount = coupon.discountValue
    }

    // Apply maximum discount limit
    if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
      discountAmount = coupon.maximumDiscount
    }

    // Ensure discount doesn't exceed applicable subtotal
    if (discountAmount > applicableSubtotal) {
      discountAmount = applicableSubtotal
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maximumDiscount: coupon.maximumDiscount
      },
      discountAmount: Math.round(discountAmount * 100) / 100,
      applicableSubtotal: Math.round(applicableSubtotal * 100) / 100
    })

  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    )
  }
} 
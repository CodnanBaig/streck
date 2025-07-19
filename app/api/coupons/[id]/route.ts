import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/coupons/[id] - Get specific coupon
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(coupon)
  } catch (error) {
    console.error('Error fetching coupon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coupon' },
      { status: 500 }
    )
  }
}

// PUT /api/coupons/[id] - Update coupon
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const {
      code,
      name,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      usageLimit,
      validFrom,
      validUntil,
      isActive,
      appliesTo,
      applicableItems
    } = body

    // Validate required fields
    if (!code || !name || !discountType || !discountValue || !validFrom || !validUntil) {
      return NextResponse.json(
        { error: 'Code, name, discount type, discount value, valid from, and valid until are required' },
        { status: 400 }
      )
    }

    // Validate discount type
    if (!['percentage', 'fixed_amount'].includes(discountType)) {
      return NextResponse.json(
        { error: 'Discount type must be either "percentage" or "fixed_amount"' },
        { status: 400 }
      )
    }

    // Validate discount value
    if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 0 and 100' },
        { status: 400 }
      )
    }

    if (discountType === 'fixed_amount' && discountValue <= 0) {
      return NextResponse.json(
        { error: 'Fixed amount discount must be greater than 0' },
        { status: 400 }
      )
    }

    // Check if coupon code already exists (excluding current coupon)
    const existingCoupon = await prisma.coupon.findFirst({
      where: { 
        code: code.toUpperCase(),
        id: { not: parseInt(params.id) }
      }
    })

    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      )
    }

    const coupon = await prisma.coupon.update({
      where: { id: parseInt(params.id) },
      data: {
        code: code.toUpperCase(),
        name,
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        minimumOrderAmount: minimumOrderAmount ? parseFloat(minimumOrderAmount) : 0,
        maximumDiscount: maximumDiscount ? parseFloat(maximumDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        isActive: isActive !== undefined ? isActive : true,
        appliesTo: appliesTo || 'all',
        applicableItems: applicableItems ? JSON.stringify(applicableItems) : null
      }
    })

    return NextResponse.json(coupon)
  } catch (error) {
    console.error('Error updating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    )
  }
}

// DELETE /api/coupons/[id] - Delete coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if coupon exists
    const coupon = await prisma.coupon.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      )
    }

    // Check if coupon has been used
    if (coupon.usedCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete coupon that has been used' },
        { status: 400 }
      )
    }

    await prisma.coupon.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    )
  }
} 
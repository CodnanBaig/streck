import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/coupons - List all coupons
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(coupons)
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    )
  }
}

// POST /api/coupons - Create new coupon
export async function POST(request: NextRequest) {
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

    // Check if coupon code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      )
    }

    const coupon = await prisma.coupon.create({
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

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error('Error creating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    )
  }
} 
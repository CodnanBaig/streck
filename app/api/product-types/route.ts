import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const where: any = {}
    if (status) {
      where.status = status
    }

    const productTypes = await prisma.productType.findMany({
      where,
      orderBy: {
        sortOrder: 'asc'
      }
    })

    return NextResponse.json(productTypes)
  } catch (error) {
    console.error('Error fetching product types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, status = 'active', sortOrder = 0 } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProductType = await prisma.productType.findUnique({
      where: { slug }
    })

    if (existingProductType) {
      return NextResponse.json(
        { error: 'Product type with this slug already exists' },
        { status: 400 }
      )
    }

    const productType = await prisma.productType.create({
      data: {
        name,
        slug,
        description,
        status,
        sortOrder
      }
    })

    return NextResponse.json(productType)
  } catch (error) {
    console.error('Error creating product type:', error)
    return NextResponse.json(
      { error: 'Failed to create product type' },
      { status: 500 }
    )
  }
} 
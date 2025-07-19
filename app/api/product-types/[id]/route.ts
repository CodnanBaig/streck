import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productType = await prisma.productType.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!productType) {
      return NextResponse.json(
        { error: 'Product type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(productType)
  } catch (error) {
    console.error('Error fetching product type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product type' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, slug, description, status, sortOrder } = body

    // Check if product type exists
    const existingProductType = await prisma.productType.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!existingProductType) {
      return NextResponse.json(
        { error: 'Product type not found' },
        { status: 404 }
      )
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingProductType.slug) {
      const slugExists = await prisma.productType.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Product type with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const updatedProductType = await prisma.productType.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        slug,
        description,
        status,
        sortOrder
      }
    })

    return NextResponse.json(updatedProductType)
  } catch (error) {
    console.error('Error updating product type:', error)
    return NextResponse.json(
      { error: 'Failed to update product type' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if product type exists
    const existingProductType = await prisma.productType.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        products: true
      }
    })

    if (!existingProductType) {
      return NextResponse.json(
        { error: 'Product type not found' },
        { status: 404 }
      )
    }

    // Check if there are products using this type
    if (existingProductType.products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product type that has associated products' },
        { status: 400 }
      )
    }

    await prisma.productType.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Product type deleted successfully' })
  } catch (error) {
    console.error('Error deleting product type:', error)
    return NextResponse.json(
      { error: 'Failed to delete product type' },
      { status: 500 }
    )
  }
} 
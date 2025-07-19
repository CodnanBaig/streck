import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/product-types/slug/[slug] - Get product type by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const productType = await prisma.productType.findUnique({
      where: { slug },
      include: {
        products: {
          where: { status: 'active' },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            originalPrice: true,
            images: true,
            category: true,
            sizes: true,
            colors: true,
            rating: true,
            reviews: true,
            inStock: true,
            featured: true,
            createdAt: true
          },
          orderBy: [
            { featured: 'desc' },
            { createdAt: 'desc' }
          ]
        },
        _count: {
          select: {
            products: {
              where: { status: 'active' }
            }
          }
        }
      }
    })

    if (!productType) {
      return NextResponse.json(
        { error: 'Product type not found' },
        { status: 404 }
      )
    }

    // Format products with parsed JSON fields if included
    let formattedProducts = undefined
    if (productType.products) {
      formattedProducts = productType.products.map(product => ({
        ...product,
        images: JSON.parse(product.images || '[]'),
        sizes: JSON.parse(product.sizes || '[]'),
        colors: JSON.parse(product.colors || '[]')
      }))
    }

    // Format response
    const formattedProductType = {
      ...productType,
      products: formattedProducts,
      productCount: productType._count.products,
      _count: undefined
    }

    return NextResponse.json(formattedProductType)
  } catch (error) {
    console.error('Error fetching product type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product type' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/categories/slug/[slug] - Get category by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts')

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: includeProducts === 'true' ? {
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
        } : false,
        _count: {
          select: {
            products: {
              where: { status: 'active' }
            }
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Format products with parsed JSON fields if included
    let formattedProducts = undefined
    if (category.products) {
      formattedProducts = category.products.map(product => ({
        ...product,
        images: JSON.parse(product.images || '[]'),
        sizes: JSON.parse(product.sizes || '[]'),
        colors: JSON.parse(product.colors || '[]')
      }))
    }

    // Format response
    const formattedCategory = {
      ...category,
      products: formattedProducts,
      productCount: category._count.products,
      _count: undefined
    }

    return NextResponse.json(formattedCategory)
  } catch (error) {
    console.error('Error fetching category by slug:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
} 
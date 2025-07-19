import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const includeProducts = searchParams.get('includeProducts')

    const where: any = {}
    
    if (status) where.status = status
    if (featured) where.featured = featured === 'true'

    const categories = await prisma.category.findMany({
      where,
      include: {
        products: includeProducts === 'true' ? {
          where: { status: 'active' }
        } : false,
        _count: {
          select: {
            products: {
              where: { status: 'active' }
            }
          }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    // Format response with product count
    const formattedCategories = categories.map(category => ({
      ...category,
      productCount: category._count.products,
      _count: undefined
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      slug,
      description,
      image,
      color,
      status,
      featured,
      sortOrder
    } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        color: color || 'bg-gray-600',
        status: status || 'active',
        featured: featured || false,
        sortOrder: sortOrder || 0
      },
      include: {
        _count: {
          select: {
            products: {
              where: { status: 'active' }
            }
          }
        }
      }
    })

    // Format response
    const formattedCategory = {
      ...category,
      productCount: category._count.products,
      _count: undefined
    }

    return NextResponse.json(formattedCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'A category with this name or slug already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
} 
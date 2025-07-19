import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/products/bulk - Bulk upload products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { products } = body

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Products must be an array' },
        { status: 400 }
      )
    }

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'No products provided' },
        { status: 400 }
      )
    }

    if (products.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 products per upload' },
        { status: 400 }
      )
    }

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    // Process products in batches
    const batchSize = 10
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      
      try {
        const batchResults = await Promise.allSettled(
          batch.map(async (product: any) => {
            // Validate required fields
            if (!product.name || !product.price || !product.category || !product.productType) {
              throw new Error(`Missing required fields for product: ${product.name || 'Unknown'}`)
            }

            // Validate price
            if (typeof product.price !== 'number' || product.price <= 0) {
              throw new Error(`Invalid price for product: ${product.name}`)
            }

            // Validate status
            const validStatuses = ['active', 'inactive', 'draft']
            if (product.status && !validStatuses.includes(product.status.toLowerCase())) {
              throw new Error(`Invalid status for product: ${product.name}`)
            }

            // Parse arrays
            const sizes = product.sizes ? product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : []
            const colors = product.colors ? product.colors.split(',').map((c: string) => c.trim()).filter(Boolean) : []
            const images = product.images ? product.images.split(';').map((img: string) => img.trim()).filter(Boolean) : []

            // Create product
            const createdProduct = await prisma.product.create({
              data: {
                name: product.name,
                description: product.description || '',
                price: parseFloat(product.price),
                originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
                category: product.category,
                productType: product.productType,
                sizes: JSON.stringify(sizes),
                colors: JSON.stringify(colors),
                images: JSON.stringify(images),
                inStock: product.inStock !== undefined ? product.inStock : true,
                status: product.status || 'active',
                featured: product.featured || false,
                rating: 0,
                reviews: 0
              }
            })

            return createdProduct
          })
        )

        // Count successes and errors
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successCount++
          } else {
            errorCount++
            const product = batch[index]
            errors.push(`Row ${i + index + 1}: ${result.reason?.message || 'Unknown error'}`)
          }
        })

      } catch (batchError) {
        errorCount += batch.length
        errors.push(`Batch error: ${batchError}`)
      }
    }

    return NextResponse.json({
      success: true,
      successCount,
      errorCount,
      errors: errors.slice(0, 10), // Limit error messages
      message: `Successfully uploaded ${successCount} products. ${errorCount} failed.`
    })

  } catch (error) {
    console.error('Bulk upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process bulk upload' },
      { status: 500 }
    )
  }
} 
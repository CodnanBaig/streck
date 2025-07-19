"use client"

import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { gsap } from "gsap"
import { CartContext } from "@/components/providers"
import { ProductCard } from "@/components/product-card"
import { Navbar } from "@/components/navbar"

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  images: string[]
  category: string
  productType: string
  sizes: string[]
  colors: string[]
  rating: number
  reviews: number
  inStock: boolean
  status: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

interface ProductType {
  id: number
  name: string
  slug: string
  description: string | null
  status: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export default function ProductTypePage({ params }: { params: { slug: string } }) {
  const { cartCount } = useContext(CartContext)
  const [productType, setProductType] = useState<ProductType | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    fetchProductTypeData()
  }, [params.slug])

  const fetchProductTypeData = async () => {
    try {
      setLoading(true)
      
      // First, fetch the product type details
      const typeResponse = await fetch(`/api/product-types/slug/${params.slug}`)
      
      if (typeResponse.ok) {
        const typeData = await typeResponse.json()
        setProductType(typeData)
        
        // Then fetch products of this type
        const productsResponse = await fetch(`/api/products?productType=${params.slug}&status=active`)
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setProducts(productsData)
        } else {
          console.error('Failed to fetch products')
          setProducts([])
        }
      } else if (typeResponse.status === 404) {
        setProductType(null)
        setProducts([])
      } else {
        console.error('Failed to fetch product type data')
        setProductType(null)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching product type data:', error)
      setProductType(null)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // GSAP Animations
    gsap.fromTo(".product-type-hero", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
    gsap.fromTo(".product-grid", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 })
  }, [productType])

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "featured":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case "name":
      default:
        return a.name.localeCompare(b.name)
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  if (!productType) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4">Product Type Not Found</h1>
          <p className="text-gray-600 mb-6">This product type doesn't exist or has been moved.</p>
          <Button onClick={() => (window.location.href = "/")} className="bg-black text-white">
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar showBackButton={true} />

      {/* Product Type Hero */}
      <section className="product-type-hero relative h-[40vh] overflow-hidden bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-black mb-4">{productType.name}</h1>
            <p className="text-xl max-w-2xl mx-auto">{productType.description}</p>
            <div className="mt-4 flex justify-center gap-4">
              <Badge className="bg-blue-600 text-white text-lg px-6 py-2">
                {products.length} Products
              </Badge>
              <Badge className="bg-gray-600 text-white text-lg px-6 py-2">
                {productType.name}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="py-8 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">
              {sortedProducts.length} Products Found
            </h2>
            <p className="text-gray-600">All {productType.name.toLowerCase()} products</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="font-bold">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-black p-2 rounded font-bold"
            >
              <option value="name">Name</option>
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="product-grid py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.images[0] || "/placeholder.svg"}
                  category={product.category}
                  description={product.description || ""}
                  rating={product.rating}
                  reviews={product.reviews}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-black mb-4">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                No {productType.name.toLowerCase()} products available yet. Check back soon!
              </p>
              <Button onClick={() => (window.location.href = "/")} className="bg-black text-white">
                Browse All Products
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Product Type Info */}
      {sortedProducts.length > 0 && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-6">About {productType.name}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {productType.description || `Our ${productType.name} collection features high-quality, 
              comfortable pieces designed for everyday wear. Each item is crafted with attention to detail 
              and made from premium materials to ensure both style and durability.`}
            </p>
            
            {/* Product Type Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-xl">{products.length}</span>
                </div>
                <h3 className="font-bold">Products</h3>
                <p className="text-gray-600">Available items</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-xl">{products.filter(p => p.featured).length}</span>
                </div>
                <h3 className="font-bold">Featured</h3>
                <p className="text-gray-600">Top picks</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-xl">
                    {Math.round(products.reduce((sum, p) => sum + p.rating, 0) / products.length * 10) / 10}
                  </span>
                </div>
                <h3 className="font-bold">Avg Rating</h3>
                <p className="text-gray-600">Customer satisfaction</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
} 
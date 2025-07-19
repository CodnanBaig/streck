"use client"

import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { gsap } from "gsap"
import { CartContext } from "@/components/providers"
import { ProductCard } from "@/components/product-card"

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  images: string[]
  category: string
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

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  color: string
  status: string
  featured: boolean
  sortOrder: number
  productCount: number
  products?: Product[]
  createdAt: string
  updatedAt: string
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { cartCount } = useContext(CartContext)
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    fetchCategoryData()
  }, [params.slug])

  const fetchCategoryData = async () => {
    try {
      setLoading(true)
      // Fetch category with products
      const response = await fetch(`/api/categories/slug/${params.slug}?includeProducts=true`)
      
      if (response.ok) {
        const data = await response.json()
        setCategory(data)
        setProducts(data.products || [])
      } else if (response.status === 404) {
        setCategory(null)
        setProducts([])
      } else {
        console.error('Failed to fetch category data')
        setCategory(null)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching category data:', error)
      setCategory(null)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // GSAP Animations
    gsap.fromTo(".category-hero", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
    gsap.fromTo(".product-grid", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 })
  }, [category])

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
          <p>Loading category...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">This category doesn't exist or has been moved.</p>
          <Button onClick={() => (window.location.href = "/")} className="bg-black text-white">
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-black p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chaos
          </Button>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => (window.location.href = "/cart")}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5 cart-icon" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Category Hero */}
      <section className="category-hero relative h-[40vh] overflow-hidden">
        <img 
          src={category.image || "/placeholder.svg"} 
          alt={category.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-black mb-4">{category.name}</h1>
            <p className="text-xl max-w-2xl mx-auto">{category.description}</p>
            <div className="mt-4 flex justify-center gap-4">
              <Badge className={`${category.color} text-white text-lg px-6 py-2`}>
                {category.productCount} Products
              </Badge>
              {category.featured && (
                <Badge className="bg-blue-600 text-white text-lg px-6 py-2">
                  Featured Category
                </Badge>
              )}
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
            <p className="text-gray-600">Prepare for maximum chaos</p>
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
                This category is currently empty. Check back soon for new chaos!
              </p>
              <Button onClick={() => (window.location.href = "/")} className="bg-black text-white">
                Browse All Products
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Category Info */}
      {sortedProducts.length > 0 && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-6">About {category.name}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {category.description}. Each piece is designed to make a statement and spark conversations. 
              Whether you're looking to express your personality or just want to stand out from the crowd, 
              our {category.name.toLowerCase()} collection has something for every rebel.
            </p>
            
            {/* Category Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white font-bold text-xl">{category.productCount}</span>
                </div>
                <h3 className="font-bold">Products</h3>
                <p className="text-gray-600">Available items</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-xl">{products.filter(p => p.featured).length}</span>
                </div>
                <h3 className="font-bold">Featured</h3>
                <p className="text-gray-600">Staff picks</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-xl">
                    {products.length > 0 ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1) : '0'}
                  </span>
                </div>
                <h3 className="font-bold">Avg Rating</h3>
                <p className="text-gray-600">Out of 5 stars</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

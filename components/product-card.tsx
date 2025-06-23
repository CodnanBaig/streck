"use client"

import { useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { gsap } from "gsap"
import { CartContext } from "@/components/providers"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin()
}

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  description: string
  rating?: number
  originalPrice?: number
}

interface ProductCardProps {
  product: Product
  onClick?: () => void
  showRating?: boolean
  showOriginalPrice?: boolean
  className?: string
}

export function ProductCard({ 
  product, 
  onClick, 
  showRating = true, 
  showOriginalPrice = false,
  className = ""
}: ProductCardProps) {
  const { setCartCount } = useContext(CartContext)

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCartCount((prev) => prev + 1)
    gsap.to(".cart-icon", { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 })
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      window.location.href = `/product/${product.id}`
    }
  }

  // Add error boundary for missing product data
  if (!product) {
    return (
      <Card className={`bg-gray-100 border-gray-300 ${className}`}>
        <CardContent className="p-4">
          <div className="text-center text-gray-500">Product not available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`bg-white border-black hover:border-red-600 transition-all group shadow-lg cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
        </div>
        
        {showRating && product.rating && (
          <div className="flex items-center mb-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
        )}
        
        <h3 className="font-black text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black">₹{product.price}</span>
            {showOriginalPrice && product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <Button
            size="sm"
            className="bg-black text-white hover:bg-red-600"
            onClick={addToCart}
          >
            ADD TO CART
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to see more details, if you dare 👀
        </div>
      </CardContent>
    </Card>
  )
} 
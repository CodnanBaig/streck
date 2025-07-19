"use client"

import { useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { gsap } from "gsap"
import { CartContext } from "@/components/providers"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin()
}

interface ProductCardProps {
  id: number
  name: string
  price: number
  originalPrice?: number | null
  image: string
  category: string
  description: string
  rating?: number
  reviews?: number
  onClick?: () => void
  showRating?: boolean
  showOriginalPrice?: boolean
  className?: string
}

export function ProductCard({ 
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  description,
  rating,
  reviews,
  onClick, 
  showRating = true, 
  showOriginalPrice = true,
  className = ""
}: ProductCardProps) {
  const { addToCart } = useContext(CartContext)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Add product to cart
    addToCart({
      id,
      name,
      price,
      image: image || "/placeholder.svg"
    })
    
    // Also store in sessionStorage as backup
    const cartItem = {
      id,
      name,
      price,
      image: image || "/placeholder.svg",
      quantity: 1
    }
    
    const existingSessionCart = sessionStorage.getItem('sessionCart')
    let sessionCart = existingSessionCart ? JSON.parse(existingSessionCart) : []
    
    const existingItem = sessionCart.find((item: any) => item.id === id)
    if (existingItem) {
      sessionCart = sessionCart.map((item: any) => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    } else {
      sessionCart.push(cartItem)
    }
    
    sessionStorage.setItem('sessionCart', JSON.stringify(sessionCart))
    
    // Animation
    gsap.to(".cart-icon", { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 })
    
    // Show a quick feedback message
    const button = e.currentTarget as HTMLButtonElement
    const originalText = button.textContent
    button.textContent = "ADDED!"
    button.style.backgroundColor = "#22c55e" // green
    
    setTimeout(() => {
      button.textContent = originalText
      button.style.backgroundColor = ""
    }, 1000)
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      window.location.href = `/product/${id}`
    }
  }

  // Calculate discount percentage
  const discountPercentage = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  return (
    <Card
      className={`bg-white border-black hover:border-red-600 transition-all group shadow-lg cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="relative aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-black text-white text-xs">
              {category}
            </Badge>
          </div>
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-600 text-white text-xs">
                {discountPercentage}% OFF
              </Badge>
            </div>
          )}
        </div>
        
        {/* Rating */}
        {showRating && rating && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {rating} {reviews && `(${reviews})`}
            </span>
          </div>
        )}
        
        <h3 className="font-black text-lg mb-2 line-clamp-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black">₹{price}</span>
            {showOriginalPrice && originalPrice && originalPrice > price && (
              <span className="text-lg text-gray-500 line-through">₹{originalPrice}</span>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            className="bg-black text-white hover:bg-red-600"
            onClick={handleAddToCart}
            onMouseDown={(e) => e.preventDefault()}
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
"use client"

import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowLeft, Star, Heart, Share2, Minus, Plus } from "lucide-react"
import { gsap } from "gsap"
import { CartContext } from "@/components/providers"

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

const productReviews = [
  {
    id: 1,
    name: "Chaos_Queen_23",
    rating: 5,
    date: "2 days ago",
    text: "Wore this to a family function. Caused exactly the amount of drama I was hoping for. 10/10 would recommend for stirring the pot.",
    verified: true,
  },
  {
    id: 2,
    name: "Sarcasm_Lord",
    rating: 4,
    date: "1 week ago",
    text: "Quality is surprisingly good for something this chaotic. My friends either love it or hate it. Perfect.",
    verified: true,
  },
  {
    id: 3,
    name: "Rebel_Without_Pause",
    rating: 5,
    date: "2 weeks ago",
    text: "Finally, a brand that gets my vibe. Wearing this is like having a personality in clothing form.",
    verified: false,
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addToCart } = useContext(CartContext)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${params.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
        setSelectedColor(data.colors[0] || "")
      } else if (response.status === 404) {
        setProduct(null)
      } else {
        console.error('Failed to fetch product')
        setProduct(null)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (product) {
      gsap.fromTo(".product-image", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 })
      gsap.fromTo(".product-info", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.3 })
    }
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">Either you're lost or we messed up. Probably both.</p>
          <Button onClick={() => (window.location.href = "/")} className="bg-black text-white">
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (!selectedSize) {
      alert("Pick a size first, genius!")
      return
    }
    
    // Add product to cart with size and color
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      size: selectedSize,
      color: selectedColor
    })
    
    // Also store in sessionStorage as backup
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    }
    
    const existingSessionCart = sessionStorage.getItem('sessionCart')
    let sessionCart = existingSessionCart ? JSON.parse(existingSessionCart) : []
    
    const existingItem = sessionCart.find((item: any) => item.id === product.id)
    if (existingItem) {
      sessionCart = sessionCart.map((item: any) => 
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      )
    } else {
      sessionCart.push(cartItem)
    }
    
    sessionStorage.setItem('sessionCart', JSON.stringify(sessionCart))
    
    gsap.to(".cart-icon", { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 })
    
    // Show feedback
    if (e) {
      const button = e.currentTarget as HTMLButtonElement
      const originalText = button.textContent
      button.textContent = "ADDED!"
      button.style.backgroundColor = "#22c55e"
      
      setTimeout(() => {
        button.textContent = originalText
        button.style.backgroundColor = ""
      }, 1000)
    }
  }

  const buyNow = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (!selectedSize) {
      alert("Pick a size first!")
      return
    }
    // Add to cart and redirect to checkout
    handleAddToCart()
    setTimeout(() => {
      window.location.href = "/checkout"
    }, 500)
  }

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-black p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setIsWishlisted(!isWishlisted)}>
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => (window.location.href = "/checkout")}
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="product-image">
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-red-600" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <Badge className="mb-4 bg-red-600 text-white">{product.category}</Badge>
            <h1 className="text-4xl font-black mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 font-bold">{product.rating}</span>
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
              {discountPercentage > 0 && (
                <Badge className="bg-green-600 text-white">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>

            <p className="text-gray-700 mb-8 text-lg leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-black mb-3">Size (Pick one, we're not mind readers)</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border-2 font-bold ${
                      selectedSize === size
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-black text-black hover:bg-black hover:text-white"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="font-black mb-3">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`px-4 py-2 border-2 font-bold ${
                      selectedColor === color
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-black text-black hover:bg-black hover:text-white"
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-black mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-black">
                  <button className="p-2 hover:bg-gray-100" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-bold">{quantity}</span>
                  <button className="p-2 hover:bg-gray-100" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-gray-600">• Max 10 per order (Don't be greedy)</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <Badge className="bg-green-100 text-green-800">✓ In Stock</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">✗ Out of Stock</Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button 
                type="button"
                className="flex-1 bg-red-600 text-white hover:bg-red-700 text-lg py-3" 
                onClick={buyNow}
                disabled={!product.inStock}
              >
                BUY NOW
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-black text-black hover:bg-black hover:text-white text-lg py-3"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                ADD TO CART
              </Button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="font-black mb-4">Why You'll Love This (Or Hate It)</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 100% Cotton (Softer than your ex's apologies)</li>
                <li>• Pre-shrunk (Unlike your standards)</li>
                <li>• Machine washable (Unlike your reputation)</li>
                <li>• Unisex fit (Because chaos knows no gender)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-3xl font-black mb-8">What Fellow Rebels Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productReviews.map((review) => (
              <Card key={review.id} className="border-black">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {review.verified && <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-bold">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

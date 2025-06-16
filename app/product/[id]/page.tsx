"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowLeft, Star, Heart, Share2, Minus, Plus } from "lucide-react"
import { gsap } from "gsap"

const productData = {
  1: {
    id: 1,
    name: "Toxic But Make It Fashion",
    price: 1299,
    originalPrice: 1599,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "18+",
    description:
      "For when you want to be problematic but stylishly. This isn't just a t-shirt, it's a lifestyle choice that your therapist will definitely want to discuss.",
    features: [
      "100% Cotton (Softer than your ex's apologies)",
      "Pre-shrunk (Unlike your standards)",
      "Machine washable (Unlike your reputation)",
      "Unisex fit (Because toxicity knows no gender)",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Blood Red"],
    rating: 4.8,
    reviews: 247,
    inStock: true,
  },
  // Add more products as needed
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
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [cartCount, setCartCount] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const product = productData[params.id as keyof typeof productData]

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0])
      gsap.fromTo(".product-image", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 })
      gsap.fromTo(".product-info", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.3 })
    }
  }, [product])

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

  const addToCart = () => {
    if (!selectedSize) {
      alert("Pick a size first, genius!")
      return
    }
    setCartCount((prev) => prev + 1)
    gsap.to(".cart-icon", { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 })
  }

  const buyNow = () => {
    if (!selectedSize) {
      alert("Pick a size first!")
      return
    }
    // Add to cart and redirect to checkout
    addToCart()
    setTimeout(() => {
      window.location.href = "/checkout"
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="p-6 border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="border-black text-black hover:bg-black hover:text-white"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-black">STRECK</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-black">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="cart-icon bg-white border-black text-black hover:bg-black hover:text-white relative"
              onClick={() => (window.location.href = "/checkout")}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs">{cartCount}</Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

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
              <Badge className="bg-green-600 text-white">
                {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
              </Badge>
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

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button className="flex-1 bg-red-600 text-white hover:bg-red-700 text-lg py-3" onClick={buyNow}>
                BUY NOW
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-black text-black hover:bg-black hover:text-white text-lg py-3"
                onClick={addToCart}
              >
                ADD TO CART
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`border-black ${isWishlisted ? "bg-red-600 text-white" : "text-black hover:bg-black hover:text-white"}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="font-black mb-4">Why This Doesn't Suck:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16 border-t border-gray-200 pt-16">
          <h2 className="text-3xl font-black mb-8">What People Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productReviews.map((review) => (
              <Card key={review.id} className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{review.name}</span>
                      {review.verified && <Badge className="bg-green-600 text-white text-xs">Verified</Badge>}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">"{review.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

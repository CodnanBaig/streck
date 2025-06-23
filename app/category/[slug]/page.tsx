"use client"

import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { gsap } from "gsap"
import { CartContext } from "@/components/providers"
import { ProductCard } from "@/components/product-card"

const allProducts = [
  // 18+ Category
  {
    id: 1,
    name: "Toxic But Make It Fashion",
    price: 1299,
    image: "/placeholder.svg",
    category: "18plus",
    description: "For when you want to be problematic but stylishly",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Sarcasm Loading... Please Wait",
    price: 1199,
    image: "/placeholder.svg",
    category: "18plus",
    description: "Perfect for those awkward family dinners",
    rating: 4.9,
  },
  {
    id: 7,
    name: "Certified Badass Hoodie",
    price: 1899,
    image: "/placeholder.svg",
    category: "18plus",
    description: "Warning: May cause sudden confidence boost",
    rating: 4.7,
  },
  // Fitness Category
  {
    id: 2,
    name: "Gym Jaana Hai Bro",
    price: 1499,
    image: "/placeholder.svg",
    category: "fitness",
    description: "Motivation not included, sweat stains guaranteed",
    rating: 4.6,
  },
  {
    id: 8,
    name: "Protein Shake > Your Opinion",
    price: 1399,
    image: "/placeholder.svg",
    category: "fitness",
    description: "For the gym bros who never shut up about gains",
    rating: 4.5,
  },
  // Pets Category
  {
    id: 3,
    name: "Dog Parent Supremacy",
    price: 1199,
    image: "/placeholder.svg",
    category: "pets",
    description: "Because your dog is better than most humans",
    rating: 4.9,
  },
  {
    id: 9,
    name: "Cat Mom Energy",
    price: 1299,
    image: "/placeholder.svg",
    category: "pets",
    description: "Judging you since forever, just like your cat",
    rating: 4.8,
  },
  // Funny Category
  {
    id: 4,
    name: "Existential Crisis Hoodie",
    price: 1799,
    image: "/placeholder.svg",
    category: "funny",
    description: "Perfect for 3 AM overthinking sessions",
    rating: 4.7,
  },
  {
    id: 10,
    name: "Adulting is Hard Tee",
    price: 1099,
    image: "/placeholder.svg",
    category: "funny",
    description: "For when you realize bills don't pay themselves",
    rating: 4.6,
  },
  // Profession Category
  {
    id: 5,
    name: "Corporate Slave Tee",
    price: 999,
    image: "/placeholder.svg",
    category: "profession",
    description: "Wear your suffering with pride",
    rating: 4.4,
  },
  {
    id: 11,
    name: "Meeting Could've Been Email",
    price: 1199,
    image: "/placeholder.svg",
    category: "profession",
    description: "The universal truth every office worker knows",
    rating: 4.8,
  },
]

const categoryInfo = {
  "18plus": {
    name: "18+ Collection",
    tagline: "Gaaliyan? Check. Toxicity? Certified. Decency? Not found.",
    description: "For the unapologetically explicit. Not for the faint-hearted or your conservative relatives.",
  },
  fitness: {
    name: "Fitness Collection",
    tagline: "Gym jaana hai? Ya sirf flex karna hai? Hum judge nahi karenge.",
    description: "Workout gear for people who actually work out. And those who just want to look like they do.",
  },
  pets: {
    name: "Pet Lovers Collection",
    tagline: "Dogs > Humans. Cats = Attitude. Hamsters = Chaos.",
    description: "For people whose pets are their personality. We get it, your dog is perfect.",
  },
  funny: {
    name: "Comedy Collection",
    tagline: "Hasna hai? Rona hai? Dono kar sakte ho.",
    description: "Humor so dark, it needs therapy. Perfect for people who laugh at their own pain.",
  },
  profession: {
    name: "Professional Collection",
    tagline: "Office mein rebel? Boss ko impress? Yahan sab milega.",
    description: "Corporate wear for people who hate corporate culture. Ironic? Absolutely.",
  },
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { cartCount, setCartCount } = useContext(CartContext)
  const [products, setProducts] = useState(allProducts.filter((p) => p.category === params.slug))
  const [sortBy, setSortBy] = useState("featured")

  const category = categoryInfo[params.slug as keyof typeof categoryInfo]

  useEffect(() => {
    gsap.fromTo(".category-header", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
    gsap.fromTo(".product-grid", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 })
  }, [])

  const handleSort = (sortType: string) => {
    setSortBy(sortType)
    const sortedProducts = [...products]

    switch (sortType) {
      case "price-low":
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sortedProducts.sort((a, b) => b.rating - a.rating)
        break
      default:
        // Keep original order for "featured"
        break
    }

    setProducts(sortedProducts)
  }

  const addToCart = () => {
    setCartCount((prev) => prev + 1)
    gsap.to(".cart-icon", { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 })
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-2xl font-black">Category not found, genius.</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Category Header */}
      <section className="category-header py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-4">{category.name}</h1>
          <p className="text-xl mb-6 text-gray-600">{category.tagline}</p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">{category.description}</p>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="py-6 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-black">{products.length} Products</span>
            <span className="text-gray-600">• Probably overpriced but worth it</span>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="border border-black rounded px-3 py-2 bg-white text-black font-bold"
            >
              <option value="featured">Featured (Our Favorites)</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="py-20 text-center">
          <h3 className="text-2xl font-black mb-4">Nothing here yet!</h3>
          <p className="text-gray-600">Either we're lazy or you picked the wrong category. Probably both.</p>
        </div>
      )}
    </div>
  )
}

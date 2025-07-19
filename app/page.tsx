"use client"

import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, AlertTriangle } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { CartContext } from "@/components/providers"
import { ProductCard } from "@/components/product-card"
import { Navbar } from "@/components/navbar"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Fallback categories with static images (used until categories are fetched from API)
const fallbackCategories = [
  {
    id: "18plus",
    name: "18+",
    image: "/18+ - Final.jpg",
    color: "bg-red-600",
    warning: true,
  },
  {
    id: "fitness",
    name: "Fitness",
    image: "/Fitness - Final.jpg",
    color: "bg-gray-700",
  },
  {
    id: "pets",
    name: "Pets",
    image: "/Pets - Final.jpg",
    color: "bg-gray-600",
  },
  {
    id: "funny",
    name: "Funny",
    image: "/Funny - Final.jpg",
    color: "bg-gray-800",
  },
  {
    id: "profession",
    name: "Profession",
    image: "/Profession - Final.jpg",
    color: "bg-gray-500",
  },
]

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

const reviews = [
  {
    name: "Rahul_the_Rebel",
    rating: 5,
    text: "Bhai ye t-shirt pehen ke office gaya, boss ne promotion de diya. Coincidence? I think not.",
    product: "Corporate Slave Tee",
  },
  {
    name: "Priya_Chaos_Queen",
    rating: 4,
    text: "Hoodie itni soft hai ki mera ex bhi jealous ho gaya. 10/10 would recommend for emotional damage.",
    product: "Existential Crisis Hoodie",
  },
  {
    name: "Gym_Bro_Arjun",
    rating: 5,
    text: "Ye shirt pehen ke gym gaya, sab mujhe dekh rahe the. Probably because I forgot to shower, but still...",
    product: "Gym Jaana Hai Bro",
  },
]

export default function StreckHomepage() {
  const { cartCount } = useContext(CartContext)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState(fallbackCategories)
  const [loading, setLoading] = useState(true)

  // Fetch products and categories from API
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?status=active')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        setFeaturedProducts(data.filter((p: Product) => p.featured))
      } else {
        console.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?status=active')
      if (response.ok) {
        const data = await response.json()
        // Transform API data to match the expected format
        const transformedCategories = data.map((cat: any) => ({
          id: cat.slug,
          name: cat.name,
          image: cat.image || fallbackCategories.find(fc => fc.id === cat.slug)?.image || "/placeholder.svg",
          color: cat.color || "bg-gray-600",
          warning: cat.slug === "18plus" // Keep warning for 18+ category
        }))
        setCategories(transformedCategories)
      } else {
        console.error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    // GSAP Animations
    gsap.fromTo(".brand-title", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "bounce.out" })

    gsap.fromTo(".disclaimer", { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.5 })

    // Jittery text animation
    gsap.to(".jittery", {
      x: () => Math.random() * 4 - 2,
      y: () => Math.random() * 4 - 2,
      duration: 0.1,
      repeat: -1,
      yoyo: true,
    })

    // Scroll triggered animations
    gsap.utils.toArray(".fade-in-scroll").forEach((element: any) => {
      gsap.fromTo(
        element,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    // Auto-slide carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % categories.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [cartCount, cartCount])

  const handleCategoryClick = (category: any) => {
    if (category.warning) {
      setShowWarning(true)
    } else {
      window.location.href = `/category/${category.id}`
    }
  }

  return (
    <div className="min-h-screen bg-white text-black font-bold">
      {/* Sticky Disclaimer Bar */}
      <div className="disclaimer bg-red-600 text-white p-2 text-center text-sm font-black">
        ⚠️ WARNING: This brand contains high levels of sarcasm, zero f*cks given, and may cause sudden urges to be
        yourself ⚠️
      </div>

      <Navbar />

      {/* Hero Carousel */}
      <section className="relative h-[80vh] overflow-hidden">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`absolute inset-0 transition-transform duration-500 ${
              index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            <div 
              className="h-full w-full cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {categories.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 fade-in-scroll bg-white">
        <div className="w-full">
          <h2 className="text-4xl font-black text-center mb-12 text-black">
            STUFF YOU PROBABLY CAN'T AFFORD
            <span className="block text-lg font-normal text-gray-600 mt-2">(But will buy anyway because YOLO)</span>
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <ShoppingCart className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading awesome products...</p>
              </div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="px-4">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={24}
                slidesPerView={1.5}
                centeredSlides={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                speed={1000}
                loop={true}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  1280: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                }}
                className="product-carousel"
              >
                {featuredProducts.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard
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
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No featured products yet</h3>
              <p className="text-gray-600">Check back soon for amazing deals!</p>
            </div>
          )}
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 fade-in-scroll bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12 text-black">
            THE FULL CHAOS COLLECTION
            <span className="block text-lg font-normal text-gray-600 mt-2">(Every product is a personality crisis waiting to happen)</span>
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <ShoppingCart className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading more chaos...</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.slice(0, 8).map((product) => (
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
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600">We're working on stocking up the chaos!</p>
            </div>
          )}

          {products.length > 8 && (
            <div className="text-center mt-12">
              <Button className="bg-red-600 text-white hover:bg-red-700 text-lg px-8 py-3">
                VIEW ALL PRODUCTS
                <span className="ml-2">→</span>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 fade-in-scroll bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12 text-black">
            WHAT OUR VICTIMS SAY
            <span className="block text-lg font-normal text-gray-600 mt-2">(Testimonials from fellow chaos agents)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="border-black hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-black">{review.name}</p>
                    <p className="text-sm text-gray-600">Bought: {review.product}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white border-t border-gray-800 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-black mb-6 text-white">STRECK</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-white">
            We got T-shirts, hoodies, terries. If you're not broke, go buy this sh*t. If you're broke like us, scroll
            and cry in style.
            <br />
            <br />
            Made with ❤️ and excessive amounts of caffeine by talented ch*tiyas with zero supervision.
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white">
              Privacy Policy (LOL)
            </a>
            <a href="#" className="hover:text-white">
              Terms & Conditions (More LOL)
            </a>
            <a href="#" className="hover:text-white">
              Contact Us (Good Luck)
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-8">© 2024 Streck. All rights reserved. Or not. We're not lawyers.</p>
        </div>
      </footer>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 border-red-600 border-2">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-black mb-4">⚠️ ADULT CONTENT WARNING ⚠️</h3>
              <p className="text-gray-700 mb-6">
                This section contains explicit humor and adult themes. Viewer discretion advised. By continuing, you
                confirm you're 18+ and have questionable taste in humor.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowWarning(false)}
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                >
                  I'm Too Pure
                </Button>
                <Button
                  onClick={() => {
                    setShowWarning(false)
                    window.location.href = "/category/18plus"
                  }}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                >
                  I Can Handle It
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

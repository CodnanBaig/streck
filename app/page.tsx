"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, AlertTriangle, Dumbbell, Heart, Laugh, Briefcase } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const categories = [
  {
    id: "18plus",
    name: "18+",
    icon: AlertTriangle,
    tagline: "Gaaliyan? Check.\nToxicity? Certified.\nDecency? Not found.",
    color: "bg-red-600",
    warning: true,
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: Dumbbell,
    tagline: "Gym jaana hai?\nYa sirf flex karna hai?\nHum judge nahi karenge.",
    color: "bg-gray-700",
  },
  {
    id: "pets",
    name: "Pets",
    icon: Heart,
    tagline: "Dogs > Humans\nCats = Attitude\nHamsters = Chaos",
    color: "bg-gray-600",
  },
  {
    id: "funny",
    name: "Funny",
    icon: Laugh,
    tagline: "Hasna hai?\nRona hai?\nDono kar sakte ho.",
    color: "bg-gray-800",
  },
  {
    id: "profession",
    name: "Profession",
    icon: Briefcase,
    tagline: "Office mein rebel?\nBoss ko impress?\nYahan sab milega.",
    color: "bg-gray-500",
  },
]

const products = [
  {
    id: 1,
    name: "Toxic But Make It Fashion",
    price: 1299,
    image: "/placeholder.svg?height=300&width=300",
    category: "18+",
    description: "For when you want to be problematic but stylishly",
  },
  {
    id: 2,
    name: "Gym Jaana Hai Bro",
    price: 1499,
    image: "/placeholder.svg?height=300&width=300",
    category: "Fitness",
    description: "Motivation not included, sweat stains guaranteed",
  },
  {
    id: 3,
    name: "Dog Parent Supremacy",
    price: 1199,
    image: "/placeholder.svg?height=300&width=300",
    category: "Pets",
    description: "Because your dog is better than most humans",
  },
  {
    id: 4,
    name: "Existential Crisis Hoodie",
    price: 1799,
    image: "/placeholder.svg?height=300&width=300",
    category: "Funny",
    description: "Perfect for 3 AM overthinking sessions",
  },
  {
    id: 5,
    name: "Corporate Slave Tee",
    price: 999,
    image: "/placeholder.svg?height=300&width=300",
    category: "Profession",
    description: "Wear your suffering with pride",
  },
]

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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [cartCount, setCartCount] = useState(0)

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
  }, [])

  const handleCategoryClick = (category: any) => {
    if (category.warning) {
      setShowWarning(true)
    } else {
      window.location.href = `/category/${category.id}`
    }
  }

  const addToCart = () => {
    setCartCount((prev) => prev + 1)
    gsap.to(".cart-icon", { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 })
  }

  return (
    <div className="min-h-screen bg-white text-black font-bold">
      {/* Sticky Disclaimer Bar */}
      <div className="disclaimer bg-red-600 text-white p-2 text-center text-sm font-black">
        ⚠️ WARNING: This brand contains high levels of sarcasm, zero f*cks given, and may cause sudden urges to be
        yourself ⚠️
      </div>

      {/* Header */}
      <header className="p-6 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="brand-title text-4xl font-black tracking-wider text-black">
            <span className="jittery">STRECK</span>
          </h1>
          <div className="flex items-center gap-4">
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

      {/* Hero Carousel */}
      <section className="relative h-96 overflow-hidden">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`absolute inset-0 transition-transform duration-500 ${
              index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            <div className={`${category.color} h-full flex items-center justify-center relative overflow-hidden`}>
              <div className="text-center z-10">
                <category.icon className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-5xl font-black mb-4">{category.name}</h2>
                <p className="text-xl whitespace-pre-line max-w-md mx-auto leading-tight">{category.tagline}</p>
                <Button
                  className="mt-6 bg-white text-black hover:bg-gray-200 font-black"
                  onClick={() => handleCategoryClick(category)}
                >
                  EXPLORE {category.name.toUpperCase()}
                </Button>
              </div>
              <div className="absolute inset-0 bg-black/20"></div>
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
      <section className="py-16 px-6 fade-in-scroll bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 text-black">
            STUFF YOU PROBABLY CAN'T AFFORD
            <span className="block text-lg font-normal text-gray-600 mt-2">(But will buy anyway because YOLO)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="bg-white border-black hover:border-red-600 transition-all group shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="cursor-pointer" onClick={() => (window.location.href = `/product/${product.id}`)}>
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <Badge className="mb-2 bg-red-600 text-white">{product.category}</Badge>
                    <h3 className="font-black text-lg mb-2 text-black">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-black text-black">₹{product.price}</span>
                      <Button size="sm" className="bg-black text-white hover:bg-red-600" onClick={addToCart}>
                        BUY NOW
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      You really gonna buy this or just stare? 👀
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-6 bg-gray-50 fade-in-scroll">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 text-black">
            WHAT OUR VICTIMS SAY
            <span className="block text-lg font-normal text-gray-600 mt-2">(Totally not fake reviews)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">@{review.name}</span>
                  </div>
                  <p className="text-gray-800 mb-4">"{review.text}"</p>
                  <Badge variant="outline" className="text-xs border-black text-black">
                    {review.product}
                  </Badge>
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

      {/* 18+ Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-white border-red-600 border-2 max-w-md w-full shadow-2xl">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <h3 className="text-2xl font-black mb-4 text-black">ADULTS ONLY!</h3>
              <p className="mb-6 text-gray-800">
                This section contains explicit humor, dark jokes, and content that might offend your mom. Proceed only
                if you can handle the chaos.
              </p>
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    setShowWarning(false)
                    window.location.href = "/category/18plus"
                  }}
                >
                  I'M READY FOR CHAOS
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-black text-black hover:bg-black hover:text-white"
                  onClick={() => setShowWarning(false)}
                >
                  NEVERMIND
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

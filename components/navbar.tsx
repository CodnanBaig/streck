"use client"

import { ShoppingCart, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react"
import { CartContext } from "@/components/providers"

interface NavbarProps {
  showBackButton?: boolean
  showShareButton?: boolean
}

export function Navbar({ showBackButton = false, showShareButton = false }: NavbarProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const { cartCount } = useContext(CartContext)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/category/18plus", label: "18+" },
    { href: "/category/fitness", label: "Fitness" },
    { href: "/category/pets", label: "Pets" },
    { href: "/category/funny", label: "Funny" },
    { href: "/category/profession", label: "Profession" },
  ]

  return (
    <header className="p-3 border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="outline"
              size="sm"
              className="border-black text-black hover:bg-black hover:text-white"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Link href="/" className="no-underline">
            <h1 className={`font-black tracking-wider text-black ${isHomePage ? "text-4xl" : "text-2xl"}`}>
              <span className={isHomePage ? "jittery" : ""}>STRECK</span>
            </h1>
          </Link>
        </div>
        
        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-semibold text-sm transition-colors hover:text-gray-600 ${
                pathname === item.href ? "text-black border-b-2 border-black" : "text-gray-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          {showShareButton && (
            <Button variant="outline" size="sm" className="border-black">
              <Share2 className="w-4 h-4" />
            </Button>
          )}
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
  )
} 
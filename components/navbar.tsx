"use client"

import { useState, useEffect, useContext } from "react"
import { ShoppingCart, ChevronDown, Menu, X, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CartContext } from "@/components/providers"

interface Category {
  id: number
  name: string
  slug: string
  status: string
}

interface ProductType {
  id: number
  name: string
  slug: string
  status: string
}

interface NavbarProps {
  showBackButton?: boolean
  showShareButton?: boolean
}

export function Navbar({ showBackButton = false, showShareButton = false }: NavbarProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const { cartCount } = useContext(CartContext)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [productTypes, setProductTypes] = useState<ProductType[]>([])

  // Fetch categories and product types
  useEffect(() => {
    fetchCategories()
    fetchProductTypes()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?status=active')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProductTypes = async () => {
    try {
      const response = await fetch('/api/product-types?status=active')
      if (response.ok) {
        const data = await response.json()
        setProductTypes(data)
      }
    } catch (error) {
      console.error('Error fetching product types:', error)
    }
  }

  const closeDropdowns = () => {
    setIsCategoriesOpen(false)
    setIsProductsOpen(false)
  }

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
              ← Back
            </Button>
          )}
          <Link href="/" className="no-underline" onClick={closeDropdowns}>
            <h1 className={`font-black tracking-wider text-black ${isHomePage ? "text-4xl" : "text-2xl"}`}>
              <span className={isHomePage ? "jittery" : ""}>STRECK</span>
            </h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Home */}
          <Link
            href="/"
            className={`font-semibold text-sm transition-colors hover:text-gray-600 ${
              pathname === "/" ? "text-black border-b-2 border-black" : "text-gray-700"
            }`}
            onClick={closeDropdowns}
          >
            Home
          </Link>

          {/* About */}
          <Link
            href="/about"
            className={`font-semibold text-sm transition-colors hover:text-gray-600 ${
              pathname === "/about" ? "text-black border-b-2 border-black" : "text-gray-700"
            }`}
            onClick={closeDropdowns}
          >
            About
          </Link>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              className={`font-semibold text-sm transition-colors hover:text-gray-600 flex items-center gap-1 ${
                pathname.startsWith("/category/") ? "text-black border-b-2 border-black" : "text-gray-700"
              }`}
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              Categories
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isCategoriesOpen && (
              <div 
                className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={closeDropdowns}
                  >
                    {category.name}
                  </Link>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <Link
                    href="/categories"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
                    onClick={closeDropdowns}
                  >
                    View All Categories
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Products Dropdown */}
          <div className="relative">
            <button
              className={`font-semibold text-sm transition-colors hover:text-gray-600 flex items-center gap-1 ${
                pathname.startsWith("/products/") ? "text-black border-b-2 border-black" : "text-gray-700"
              }`}
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              Products
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isProductsOpen && (
              <div 
                className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                {productTypes.map((type) => (
                  <Link
                    key={type.id}
                    href={`/products/${type.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={closeDropdowns}
                  >
                    {type.name}
                  </Link>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <Link
                    href="/products"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
                    onClick={closeDropdowns}
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
        
        <div className="flex items-center gap-2">
          {showShareButton && (
            <Button variant="outline" size="sm" className="border-black">
              <Share2 className="w-4 h-4" />
            </Button>
          )}
          
          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden border-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-2 space-y-2">
            <Link
              href="/"
              className="block py-2 text-sm font-semibold text-gray-700 hover:text-black"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block py-2 text-sm font-semibold text-gray-700 hover:text-black"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {/* Mobile Categories */}
            <div className="py-2">
              <div className="text-sm font-semibold text-gray-700 mb-2">Categories</div>
              <div className="pl-4 space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block py-1 text-sm text-gray-600 hover:text-black"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Products */}
            <div className="py-2">
              <div className="text-sm font-semibold text-gray-700 mb-2">Products</div>
              <div className="pl-4 space-y-1">
                {productTypes.map((type) => (
                  <Link
                    key={type.id}
                    href={`/products/${type.slug}`}
                    className="block py-1 text-sm text-gray-600 hover:text-black"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {type.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
} 
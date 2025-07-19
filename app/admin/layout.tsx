"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ShoppingBag,
  BarChart3,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
  ChevronDown,
  Tag
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
    submenu: [
      {
        title: "All Products",
        href: "/admin/products"
      },
      {
        title: "Bulk Upload",
        href: "/admin/products/bulk-upload"
      },
      {
        title: "Product Types",
        href: "/admin/product-types"
      }
    ]
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: ShoppingBag
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: Tag
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [adminUser, setAdminUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('adminToken')
        const user = localStorage.getItem('adminUser')
        
        if (!token || !user) {
          router.push('/admin/login')
          return
        }
        
        setAdminUser(JSON.parse(user))
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    // Only check auth if not on login page
    if (pathname !== '/admin/login') {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  const toggleSubmenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  // Show loading state while checking authentication (but not on login page)
  if (loading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If on login page, render children without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="h-[100vh] bg-gray-50 flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800 flex-shrink-0">
          <Link href="/admin" className="flex items-center">
            <h1 className="text-xl font-bold text-white">STRECK Admin</h1>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Navigation - Scrollable middle section */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="space-y-2 pb-4">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.submenu && item.submenu.some(sub => sub.href === pathname))
              const isExpanded = expandedMenus.includes(item.title)
              
              return (
                <div key={item.href}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.title}
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isExpanded && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.submenu.map((subItem) => {
                            const isSubActive = pathname === subItem.href
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                                  isSubActive
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.title}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="w-full p-4 border-t border-gray-700">
          <Link
            href="/"
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors mb-2"
          >
            <Home className="w-5 h-5 mr-3" />
            Back to Website
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:px-8 flex-shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="ml-4 lg:ml-0 text-lg font-semibold text-gray-900">
              {sidebarItems.find(item => item.href === pathname)?.title || 'Admin'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Online
            </Badge>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {adminUser?.name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 
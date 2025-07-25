"use client"

import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Trash2, Plus, Minus, CreditCard, Truck, Shield } from "lucide-react"
import { gsap } from "gsap"
import { CartContext } from "@/components/providers"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { toast } = useToast()
  const { cartItems: contextCartItems, updateQuantity, clearCart } = useContext(CartContext)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  })

  // Get cart items from context or sessionStorage as fallback
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    // Use context cart items if available, otherwise fall back to sessionStorage
    if (contextCartItems && contextCartItems.length > 0) {
      setCartItems(contextCartItems)
      console.log('Using context cart items:', contextCartItems)
    } else {
      // Fallback to sessionStorage
      const sessionCart = sessionStorage.getItem('sessionCart')
      if (sessionCart) {
        try {
          const parsedSessionCart = JSON.parse(sessionCart)
          setCartItems(parsedSessionCart)
          console.log('Using sessionStorage cart items:', parsedSessionCart)
        } catch (error) {
          console.error('Error parsing sessionStorage cart:', error)
          setCartItems([])
        }
      } else {
        setCartItems([])
      }
    }
  }, [contextCartItems])

  // Debug logging
  useEffect(() => {
    console.log('Checkout page - cartItems:', cartItems)
    console.log('Checkout page - cartItems length:', cartItems.length)
  }, [cartItems])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon && appliedCoupon.discountAmount ? appliedCoupon.discountAmount : 0
  const shipping = shippingMethod === "express" ? 200 : 0
  const total = subtotal - discount + shipping

  useEffect(() => {
    gsap.fromTo(".checkout-content", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item
      const updatedItems = cartItems.filter(item => item.id !== id)
      setCartItems(updatedItems)
      
      // Update sessionStorage
      sessionStorage.setItem('sessionCart', JSON.stringify(updatedItems))
      
      // Update context if available
      if (updateQuantity) {
        updateQuantity(id, 0)
      }
    } else {
      // Update quantity
      const updatedItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
      setCartItems(updatedItems)
      
      // Update sessionStorage
      sessionStorage.setItem('sessionCart', JSON.stringify(updatedItems))
      
      // Update context if available
      if (updateQuantity) {
        updateQuantity(id, newQuantity)
      }
    }
  }

  const handleClearCart = () => {
    setCartItems([])
    sessionStorage.removeItem('sessionCart')
    if (clearCart) {
      clearCart()
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Coupon",
        description: "Please enter a coupon code.",
      })
      return
    }

    setCouponLoading(true)

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          subtotal: subtotal,
          items: cartItems
        })
      })

      if (response.ok) {
        const result = await response.json()
        setAppliedCoupon(result)
        setCouponCode("")
        gsap.to(".coupon-success", { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 })
        toast({
          variant: "success",
          title: "Coupon Applied!",
          description: `${result.coupon.name || result.coupon.code} - You saved ₹${result.discountAmount.toLocaleString()}`,
        })
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Invalid Coupon",
          description: error.error || "Invalid coupon code.",
        })
      }
    } catch (error) {
      console.error('Error applying coupon:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
      })
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order.",
    })
  }

  const handleCheckout = async () => {
    // Validate form data
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "Your cart is empty!",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare order data
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        subtotal: subtotal,
        discount: discount,
        couponCode: appliedCoupon && appliedCoupon.coupon ? appliedCoupon.coupon.code : null,
        couponId: appliedCoupon && appliedCoupon.coupon ? appliedCoupon.coupon.id : null,
        tax: subtotal * 0.18, // 18% GST
        shipping: shipping,
        total: total,
        paymentMethod: paymentMethod === "card" ? "Online Payment" : "UPI",
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          productPrice: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          productImage: item.image,
          productSize: item.size || null,
          productColor: item.color || null
        }))
      }

      // Create order via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const order = await response.json()
        
        // Clear cart
        handleClearCart()
        
        // Show success message
        toast({
          variant: "success",
          title: "Order Placed!",
          description: `Order placed successfully! Order number: ${order.orderNumber}`,
        })
        
        // Redirect to home page
        window.location.href = "/"
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to place order: ${error.error}`,
        })
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to place order. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Like your soul. Go buy something to fill the void.</p>
          <Button onClick={() => (window.location.href = "/")} className="bg-black text-white">
            Start Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="bg-black text-white py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white hover:text-black"
              onClick={() => (window.location.href = "/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <h1 className="text-2xl font-black">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="checkout-content max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items & Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cart Items */}
            <Card className="border-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Your Questionable Choices</span>
                  <Badge>{cartItems.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-600">
                        {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                      </p>
                      <p className="font-bold text-lg">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 border border-gray-300 rounded font-bold">{item.quantity}</span>
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      onClick={() => handleUpdateQuantity(item.id, 0)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="border-black">
              <CardHeader>
                <CardTitle>Shipping Info (Where to send your regrets)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Your actual name" 
                      className="border-black"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Not your Instagram handle" 
                      className="border-black"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="We promise not to spam... much"
                    className="border-black"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input 
                    id="phone" 
                    placeholder="For delivery updates and existential calls" 
                    className="border-black"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input 
                    id="address" 
                    placeholder="Where you actually live" 
                    className="border-black"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      placeholder="Your city" 
                      className="border-black"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input 
                      id="state" 
                      placeholder="Your state" 
                      className="border-black"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input 
                      id="pincode" 
                      placeholder="6 digits" 
                      className="border-black"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card className="border-black">
              <CardHeader>
                <CardTitle>Shipping Method (How fast you want to regret this)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="text-red-600"
                    />
                    <Truck className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-bold">Standard Delivery (5-7 days)</div>
                      <div className="text-sm text-gray-600">Free • When it gets there, it gets there</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="text-red-600"
                    />
                    <Truck className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-bold">Express Delivery (2-3 days)</div>
                      <div className="text-sm text-gray-600">₹200 • For the impatient</div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-black">
              <CardHeader>
                <CardTitle>Payment Method (How you'll pay for your choices)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-red-600"
                    />
                    <CreditCard className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-bold">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, RuPay accepted</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-red-600"
                    />
                    <Shield className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-bold">UPI</div>
                      <div className="text-sm text-gray-600">PhonePe, GPay, Paytm</div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-black sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary (The Damage)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>₹{(subtotal * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.coupon.code})</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                  <Label>Coupon Code (If you're lucky)</Label>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="border-black"
                        disabled={couponLoading}
                      />
                      <Button
                        variant="outline"
                        className="border-black text-black hover:bg-black hover:text-white"
                        onClick={applyCoupon}
                        disabled={couponLoading}
                      >
                        {couponLoading ? "..." : "Apply"}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-green-800">{appliedCoupon.coupon.code}</p>
                          <p className="text-sm text-green-600">{appliedCoupon.coupon.name || 'Discount Applied'}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="text-green-600 hover:text-green-800"
                        >
                          Remove
                        </Button>
                      </div>
                      <p className="coupon-success text-green-600 text-sm font-bold mt-1">
                        You saved ₹{discount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full bg-red-600 text-white hover:bg-red-700 text-lg py-3" 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "PLACING ORDER..." : "COMPLETE ORDER"}
                </Button>

                <div className="text-xs text-gray-600 text-center">
                  By placing this order, you agree that we're not responsible for your fashion choices or life
                  decisions.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

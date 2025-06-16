"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Trash2, Plus, Minus, CreditCard, Truck, Shield } from "lucide-react"
import { gsap } from "gsap"

const cartItems = [
  {
    id: 1,
    name: "Toxic But Make It Fashion",
    price: 1299,
    image: "/placeholder.svg?height=100&width=100",
    size: "M",
    color: "Black",
    quantity: 2,
  },
  {
    id: 2,
    name: "Gym Jaana Hai Bro",
    price: 1499,
    image: "/placeholder.svg?height=100&width=100",
    size: "L",
    color: "White",
    quantity: 1,
  },
]

export default function CheckoutPage() {
  const [items, setItems] = useState(cartItems)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState("")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("card")

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon === "CHAOS10" ? subtotal * 0.1 : 0
  const shipping = shippingMethod === "express" ? 200 : 0
  const total = subtotal - discount + shipping

  useEffect(() => {
    gsap.fromTo(".checkout-content", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setItems(items.filter((item) => item.id !== id))
    } else {
      setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const applyCoupon = () => {
    if (couponCode === "CHAOS10") {
      setAppliedCoupon(couponCode)
      gsap.to(".coupon-success", { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 })
    } else {
      alert("Invalid coupon code. Try 'CHAOS10' if you're feeling lucky.")
    }
  }

  const handleCheckout = () => {
    alert("Payment successful! Your order will arrive when it arrives. Maybe.")
    window.location.href = "/"
  }

  if (items.length === 0) {
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
      <header className="p-6 border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="border-black text-black hover:bg-black hover:text-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-black">STRECK CHECKOUT</h1>
          <Badge className="bg-red-600 text-white">Almost There!</Badge>
        </div>
      </header>

      <div className="checkout-content max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items & Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cart Items */}
            <Card className="border-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Your Questionable Choices</span>
                  <Badge>{items.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-600">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="font-bold text-lg">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 border border-gray-300 rounded font-bold">{item.quantity}</span>
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      onClick={() => updateQuantity(item.id, 0)}
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
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Your actual name" className="border-black" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Not your Instagram handle" className="border-black" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="We promise not to spam... much"
                    className="border-black"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="For delivery updates and existential calls" className="border-black" />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Where you actually live" className="border-black" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Your city" className="border-black" />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="Your state" className="border-black" />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" placeholder="6 digits" className="border-black" />
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
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon})</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                  <Label>Coupon Code (If you're lucky)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Try CHAOS10"
                      className="border-black"
                    />
                    <Button
                      variant="outline"
                      className="border-black text-black hover:bg-black hover:text-white"
                      onClick={applyCoupon}
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <p className="coupon-success text-green-600 text-sm font-bold">
                      Coupon applied! You saved ₹{discount}
                    </p>
                  )}
                </div>

                <Button className="w-full bg-red-600 text-white hover:bg-red-700 text-lg py-3" onClick={handleCheckout}>
                  COMPLETE ORDER
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

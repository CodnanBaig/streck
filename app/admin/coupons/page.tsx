"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Tag,
  Calendar,
  DollarSign,
  Percent,
  Users,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface Coupon {
  id: number
  code: string
  name: string
  description: string | null
  discountType: string
  discountValue: number
  minimumOrderAmount: number
  maximumDiscount: number | null
  usageLimit: number | null
  usedCount: number
  validFrom: string
  validUntil: string
  isActive: boolean
  appliesTo: string
  applicableItems: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminCoupons() {
  const { toast } = useToast()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minimumOrderAmount: "",
    maximumDiscount: "",
    usageLimit: "",
    validFrom: "",
    validUntil: "",
    isActive: true,
    appliesTo: "all",
    applicableItems: ""
  })

  // Fetch coupons from API
  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/coupons')
      if (response.ok) {
        const data = await response.json()
        setCoupons(data)
      } else {
        console.error('Failed to fetch coupons')
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date()
    const validFrom = new Date(coupon.validFrom)
    const validUntil = new Date(coupon.validUntil)
    
    if (!coupon.isActive) {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
    }
    
    if (now < validFrom) {
      return <Badge className="bg-yellow-100 text-yellow-800">Upcoming</Badge>
    }
    
    if (now > validUntil) {
      return <Badge className="bg-red-100 text-red-800">Expired</Badge>
    }
    
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return <Badge className="bg-red-100 text-red-800">Limit Reached</Badge>
    }
    
    return <Badge className="bg-green-100 text-green-800">Active</Badge>
  }

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`
    } else {
      return `₹${coupon.discountValue}`
    }
  }

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCoupon = async () => {
    try {
      // Validate required fields
      if (!newCoupon.code || !newCoupon.name || !newCoupon.discountValue || !newCoupon.validFrom || !newCoupon.validUntil) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields",
        })
        return
      }

      const couponData = {
        ...newCoupon,
        discountValue: parseFloat(newCoupon.discountValue),
        minimumOrderAmount: newCoupon.minimumOrderAmount ? parseFloat(newCoupon.minimumOrderAmount) : 0,
        maximumDiscount: newCoupon.maximumDiscount ? parseFloat(newCoupon.maximumDiscount) : null,
        usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : null,
        applicableItems: newCoupon.applicableItems ? newCoupon.applicableItems.split(',').map(item => item.trim()) : null
      }

      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData)
      })

      if (response.ok) {
        const createdCoupon = await response.json()
        setCoupons(prev => [createdCoupon, ...prev])
        setIsAddModalOpen(false)
        setNewCoupon({
          code: "",
          name: "",
          description: "",
          discountType: "percentage",
          discountValue: "",
          minimumOrderAmount: "",
          maximumDiscount: "",
          usageLimit: "",
          validFrom: "",
          validUntil: "",
          isActive: true,
          appliesTo: "all",
          applicableItems: ""
        })
        toast({
          variant: "success",
          title: "Success!",
          description: "Coupon added successfully!",
        })
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to add coupon: ${error.error}`,
        })
      }
    } catch (error) {
      console.error('Error adding coupon:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add coupon. Please try again.",
      })
    }
  }

  const handleViewCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setNewCoupon({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minimumOrderAmount: coupon.minimumOrderAmount.toString(),
      maximumDiscount: coupon.maximumDiscount?.toString() || "",
      usageLimit: coupon.usageLimit?.toString() || "",
      validFrom: coupon.validFrom.split('T')[0],
      validUntil: coupon.validUntil.split('T')[0],
      isActive: coupon.isActive,
      appliesTo: coupon.appliesTo,
      applicableItems: coupon.applicableItems ? JSON.parse(coupon.applicableItems).join(', ') : ""
    })
    setIsEditModalOpen(true)
  }

  const handleEditCoupon = async () => {
    if (!selectedCoupon) return

    try {
      const couponData = {
        ...newCoupon,
        discountValue: parseFloat(newCoupon.discountValue),
        minimumOrderAmount: newCoupon.minimumOrderAmount ? parseFloat(newCoupon.minimumOrderAmount) : 0,
        maximumDiscount: newCoupon.maximumDiscount ? parseFloat(newCoupon.maximumDiscount) : null,
        usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : null,
        applicableItems: newCoupon.applicableItems ? newCoupon.applicableItems.split(',').map(item => item.trim()) : null
      }

      const response = await fetch(`/api/coupons/${selectedCoupon.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData)
      })

      if (response.ok) {
        const updatedCoupon = await response.json()
        setCoupons(prev => prev.map(c => c.id === selectedCoupon.id ? updatedCoupon : c))
        setIsEditModalOpen(false)
        setSelectedCoupon(null)
        toast({
          variant: "success",
          title: "Success!",
          description: "Coupon updated successfully!",
        })
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to update coupon: ${error.error}`,
        })
      }
    } catch (error) {
      console.error('Error updating coupon:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update coupon. Please try again.",
      })
    }
  }

  const handleDeleteClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return

    try {
      const response = await fetch(`/api/coupons/${selectedCoupon.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCoupons(prev => prev.filter(c => c.id !== selectedCoupon.id))
        toast({
          variant: "success",
          title: "Success!",
          description: "Coupon deleted successfully!",
        })
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to delete coupon: ${error.error}`,
        })
      }
    } catch (error) {
      console.error('Error deleting coupon:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete coupon. Please try again.",
      })
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setNewCoupon(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Calculate stats
  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.isActive).length,
    expired: coupons.filter(c => new Date() > new Date(c.validUntil)).length,
    totalUsage: coupons.reduce((sum, c) => sum + c.usedCount, 0)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Tag className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading coupons...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
            <p className="text-gray-600 mt-2">Manage discount coupons and promotional codes</p>
          </div>
          
          {/* Add Coupon Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Add New Coupon
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Coupon Code *</Label>
                    <Input
                      id="code"
                      placeholder="e.g., SAVE20"
                      value={newCoupon.code}
                      onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Coupon Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., 20% Off Sale"
                      value={newCoupon.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the coupon offer..."
                    value={newCoupon.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Discount Settings */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select value={newCoupon.discountType} onValueChange={(value) => handleInputChange("discountType", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Discount Value *</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      placeholder={newCoupon.discountType === 'percentage' ? "20" : "100"}
                      value={newCoupon.discountValue}
                      onChange={(e) => handleInputChange("discountValue", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maximumDiscount">Max Discount</Label>
                    <Input
                      id="maximumDiscount"
                      type="number"
                      placeholder="500"
                      value={newCoupon.maximumDiscount}
                      onChange={(e) => handleInputChange("maximumDiscount", e.target.value)}
                    />
                  </div>
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minimumOrderAmount">Minimum Order Amount</Label>
                    <Input
                      id="minimumOrderAmount"
                      type="number"
                      placeholder="0"
                      value={newCoupon.minimumOrderAmount}
                      onChange={(e) => handleInputChange("minimumOrderAmount", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      placeholder="Unlimited"
                      value={newCoupon.usageLimit}
                      onChange={(e) => handleInputChange("usageLimit", e.target.value)}
                    />
                  </div>
                </div>

                {/* Validity Period */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validFrom">Valid From *</Label>
                    <Input
                      id="validFrom"
                      type="date"
                      value={newCoupon.validFrom}
                      onChange={(e) => handleInputChange("validFrom", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until *</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={newCoupon.validUntil}
                      onChange={(e) => handleInputChange("validUntil", e.target.value)}
                    />
                  </div>
                </div>

                {/* Applicability */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appliesTo">Applies To</Label>
                    <Select value={newCoupon.appliesTo} onValueChange={(value) => handleInputChange("appliesTo", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="categories">Specific Categories</SelectItem>
                        <SelectItem value="products">Specific Products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isActive">Status</Label>
                    <Select value={newCoupon.isActive.toString()} onValueChange={(value) => handleInputChange("isActive", value === 'true')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Applicable Items */}
                {(newCoupon.appliesTo === 'categories' || newCoupon.appliesTo === 'products') && (
                  <div className="space-y-2">
                    <Label htmlFor="applicableItems">
                      {newCoupon.appliesTo === 'categories' ? 'Category IDs' : 'Product IDs'} (comma-separated)
                    </Label>
                    <Input
                      id="applicableItems"
                      placeholder="1, 2, 3"
                      value={newCoupon.applicableItems}
                      onChange={(e) => handleInputChange("applicableItems", e.target.value)}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddCoupon}
                    disabled={!newCoupon.code || !newCoupon.name || !newCoupon.discountValue || !newCoupon.validFrom || !newCoupon.validUntil}
                    className="bg-black hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Coupon
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Tag className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Coupons</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usage</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search coupons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => (
            <Card key={coupon.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{coupon.code}</h3>
                    <p className="text-sm text-gray-600 mb-2">{coupon.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-green-600">
                        {getDiscountDisplay(coupon)}
                      </span>
                      {coupon.minimumOrderAmount > 0 && (
                        <span className="text-sm text-gray-500">
                          Min ₹{coupon.minimumOrderAmount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(coupon)}
                    <div className="text-xs text-gray-500">
                      {coupon.usedCount}/{coupon.usageLimit || '∞'} used
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p>Valid: {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}</p>
                  <p>Applies to: {coupon.appliesTo}</p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewCoupon(coupon)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleEditClick(coupon)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteClick(coupon)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCoupons.length === 0 && !loading && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
            <p className="text-gray-600">Try adjusting your search terms or add a new coupon.</p>
          </div>
        )}

        {/* View Coupon Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Coupon Details
              </DialogTitle>
            </DialogHeader>
            {selectedCoupon && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedCoupon.code}</h3>
                    <p className="text-sm text-gray-600">{selectedCoupon.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-lg text-green-600">
                        {getDiscountDisplay(selectedCoupon)}
                      </span>
                      {selectedCoupon.maximumDiscount && (
                        <span className="text-sm text-gray-500">
                          Max ₹{selectedCoupon.maximumDiscount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(selectedCoupon)}
                    <div className="text-sm text-gray-600 mt-2">
                      {selectedCoupon.usedCount}/{selectedCoupon.usageLimit || '∞'} used
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedCoupon.description || "No description available"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Minimum Order: ₹{selectedCoupon.minimumOrderAmount}</p>
                      <p>Applies to: {selectedCoupon.appliesTo}</p>
                      <p>Usage Limit: {selectedCoupon.usageLimit || 'Unlimited'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Validity</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>From: {new Date(selectedCoupon.validFrom).toLocaleDateString()}</p>
                      <p>Until: {new Date(selectedCoupon.validUntil).toLocaleDateString()}</p>
                      <p>Status: {selectedCoupon.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsViewModalOpen(false)
                      handleEditClick(selectedCoupon)
                    }}
                    className="bg-black hover:bg-gray-800"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Coupon
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Coupon Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Edit Coupon
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Coupon Code *</Label>
                  <Input
                    id="edit-code"
                    placeholder="e.g., SAVE20"
                    value={newCoupon.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Coupon Name *</Label>
                  <Input
                    id="edit-name"
                    placeholder="e.g., 20% Off Sale"
                    value={newCoupon.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe the coupon offer..."
                  value={newCoupon.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Discount Settings */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-discountType">Discount Type</Label>
                  <Select value={newCoupon.discountType} onValueChange={(value) => handleInputChange("discountType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-discountValue">Discount Value *</Label>
                  <Input
                    id="edit-discountValue"
                    type="number"
                    placeholder={newCoupon.discountType === 'percentage' ? "20" : "100"}
                    value={newCoupon.discountValue}
                    onChange={(e) => handleInputChange("discountValue", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maximumDiscount">Max Discount</Label>
                  <Input
                    id="edit-maximumDiscount"
                    type="number"
                    placeholder="500"
                    value={newCoupon.maximumDiscount}
                    onChange={(e) => handleInputChange("maximumDiscount", e.target.value)}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-minimumOrderAmount">Minimum Order Amount</Label>
                  <Input
                    id="edit-minimumOrderAmount"
                    type="number"
                    placeholder="0"
                    value={newCoupon.minimumOrderAmount}
                    onChange={(e) => handleInputChange("minimumOrderAmount", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-usageLimit">Usage Limit</Label>
                  <Input
                    id="edit-usageLimit"
                    type="number"
                    placeholder="Unlimited"
                    value={newCoupon.usageLimit}
                    onChange={(e) => handleInputChange("usageLimit", e.target.value)}
                  />
                </div>
              </div>

              {/* Validity Period */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-validFrom">Valid From *</Label>
                  <Input
                    id="edit-validFrom"
                    type="date"
                    value={newCoupon.validFrom}
                    onChange={(e) => handleInputChange("validFrom", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-validUntil">Valid Until *</Label>
                  <Input
                    id="edit-validUntil"
                    type="date"
                    value={newCoupon.validUntil}
                    onChange={(e) => handleInputChange("validUntil", e.target.value)}
                  />
                </div>
              </div>

              {/* Applicability */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-appliesTo">Applies To</Label>
                  <Select value={newCoupon.appliesTo} onValueChange={(value) => handleInputChange("appliesTo", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="categories">Specific Categories</SelectItem>
                      <SelectItem value="products">Specific Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-isActive">Status</Label>
                  <Select value={newCoupon.isActive.toString()} onValueChange={(value) => handleInputChange("isActive", value === 'true')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Applicable Items */}
              {(newCoupon.appliesTo === 'categories' || newCoupon.appliesTo === 'products') && (
                <div className="space-y-2">
                  <Label htmlFor="edit-applicableItems">
                    {newCoupon.appliesTo === 'categories' ? 'Category IDs' : 'Product IDs'} (comma-separated)
                  </Label>
                  <Input
                    id="edit-applicableItems"
                    placeholder="1, 2, 3"
                    value={newCoupon.applicableItems}
                    onChange={(e) => handleInputChange("applicableItems", e.target.value)}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEditCoupon}
                  disabled={!newCoupon.code || !newCoupon.name || !newCoupon.discountValue || !newCoupon.validFrom || !newCoupon.validUntil}
                  className="bg-black hover:bg-gray-800"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Coupon
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="Delete Coupon"
          description={`Are you sure you want to delete "${selectedCoupon?.code}"? This action cannot be undone.`}
          onConfirm={handleDeleteCoupon}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />

      </div>
    </div>
  )
} 
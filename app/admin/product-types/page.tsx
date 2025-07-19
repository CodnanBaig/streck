"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
  Package,
  ChevronDown
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface ProductType {
  id: number
  name: string
  slug: string
  description: string | null
  status: string
  sortOrder: number
  productCount: number
  createdAt: string
  updatedAt: string
}

export default function AdminProductTypes() {
  const { toast } = useToast()
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null)
  const [newProductType, setNewProductType] = useState({
    name: "",
    slug: "",
    description: "",
    status: "active",
    sortOrder: 0
  })

  // Fetch product types from API
  useEffect(() => {
    fetchProductTypes()
  }, [])

  const fetchProductTypes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/product-types')
      if (response.ok) {
        const data = await response.json()
        setProductTypes(data)
      } else {
        console.error('Failed to fetch product types')
      }
    } catch (error) {
      console.error('Error fetching product types:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const filteredProductTypes = productTypes.filter(productType =>
    productType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (productType.description && productType.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddProductType = async () => {
    try {
      // Validate required fields
      if (!newProductType.name || !newProductType.slug) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields (Name and Slug)",
        })
        return
      }

      const response = await fetch('/api/product-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProductType)
      })

      if (response.ok) {
        const createdProductType = await response.json()
        setProductTypes(prev => [createdProductType, ...prev])
        setIsAddModalOpen(false)
        setNewProductType({
          name: "",
          slug: "",
          description: "",
          status: "active",
          sortOrder: 0
        })
        toast({
          variant: "success",
          title: "Success!",
          description: "Product type added successfully!",
        })
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to add product type: ${error.error}`,
        })
      }
    } catch (error) {
      console.error('Error adding product type:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product type. Please try again.",
      })
    }
  }

  const handleEditProductType = async () => {
    if (!selectedProductType) return

    try {
      const response = await fetch(`/api/product-types/${selectedProductType.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProductType)
      })

      if (response.ok) {
        const updatedProductType = await response.json()
        setProductTypes(prev => prev.map(pt => pt.id === selectedProductType.id ? updatedProductType : pt))
        setIsEditModalOpen(false)
        setSelectedProductType(null)
        toast({
          variant: "success",
          title: "Success!",
          description: "Product type updated successfully!",
        })
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to update product type: ${error.error}`,
        })
      }
    } catch (error) {
      console.error('Error updating product type:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product type. Please try again.",
      })
    }
  }

  const handleDeleteClick = (productType: ProductType) => {
    setSelectedProductType(productType)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteProductType = async () => {
    if (!selectedProductType) return

    try {
      const response = await fetch(`/api/product-types/${selectedProductType.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProductTypes(prev => prev.filter(pt => pt.id !== selectedProductType.id))
        toast({
          variant: "success",
          title: "Success!",
          description: "Product type deleted successfully!",
        })
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to delete product type: ${error.error}`,
        })
      }
    } catch (error) {
      console.error('Error deleting product type:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product type. Please try again.",
      })
    }
  }

  const handleViewProductType = (productType: ProductType) => {
    setSelectedProductType(productType)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (productType: ProductType) => {
    setSelectedProductType(productType)
    setNewProductType({
      name: productType.name,
      slug: productType.slug,
      description: productType.description || "",
      status: productType.status,
      sortOrder: productType.sortOrder
    })
    setIsEditModalOpen(true)
  }

  const handleInputChange = (field: string, value: any) => {
    setNewProductType(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    handleInputChange("name", name)
    // Auto-generate slug from name if slug is empty
    if (!newProductType.slug || newProductType.slug === generateSlug(newProductType.name)) {
      handleInputChange("slug", generateSlug(name))
    }
  }

  // Calculate stats
  const stats = {
    total: productTypes.length,
    active: productTypes.filter(pt => pt.status === 'active').length,
    inactive: productTypes.filter(pt => pt.status === 'inactive').length,
    totalProducts: productTypes.reduce((sum, pt) => sum + (pt.productCount || 0), 0)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Package className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading product types...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Product Types</h1>
            <p className="text-gray-600 mt-2">Manage your product type categories</p>
          </div>
          
          {/* Add Product Type Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Product Type
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Add New Product Type
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Product Type Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Product Type Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Leggings, Caps, Bags"
                    value={newProductType.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="leggings"
                    value={newProductType.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    This will be used in the URL: /products/{newProductType.slug || 'example'}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this product type..."
                    value={newProductType.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Status and Sort Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newProductType.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      placeholder="0"
                      value={newProductType.sortOrder}
                      onChange={(e) => handleInputChange("sortOrder", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Product Type Preview */}
                {newProductType.name && (
                  <div className="space-y-2">
                    <Label>Product Type Preview</Label>
                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{newProductType.name}</h4>
                          {newProductType.description && (
                            <p className="text-sm text-gray-600">{newProductType.description}</p>
                          )}
                          <p className="text-xs text-gray-500">Slug: /products/{newProductType.slug}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={newProductType.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {newProductType.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </Card>
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
                    onClick={handleAddProductType}
                    disabled={!newProductType.name || !newProductType.slug}
                    className="bg-black hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product Type
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
                <Package className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Product Types</p>
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
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
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
                    placeholder="Search product types..."
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

        {/* Product Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProductTypes.map((productType) => (
            <Card key={productType.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{productType.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{productType.description}</p>
                    <p className="text-sm text-gray-500">Slug: /products/{productType.slug}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">{productType.productCount || 0} products</span>
                  </div>
                  <span className="text-xs text-gray-500">Order: {productType.sortOrder}</span>
                </div>

                <div className="flex gap-2 mb-4">
                  {getStatusBadge(productType.status)}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewProductType(productType)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleEditClick(productType)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteClick(productType)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Product Type Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Product Type Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedProductType && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedProductType.name}</h3>
                    <p className="text-sm text-gray-500">Slug: /products/{selectedProductType.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(selectedProductType.status)}
                  </div>
                </div>

                {selectedProductType.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedProductType.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Sort Order</h4>
                    <p className="text-gray-600">{selectedProductType.sortOrder}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Products</h4>
                    <p className="text-gray-600">{selectedProductType.productCount || 0} products</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Created</h4>
                    <p className="text-gray-600">{new Date(selectedProductType.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
                    <p className="text-gray-600">{new Date(selectedProductType.updatedAt).toLocaleDateString()}</p>
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
                      handleEditClick(selectedProductType)
                    }}
                    className="bg-black hover:bg-gray-800"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Product Type
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Product Type Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Edit Product Type
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Product Type Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Type Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Leggings, Caps, Bags"
                  value={newProductType.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="edit-slug">URL Slug *</Label>
                <Input
                  id="edit-slug"
                  placeholder="leggings"
                  value={newProductType.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  This will be used in the URL: /products/{newProductType.slug || 'example'}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe this product type..."
                  value={newProductType.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Status and Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={newProductType.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sortOrder">Sort Order</Label>
                  <Input
                    id="edit-sortOrder"
                    type="number"
                    placeholder="0"
                    value={newProductType.sortOrder}
                    onChange={(e) => handleInputChange("sortOrder", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEditProductType}
                  disabled={!newProductType.name || !newProductType.slug}
                  className="bg-black hover:bg-gray-800"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Product Type
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="Delete Product Type"
          description={`Are you sure you want to delete "${selectedProductType?.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteProductType}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />

      </div>
    </div>
  )
} 
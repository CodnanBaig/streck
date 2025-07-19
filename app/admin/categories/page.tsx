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
  Tag,
  Upload,
  Palette
} from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  color: string
  status: string
  featured: boolean
  sortOrder: number
  productCount: number
  createdAt: string
  updatedAt: string
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    status: "active",
    image: "",
    color: "bg-gray-600",
    featured: false,
    sortOrder: 0
  })

  const colorOptions = [
    { value: "bg-red-600", label: "Red", preview: "bg-red-600" },
    { value: "bg-blue-600", label: "Blue", preview: "bg-blue-600" },
    { value: "bg-green-600", label: "Green", preview: "bg-green-600" },
    { value: "bg-purple-600", label: "Purple", preview: "bg-purple-600" },
    { value: "bg-orange-600", label: "Orange", preview: "bg-orange-600" },
    { value: "bg-pink-600", label: "Pink", preview: "bg-pink-600" },
    { value: "bg-gray-600", label: "Gray", preview: "bg-gray-600" },
    { value: "bg-gray-800", label: "Dark Gray", preview: "bg-gray-800" }
  ]

  // Fetch categories from API
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        console.error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      draft: { color: "bg-yellow-100 text-yellow-800", label: "Draft" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddCategory = async () => {
    try {
      // Validate required fields
      if (!newCategory.name || !newCategory.slug) {
        alert("Please fill in all required fields (Name and Slug)")
        return
      }

      const categoryData = {
        ...newCategory,
        sortOrder: parseInt(newCategory.sortOrder.toString()) || 0
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
      })

      if (response.ok) {
        const createdCategory = await response.json()
        setCategories(prev => [createdCategory, ...prev])
        setIsAddModalOpen(false)
        setNewCategory({
          name: "",
          slug: "",
          description: "",
          status: "active",
          image: "",
          color: "bg-gray-600",
          featured: false,
          sortOrder: 0
        })
        alert("Category added successfully!")
      } else {
        const error = await response.json()
        alert(`Failed to add category: ${error.error}`)
      }
    } catch (error) {
      console.error('Error adding category:', error)
      alert("Failed to add category. Please try again.")
    }
  }

  const handleEditCategory = async () => {
    if (!selectedCategory) return

    try {
      const categoryData = {
        ...newCategory,
        sortOrder: parseInt(newCategory.sortOrder.toString()) || 0
      }

      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
      })

      if (response.ok) {
        const updatedCategory = await response.json()
        setCategories(prev => prev.map(c => c.id === selectedCategory.id ? updatedCategory : c))
        setIsEditModalOpen(false)
        setSelectedCategory(null)
        alert("Category updated successfully!")
      } else {
        const error = await response.json()
        alert(`Failed to update category: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert("Failed to update category. Please try again.")
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCategories(prev => prev.filter(c => c.id !== categoryId))
        alert("Category deleted successfully!")
      } else {
        const error = await response.json()
        alert(`Failed to delete category: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert("Failed to delete category. Please try again.")
    }
  }

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsViewModalOpen(true)
  }

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setNewCategory({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      status: category.status,
      image: category.image || "",
      color: category.color,
      featured: category.featured,
      sortOrder: category.sortOrder
    })
    setIsEditModalOpen(true)
  }

  const handleInputChange = (field: string, value: any) => {
    setNewCategory(prev => ({
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
    if (!newCategory.slug || newCategory.slug === generateSlug(newCategory.name)) {
      handleInputChange("slug", generateSlug(name))
    }
  }

  // Calculate stats
  const stats = {
    total: categories.length,
    active: categories.filter(c => c.status === 'active').length,
    featured: categories.filter(c => c.featured).length,
    totalProducts: categories.reduce((sum, c) => sum + c.productCount, 0)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Tag className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading categories...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">Organize your product categories</p>
          </div>
          
          {/* Add Category Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Add New Category
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Category Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Funny, Fitness, 18+"
                    value={newCategory.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="funny"
                    value={newCategory.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    This will be used in the URL: /category/{newCategory.slug || 'example'}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this category is about..."
                    value={newCategory.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Status and Color */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newCategory.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Category Color</Label>
                    <Select value={newCategory.color} onValueChange={(value) => handleInputChange("color", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full ${color.preview} mr-2`}></div>
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Image Upload and Sort Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Category Image</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        placeholder="https://example.com/category-image.jpg"
                        value={newCategory.image}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      placeholder="0"
                      value={newCategory.sortOrder}
                      onChange={(e) => handleInputChange("sortOrder", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newCategory.featured}
                    onChange={(e) => handleInputChange("featured", e.target.checked)}
                  />
                  <Label htmlFor="featured">Featured Category</Label>
                </div>

                {/* Category Preview */}
                {newCategory.name && (
                  <div className="space-y-2">
                    <Label>Category Preview</Label>
                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full ${newCategory.color} flex items-center justify-center`}>
                          <Tag className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{newCategory.name}</h4>
                          {newCategory.description && (
                            <p className="text-sm text-gray-600">{newCategory.description}</p>
                          )}
                          <p className="text-xs text-gray-500">Slug: /{newCategory.slug}</p>
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(newCategory.status)}
                          {newCategory.featured && <Badge className="bg-blue-100 text-blue-800">Featured</Badge>}
                        </div>
                      </div>
                      {newCategory.image && (
                        <div className="mt-3">
                          <img 
                            src={newCategory.image} 
                            alt="Preview" 
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                      )}
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
                    onClick={handleAddCategory}
                    disabled={!newCategory.name || !newCategory.slug}
                    className="bg-black hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
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
                  <p className="text-sm font-medium text-gray-600">Total Categories</p>
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
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
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
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
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
                    placeholder="Search categories..."
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

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Category Image */}
                <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={category.image || "/placeholder.svg"} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(category.status)}
                  </div>
                  {category.featured && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                    </div>
                  )}
                </div>
                
                {/* Category Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      <p className="text-sm text-gray-500">Slug: /{category.slug}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${category.color} mr-2`}></div>
                      <span className="text-sm text-gray-600">{category.productCount} products</span>
                    </div>
                    <span className="text-xs text-gray-500">Order: {category.sortOrder}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewCategory(category)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditClick(category)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && !loading && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search terms or add a new category.</p>
          </div>
        )}

        {/* View Category Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Category Details
              </DialogTitle>
            </DialogHeader>
            {selectedCategory && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedCategory.name}</h3>
                    <p className="text-sm text-gray-600">Slug: /{selectedCategory.slug}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-4 h-4 rounded-full ${selectedCategory.color}`}></div>
                      <span className="text-sm text-gray-600">Category Color</span>
                    </div>
                  </div>
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    {selectedCategory.image ? (
                      <img 
                        src={selectedCategory.image} 
                        alt={selectedCategory.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    ) : (
                      <Tag className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedCategory.description || "No description available"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Status: {selectedCategory.status}</p>
                      <p>Featured: {selectedCategory.featured ? "Yes" : "No"}</p>
                      <p>Sort Order: {selectedCategory.sortOrder}</p>
                      <p>Products: {selectedCategory.productCount}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Timestamps</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Created: {new Date(selectedCategory.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(selectedCategory.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {getStatusBadge(selectedCategory.status)}
                  {selectedCategory.featured && <Badge className="bg-blue-100 text-blue-800">Featured</Badge>}
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
                      handleEditClick(selectedCategory)
                    }}
                    className="bg-black hover:bg-gray-800"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Category
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Category Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Edit Category
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Category Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Funny, Fitness, 18+"
                  value={newCategory.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="edit-slug">URL Slug *</Label>
                <Input
                  id="edit-slug"
                  placeholder="funny"
                  value={newCategory.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  This will be used in the URL: /category/{newCategory.slug || 'example'}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe what this category is about..."
                  value={newCategory.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Status and Color */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={newCategory.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Category Color</Label>
                  <Select value={newCategory.color} onValueChange={(value) => handleInputChange("color", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full ${color.preview} mr-2`}></div>
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload and Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Category Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-image"
                      placeholder="https://example.com/category-image.jpg"
                      value={newCategory.image}
                      onChange={(e) => handleInputChange("image", e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sortOrder">Sort Order</Label>
                  <Input
                    id="edit-sortOrder"
                    type="number"
                    placeholder="0"
                    value={newCategory.sortOrder}
                    onChange={(e) => handleInputChange("sortOrder", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={newCategory.featured}
                  onChange={(e) => handleInputChange("featured", e.target.checked)}
                />
                <Label htmlFor="edit-featured">Featured Category</Label>
              </div>

              {/* Category Preview */}
              {newCategory.name && (
                <div className="space-y-2">
                  <Label>Category Preview</Label>
                  <Card className="p-4 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${newCategory.color} flex items-center justify-center`}>
                        <Tag className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{newCategory.name}</h4>
                        {newCategory.description && (
                          <p className="text-sm text-gray-600">{newCategory.description}</p>
                        )}
                        <p className="text-xs text-gray-500">Slug: /{newCategory.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(newCategory.status)}
                        {newCategory.featured && <Badge className="bg-blue-100 text-blue-800">Featured</Badge>}
                      </div>
                    </div>
                    {newCategory.image && (
                      <div className="mt-3">
                        <img 
                          src={newCategory.image} 
                          alt="Preview" 
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                    )}
                  </Card>
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
                  onClick={handleEditCategory}
                  disabled={!newCategory.name || !newCategory.slug}
                  className="bg-black hover:bg-gray-800"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Search, 
  Filter,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  Users,
  User,
  Calendar,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: number
  email: string
  name: string
  phone: string
  address: string
  status: string
  notes?: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

export default function AdminCustomers() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
    notes: ""
  })

  // Fetch customers from API
  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      } else {
        console.error('Failed to fetch customers')
        setCustomers([])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      vip: { color: "bg-purple-100 text-purple-800", label: "VIP" },
      new: { color: "bg-blue-100 text-blue-800", label: "New" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || statusFilter === 'all' || customer.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleAddCustomer = async () => {
    try {
      // Validate required fields
      if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields (Name, Email, Phone)",
        })
        return
      }

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer)
      })

      if (response.ok) {
        const result = await response.json()
        setIsAddModalOpen(false)
        setNewCustomer({
          name: "",
          email: "",
          phone: "",
          address: "",
          status: "active",
          notes: ""
        })
        toast({
          variant: "success",
          title: "Success!",
          description: "Customer added successfully!",
        })
        fetchCustomers() // Refresh the list
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to add customer: ${error.error}`,
        })
      }
    } catch (error) {
      console.error('Error adding customer:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add customer. Please try again.",
      })
    }
  }

  const handleViewCustomer = async (customerId: number) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`)
      if (response.ok) {
        const customerData = await response.json()
        setSelectedCustomer(customerData)
        setIsViewModalOpen(true)
      } else {
        console.error('Failed to fetch customer details')
      }
    } catch (error) {
      console.error('Error fetching customer details:', error)
    }
  }

  const handleEditCustomer = async (customerId: number) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`)
      if (response.ok) {
        const customerData = await response.json()
        setSelectedCustomer(customerData)
        setNewCustomer({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address || "",
          status: customerData.status,
          notes: customerData.notes || ""
        })
        setIsEditModalOpen(true)
      } else {
        console.error('Failed to fetch customer details')
      }
    } catch (error) {
      console.error('Error fetching customer details:', error)
    }
  }

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return

    try {
      const response = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer)
      })

      if (response.ok) {
        const result = await response.json()
        setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? result.customer : c))
        setIsEditModalOpen(false)
        setSelectedCustomer(null)
        toast({
          variant: "success",
          title: "Success!",
          description: "Customer updated successfully!",
        })
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to update customer: ${error.error}`,
        })
      }
    } catch (error) {
      console.error('Error updating customer:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update customer. Please try again.",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setNewCustomer(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-2">Manage your customer base</p>
          </div>
          
          {/* Add Customer Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Add New Customer
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Customer Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Rahul Sharma"
                    value={newCustomer.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="rahul.sharma@email.com"
                    value={newCustomer.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                {/* Phone and Address */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={newCustomer.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Mumbai, Maharashtra"
                      value={newCustomer.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>
                </div>

                {/* Status and Join Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newCustomer.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Any additional information about the customer..."
                    value={newCustomer.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>

                {/* Customer Preview */}
                {newCustomer.name && (
                  <div className="space-y-2">
                    <Label>Customer Preview</Label>
                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{newCustomer.name}</h4>
                          <p className="text-sm text-gray-600">{newCustomer.email}</p>
                          {newCustomer.phone && (
                            <p className="text-sm text-gray-600">{newCustomer.phone}</p>
                          )}
                        </div>
                        {getStatusBadge(newCustomer.status)}
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
                    onClick={handleAddCustomer}
                    disabled={!newCustomer.name || !newCustomer.email || !newCustomer.phone}
                    className="bg-black hover:bg-gray-800"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* View Customer Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Details
                </DialogTitle>
              </DialogHeader>
              
              {selectedCustomer && (
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Name</Label>
                      <p className="text-gray-900">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-gray-900">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Phone</Label>
                      <p className="text-gray-900">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedCustomer.status)}</div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Address</Label>
                    <p className="text-gray-900">{selectedCustomer.address || 'No address provided'}</p>
                  </div>

                  {selectedCustomer.notes && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Notes</Label>
                      <p className="text-gray-900">{selectedCustomer.notes}</p>
                    </div>
                  )}

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalOrders}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Spent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">Joined</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
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
                        handleEditCustomer(selectedCustomer.id)
                      }}
                      className="bg-black hover:bg-gray-800"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Customer
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Customer Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Customer
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Customer Name */}
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name *</Label>
                  <Input
                    id="edit-name"
                    placeholder="e.g., Rahul Sharma"
                    value={newCustomer.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="rahul.sharma@email.com"
                    value={newCustomer.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                {/* Phone and Address */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone Number *</Label>
                    <Input
                      id="edit-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={newCustomer.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-address">Address</Label>
                    <Input
                      id="edit-address"
                      placeholder="Mumbai, Maharashtra"
                      value={newCustomer.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>
                </div>

                {/* Status and Notes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select value={newCustomer.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-notes">Notes</Label>
                    <Input
                      id="edit-notes"
                      placeholder="Any additional notes..."
                      value={newCustomer.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
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
                    onClick={handleUpdateCustomer}
                    disabled={!newCustomer.name || !newCustomer.email || !newCustomer.phone}
                    className="bg-black hover:bg-gray-800"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Update Customer
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
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{customers.filter(c => c.status === 'active').length}</p>
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
                  <p className="text-sm font-medium text-gray-600">VIP Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{customers.filter(c => c.status === 'vip').length}</p>
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
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{customers.filter(c => c.status === 'new').length}</p>
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
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <p>Loading customers...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Customers Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                {searchTerm || statusFilter !== 'all' ? 'No customers found matching your criteria.' : 'No customers found.'}
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <Card key={customer.email} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{customer.name}</h3>
                    {getStatusBadge(customer.status)}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewCustomer(customer.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditCustomer(customer.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {customer.address}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-gray-900">{customer.totalOrders}</p>
                          <p className="text-xs text-gray-600">Orders</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Total Spent</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
} 
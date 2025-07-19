"use client"

import { useState } from "react"
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
  Mail,
  Phone,
  MapPin,
  UserPlus,
  Users,
  User,
  Calendar
} from "lucide-react"

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    status: "active",
    joinDate: new Date().toISOString().split('T')[0]
  })
  
  const customers = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra",
      orders: 12,
      totalSpent: 15400,
      status: "active",
      joinDate: "2023-08-15"
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya.singh@email.com",
      phone: "+91 87654 32109",
      location: "Delhi, Delhi",
      orders: 8,
      totalSpent: 9200,
      status: "active",
      joinDate: "2023-09-22"
    },
    {
      id: 3,
      name: "Arjun Patel",
      email: "arjun.patel@email.com",
      phone: "+91 76543 21098",
      location: "Bangalore, Karnataka",
      orders: 15,
      totalSpent: 22100,
      status: "vip",
      joinDate: "2023-07-03"
    },
    {
      id: 4,
      name: "Sneha Gupta",
      email: "sneha.gupta@email.com",
      phone: "+91 65432 10987",
      location: "Pune, Maharashtra",
      orders: 3,
      totalSpent: 4500,
      status: "new",
      joinDate: "2024-01-10"
    },
    {
      id: 5,
      name: "Vikram Kumar",
      email: "vikram.kumar@email.com",
      phone: "+91 54321 09876",
      location: "Chennai, Tamil Nadu",
      orders: 0,
      totalSpent: 0,
      status: "inactive",
      joinDate: "2023-12-05"
    }
  ]

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

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCustomer = () => {
    // Here you would typically send the data to your backend
    console.log("Adding new customer:", newCustomer)
    
    // For demo purposes, we'll just close the modal and reset the form
    setIsAddModalOpen(false)
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      location: "",
      status: "active",
      joinDate: new Date().toISOString().split('T')[0]
    })
    
    // You could also show a success toast here
    alert("Customer added successfully! (This is a demo - in real app, it would save to database)")
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

                {/* Phone and Location */}
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
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Mumbai, Maharashtra"
                      value={newCustomer.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
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
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={newCustomer.joinDate}
                      onChange={(e) => handleInputChange("joinDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Any additional information about the customer..."
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">892</p>
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
                  <p className="text-2xl font-bold text-gray-900">756</p>
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
                  <p className="text-2xl font-bold text-gray-900">45</p>
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
                  <p className="text-2xl font-bold text-gray-900">91</p>
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
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{customer.name}</h3>
                    {getStatusBadge(customer.status)}
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
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
                    {customer.location}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{customer.orders}</p>
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
          ))}
        </div>
      </div>
    </div>
  )
} 
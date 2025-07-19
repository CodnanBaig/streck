"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { 
  Store,
  User,
  Bell,
  Shield,
  Palette,
  Mail,
  Globe,
  CreditCard,
  Truck,
  Save
} from "lucide-react"

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "STRECK",
    storeDescription: "Bold, chaotic, unapologetically desi streetwear for Gen Z rebels",
    storeEmail: "hello@streck.store",
    storePhone: "+91 98765 43210",
    storeAddress: "Mumbai, Maharashtra, India",
    
    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerNotifications: false,
    
    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
    
    // Display
    darkMode: false,
    compactView: false,
    showProductImages: true,
    itemsPerPage: "20"
  })

  const handleSave = () => {
    // Handle save logic here
    console.log("Settings saved:", settings)
  }

  const settingSections = [
    {
      title: "Store Information",
      icon: Store,
      fields: [
        { key: "storeName", label: "Store Name", type: "text" },
        { key: "storeDescription", label: "Description", type: "textarea" },
        { key: "storeEmail", label: "Email", type: "email" },
        { key: "storePhone", label: "Phone", type: "tel" },
        { key: "storeAddress", label: "Address", type: "textarea" }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      fields: [
        { key: "emailNotifications", label: "Email Notifications", type: "switch" },
        { key: "orderNotifications", label: "New Order Alerts", type: "switch" },
        { key: "lowStockAlerts", label: "Low Stock Alerts", type: "switch" },
        { key: "customerNotifications", label: "Customer Messages", type: "switch" }
      ]
    },
    {
      title: "Security",
      icon: Shield,
      fields: [
        { key: "twoFactorAuth", label: "Two-Factor Authentication", type: "switch" },
        { key: "loginAlerts", label: "Login Alerts", type: "switch" },
        { key: "sessionTimeout", label: "Session Timeout (minutes)", type: "number" }
      ]
    },
    {
      title: "Display Preferences",
      icon: Palette,
      fields: [
        { key: "darkMode", label: "Dark Mode", type: "switch" },
        { key: "compactView", label: "Compact View", type: "switch" },
        { key: "showProductImages", label: "Show Product Images", type: "switch" },
        { key: "itemsPerPage", label: "Items Per Page", type: "number" }
      ]
    }
  ]

  const renderField = (field: any) => {
    const value = settings[field.key as keyof typeof settings]
    
    switch (field.type) {
      case "switch":
        return (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
            </Label>
            <Switch
              id={field.key}
              checked={value as boolean}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, [field.key]: checked }))
              }
            />
          </div>
        )
      
      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
            </Label>
            <Textarea
              id={field.key}
              value={value as string}
              onChange={(e) => 
                setSettings(prev => ({ ...prev, [field.key]: e.target.value }))
              }
              rows={3}
            />
          </div>
        )
      
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
            </Label>
            <Input
              id={field.key}
              type={field.type}
              value={value as string}
              onChange={(e) => 
                setSettings(prev => ({ ...prev, [field.key]: e.target.value }))
              }
            />
          </div>
        )
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Configure your store settings and preferences</p>
          </div>
          <Button onClick={handleSave} className="bg-black hover:bg-gray-800">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Payment Settings</h3>
              <p className="text-sm text-gray-600">Configure payment gateways</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Truck className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Settings</h3>
              <p className="text-sm text-gray-600">Manage delivery options</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Templates</h3>
              <p className="text-sm text-gray-600">Customize email messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingSections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <section.icon className="w-5 h-5 mr-2" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {section.fields.map((field) => (
                    <div key={field.key}>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50 mt-8">
          <CardHeader>
            <CardTitle className="text-red-800">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-red-800 mb-2">Reset All Settings</h4>
                <p className="text-sm text-red-600 mb-3">
                  This will reset all settings to their default values. This action cannot be undone.
                </p>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                  Reset Settings
                </Button>
              </div>
              
              <div className="border-t border-red-200 pt-4">
                <h4 className="font-medium text-red-800 mb-2">Delete Store Data</h4>
                <p className="text-sm text-red-600 mb-3">
                  Permanently delete all store data including products, orders, and customers.
                </p>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                  Delete All Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button (Bottom) */}
        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} className="bg-black hover:bg-gray-800">
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  )
} 
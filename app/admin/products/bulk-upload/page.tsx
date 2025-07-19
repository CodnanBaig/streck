"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertTriangle,
  X,
  Plus,
  Eye,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductRow {
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  productType: string
  sizes: string
  colors: string
  images: string
  inStock: boolean
  status: string
  featured: boolean
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export default function BulkUploadProducts() {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [csvData, setCsvData] = useState<ProductRow[]>([])
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const downloadTemplate = () => {
    const headers = [
      'name',
      'description', 
      'price',
      'originalPrice',
      'category',
      'productType',
      'sizes',
      'colors',
      'images',
      'inStock',
      'status',
      'featured'
    ]
    
    const sampleData = [
      'Sample Product',
      'This is a sample product description',
      '999.99',
      '1299.99',
      'Funny',
      'T-Shirt',
      'S,M,L,XL',
      'Red,Blue,Black',
      'https://example.com/image1.jpg;https://example.com/image2.jpg',
      'true',
      'active',
      'false'
    ]

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-upload-template.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded successfully!",
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      parseCSV(text)
    }
    reader.readAsText(file)
  }

  const parseCSV = (csvText: string) => {
    try {
      const lines = csvText.split('\n').filter(line => line.trim())
      if (lines.length < 2) {
        toast({
          variant: "destructive",
          title: "Invalid CSV",
          description: "CSV file must have at least a header row and one data row.",
        })
        return
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const requiredHeaders = ['name', 'price', 'category', 'producttype']
      
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
      if (missingHeaders.length > 0) {
        toast({
          variant: "destructive",
          title: "Missing Headers",
          description: `Missing required headers: ${missingHeaders.join(', ')}`,
        })
        return
      }

      const products: ProductRow[] = []
      const validationResults: ValidationResult[] = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        const values = parseCSVLine(line)
        
        if (values.length < headers.length) {
          validationResults.push({
            isValid: false,
            errors: [`Row ${i + 1}: Insufficient columns`],
            warnings: []
          })
          continue
        }

        const product: ProductRow = {
          name: values[headers.indexOf('name')] || '',
          description: values[headers.indexOf('description')] || '',
          price: parseFloat(values[headers.indexOf('price')]) || 0,
          originalPrice: values[headers.indexOf('originalprice')] ? parseFloat(values[headers.indexOf('originalprice')]) : undefined,
          category: values[headers.indexOf('category')] || '',
          productType: values[headers.indexOf('producttype')] || '',
          sizes: values[headers.indexOf('sizes')] || '',
          colors: values[headers.indexOf('colors')] || '',
          images: values[headers.indexOf('images')] || '',
          inStock: values[headers.indexOf('instock')]?.toLowerCase() === 'true',
          status: values[headers.indexOf('status')] || 'active',
          featured: values[headers.indexOf('featured')]?.toLowerCase() === 'true'
        }

        products.push(product)
        validationResults.push(validateProduct(product, i + 1))
      }

      setCsvData(products)
      setValidationResults(validationResults)
      setPreviewMode(true)

      const validCount = validationResults.filter(r => r.isValid).length
      const errorCount = validationResults.filter(r => !r.isValid).length

      toast({
        title: "CSV Parsed Successfully",
        description: `${validCount} valid products, ${errorCount} with errors`,
      })

    } catch (error) {
      console.error('Error parsing CSV:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to parse CSV file. Please check the format.",
      })
    }
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }

  const validateProduct = (product: ProductRow, rowNumber: number): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    // Required field validation
    if (!product.name.trim()) {
      errors.push(`Row ${rowNumber}: Product name is required`)
    }
    if (product.price <= 0) {
      errors.push(`Row ${rowNumber}: Price must be greater than 0`)
    }
    if (!product.category.trim()) {
      errors.push(`Row ${rowNumber}: Category is required`)
    }
    if (!product.productType.trim()) {
      errors.push(`Row ${rowNumber}: Product type is required`)
    }

    // Price validation
    if (product.originalPrice && product.originalPrice <= product.price) {
      warnings.push(`Row ${rowNumber}: Original price should be higher than current price`)
    }

    // Status validation
    const validStatuses = ['active', 'inactive', 'draft']
    if (!validStatuses.includes(product.status.toLowerCase())) {
      errors.push(`Row ${rowNumber}: Invalid status. Must be one of: ${validStatuses.join(', ')}`)
    }

    // Image URL validation
    if (product.images) {
      const imageUrls = product.images.split(';').filter(url => url.trim())
      for (const url of imageUrls) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          warnings.push(`Row ${rowNumber}: Image URL "${url}" may not be valid`)
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  const handleBulkUpload = async () => {
    const validProducts = csvData.filter((_, index) => validationResults[index].isValid)
    
    if (validProducts.length === 0) {
      toast({
        variant: "destructive",
        title: "No Valid Products",
        description: "Please fix validation errors before uploading.",
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const batchSize = 10
      const totalBatches = Math.ceil(validProducts.length / batchSize)
      let successCount = 0
      let errorCount = 0

      for (let i = 0; i < totalBatches; i++) {
        const batch = validProducts.slice(i * batchSize, (i + 1) * batchSize)
        
        const response = await fetch('/api/products/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ products: batch })
        })

        if (response.ok) {
          const result = await response.json()
          successCount += result.successCount || 0
          errorCount += result.errorCount || 0
        } else {
          errorCount += batch.length
        }

        setUploadProgress(((i + 1) / totalBatches) * 100)
      }

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${successCount} products. ${errorCount} failed.`,
      })

      // Reset form
      setCsvData([])
      setValidationResults([])
      setPreviewMode(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "An error occurred during upload. Please try again.",
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const getValidationIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-red-600" />
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bulk Upload Products</h1>
            <p className="text-gray-600 mt-2">Upload multiple products at once using CSV format</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload CSV File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  Choose File
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={downloadTemplate}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Download Template</h4>
                    <p className="text-sm text-gray-600">Get the CSV template with the correct format and sample data.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Fill Your Data</h4>
                    <p className="text-sm text-gray-600">Replace the sample data with your actual product information.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Upload & Validate</h4>
                    <p className="text-sm text-gray-600">Upload your CSV file and review validation results.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Bulk Upload</h4>
                    <p className="text-sm text-gray-600">Upload all valid products to your store.</p>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Required fields:</strong> name, price, category, productType<br/>
                  <strong>Optional fields:</strong> description, originalPrice, sizes, colors, images, inStock, status, featured<br/>
                  <strong>Image URLs:</strong> Separate multiple images with semicolons (;)
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Validation */}
        {previewMode && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Preview & Validation</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {validationResults.filter(r => r.isValid).length} Valid
                  </Badge>
                  <Badge variant="outline" className="text-red-600">
                    {validationResults.filter(r => !r.isValid).length} Errors
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {csvData.map((product, index) => {
                  const validation = validationResults[index]
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getValidationIcon(validation.isValid)}
                          <h4 className="font-medium">{product.name || `Row ${index + 1}`}</h4>
                          <Badge variant={validation.isValid ? "default" : "destructive"}>
                            {validation.isValid ? "Valid" : "Invalid"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          ₹{product.price}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                        <div>Category: {product.category}</div>
                        <div>Type: {product.productType}</div>
                        <div>Status: {product.status}</div>
                        <div>In Stock: {product.inStock ? "Yes" : "No"}</div>
                      </div>

                      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
                        <div className="space-y-1">
                          {validation.errors.map((error, i) => (
                            <div key={i} className="text-sm text-red-600 flex items-center gap-1">
                              <X className="w-3 h-3" />
                              {error}
                            </div>
                          ))}
                          {validation.warnings.map((warning, i) => (
                            <div key={i} className="text-sm text-yellow-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {warning}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Progress */}
        {uploading && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Uploading Products...</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={uploadProgress} className="mb-2" />
              <p className="text-sm text-gray-600">
                {Math.round(uploadProgress)}% complete
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {previewMode && (
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline"
              onClick={() => {
                setCsvData([])
                setValidationResults([])
                setPreviewMode(false)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBulkUpload}
              disabled={uploading || validationResults.filter(r => r.isValid).length === 0}
              className="bg-black hover:bg-gray-800"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploading ? "Uploading..." : `Upload ${validationResults.filter(r => r.isValid).length} Products`}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Save, 
  Copy, 
  Trash2, 
  FileText, 
  Clock, 
  Phone, 
  MessageSquare, 
  Mail,
  MapPin,
  Flag,
  User,
  Package,
  Truck,
  Calendar,
  History,
  Plus,
  Edit,
  Eye,
  ArrowLeft,
  Globe,
  ExternalLink,
  Zap,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react'
import { formatCurrency, formatDate, getTimeAgo, getInitials } from '@/lib/utils'
import { OrderType } from '@/lib/types'
import { mockOrders, mockUsers, mockProducts, mockWarehouses } from '@/lib/mock-data'

interface OrderDetailPageProps {
  orderId: string
  onBack: () => void
}

export default function OrderDetailPage({ orderId, onBack }: OrderDetailPageProps) {
  const [order, setOrder] = useState<OrderType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [showAddNote, setShowAddNote] = useState(false)

  // Mock order data - in real app, fetch from API
  useEffect(() => {
    const foundOrder = mockOrders.find(o => o.id === orderId)
    if (foundOrder) {
      setOrder(foundOrder)
    }
  }, [orderId])

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  const operator = mockUsers.find(u => u.id === order.operator_id)
  const product = mockProducts.find(p => p.id === order.product_id)
  const warehouse = mockWarehouses.find(w => w.id === order.warehouse_id)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'processing': 'bg-blue-100 text-blue-800',
      'in_work': 'bg-yellow-100 text-yellow-800',
      'callback': 'bg-orange-100 text-orange-800',
      'spam': 'bg-red-100 text-red-800',
      'duplicate': 'bg-gray-100 text-gray-800',
      'verification': 'bg-purple-100 text-purple-800',
      'accepted': 'bg-green-100 text-green-800',
      'approved': 'bg-emerald-100 text-emerald-800',
      'canceled': 'bg-red-100 text-red-800',
      'in_shipping': 'bg-blue-100 text-blue-800',
      'closed_won': 'bg-green-100 text-green-800',
      'closed_lost': 'bg-red-100 text-red-800',
      'return': 'bg-orange-100 text-orange-800',
      'pre_payment': 'bg-yellow-100 text-yellow-800',
      'confirm': 'bg-indigo-100 text-indigo-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleSave = () => {
    // In real app, save to API
    console.log('Saving order:', order)
    setIsEditing(false)
    alert('Order updated successfully!')
  }

  const handleDuplicate = () => {
    // In real app, create duplicate order
    console.log('Duplicating order:', order.id)
    alert('Order duplicated successfully!')
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this order?')) {
      console.log('Deleting order:', order.id)
      alert('Order deleted successfully!')
      onBack()
    }
  }

  const handleExportPDF = () => {
    console.log('Exporting order to PDF:', order.id)
    alert('PDF export started!')
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      // In real app, add note to order history
      console.log('Adding note:', newNote)
      setNewNote('')
      setShowAddNote(false)
      alert('Note added successfully!')
    }
  }

  // Mock history data
  const orderHistory = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      operator: 'João Silva',
      action: 'Status changed from Callback → Approved',
      icon: CheckCircle2,
      color: 'text-green-600'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      operator: 'Maria Santos',
      action: 'Added note: Cliente confirmou interesse no produto',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      operator: 'Pedro Costa',
      action: 'Phone call made - Duration: 5:32',
      icon: Phone,
      color: 'text-purple-600'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      operator: 'System',
      action: 'Order created from lead #12345',
      icon: Plus,
      color: 'text-gray-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.id.slice(-6)}
              </h1>
              <p className="text-sm text-gray-500">
                Created {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(order.status)}>
              {order.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Button onClick={handleSave} disabled={!isEditing}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleDuplicate} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button onClick={handleDelete} variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button onClick={handleExportPDF} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Project Selector */}
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Project:</Label>
              <Select defaultValue="main">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Project</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Operator */}
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Operator:</Label>
              {operator && (
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={operator.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {getInitials(operator.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{operator.name}</span>
                </div>
              )}
            </div>
            
            {/* Client Time */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Wait time: 2h 15m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Client Information */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                  <Input 
                    value={order.client_name} 
                    onChange={(e) => setOrder({...order, client_name: e.target.value})}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1 flex-1">
                      <Flag className="h-4 w-4 text-gray-400" />
                      <Input 
                        value={order.client_phone} 
                        onChange={(e) => setOrder({...order, client_phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <Button size="sm" variant="outline" className="text-green-600">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-blue-600">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-purple-600">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input 
                    value={order.client_email} 
                    onChange={(e) => setOrder({...order, client_email: e.target.value})}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Age</Label>
                  <Input 
                    value="32" 
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Address</Label>
                  <div className="space-y-2 mt-1">
                    <Input placeholder="Street" disabled={!isEditing} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="City" disabled={!isEditing} />
                      <Input placeholder="Province" disabled={!isEditing} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Flag className="h-4 w-4 text-gray-400" />
                      <Input placeholder="Country" disabled={!isEditing} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">ZIP / Postal Code</Label>
                  <Input placeholder="12345-678" disabled={!isEditing} className="mt-1" />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Lead Source</Label>
                  <Select defaultValue="api_cpa" disabled={!isEditing}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="imported">Imported</SelectItem>
                      <SelectItem value="api_cpa">API CPA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Webmaster / Affiliate</Label>
                  <Input value="João Silva Marketing" disabled={!isEditing} className="mt-1" />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Offer Linked</Label>
                  <Input value="Premium Package Q4" disabled={!isEditing} className="mt-1" />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">GEO / IP</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Flag className="h-4 w-4 text-gray-400" />
                    <Input value="Angola (192.168.1.1)" disabled={!isEditing} />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Reward Method</Label>
                  <Select defaultValue="approval" disabled={!isEditing}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approval">Approval</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Rejection Reason</Label>
                  <Select disabled={!isEditing}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_answer">No Answer</SelectItem>
                      <SelectItem value="not_interested">Not Interested</SelectItem>
                      <SelectItem value="wrong_number">Wrong Number</SelectItem>
                      <SelectItem value="duplicate">Duplicate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Number of Attempts</Label>
                  <Input value="3" disabled={!isEditing} className="mt-1" />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Comments / Notes</Label>
                  <Textarea 
                    value={order.notes || ''} 
                    onChange={(e) => setOrder({...order, notes: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Order Details */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Table */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Products</Label>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">Product</th>
                        <th className="px-3 py-2 text-left">Variation</th>
                        <th className="px-3 py-2 text-right">Price</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                            <span>{product?.name || 'Premium Package'}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">Standard</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(order.total)}</td>
                        <td className="px-3 py-2 text-right">1</td>
                        <td className="px-3 py-2 text-right font-medium">{formatCurrency(order.total)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Discount / Bonus</Label>
                <Input placeholder="0.00" disabled={!isEditing} className="mt-1" />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Delivery Status</Label>
                <Select defaultValue="pending" disabled={!isEditing}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Shipping Date & Time</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input type="date" disabled={!isEditing} />
                  <Input type="time" disabled={!isEditing} />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Warehouse</Label>
                <Select defaultValue={order.warehouse_id} disabled={!isEditing}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWarehouses.map((w) => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Courier / Delivery Method</Label>
                <Select defaultValue="standard" disabled={!isEditing}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Delivery</SelectItem>
                    <SelectItem value="express">Express Delivery</SelectItem>
                    <SelectItem value="pickup">Store Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Order Notes</Label>
                <Textarea 
                  placeholder="Internal notes about this order..."
                  disabled={!isEditing}
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="retention" disabled={!isEditing} />
                <Label htmlFor="retention" className="text-sm">Retention completed</Label>
              </div>
              
              {/* Total Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount:</span>
                  <span>-{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between font-medium text-base border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary Panel */}
        <div className="lg:col-span-4">
          <div className="space-y-6">
            {/* Quick Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Quick Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Client Wait Time:</span>
                  <span className="font-medium">2h 15m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lead Origin:</span>
                  <div className="flex items-center space-x-1">
                    <Flag className="h-3 w-3" />
                    <span className="font-medium">facebook.com (AO)</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Offer Name:</span>
                  <span className="font-medium">Premium Package Q4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">External ID:</span>
                  <span className="font-medium">EXT-{order.id.slice(-6)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">External Tag:</span>
                  <Badge variant="outline" className="text-xs">premium-q4</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Initial Cart Price:</span>
                  <span className="font-medium">{formatCurrency(order.total * 1.2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Reward Value:</span>
                  <span className="font-medium text-green-600">{formatCurrency(order.total * 0.15)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Current Status:</span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Update:</span>
                  <span className="font-medium">{getTimeAgo(order.updated_at || order.created_at)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-2">Contact Summary:</div>
                    <div className="space-y-1 text-gray-600">
                      <div>📞 {order.client_phone}</div>
                      <div>📧 {order.client_email}</div>
                      <div>💬 WhatsApp Available</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button size="sm" variant="outline" className="text-blue-600">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-green-600">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-purple-600">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mini Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">Map View</div>
                    <div className="text-xs">Luanda, Angola</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel Edit' : 'Edit Order'}
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setShowHistory(true)}
                  >
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setShowAddNote(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* History Timeline Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                History Timeline
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </CardHeader>
          {showHistory && (
            <CardContent>
              <div className="space-y-4">
                {orderHistory.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-gray-100 ${item.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(item.timestamp)} - {item.operator}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.action}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Add Note Dialog */}
      <Dialog open={showAddNote} onOpenChange={setShowAddNote}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note to this order's history
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note here..."
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddNote(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote}>
                Add Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
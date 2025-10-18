"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

import { supabase } from "@/lib/supabase-browser";

import { 
  Users, 
  TrendingUp, 
  Phone, 
  DollarSign, 
  Ticket, 
  Clock, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Mail,
  Building,
  Target,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  ShoppingCart,
  PhoneCall,
  Headphones,
  Truck,
  Package,
  UserCheck,
  History,
  Monitor,
  Share2,
  CheckCircle,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Download,
  Upload,
  Eye,
  AlertTriangle,
  Zap,
  PieChart,
  Globe,
  Award,
  MapPin,
  FileText,
  Save,
  FilterX
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { 
  mockDashboardMetrics, 
  mockLeads, 
  mockTasks, 
  mockTickets, 
  mockUsers, 
  mockActivities,
  mockOrders,
  mockCallLogs,
  mockCallCenters,
  mockAgentStatus,
  mockShipments,
  mockWarehouses,
  mockProducts,
  mockClients,
  mockHistoryLogs,
  mockMonitoringStatus,
  mockAffiliates,
  mockValidationRules
} from '@/lib/mock-data'
import { formatCurrency, formatDate, getStatusColor, getInitials, getTimeAgo } from '@/lib/utils'
import { LeadType, TaskType, ActivityType, OrderType, CallLog, ShipmentType, ProductType, ClientType, HistoryLog, MonitoringStatus, AffiliateType, ValidationRule } from '@/lib/types'
import OrderDetailPage from '@/components/OrderDetailPage'

const chartData = [
  { name: 'Jan', leads: 65, conversions: 15, orders: 12, revenue: 45000 },
  { name: 'Feb', leads: 78, conversions: 18, orders: 15, revenue: 52000 },
  { name: 'Mar', leads: 92, conversions: 22, orders: 18, revenue: 61000 },
  { name: 'Apr', leads: 85, conversions: 19, orders: 16, revenue: 58000 },
  { name: 'May', leads: 98, conversions: 25, orders: 21, revenue: 67000 },
  { name: 'Jun', leads: 112, conversions: 28, orders: 24, revenue: 75000 }
]

const pieData = [
  { name: 'New', value: 35, color: '#3b82f6' },
  { name: 'Qualified', value: 25, color: '#10b981' },
  { name: 'Proposal', value: 20, color: '#f59e0b' },
  { name: 'Won', value: 15, color: '#22c55e' },
  { name: 'Lost', value: 5, color: '#ef4444' }
]

// Mock analytics data
const analyticsData = {
  overview: {
    totalLeads: 1247,
    approved: { count: 312, percentage: 25.0 },
    deliveries: { count: 289, percentage: 23.2 },
    cheques: { count: 45 },
    rejections: { count: 156, percentage: 12.5 },
    callbacks: { count: 234 },
    spam: { count: 89 },
    hold: { count: 122, avgTime: '2.5h' }
  },
  geoAnalysis: [
    { country: 'Angola', leads: 456, approves: 123, deliveries: 98, conversion: 27.0, rejection: 15.2 },
    { country: 'Portugal', leads: 234, approves: 67, deliveries: 54, conversion: 28.6, rejection: 12.8 },
    { country: 'Brazil', leads: 345, approves: 89, deliveries: 76, conversion: 25.8, rejection: 18.3 },
    { country: 'Mozambique', leads: 212, approves: 33, deliveries: 61, conversion: 15.6, rejection: 22.1 }
  ],
  offers: [
    { name: 'Premium Package', leads: 234, approves: 89, revenue: 45600, delivery: 85.2, refunds: 12 },
    { name: 'Basic Plan', leads: 456, approves: 123, revenue: 23400, delivery: 78.9, refunds: 8 },
    { name: 'Enterprise', leads: 123, approves: 67, revenue: 67800, delivery: 92.1, refunds: 3 },
    { name: 'Starter', leads: 345, approves: 78, revenue: 15600, delivery: 71.2, refunds: 15 }
  ],
  webmasters: [
    { name: 'João Silva', leads: 234, approves: 89, conversion: 38.0, buyout: 85.2, cpl: 12.50, revenue: 4560, rejections: 23 },
    { name: 'Maria Santos', leads: 456, approves: 123, conversion: 27.0, buyout: 78.9, cpl: 15.20, revenue: 6780, rejections: 45 },
    { name: 'Pedro Costa', leads: 123, approves: 67, conversion: 54.5, buyout: 92.1, cpl: 8.90, revenue: 3450, rejections: 12 },
    { name: 'Ana Ferreira', leads: 345, approves: 78, conversion: 22.6, buyout: 71.2, cpl: 18.70, revenue: 2340, rejections: 67 }
  ],
  operators: [
    { name: 'Carlos Mendes', handled: 234, approves: 89, avgDuration: '4.2m', rejection: 12.5, leadsPerHour: 8.5 },
    { name: 'Sofia Lima', handled: 456, approves: 123, avgDuration: '3.8m', rejection: 15.2, leadsPerHour: 12.3 },
    { name: 'Miguel Torres', handled: 123, approves: 67, avgDuration: '5.1m', rejection: 8.9, leadsPerHour: 6.7 },
    { name: 'Rita Oliveira', handled: 345, approves: 78, avgDuration: '4.6m', rejection: 18.3, leadsPerHour: 9.8 }
  ],
  timeAnalysis: {
    hourlyData: [
      { hour: '00:00', leads: 12, calls: 8 },
      { hour: '01:00', leads: 8, calls: 5 },
      { hour: '02:00', leads: 6, calls: 3 },
      { hour: '03:00', leads: 4, calls: 2 },
      { hour: '04:00', leads: 3, calls: 1 },
      { hour: '05:00', leads: 5, calls: 3 },
      { hour: '06:00', leads: 15, calls: 12 },
      { hour: '07:00', leads: 25, calls: 20 },
      { hour: '08:00', leads: 45, calls: 38 },
      { hour: '09:00', leads: 67, calls: 55 },
      { hour: '10:00', leads: 89, calls: 72 },
      { hour: '11:00', leads: 95, calls: 78 },
      { hour: '12:00', leads: 78, calls: 65 },
      { hour: '13:00', leads: 85, calls: 70 },
      { hour: '14:00', leads: 92, calls: 76 },
      { hour: '15:00', leads: 88, calls: 73 },
      { hour: '16:00', leads: 76, calls: 62 },
      { hour: '17:00', leads: 65, calls: 53 },
      { hour: '18:00', leads: 45, calls: 38 },
      { hour: '19:00', leads: 32, calls: 26 },
      { hour: '20:00', leads: 25, calls: 20 },
      { hour: '21:00', leads: 18, calls: 15 },
      { hour: '22:00', leads: 15, calls: 12 },
      { hour: '23:00', leads: 12, calls: 10 }
    ],
    weeklyData: [
      { day: 'Monday', leads: 234, processing: '2.1h' },
      { day: 'Tuesday', leads: 267, processing: '1.8h' },
      { day: 'Wednesday', leads: 298, processing: '2.3h' },
      { day: 'Thursday', leads: 245, processing: '2.0h' },
      { day: 'Friday', leads: 289, processing: '1.9h' },
      { day: 'Saturday', leads: 156, processing: '3.2h' },
      { day: 'Sunday', leads: 123, processing: '4.1h' }
    ]
  }
}

export default function IngoCRM() {
  // --- INÍCIO: contadores de Leads (Supabase + Realtime) ---
  const [leadStats, setLeadStats] = useState({
  total: 0,
  new: 0,
  processing: 0,
  approved: 0,
  rejected: 0,
  callback: 0,
  spam: 0,
  verification: 0,
  delivered: 0,
  returned: 0,
});

  useEffect(() => {
    async function loadStats() {
      const { data, error } = await supabase.from("leads").select("status");
      if (error) {
        console.error("Erro ao carregar leads:", error);
        return;
      }
      const counts = {
  total: data.length,
  new: data.filter((l) => (l.status || '').toLowerCase() === 'new').length,
  processing: data.filter((l) => (l.status || '').toLowerCase() === 'processing').length,
  approved: data.filter((l) => (l.status || '').toLowerCase() === 'approved').length,
  rejected: data.filter((l) => (l.status || '').toLowerCase() === 'rejected').length,
  callback: data.filter((l) => (l.status || '').toLowerCase() === 'callback').length,
  spam: data.filter((l) => (l.status || '').toLowerCase() === 'spam').length,
  verification: data.filter((l) => (l.status || '').toLowerCase() === 'verification').length,
  delivered: data.filter((l) => (l.status || '').toLowerCase() === 'delivered').length,
  returned: data.filter((l) => (l.status || '').toLowerCase() === 'returned').length,
};

      setLeadStats(counts);
    }

    loadStats();

    const subscription = supabase
      .channel("realtime-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => loadStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  // --- FIM: contadores de Leads (Supabase + Realtime) ---

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLead, setSelectedLead] = useState<LeadType | null>(null)
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false)
  const [callModeActive, setCallModeActive] = useState(false)
  const [currentCallTimer, setCurrentCallTimer] = useState(0)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editType, setEditType] = useState<'lead' | 'order' | 'client' | 'product' | 'affiliate'>('lead')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  
  // Filter states for Orders
  const [filters, setFilters] = useState({
    geo: "",
    offer: "",
    status: "",
    user: "",
    webmaster: ""
  })
  
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website',
    value: '',
    notes: ''
  })

  const metrics = mockDashboardMetrics
  const leads = mockLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter orders based on current filters
  const filteredOrders = mockOrders.filter(order => {
    const operator = mockUsers.find(u => u.id === order.operator_id)
    return (
      (!filters.geo || order.geo === filters.geo) &&
      (!filters.offer || order.offer === filters.offer) &&
      (!filters.status || order.status === filters.status) &&
      (!filters.user || (operator && operator.name === filters.user)) &&
      (!filters.webmaster || order.webmaster === filters.webmaster)
    )
  })

  // Get unique values for filter dropdowns
  const uniqueGeos = [...new Set(mockOrders.map(order => order.geo).filter(Boolean))]
  const uniqueOffers = [...new Set(mockOrders.map(order => order.offer).filter(Boolean))]
  const uniqueStatuses = [...new Set(mockOrders.map(order => order.status))]
  const uniqueUsers = [...new Set(mockOrders.map(order => {
    const operator = mockUsers.find(u => u.id === order.operator_id)
    return operator?.name
  }).filter(Boolean))]
  const uniqueWebmasters = [...new Set(mockOrders.map(order => order.webmaster).filter(Boolean))]

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({ geo: "", offer: "", status: "", user: "", webmaster: "" })
    toast.success("Filters cleared successfully")
  }

  // Export CSV function
  const handleExportCSV = () => {
    const headers = ["ID", "Client", "GEO", "Offer", "Status", "Operator", "Webmaster", "Total", "CreatedAt"]
    const rows = filteredOrders.map(order => {
      const operator = mockUsers.find(u => u.id === order.operator_id)
      return [
        order.id.slice(-6),
        order.client_name,
        order.geo || '',
        order.offer || '',
        order.status,
        operator?.name || '',
        order.webmaster || '',
        order.total,
        formatDate(order.created_at)
      ]
    })
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ingoCRM_orders_export.csv"
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Export completed successfully")
  }

  // Timer for call mode
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callModeActive) {
      interval = setInterval(() => {
        setCurrentCallTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callModeActive])

  const handleCreateLead = () => {
    // In real app, this would call API
    console.log('Creating lead:', newLead)
    setIsNewLeadOpen(false)
    setNewLead({
      name: '',
      email: '',
      phone: '',
      company: '',
      source: 'website',
      value: '',
      notes: ''
    })
  }

  const handleEdit = (item: any, type: 'lead' | 'order' | 'client' | 'product' | 'affiliate') => {
    setEditingItem(item)
    setEditType(type)
    setEditDialogOpen(true)
  }

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId)
    setShowOrderDetail(true)
  }

  const handleBackToOrders = () => {
    setShowOrderDetail(false)
    setSelectedOrderId(null)
  }

  const handleSaveEdit = () => {
    // In real app, this would call API to update the item
    console.log('Saving edit:', editType, editingItem)
    setEditDialogOpen(false)
    setEditingItem(null)
    // Show success toast
    toast.success('Item updated successfully!')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getOrderStatusColor = (status: string) => {
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

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IC</span>
          </div>
          <span className="text-xl font-bold text-gray-900">IngoCRM</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <nav className="mt-6 px-3 h-full overflow-y-auto">
        <div className="space-y-1">
          {/* Core Modules */}
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Core CRM
          </div>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'leads', label: 'Leads', icon: Target },
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'accounts', label: 'Accounts', icon: Building },
            { id: 'tasks', label: 'Tasks', icon: Calendar },
            { id: 'tickets', label: 'Tickets', icon: Ticket },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            )
          })}

          {/* Advanced Modules */}
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6">
            Sales & Operations
          </div>
          {[
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'call-mode', label: 'Call Mode', icon: PhoneCall },
            { id: 'call-centers', label: 'Call Centers', icon: Headphones },
            { id: 'shipments', label: 'Shipments', icon: Truck },
            { id: 'warehouse', label: 'Warehouse', icon: Package },
            { id: 'clients', label: 'Clients', icon: UserCheck },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            )
          })}

          {/* Analytics & Management */}
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6">
            Analytics & Management
          </div>
          {[
            { id: 'analytics', label: '📊 Estatísticas', icon: PieChart },
            { id: 'history', label: 'History', icon: History },
            { id: 'monitoring', label: 'Real-time Monitoring', icon: Monitor },
            { id: 'affiliates', label: 'CPA & Affiliates', icon: Share2 },
            { id: 'validation-rules', label: 'Validation Rules', icon: Zap },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )

  const Header = () => (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'analytics' ? 'Estatísticas e Desempenho' : 
               activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
            </h1>
            <p className="text-sm text-gray-500">
              {activeTab === 'dashboard' && 'Overview of your sales performance'}
              {activeTab === 'leads' && 'Manage your sales leads'}
              {activeTab === 'contacts' && 'Manage your contacts'}
              {activeTab === 'accounts' && 'Manage your accounts'}
              {activeTab === 'tasks' && 'Manage your tasks'}
              {activeTab === 'tickets' && 'Manage support tickets'}
              {activeTab === 'orders' && 'Manage customer orders'}
              {activeTab === 'call-mode' && 'Call center operations'}
              {activeTab === 'call-centers' && 'Manage call center teams'}
              {activeTab === 'shipments' && 'Track shipments and deliveries'}
              {activeTab === 'warehouse' && 'Inventory management'}
              {activeTab === 'clients' && 'Customer relationship management'}
              {activeTab === 'analytics' && 'Performance analytics and insights'}
              {activeTab === 'history' && 'System activity logs'}
              {activeTab === 'monitoring' && 'Real-time user activity'}
              {activeTab === 'affiliates' && 'Affiliate and CPA management'}
              {activeTab === 'validation-rules' && 'Automation rules and workflows'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src={mockUsers[0].avatar_url} />
            <AvatarFallback>{getInitials(mockUsers[0].name)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )

  // Edit Dialog Component
  const EditDialog = () => (
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit {editType.charAt(0).toUpperCase() + editType.slice(1)}</DialogTitle>
          <DialogDescription>
            Make changes to the {editType} details below.
          </DialogDescription>
        </DialogHeader>
        {editingItem && (
          <div className="grid gap-4 py-4">
            {editType === 'lead' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">Email</Label>
                  <Input
                    id="edit-email"
                    value={editingItem.email || ''}
                    onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-right">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editingItem.phone || ''}
                    onChange={(e) => setEditingItem({...editingItem, phone: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-company" className="text-right">Company</Label>
                  <Input
                    id="edit-company"
                    value={editingItem.company || ''}
                    onChange={(e) => setEditingItem({...editingItem, company: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">Status</Label>
                  <Select value={editingItem.status} onValueChange={(value) => setEditingItem({...editingItem, status: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="callback">Callback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-value" className="text-right">Value</Label>
                  <Input
                    id="edit-value"
                    type="number"
                    value={editingItem.value || ''}
                    onChange={(e) => setEditingItem({...editingItem, value: parseFloat(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-notes" className="text-right">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingItem.notes || ''}
                    onChange={(e) => setEditingItem({...editingItem, notes: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
            
            {editType === 'order' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-name" className="text-right">Client Name</Label>
                  <Input
                    id="edit-client-name"
                    value={editingItem.client_name || ''}
                    onChange={(e) => setEditingItem({...editingItem, client_name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-email" className="text-right">Client Email</Label>
                  <Input
                    id="edit-client-email"
                    value={editingItem.client_email || ''}
                    onChange={(e) => setEditingItem({...editingItem, client_email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-phone" className="text-right">Client Phone</Label>
                  <Input
                    id="edit-client-phone"
                    value={editingItem.client_phone || ''}
                    onChange={(e) => setEditingItem({...editingItem, client_phone: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-total" className="text-right">Total</Label>
                  <Input
                    id="edit-total"
                    type="number"
                    value={editingItem.total || ''}
                    onChange={(e) => setEditingItem({...editingItem, total: parseFloat(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-order-status" className="text-right">Status</Label>
                  <Select value={editingItem.status} onValueChange={(value) => setEditingItem({...editingItem, status: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="in_work">In Work</SelectItem>
                      <SelectItem value="callback">Callback</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                      <SelectItem value="in_shipping">In Shipping</SelectItem>
                      <SelectItem value="closed_won">Closed Won</SelectItem>
                      <SelectItem value="closed_lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-order-notes" className="text-right">Notes</Label>
                  <Textarea
                    id="edit-order-notes"
                    value={editingItem.notes || ''}
                    onChange={(e) => setEditingItem({...editingItem, notes: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </>
            )}

            {editType === 'client' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-name" className="text-right">Name</Label>
                  <Input
                    id="edit-client-name"
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-email" className="text-right">Email</Label>
                  <Input
                    id="edit-client-email"
                    value={editingItem.email || ''}
                    onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-phone" className="text-right">Phone</Label>
                  <Input
                    id="edit-client-phone"
                    value={editingItem.phone || ''}
                    onChange={(e) => setEditingItem({...editingItem, phone: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-address" className="text-right">Address</Label>
                  <Input
                    id="edit-client-address"
                    value={editingItem.address || ''}
                    onChange={(e) => setEditingItem({...editingItem, address: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-segment" className="text-right">Segment</Label>
                  <Select value={editingItem.segment} onValueChange={(value) => setEditingItem({...editingItem, segment: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-notes" className="text-right">Notes</Label>
                  <Textarea
                    id="edit-client-notes"
                    value={editingItem.notes || ''}
                    onChange={(e) => setEditingItem({...editingItem, notes: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </>
            )}

            {editType === 'product' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-product-name" className="text-right">Name</Label>
                  <Input
                    id="edit-product-name"
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-product-sku" className="text-right">SKU</Label>
                  <Input
                    id="edit-product-sku"
                    value={editingItem.sku || ''}
                    onChange={(e) => setEditingItem({...editingItem, sku: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-product-stock" className="text-right">Stock Quantity</Label>
                  <Input
                    id="edit-product-stock"
                    type="number"
                    value={editingItem.quantity_in_stock || ''}
                    onChange={(e) => setEditingItem({...editingItem, quantity_in_stock: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-product-price" className="text-right">Unit Price</Label>
                  <Input
                    id="edit-product-price"
                    type="number"
                    value={editingItem.unit_price || ''}
                    onChange={(e) => setEditingItem({...editingItem, unit_price: parseFloat(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-product-supplier" className="text-right">Supplier</Label>
                  <Input
                    id="edit-product-supplier"
                    value={editingItem.supplier || ''}
                    onChange={(e) => setEditingItem({...editingItem, supplier: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-product-min-stock" className="text-right">Min Stock</Label>
                  <Input
                    id="edit-product-min-stock"
                    type="number"
                    value={editingItem.min_stock_threshold || ''}
                    onChange={(e) => setEditingItem({...editingItem, min_stock_threshold: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              </>
            )}

            {editType === 'affiliate' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-affiliate-name" className="text-right">Name</Label>
                  <Input
                    id="edit-affiliate-name"
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-affiliate-email" className="text-right">Email</Label>
                  <Input
                    id="edit-affiliate-email"
                    value={editingItem.email || ''}
                    onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-affiliate-phone" className="text-right">Phone</Label>
                  <Input
                    id="edit-affiliate-phone"
                    value={editingItem.phone || ''}
                    onChange={(e) => setEditingItem({...editingItem, phone: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-affiliate-commission" className="text-right">Commission Rate (%)</Label>
                  <Input
                    id="edit-affiliate-commission"
                    type="number"
                    value={editingItem.commission_rate || ''}
                    onChange={(e) => setEditingItem({...editingItem, commission_rate: parseFloat(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-affiliate-payout" className="text-right">Payout Method</Label>
                  <Select value={editingItem.payout_method} onValueChange={(value) => setEditingItem({...editingItem, payout_method: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-affiliate-status" className="text-right">Status</Label>
                  <Select value={editingItem.status} onValueChange={(value) => setEditingItem({...editingItem, status: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const AnalyticsContent = () => (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Geral</TabsTrigger>
          <TabsTrigger value="geo">GEO Analysis</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="webmasters">Webmasters</TabsTrigger>
          <TabsTrigger value="operators">Operators</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Total Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.overview.totalLeads.toLocaleString()}</div>
                <p className="text-xs opacity-75 mt-1">+12% vs last month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.overview.approved.count}</div>
                <p className="text-xs opacity-75 mt-1">{analyticsData.overview.approved.percentage}% conversion</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.overview.deliveries.count}</div>
                <p className="text-xs opacity-75 mt-1">{analyticsData.overview.deliveries.percentage}% delivery rate</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Callbacks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.overview.callbacks.count}</div>
                <p className="text-xs opacity-75 mt-1">Pending follow-up</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Cheques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{analyticsData.overview.cheques.count}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Rejections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{analyticsData.overview.rejections.count}</div>
                <p className="text-xs text-gray-500 mt-1">{analyticsData.overview.rejections.percentage}% rejection rate</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Spam</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{analyticsData.overview.spam.count}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Hold / Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{analyticsData.overview.hold.count}</div>
                <p className="text-xs text-gray-500 mt-1">Avg: {analyticsData.overview.hold.avgTime}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Leads per Day</CardTitle>
                <CardDescription>Daily lead generation trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="leads" fill="#2563eb" name="Leads" />
                    <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Current lead status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Rate Evolution */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Evolution</CardTitle>
              <CardDescription>Monthly conversion rate trend</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geo" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">GEO Analysis</h3>
              <p className="text-sm text-gray-500">Performance by country/region</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter by Country
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approves
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deliveries
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rejection %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.geoAnalysis.map((geo, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{geo.country}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {geo.leads}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {geo.approves}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                          {geo.deliveries}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-green-100 text-green-800">
                            {geo.conversion}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-red-100 text-red-800">
                            {geo.rejection}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Offer / Product Analytics</h3>
              <p className="text-sm text-gray-500">Performance by product/offer</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.offers.map((offer, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{offer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Leads:</span>
                      <span className="font-medium">{offer.leads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Approves:</span>
                      <span className="font-medium text-green-600">{offer.approves}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Revenue:</span>
                      <span className="font-medium">{formatCurrency(offer.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Delivery Rate:</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {offer.delivery}%
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Refunds:</span>
                      <span className="text-red-600">{offer.refunds}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webmasters" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Webmaster / Affiliate Analytics</h3>
              <p className="text-sm text-gray-500">Partner performance overview</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Webmaster
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leads Sent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approves
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buyout %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CPL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rejections
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.webmasters.map((webmaster, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback>{getInitials(webmaster.name)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-900">{webmaster.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {webmaster.leads}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {webmaster.approves}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-green-100 text-green-800">
                            {webmaster.conversion}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-blue-100 text-blue-800">
                            {webmaster.buyout}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${webmaster.cpl}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(webmaster.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {webmaster.rejections}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Webmaster Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Leads per Webmaster</CardTitle>
              <CardDescription>Performance comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.webmasters}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
                  <Bar dataKey="approves" fill="#10b981" name="Approves" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operators" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Operator Performance</h3>
              <p className="text-sm text-gray-500">Call center agent analytics</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Handled Leads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approves
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Call Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rejection %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leads/Hour
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.operators.map((operator, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback>{getInitials(operator.name)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-900">{operator.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {operator.handled}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {operator.approves}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {operator.avgDuration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-red-100 text-red-800">
                            {operator.rejection}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {operator.leadsPerHour}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Trend</CardTitle>
              <CardDescription>Operator performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#3b82f6" name="Leads" />
                  <Line type="monotone" dataKey="conversions" stroke="#10b981" name="Conversions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Time-based Analytics</h3>
              <p className="text-sm text-gray-500">Performance by time periods</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Hourly Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity Heatmap</CardTitle>
              <CardDescription>Leads and calls by hour of the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.timeAnalysis.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="leads" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="calls" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Data */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>Leads created per weekday</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.timeAnalysis.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Processing Time Table */}
          <Card>
            <CardHeader>
              <CardTitle>Average Processing Time by Day</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Leads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Processing Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.timeAnalysis.weeklyData.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {day.day}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.leads}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.processing}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Export / Reports</h3>
              <p className="text-sm text-gray-500">Generate and download reports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Daily Summary
                </CardTitle>
                <CardDescription>Complete daily performance report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Weekly Report
                </CardTitle>
                <CardDescription>Weekly performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Operator Report
                </CardTitle>
                <CardDescription>Individual operator performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  GEO Report
                </CardTitle>
                <CardDescription>Geographic performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Affiliate Report
                </CardTitle>
                <CardDescription>Webmaster and affiliate performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Custom Report
                </CardTitle>
                <CardDescription>Generate custom date range report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="Start Date" />
                    <Input type="date" placeholder="End Date" />
                  </div>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    );
}

  const DashboardContent = () => {
  // ---- Contadores de Leads (Supabase + Realtime) ----
  const [leadStats, setLeadStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    callback: 0,
    spam: 0,
    verification: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const { data, error } = await supabase.from("leads").select("status");
      if (error) {
        console.error("Erro ao carregar leads:", error);
        return;
      }

      const counts = {
        total: data.length,
        approved: data.filter((l) => l.status === "approved").length,
        rejected: data.filter((l) => l.status === "rejected").length,
        callback: data.filter((l) => l.status === "callback").length,
        spam: data.filter((l) => l.status === "spam").length,
        verification: data.filter((l) => l.status === "verification").length,
      };
      setLeadStats(counts);
    }

    loadStats();

    const sub = supabase
      .channel("realtime-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => loadStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);
  // ---- FIM: Contadores de Leads ----

    <div className="space-y-6">
      {/* Enhanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Total Leads (ao vivo)</CardTitle>
    <Target className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{leadStats.total}</div>
    <p className="text-xs text-muted-foreground">
      Atualizado em tempo real via Supabase
    </p>
  </CardContent>
</Card>

{/* --- Status dos Leads (ao vivo) --- */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Approved</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{leadStats.approved}</div>
      <p className="text-xs text-muted-foreground">Leads aprovados</p>
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Rejected</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{leadStats.rejected}</div>
      <p className="text-xs text-muted-foreground">Leads rejeitados</p>
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Callback</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{leadStats.callback}</div>
      <p className="text-xs text-muted-foreground">Aguardando retorno</p>
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Spam</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{leadStats.spam}</div>
      <p className="text-xs text-muted-foreground">Marcados como spam</p>
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Verification</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{leadStats.verification}</div>
      <p className="text-xs text-muted-foreground">Em verificação</p>
    </CardContent>
  </Card>
</div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_orders}</div>
            <p className="text-xs text-muted-foreground">{metrics.orders_today} today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.revenue_this_month)}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.active_agents}</div>
            <p className="text-xs text-muted-foreground">{metrics.calls_today} calls today</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.active_shipments}</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.low_stock_alerts}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversion_rate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.tickets_open}</div>
            <p className="text-xs text-muted-foreground">{metrics.avg_response_time}h avg response</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Leads, conversions, orders and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
                <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                <Bar dataKey="orders" fill="#f59e0b" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
            <CardDescription>Current pipeline breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUsers.find(u => u.id === activity.user_id)?.avatar_url} />
                  <AvatarFallback>
                    {getInitials(mockUsers.find(u => u.id === activity.user_id)?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400">{getTimeAgo(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
              </CardContent>
);
}; // fecha o componente anterior

// ================== LEADS CONTENT ==================
const LeadsContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    value: "",
    notes: "",
  });

  const handleCreateLead = async () => {
    // lógica de criação do lead
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Lead</DialogTitle>
              <DialogDescription>
                Add a new lead to your pipeline. Fill in the details below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input
                  id="phone"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">Company</Label>
                <Input
                  id="company"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source" className="text-right">Source</Label>
                <Select
                  value={newLead.source}
                  onValueChange={(value) => setNewLead({ ...newLead, source: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="cold_call">Cold Call</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={newLead.value}
                  onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea
                  id="notes"
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewLeadOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLead}>Create Lead</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => {
                  const assignedUser = mockUsers.find(u => u.id === lead.assigned_to);
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.value ? formatCurrency(lead.value) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {assignedUser && (
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={assignedUser.avatar_url} />
                              <AvatarFallback className="text-xs">
                                {getInitials(assignedUser.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-900">{assignedUser.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(lead, "lead")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

  const OrdersContent = () => {
    // If showing order detail, render the detail page
    if (showOrderDetail && selectedOrderId) {
      return (
        <OrderDetailPage 
          orderId={selectedOrderId} 
          onBack={handleBackToOrders}
        />
      )
    }

    // Otherwise show the orders list
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Orders Management</h2>
            <p className="text-sm text-gray-500">Track and manage customer orders</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="filter-geo">GEO</Label>
                <Select value={filters.geo} onValueChange={(value) => setFilters({...filters, geo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All GEOs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All GEOs</SelectItem>
                    {uniqueGeos.map((geo) => (
                      <SelectItem key={geo} value={geo}>{geo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filter-offer">Offer</Label>
                <Select value={filters.offer} onValueChange={(value) => setFilters({...filters, offer: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Offers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Offers</SelectItem>
                    {uniqueOffers.map((offer) => (
                      <SelectItem key={offer} value={offer}>{offer}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filter-status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filter-user">Operator</Label>
                <Select value={filters.user} onValueChange={(value) => setFilters({...filters, user: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Operators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Operators</SelectItem>
                    {uniqueUsers.map((user) => (
                      <SelectItem key={user} value={user}>{user}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filter-webmaster">Webmaster</Label>
                <Select value={filters.webmaster} onValueChange={(value) => setFilters({...filters, webmaster: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Webmasters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Webmasters</SelectItem>
                    {uniqueWebmasters.map((webmaster) => (
                      <SelectItem key={webmaster} value={webmaster}>{webmaster}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {mockOrders.length} orders
              </div>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <FilterX className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GEO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Webmaster
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const operator = mockUsers.find(u => u.id === order.operator_id)
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.client_name}</div>
                            <div className="text-sm text-gray-500">{order.client_email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.geo || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.offer || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {operator && (
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={operator.avatar_url} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(operator.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-900">{operator.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.webmaster || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewOrder(order.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(order, 'order')}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const CallModeContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Call Mode</h2>
          <p className="text-sm text-gray-500">Call center operations interface</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Call Timer: <span className="font-mono font-bold">{formatTime(currentCallTimer)}</span>
          </div>
          <Button
            onClick={() => setCallModeActive(!callModeActive)}
            variant={callModeActive ? "destructive" : "default"}
          >
            {callModeActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                End Call
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Call
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Queue */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lead Queue</CardTitle>
              <CardDescription>Leads waiting to be called</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLeads.filter(lead => ['new', 'callback'].includes(lead.status)).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-medium">{lead.name}</h3>
                          <p className="text-sm text-gray-500">{lead.phone}</p>
                          <p className="text-sm text-gray-500">{lead.company}</p>
                        </div>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button size="sm" variant="ghost">
                        Skip
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call Controls */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Call Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="bg-green-50 text-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approved
                </Button>
                <Button variant="outline" size="sm" className="bg-orange-50 text-orange-700">
                  <Clock className="h-4 w-4 mr-2" />
                  Callback
                </Button>
                <Button variant="outline" size="sm" className="bg-red-50 text-red-700">
                  <X className="h-4 w-4 mr-2" />
                  Spam
                </Button>
                <Button variant="outline" size="sm" className="bg-gray-50 text-gray-700">
                  <X className="h-4 w-4 mr-2" />
                  Rejected
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="call-notes">Call Notes</Label>
                <Textarea
                  id="call-notes"
                  placeholder="Enter call notes..."
                  rows={4}
                />
              </div>
              
              <Button className="w-full">
                Save Call Log
              </Button>
            </CardContent>
          </Card>

          {/* Today's Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Today's Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Calls Made</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Approved</span>
                  <span className="font-medium text-green-600">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Callbacks</span>
                  <span className="font-medium text-orange-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Conversion Rate</span>
                  <span className="font-medium">41.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const CallCentersContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Call Centers</h2>
          <p className="text-sm text-gray-500">Manage call center teams and agents</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Call Center
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockCallCenters.map((center) => (
          <Card key={center.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{center.name}</CardTitle>
                <Badge className={center.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {center.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardDescription>{center.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Agents ({center.agents.length})</h4>
                  <div className="space-y-2">
                    {center.agents.map((agentId) => {
                      const agent = mockUsers.find(u => u.id === agentId)
                      const status = mockAgentStatus.find(s => s.user_id === agentId)
                      return (
                        <div key={agentId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={agent?.avatar_url} />
                              <AvatarFallback className="text-xs">
                                {getInitials(agent?.name || '')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{agent?.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={status?.status === 'available' ? 'bg-green-100 text-green-800' : 
                                             status?.status === 'busy' ? 'bg-red-100 text-red-800' : 
                                             'bg-yellow-100 text-yellow-800'}>
                              {status?.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{status?.calls_today} calls</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Max Calls/Agent:</span>
                    <span className="ml-2 font-medium">{center.settings.max_calls_per_agent}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Break Duration:</span>
                    <span className="ml-2 font-medium">{center.settings.break_duration}min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const ShipmentsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Shipments</h2>
          <p className="text-sm text-gray-500">Track shipments and deliveries</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Shipment
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockShipments.map((shipment) => {
                  const warehouse = mockWarehouses.find(w => w.id === shipment.warehouse_id)
                  return (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{shipment.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{shipment.order_id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {warehouse?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shipment.tracking_number || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shipment.carrier || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(shipment.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const WarehouseContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Warehouse Management</h2>
          <p className="text-sm text-gray-500">Inventory and stock management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {mockProducts.filter(p => p.quantity_in_stock < p.min_stock_threshold).length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockProducts.filter(p => p.quantity_in_stock < p.min_stock_threshold).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({product.sku})</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-orange-600">
                      {product.quantity_in_stock} / {product.min_stock_threshold}
                    </div>
                    <div className="text-xs text-gray-500">units remaining</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockProducts.map((product) => {
                  const warehouse = mockWarehouses.find(w => w.id === product.warehouse_id)
                  const isLowStock = product.quantity_in_stock < product.min_stock_threshold
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${isLowStock ? 'text-orange-600' : 'text-gray-900'}`}>
                            {product.quantity_in_stock}
                          </span>
                          {isLowStock && (
                            <AlertTriangle className="h-4 w-4 text-orange-500 ml-2" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">Min: {product.min_stock_threshold}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.unit_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.supplier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {warehouse?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(product, 'product')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const ClientsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Clients</h2>
          <p className="text-sm text-gray-500">Customer relationship management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Segment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(client.segment)}>
                        {client.segment}
                      </Badge>
                      <div className="mt-1">
                        {client.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="mr-1 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.total_orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(client.total_spent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.last_order_date ? formatDate(client.last_order_date) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.acquisition_source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(client, 'client')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const HistoryContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">System History</h2>
          <p className="text-sm text-gray-500">Track all system activities and changes</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            {mockHistoryLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUsers.find(u => u.id === log.user_id)?.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {getInitials(log.user_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{log.user_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {log.action}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {log.entity_type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                  {log.changes && (
                    <div className="mt-2 text-xs text-gray-500">
                      {Object.entries(log.changes).map(([field, change]) => (
                        <div key={field} className="flex items-center space-x-2">
                          <span className="font-medium">{field}:</span>
                          <span className="bg-red-100 text-red-800 px-1 rounded">{String(change.old)}</span>
                          <span>→</span>
                          <span className="bg-green-100 text-green-800 px-1 rounded">{String(change.new)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span>{formatDate(log.created_at)}</span>
                    {log.ip_address && <span>IP: {log.ip_address}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const MonitoringContent = () => {
    const [autoRefresh, setAutoRefresh] = useState(true)
    
    useEffect(() => {
      if (autoRefresh) {
        const interval = setInterval(() => {
          // In real app, this would fetch fresh data
          console.log('Refreshing monitoring data...')
        }, 10000)
        return () => clearInterval(interval)
      }
    }, [autoRefresh])

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Real-time Monitoring</h2>
            <p className="text-sm text-gray-500">Monitor active users and system activity</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              )}
            </Button>
            <span className="text-sm text-gray-500">
              Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Call Mode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockMonitoringStatus.map((status) => (
                    <tr key={status.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={mockUsers.find(u => u.id === status.user_id)?.avatar_url} />
                            <AvatarFallback className="text-xs">
                              {getInitials(status.user_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{status.user_name}</div>
                            <div className="text-sm text-gray-500">
                              {status.is_editing && (
                                <span className="text-orange-600">Editing...</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {status.current_page}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            status.status === 'online' ? 'bg-green-400' : 
                            status.status === 'idle' ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                          <Badge className={
                            status.status === 'online' ? 'bg-green-100 text-green-800' :
                            status.status === 'idle' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {status.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {status.time_active}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {status.call_mode ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Phone className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {status.ip_address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getTimeAgo(status.last_activity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const AffiliatesContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">CPA & Affiliates</h2>
          <p className="text-sm text-gray-500">Manage affiliate partners and lead sources</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Affiliate
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockAffiliates.map((affiliate) => (
          <Card key={affiliate.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{affiliate.name}</CardTitle>
                <Badge className={affiliate.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {affiliate.status}
                </Badge>
              </div>
              <CardDescription>{affiliate.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{affiliate.total_leads}</div>
                    <div className="text-sm text-gray-500">Total Leads</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(affiliate.total_commission)}
                    </div>
                    <div className="text-sm text-gray-500">Total Commission</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Commission Rate:</span>
                    <span className="font-medium">{affiliate.commission_rate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payout Method:</span>
                    <span className="font-medium">{affiliate.payout_method.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium">{affiliate.phone}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(affiliate, 'affiliate')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const ValidationRulesContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Validation Rules</h2>
          <p className="text-sm text-gray-500">Automation rules and workflows</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </div>

      <div className="space-y-4">
        {mockValidationRules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    {rule.name}
                  </CardTitle>
                  <CardDescription>{rule.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Priority {rule.priority}</Badge>
                  <Badge className={rule.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {rule.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Conditions</h4>
                  <div className="space-y-1">
                    {rule.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        {index > 0 && condition.logic && (
                          <Badge variant="outline" className="text-xs">
                            {condition.logic.toUpperCase()}
                          </Badge>
                        )}
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {condition.field}
                        </span>
                        <span className="text-gray-500">{condition.operator.replace('_', ' ')}</span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                          {String(condition.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Actions</h4>
                  <div className="space-y-1">
                    {rule.actions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Badge className="bg-green-100 text-green-800">
                          {action.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-gray-600">
                          {JSON.stringify(action.config)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Clone
                  </Button>
                  <Button 
                    variant={rule.is_active ? "destructive" : "default"} 
                    size="sm"
                  >
                    {rule.is_active ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const TasksContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Tasks</h2>
          <p className="text-sm text-gray-500">Manage your daily tasks</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="grid gap-4">
        {mockTasks.map((task) => {
          const assignedUser = mockUsers.find(u => u.id === task.assigned_to)
          return (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{task.title}</h3>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <Badge className={getStatusColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due: {task.due_date ? formatDate(task.due_date) : 'No due date'}
                      </span>
                      {assignedUser && (
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {assignedUser.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const TicketsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Support Tickets</h2>
          <p className="text-sm text-gray-500">Manage customer support requests</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="grid gap-4">
        {mockTickets.map((ticket) => {
          const assignedUser = mockUsers.find(u => u.id === ticket.assigned_to)
          return (
            <Card key={ticket.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{ticket.title}</h3>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Badge className={getStatusColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {ticket.requester_email}
                      </span>
                      {assignedUser && (
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {assignedUser.name}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeAgo(ticket.created_at)}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'leads' && <LeadsContent />}
          {activeTab === 'orders' && <OrdersContent />}
          {activeTab === 'call-mode' && <CallModeContent />}
          {activeTab === 'call-centers' && <CallCentersContent />}
          {activeTab === 'shipments' && <ShipmentsContent />}
          {activeTab === 'warehouse' && <WarehouseContent />}
          {activeTab === 'clients' && <ClientsContent />}
          {activeTab === 'analytics' && <AnalyticsContent />}
          {activeTab === 'history' && <HistoryContent />}
          {activeTab === 'monitoring' && <MonitoringContent />}
          {activeTab === 'affiliates' && <AffiliatesContent />}
          {activeTab === 'validation-rules' && <ValidationRulesContent />}
          {activeTab === 'tasks' && <TasksContent />}
          {activeTab === 'tickets' && <TicketsContent />}
          {activeTab === 'contacts' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Contacts Module</h3>
              <p className="text-gray-500">Contact management functionality coming soon...</p>
            </div>
          )}
          {activeTab === 'accounts' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Accounts Module</h3>
              <p className="text-gray-500">Account management functionality coming soon...</p>
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reports Module</h3>
              <p className="text-gray-500">Advanced reporting functionality coming soon...</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Module</h3>
              <p className="text-gray-500">System settings functionality coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {/* Edit Dialog */}
      <EditDialog />
    </div>
  )
}

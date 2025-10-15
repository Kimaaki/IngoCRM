// IngoCRM - Mock Data for Development
import { 
  User, 
  Organization, 
  LeadType, 
  Contact, 
  Account, 
  Opportunity, 
  TaskType, 
  TicketType, 
  Campaign, 
  ActivityType,
  DashboardMetrics,
  OrderType,
  OrderItem,
  CallLog,
  CallCenter,
  AgentStatus,
  ShipmentType,
  WarehouseType,
  ProductType,
  StockMovement,
  ClientType,
  HistoryLog,
  MonitoringStatus,
  AffiliateType,
  LeadSource,
  ValidationRule
} from './types'

export const mockOrganization: Organization = {
  id: 'org-1',
  name: 'IngoCRM Demo',
  domain: 'ingocrm.com',
  settings: {
    timezone: 'UTC',
    currency: 'USD',
    language: 'en',
    business_hours: {
      start: '09:00',
      end: '18:00',
      days: [1, 2, 3, 4, 5]
    }
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@ingocrm.com',
    name: 'Admin User',
    role: 'admin',
    organization_id: 'org-1',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    last_active: '2024-01-18T10:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    email: 'manager@ingocrm.com',
    name: 'Sales Manager',
    role: 'manager',
    organization_id: 'org-1',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    last_active: '2024-01-18T10:25:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-3',
    email: 'agent@ingocrm.com',
    name: 'Sales Agent',
    role: 'agent',
    organization_id: 'org-1',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'busy',
    last_active: '2024-01-18T10:20:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-4',
    email: 'agent2@ingocrm.com',
    name: 'Call Agent',
    role: 'agent',
    organization_id: 'org-1',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    status: 'available',
    last_active: '2024-01-18T10:15:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export const mockLeads: LeadType[] = [
  {
    id: 'lead-1',
    organization_id: 'org-1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    phone: '+244 912 345 678',
    company: 'Tech Solutions Ltd',
    status: 'new',
    source: 'website',
    value: 15000,
    assigned_to: 'user-3',
    notes: 'Interested in our enterprise package',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'lead-2',
    organization_id: 'org-1',
    name: 'Maria Santos',
    email: 'maria@startup.co',
    phone: '+244 923 456 789',
    company: 'Startup Innovations',
    status: 'qualified',
    source: 'facebook',
    value: 8500,
    assigned_to: 'user-3',
    notes: 'Looking for CRM solution for 20 users',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-16T09:15:00Z'
  },
  {
    id: 'lead-3',
    organization_id: 'org-1',
    name: 'Carlos Mendes',
    email: 'carlos@consulting.pt',
    phone: '+351 912 345 678',
    company: 'Business Consulting',
    status: 'proposal',
    source: 'referral',
    value: 25000,
    assigned_to: 'user-2',
    notes: 'Needs custom integration with existing ERP',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-17T11:30:00Z'
  },
  {
    id: 'lead-4',
    organization_id: 'org-1',
    name: 'Ana Costa',
    email: 'ana@retail.com',
    phone: '+244 934 567 890',
    company: 'Retail Plus',
    status: 'callback',
    source: 'cold_call',
    value: 12000,
    assigned_to: 'user-4',
    notes: 'Requested callback tomorrow at 2 PM',
    created_at: '2024-01-18T09:00:00Z',
    updated_at: '2024-01-18T09:00:00Z'
  }
]

export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    organization_id: 'org-1',
    name: 'Ana Costa',
    email: 'ana@techcorp.com',
    phone: '+244 934 567 890',
    company: 'TechCorp',
    position: 'IT Director',
    account_id: 'account-1',
    tags: ['decision-maker', 'technical'],
    segment: 'vip',
    last_contact: '2024-01-17T14:30:00Z',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z'
  },
  {
    id: 'contact-2',
    organization_id: 'org-1',
    name: 'Pedro Oliveira',
    email: 'pedro@finance.co',
    phone: '+244 945 678 901',
    company: 'Finance Solutions',
    position: 'CFO',
    account_id: 'account-2',
    tags: ['budget-holder', 'finance'],
    segment: 'regular',
    last_contact: '2024-01-16T10:15:00Z',
    created_at: '2024-01-11T12:30:00Z',
    updated_at: '2024-01-11T12:30:00Z'
  }
]

export const mockAccounts: Account[] = [
  {
    id: 'account-1',
    organization_id: 'org-1',
    name: 'TechCorp Solutions',
    type: 'customer',
    industry: 'Technology',
    website: 'https://techcorp.com',
    phone: '+244 912 000 000',
    address: 'Luanda, Angola',
    assigned_to: 'user-2',
    value: 150000,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'account-2',
    organization_id: 'org-1',
    name: 'Finance Solutions Ltd',
    type: 'prospect',
    industry: 'Financial Services',
    website: 'https://financesolutions.com',
    phone: '+244 923 000 000',
    address: 'Porto, Portugal',
    assigned_to: 'user-3',
    value: 75000,
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z'
  }
]

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    organization_id: 'org-1',
    name: 'Enterprise CRM Implementation',
    account_id: 'account-1',
    contact_id: 'contact-1',
    stage: 'negotiation',
    value: 45000,
    probability: 75,
    close_date: '2024-02-28',
    assigned_to: 'user-2',
    description: 'Full CRM implementation for 100+ users',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-17T00:00:00Z'
  },
  {
    id: 'opp-2',
    organization_id: 'org-1',
    name: 'Small Business Package',
    account_id: 'account-2',
    contact_id: 'contact-2',
    stage: 'proposal',
    value: 12000,
    probability: 60,
    close_date: '2024-02-15',
    assigned_to: 'user-3',
    description: 'CRM solution for small business with 10 users',
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z'
  }
]

export const mockTasks: TaskType[] = [
  {
    id: 'task-1',
    organization_id: 'org-1',
    title: 'Follow up with João Silva',
    description: 'Call to discuss pricing and next steps',
    type: 'call',
    status: 'pending',
    priority: 'high',
    assigned_to: 'user-3',
    related_to: 'lead-1',
    related_type: 'lead',
    due_date: '2024-01-20T15:00:00Z',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z'
  },
  {
    id: 'task-2',
    organization_id: 'org-1',
    title: 'Send proposal to Maria Santos',
    description: 'Prepare and send detailed proposal with pricing',
    type: 'email',
    status: 'completed',
    priority: 'medium',
    assigned_to: 'user-3',
    related_to: 'lead-2',
    related_type: 'lead',
    due_date: '2024-01-18T12:00:00Z',
    completed_at: '2024-01-18T11:30:00Z',
    created_at: '2024-01-16T14:00:00Z',
    updated_at: '2024-01-18T11:30:00Z'
  }
]

export const mockTickets: TicketType[] = [
  {
    id: 'ticket-1',
    organization_id: 'org-1',
    title: 'Login Issues',
    description: 'User cannot access the system after password reset',
    status: 'open',
    priority: 'high',
    category: 'technical',
    assigned_to: 'user-1',
    requester_email: 'user@client.com',
    requester_name: 'Client User',
    sla_due_date: '2024-01-19T18:00:00Z',
    created_at: '2024-01-18T09:00:00Z',
    updated_at: '2024-01-18T09:00:00Z'
  },
  {
    id: 'ticket-2',
    organization_id: 'org-1',
    title: 'Feature Request: Export Data',
    description: 'Request to add CSV export functionality',
    status: 'in_progress',
    priority: 'medium',
    category: 'feature_request',
    assigned_to: 'user-1',
    requester_email: 'manager@client.com',
    requester_name: 'Client Manager',
    created_at: '2024-01-15T14:30:00Z',
    updated_at: '2024-01-17T16:00:00Z'
  }
]

// NEW MOCK DATA FOR ADVANCED MODULES

export const mockOrders: OrderType[] = [
  {
    id: 'order-1',
    organization_id: 'org-1',
    client_id: 'client-1',
    client_name: 'João Silva',
    client_email: 'joao@empresa.com',
    client_phone: '+244 912 345 678',
    cart: [
      {
        id: 'item-1',
        product_id: 'prod-1',
        product_name: 'CRM Enterprise License',
        quantity: 1,
        unit_price: 15000,
        total_price: 15000
      }
    ],
    total: 15000,
    status: 'processing',
    operator_id: 'user-3',
    notes: 'Customer interested in enterprise features',
    created_at: '2024-01-18T09:30:00Z',
    updated_at: '2024-01-18T09:30:00Z'
  },
  {
    id: 'order-2',
    organization_id: 'org-1',
    client_id: 'client-2',
    client_name: 'Maria Santos',
    client_email: 'maria@startup.co',
    client_phone: '+244 923 456 789',
    cart: [
      {
        id: 'item-2',
        product_id: 'prod-2',
        product_name: 'CRM Starter Package',
        quantity: 1,
        unit_price: 8500,
        total_price: 8500
      }
    ],
    total: 8500,
    status: 'approved',
    operator_id: 'user-3',
    notes: 'Payment confirmed, ready for delivery',
    created_at: '2024-01-17T14:20:00Z',
    updated_at: '2024-01-18T08:15:00Z'
  },
  {
    id: 'order-3',
    organization_id: 'org-1',
    client_id: 'client-3',
    client_name: 'Carlos Mendes',
    client_email: 'carlos@consulting.pt',
    client_phone: '+351 912 345 678',
    cart: [
      {
        id: 'item-3',
        product_id: 'prod-3',
        product_name: 'CRM Custom Integration',
        quantity: 1,
        unit_price: 25000,
        total_price: 25000
      }
    ],
    total: 25000,
    status: 'in_shipping',
    operator_id: 'user-2',
    notes: 'Custom integration package being deployed',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-18T07:30:00Z'
  }
]

export const mockCallLogs: CallLog[] = [
  {
    id: 'call-1',
    organization_id: 'org-1',
    lead_id: 'lead-1',
    operator_id: 'user-3',
    phone_number: '+244 912 345 678',
    duration: 1800, // 30 minutes
    outcome: 'approved',
    notes: 'Customer very interested, ready to proceed with purchase',
    started_at: '2024-01-18T10:00:00Z',
    ended_at: '2024-01-18T10:30:00Z',
    created_at: '2024-01-18T10:30:00Z'
  },
  {
    id: 'call-2',
    organization_id: 'org-1',
    lead_id: 'lead-4',
    operator_id: 'user-4',
    phone_number: '+244 934 567 890',
    duration: 600, // 10 minutes
    outcome: 'callback',
    notes: 'Customer requested callback tomorrow at 2 PM',
    started_at: '2024-01-18T09:00:00Z',
    ended_at: '2024-01-18T09:10:00Z',
    created_at: '2024-01-18T09:10:00Z'
  }
]

export const mockCallCenters: CallCenter[] = [
  {
    id: 'center-1',
    organization_id: 'org-1',
    name: 'Main Call Center',
    description: 'Primary call center for lead conversion',
    agents: ['user-3', 'user-4'],
    supervisor_id: 'user-2',
    is_active: true,
    settings: {
      auto_assign: true,
      max_calls_per_agent: 50,
      break_duration: 15
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  }
]

export const mockAgentStatus: AgentStatus[] = [
  {
    user_id: 'user-3',
    status: 'busy',
    current_call_id: 'call-1',
    calls_today: 12,
    last_activity: '2024-01-18T10:30:00Z'
  },
  {
    user_id: 'user-4',
    status: 'available',
    calls_today: 8,
    last_activity: '2024-01-18T10:25:00Z'
  }
]

export const mockWarehouses: WarehouseType[] = [
  {
    id: 'warehouse-1',
    organization_id: 'org-1',
    name: 'Main Warehouse',
    address: 'Luanda Industrial Zone, Angola',
    manager_id: 'user-2',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'warehouse-2',
    organization_id: 'org-1',
    name: 'European Hub',
    address: 'Porto Business Center, Portugal',
    manager_id: 'user-1',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export const mockProducts: ProductType[] = [
  {
    id: 'prod-1',
    organization_id: 'org-1',
    name: 'CRM Enterprise License',
    sku: 'CRM-ENT-001',
    description: 'Full-featured CRM for enterprise customers',
    unit_price: 15000,
    quantity_in_stock: 50,
    min_stock_threshold: 10,
    supplier: 'IngoCRM Internal',
    category: 'Software License',
    warehouse_id: 'warehouse-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'prod-2',
    organization_id: 'org-1',
    name: 'CRM Starter Package',
    sku: 'CRM-START-001',
    description: 'Basic CRM package for small businesses',
    unit_price: 8500,
    quantity_in_stock: 100,
    min_stock_threshold: 20,
    supplier: 'IngoCRM Internal',
    category: 'Software License',
    warehouse_id: 'warehouse-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'prod-3',
    organization_id: 'org-1',
    name: 'Hardware Kit',
    sku: 'HW-KIT-001',
    description: 'Complete hardware setup kit',
    unit_price: 2500,
    quantity_in_stock: 5,
    min_stock_threshold: 10,
    supplier: 'Tech Hardware Co.',
    category: 'Hardware',
    warehouse_id: 'warehouse-2',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  }
]

export const mockShipments: ShipmentType[] = [
  {
    id: 'ship-1',
    organization_id: 'org-1',
    order_id: 'order-2',
    warehouse_id: 'warehouse-1',
    items: [
      {
        product_id: 'prod-2',
        product_name: 'CRM Starter Package',
        quantity: 1,
        sku: 'CRM-START-001'
      }
    ],
    status: 'in_transit',
    tracking_number: 'TRK123456789',
    carrier: 'Express Delivery',
    shipped_at: '2024-01-18T08:00:00Z',
    created_at: '2024-01-18T08:00:00Z',
    updated_at: '2024-01-18T08:00:00Z'
  },
  {
    id: 'ship-2',
    organization_id: 'org-1',
    order_id: 'order-3',
    warehouse_id: 'warehouse-2',
    items: [
      {
        product_id: 'prod-3',
        product_name: 'CRM Custom Integration',
        quantity: 1,
        sku: 'CRM-CUSTOM-001'
      }
    ],
    status: 'delivered',
    tracking_number: 'TRK987654321',
    carrier: 'Premium Logistics',
    shipped_at: '2024-01-16T10:00:00Z',
    delivered_at: '2024-01-17T14:30:00Z',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-17T14:30:00Z'
  }
]

export const mockClients: ClientType[] = [
  {
    id: 'client-1',
    organization_id: 'org-1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    phone: '+244 912 345 678',
    address: 'Luanda, Angola',
    segment: 'vip',
    tags: ['enterprise', 'high-value'],
    total_orders: 3,
    total_spent: 45000,
    last_order_date: '2024-01-18T09:30:00Z',
    acquisition_source: 'website',
    notes: 'Long-term customer, always pays on time',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-18T09:30:00Z'
  },
  {
    id: 'client-2',
    organization_id: 'org-1',
    name: 'Maria Santos',
    email: 'maria@startup.co',
    phone: '+244 923 456 789',
    address: 'Benguela, Angola',
    segment: 'regular',
    tags: ['startup', 'growth-potential'],
    total_orders: 1,
    total_spent: 8500,
    last_order_date: '2024-01-17T14:20:00Z',
    acquisition_source: 'facebook',
    notes: 'New customer, very responsive',
    created_at: '2024-01-14T00:00:00Z',
    updated_at: '2024-01-17T14:20:00Z'
  },
  {
    id: 'client-3',
    organization_id: 'org-1',
    name: 'Carlos Mendes',
    email: 'carlos@consulting.pt',
    phone: '+351 912 345 678',
    address: 'Porto, Portugal',
    segment: 'vip',
    tags: ['consulting', 'referral-source'],
    total_orders: 2,
    total_spent: 50000,
    last_order_date: '2024-01-15T11:00:00Z',
    acquisition_source: 'referral',
    notes: 'Brings many referrals, excellent relationship',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T11:00:00Z'
  }
]

export const mockHistoryLogs: HistoryLog[] = [
  {
    id: 'hist-1',
    organization_id: 'org-1',
    user_id: 'user-3',
    user_name: 'Sales Agent',
    action: 'status_change',
    entity_type: 'order',
    entity_id: 'order-2',
    changes: {
      status: { old: 'processing', new: 'approved' }
    },
    description: 'Sales Agent changed order #order-2 status from Processing to Approved',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    created_at: '2024-01-18T08:15:00Z'
  },
  {
    id: 'hist-2',
    organization_id: 'org-1',
    user_id: 'user-4',
    user_name: 'Call Agent',
    action: 'create',
    entity_type: 'call_log',
    entity_id: 'call-2',
    description: 'Call Agent created new call log for lead #lead-4',
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    created_at: '2024-01-18T09:10:00Z'
  },
  {
    id: 'hist-3',
    organization_id: 'org-1',
    user_id: 'user-2',
    user_name: 'Sales Manager',
    action: 'update',
    entity_type: 'lead',
    entity_id: 'lead-3',
    changes: {
      status: { old: 'qualified', new: 'proposal' },
      assigned_to: { old: 'user-3', new: 'user-2' }
    },
    description: 'Sales Manager updated lead #lead-3 status and assignment',
    ip_address: '192.168.1.102',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    created_at: '2024-01-17T11:30:00Z'
  }
]

export const mockMonitoringStatus: MonitoringStatus[] = [
  {
    user_id: 'user-1',
    user_name: 'Admin User',
    current_page: '/dashboard',
    is_editing: false,
    time_active: 45,
    call_mode: false,
    status: 'online',
    ip_address: '192.168.1.100',
    last_activity: '2024-01-18T10:30:00Z'
  },
  {
    user_id: 'user-2',
    user_name: 'Sales Manager',
    current_page: '/leads',
    is_editing: true,
    time_active: 32,
    call_mode: false,
    status: 'online',
    ip_address: '192.168.1.101',
    last_activity: '2024-01-18T10:25:00Z'
  },
  {
    user_id: 'user-3',
    user_name: 'Sales Agent',
    current_page: '/call-mode',
    is_editing: false,
    time_active: 120,
    call_mode: true,
    status: 'online',
    ip_address: '192.168.1.102',
    last_activity: '2024-01-18T10:20:00Z'
  },
  {
    user_id: 'user-4',
    user_name: 'Call Agent',
    current_page: '/call-mode',
    is_editing: false,
    time_active: 85,
    call_mode: true,
    status: 'online',
    ip_address: '192.168.1.103',
    last_activity: '2024-01-18T10:15:00Z'
  }
]

export const mockAffiliates: AffiliateType[] = [
  {
    id: 'aff-1',
    organization_id: 'org-1',
    name: 'Digital Marketing Pro',
    email: 'contact@digitalmarketingpro.com',
    phone: '+244 912 000 111',
    commission_rate: 15,
    payout_method: 'bank_transfer',
    payout_details: {
      bank_name: 'Banco BAI',
      account_number: '1234567890',
      account_holder: 'Digital Marketing Pro Ltd'
    },
    status: 'active',
    total_leads: 45,
    total_commission: 6750,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'aff-2',
    organization_id: 'org-1',
    name: 'Tech Referrals',
    email: 'partners@techreferrals.com',
    phone: '+351 912 000 222',
    commission_rate: 20,
    payout_method: 'paypal',
    payout_details: {
      paypal_email: 'payments@techreferrals.com'
    },
    status: 'active',
    total_leads: 28,
    total_commission: 8400,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z'
  }
]

export const mockLeadSources: LeadSource[] = [
  {
    id: 'source-1',
    organization_id: 'org-1',
    name: 'Google Ads Campaign',
    type: 'paid',
    cost_per_lead: 45,
    conversion_rate: 12.5,
    total_leads: 120,
    total_conversions: 15,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z'
  },
  {
    id: 'source-2',
    organization_id: 'org-1',
    name: 'Digital Marketing Pro',
    type: 'affiliate',
    affiliate_id: 'aff-1',
    cost_per_lead: 30,
    conversion_rate: 18.7,
    total_leads: 45,
    total_conversions: 8,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z'
  },
  {
    id: 'source-3',
    organization_id: 'org-1',
    name: 'Organic Website',
    type: 'organic',
    cost_per_lead: 0,
    conversion_rate: 8.3,
    total_leads: 85,
    total_conversions: 7,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z'
  }
]

export const mockValidationRules: ValidationRule[] = [
  {
    id: 'rule-1',
    organization_id: 'org-1',
    name: 'Auto-assign high value leads',
    description: 'Automatically assign leads with value > $20,000 to senior agents',
    entity_type: 'lead',
    conditions: [
      {
        field: 'value',
        operator: 'greater_than',
        value: 20000
      }
    ],
    actions: [
      {
        type: 'assign_user',
        config: { user_id: 'user-2' }
      },
      {
        type: 'create_task',
        config: {
          title: 'High-value lead follow-up',
          type: 'call',
          priority: 'high',
          due_hours: 2
        }
      }
    ],
    is_active: true,
    priority: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'rule-2',
    organization_id: 'org-1',
    name: 'Callback reminder',
    description: 'Create reminder task for leads not contacted in 24 hours',
    entity_type: 'lead',
    conditions: [
      {
        field: 'status',
        operator: 'equals',
        value: 'new'
      },
      {
        field: 'created_at',
        operator: 'less_than',
        value: '24_hours_ago',
        logic: 'and'
      }
    ],
    actions: [
      {
        type: 'change_status',
        config: { status: 'callback' }
      },
      {
        type: 'create_task',
        config: {
          title: 'Follow up on new lead',
          type: 'call',
          priority: 'medium',
          due_hours: 4
        }
      }
    ],
    is_active: true,
    priority: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  }
]

export const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-1',
    organization_id: 'org-1',
    name: 'Q1 Lead Generation',
    type: 'ppc',
    status: 'active',
    budget: 5000,
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    target_audience: 'Small to medium businesses in Angola and Portugal',
    description: 'Google Ads campaign targeting CRM keywords',
    metrics: {
      impressions: 15420,
      clicks: 892,
      leads: 45,
      conversions: 12,
      cost_per_lead: 111.11,
      roi: 240
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-17T00:00:00Z'
  }
]

export const mockActivities: ActivityType[] = [
  {
    id: 'activity-1',
    organization_id: 'org-1',
    type: 'call',
    title: 'Called João Silva',
    description: 'Discussed requirements and pricing. Very interested.',
    user_id: 'user-3',
    related_to: 'lead-1',
    related_type: 'lead',
    metadata: { duration: 1800, outcome: 'positive' },
    created_at: '2024-01-17T14:30:00Z'
  },
  {
    id: 'activity-2',
    organization_id: 'org-1',
    type: 'email',
    title: 'Sent proposal to Maria Santos',
    description: 'Sent detailed proposal with 20% discount for early adoption',
    user_id: 'user-3',
    related_to: 'lead-2',
    related_type: 'lead',
    metadata: { email_opened: true, links_clicked: 2 },
    created_at: '2024-01-18T11:30:00Z'
  },
  {
    id: 'activity-3',
    organization_id: 'org-1',
    type: 'status_change',
    title: 'Order status updated',
    description: 'Changed order status from Processing to Approved',
    user_id: 'user-3',
    related_to: 'order-2',
    related_type: 'lead',
    metadata: { old_status: 'processing', new_status: 'approved' },
    created_at: '2024-01-18T08:15:00Z'
  }
]

export const mockDashboardMetrics: DashboardMetrics = {
  total_leads: 156,
  conversion_rate: 23,
  active_agents: 8,
  calls_today: 47,
  revenue_this_month: 125000,
  tickets_open: 12,
  avg_response_time: 2.5,
  total_orders: 89,
  orders_today: 12,
  active_shipments: 15,
  low_stock_alerts: 3,
  top_performers: [
    { user_id: 'user-2', name: 'Sales Manager', score: 95 },
    { user_id: 'user-3', name: 'Sales Agent', score: 87 },
    { user_id: 'user-1', name: 'Admin User', score: 82 }
  ]
}
// IngoCRM - Core Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'agent' | 'viewer';
  organization_id: string;
  avatar_url?: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  last_active?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  domain?: string;
  settings: OrganizationSettings;
  created_at: string;
  updated_at: string;
}

export interface OrganizationSettings {
  timezone: string;
  currency: string;
  language: 'en' | 'pt' | 'fr';
  business_hours: {
    start: string;
    end: string;
    days: number[];
  };
}

export type LeadType = {
  id: string;
  organization_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'callback' | 'spam' | 'duplicate';
  source: 'website' | 'facebook' | 'google' | 'referral' | 'cold_call' | 'other';
  value?: number;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  organization_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  account_id?: string;
  tags: string[];
  segment: 'vip' | 'new' | 'inactive' | 'regular';
  last_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  organization_id: string;
  name: string;
  type: 'prospect' | 'customer' | 'partner' | 'competitor';
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  assigned_to?: string;
  value?: number;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  organization_id: string;
  name: string;
  account_id?: string;
  contact_id?: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  value: number;
  probability: number;
  close_date: string;
  assigned_to?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type TaskType = {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  type: 'call' | 'email' | 'meeting' | 'follow_up' | 'other';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: string;
  related_to?: string;
  related_type?: 'lead' | 'contact' | 'account' | 'opportunity' | 'ticket';
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export type TicketType = {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report';
  assigned_to?: string;
  requester_email?: string;
  requester_name?: string;
  sla_due_date?: string;
  resolution_time?: number;
  created_at: string;
  updated_at: string;
}

// NEW ADVANCED MODULES

export interface OrderType {
  id: string;
  org_id: string;
  client_id?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  cart?: OrderItem[];
  total: number;
  status: 'processing' | 'in_work' | 'callback' | 'spam' | 'duplicate' | 'verification' | 'accepted' | 'canceled' | 'in_shipping' | 'closed_won' | 'closed_lost' | 'return' | 'pre_payment' | 'confirm' | 'approved';
  operator_id?: string;
  product_id?: string;
  warehouse_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CallLog {
  id: string;
  organization_id: string;
  lead_id: string;
  operator_id: string;
  phone_number: string;
  duration: number; // in seconds
  outcome: 'approved' | 'callback' | 'spam' | 'rejected' | 'no_answer' | 'busy';
  notes?: string;
  recording_url?: string;
  started_at: string;
  ended_at?: string;
  created_at: string;
}

export interface CallCenter {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  agents: string[]; // user IDs
  supervisor_id: string;
  is_active: boolean;
  settings: {
    auto_assign: boolean;
    max_calls_per_agent: number;
    break_duration: number;
  };
  created_at: string;
  updated_at: string;
}

export interface AgentStatus {
  user_id: string;
  status: 'available' | 'busy' | 'break' | 'offline';
  current_call_id?: string;
  calls_today: number;
  last_activity: string;
}

export interface ShipmentType {
  id: string;
  organization_id: string;
  order_id: string;
  warehouse_id: string;
  items: ShipmentItem[];
  status: 'pending' | 'in_transit' | 'delivered' | 'returned';
  tracking_number?: string;
  carrier?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentItem {
  product_id: string;
  product_name: string;
  quantity: number;
  sku: string;
}

export interface WarehouseType {
  id: string;
  organization_id: string;
  name: string;
  address: string;
  manager_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductType {
  id: string;
  organization_id: string;
  name: string;
  sku: string;
  description?: string;
  unit_price: number;
  quantity_in_stock: number;
  min_stock_threshold: number;
  supplier?: string;
  category?: string;
  warehouse_id: string;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  organization_id: string;
  product_id: string;
  warehouse_id: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason?: string;
  reference_id?: string; // order_id, shipment_id, etc.
  user_id: string;
  created_at: string;
}

export interface ClientType {
  id: string;
  organization_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  segment: 'vip' | 'new' | 'inactive' | 'regular';
  tags: string[];
  total_orders: number;
  total_spent: number;
  last_order_date?: string;
  acquisition_source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HistoryLog {
  id: string;
  organization_id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes?: Record<string, { old: any; new: any }>;
  description: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface MonitoringStatus {
  user_id: string;
  user_name: string;
  current_page: string;
  is_editing: boolean;
  time_active: number; // in minutes
  call_mode: boolean;
  status: 'online' | 'offline' | 'idle';
  ip_address?: string;
  last_activity: string;
}

export interface AffiliateType {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone?: string;
  commission_rate: number; // percentage
  payout_method: 'bank_transfer' | 'paypal' | 'crypto';
  payout_details: Record<string, any>;
  status: 'active' | 'inactive' | 'suspended';
  total_leads: number;
  total_commission: number;
  created_at: string;
  updated_at: string;
}

export interface LeadSource {
  id: string;
  organization_id: string;
  name: string;
  type: 'affiliate' | 'campaign' | 'organic' | 'paid';
  affiliate_id?: string;
  cost_per_lead?: number;
  conversion_rate: number;
  total_leads: number;
  total_conversions: number;
  created_at: string;
  updated_at: string;
}

export interface ValidationRule {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  entity_type: 'lead' | 'order' | 'ticket' | 'task';
  conditions: ValidationCondition[];
  actions: ValidationAction[];
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface ValidationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: any;
  logic?: 'and' | 'or';
}

export interface ValidationAction {
  type: 'change_status' | 'assign_user' | 'create_task' | 'send_notification' | 'add_tag';
  config: Record<string, any>;
}

export interface Campaign {
  id: string;
  organization_id: string;
  name: string;
  type: 'email' | 'social' | 'ppc' | 'content' | 'event' | 'other';
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget?: number;
  start_date: string;
  end_date?: string;
  target_audience?: string;
  description?: string;
  metrics: CampaignMetrics;
  created_at: string;
  updated_at: string;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  cost_per_lead: number;
  roi: number;
}

export type ActivityType = {
  id: string;
  organization_id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'status_change';
  title: string;
  description?: string;
  user_id: string;
  related_to: string;
  related_type: 'lead' | 'contact' | 'account' | 'opportunity' | 'ticket';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AutomationRule {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  trigger: {
    entity: string;
    field: string;
    condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
  actions: AutomationAction[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AutomationAction {
  type: 'create_task' | 'send_email' | 'update_field' | 'assign_user' | 'send_notification';
  config: Record<string, any>;
}

export interface DashboardMetrics {
  total_leads: number;
  conversion_rate: number;
  active_agents: number;
  calls_today: number;
  revenue_this_month: number;
  tickets_open: number;
  avg_response_time: number;
  total_orders: number;
  orders_today: number;
  active_shipments: number;
  low_stock_alerts: number;
  top_performers: Array<{
    user_id: string;
    name: string;
    score: number;
  }>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  items: LeadType[] | Opportunity[];
}

export interface FilterOptions {
  search?: string;
  status?: string;
  assigned_to?: string;
  date_range?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

// Legacy exports for backward compatibility
export type Lead = LeadType;
export type Task = TaskType;
export type Ticket = TicketType;
export type Activity = ActivityType;
export type Order = OrderType;
export type Shipment = ShipmentType;
export type Warehouse = WarehouseType;
export type Product = ProductType;
export type Client = ClientType;
export type Affiliate = AffiliateType;
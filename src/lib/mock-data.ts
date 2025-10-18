// /src/lib/mock-data.ts
// Mock Data para IngoCRM — apenas dados estáticos (sem JSX, sem hooks)

export const mockUsers = [
  {
    id: "user-1",
    name: "Maria Silva",
    email: "maria@ingo.com",
    role: "Admin",
    avatar_url: "https://i.pravatar.cc/150?u=maria",
  },
  {
    id: "user-2",
    name: "João Costa",
    email: "joao@ingo.com",
    role: "Agent",
    avatar_url: "https://i.pravatar.cc/150?u=joao",
  },
  {
    id: "user-3",
    name: "Ana Lopes",
    email: "ana@ingo.com",
    role: "Supervisor",
    avatar_url: "https://i.pravatar.cc/150?u=ana",
  },
];

export const mockLeads = [
  {
    id: "lead-1",
    name: "Carlos Mendes",
    email: "carlos@gmail.com",
    phone: "+351 910 000 001",
    country: "Portugal",
    status: "new",
    created_at: new Date().toISOString(),
  },
  {
    id: "lead-2",
    name: "Ana Oliveira",
    email: "ana@gmail.com",
    phone: "+351 910 000 002",
    country: "Angola",
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: "lead-3",
    name: "Pedro Santos",
    email: "pedro@gmail.com",
    phone: "+351 910 000 003",
    country: "Moçambique",
    status: "processing",
    created_at: new Date().toISOString(),
  },
];

export const mockOrders = [
  {
    id: "order-1",
    client_id: "client-1",
    product_name: "Eretronh Vita",
    amount: 49.9,
    status: "delivered",
  },
  {
    id: "order-2",
    client_id: "client-2",
    product_name: "AktivMax",
    amount: 39.9,
    status: "processing",
  },
  {
    id: "order-3",
    client_id: "client-3",
    product_name: "Prostafix",
    amount: 59.9,
    status: "approved",
  },
];

export const mockClients = [
  {
    id: "client-1",
    name: "Miguel Almeida",
    email: "miguel@gmail.com",
    phone: "+351 920 000 001",
    segment: "vip",
    tags: ["active", "returning"],
    total_orders: 12,
    total_spent: 560,
    last_order_date: new Date().toISOString(),
    acquisition_source: "Facebook",
  },
  {
    id: "client-2",
    name: "Joana Marques",
    email: "joana@gmail.com",
    phone: "+351 920 000 002",
    segment: "standard",
    tags: ["new"],
    total_orders: 3,
    total_spent: 120,
    last_order_date: new Date().toISOString(),
    acquisition_source: "Instagram",
  },
  {
    id: "client-3",
    name: "Tiago Rocha",
    email: "tiago@gmail.com",
    phone: "+351 920 000 003",
    segment: "inactive",
    tags: ["lost"],
    total_orders: 1,
    total_spent: 40,
    last_order_date: null,
    acquisition_source: "Google",
  },
];

export const mockProducts = [
  {
    id: "prod-1",
    name: "Eretronh Vita",
    category: "Suplementos",
    sku: "ER-VITA-001",
    quantity_in_stock: 35,
    min_stock_threshold: 10,
    unit_price: 49.9,
    supplier: "NutraForte",
    warehouse_id: "wh-1",
  },
  {
    id: "prod-2",
    name: "AktivMax",
    category: "Suplementos",
    sku: "AKTIV-002",
    quantity_in_stock: 12,
    min_stock_threshold: 20,
    unit_price: 39.9,
    supplier: "NutraForte",
    warehouse_id: "wh-1",
  },
  {
    id: "prod-3",
    name: "Prostafix",
    category: "Saúde Masculina",
    sku: "PROS-003",
    quantity_in_stock: 5,
    min_stock_threshold: 15,
    unit_price: 59.9,
    supplier: "NutraPlus",
    warehouse_id: "wh-2",
  },
];

export const mockWarehouses = [
  { id: "wh-1", name: "Central Lisboa" },
  { id: "wh-2", name: "Depósito Porto" },
];

export const mockShipments = [
  {
    id: "ship-1",
    order_id: "order-1",
    warehouse_id: "wh-1",
    carrier: "Rangel",
    tracking_number: "RG123456789PT",
    status: "delivered",
    created_at: new Date().toISOString(),
  },
  {
    id: "ship-2",
    order_id: "order-2",
    warehouse_id: "wh-1",
    carrier: "DHL",
    tracking_number: "DHL987654321",
    status: "in_transit",
    created_at: new Date().toISOString(),
  },
];

export const mockCallCenters = [
  {
    id: "cc-1",
    name: "Lisboa Call Center",
    description: "Equipe principal de Portugal",
    is_active: true,
    agents: ["user-1", "user-2"],
    settings: { max_calls_per_agent: 10, break_duration: 15 },
  },
  {
    id: "cc-2",
    name: "Luanda Call Center",
    description: "Equipe de Angola",
    is_active: false,
    agents: ["user-3"],
    settings: { max_calls_per_agent: 8, break_duration: 10 },
  },
];

export const mockHistoryLogs = [
  {
    id: "log-1",
    user_id: "user-1",
    user_name: "Maria Silva",
    action: "update",
    entity_type: "Lead",
    description: "Lead status changed from 'new' to 'approved'",
    changes: { status: { old: "new", new: "approved" } },
    ip_address: "192.168.1.101",
    created_at: new Date().toISOString(),
  },
  {
    id: "log-2",
    user_id: "user-2",
    user_name: "João Costa",
    action: "create",
    entity_type: "Order",
    description: "New order created for client Miguel Almeida",
    ip_address: "192.168.1.102",
    created_at: new Date().toISOString(),
  },
];

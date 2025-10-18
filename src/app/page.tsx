"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// UI (shadcn)
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

// Ícones
import {
  Plus,
  Download,
  Edit,
  MoreHorizontal,
  Eye,
  Target,
  AlertTriangle,
  Upload,
  Filter,
  Phone,
  Play,
  Pause,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Mail,
  Copy,
  Zap,
} from "lucide-react";

// Layout
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import EditDialog from "../components/dialogs/EditDialog";

// Mocks e utils  (⚠️ mock-data.ts com hífen)
import {
  mockUsers,
  mockLeads,
  mockOrders,
  mockCallCenters,
  mockWarehouses,
  mockShipments,
  mockProducts,
  mockClients,
  mockAffiliates,
  mockValidationRules,
  mockTasks,
  mockTickets,
  mockMonitoringStatus,
  mockHistoryLogs,
} from "../lib/mock-data";

import {
  getStatusColor,
  formatDate,
  formatCurrency,
  getInitials,
} from "../lib/utils";

/* ============================
   Supabase Client
============================= */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ============================
   Tipos simples
============================= */
type Lead = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  created_at: string;
  status:
    | "new"
    | "processing"
    | "approved"
    | "rejected"
    | "callback"
    | "spam"
    | "verification"
    | "delivered"
    | "returned";
};

/* ============================
   DashboardCounters (AGORA CLICÁVEL)
============================= */
function DashboardCounters({
  leadStats,
  onStatusClick,
}: {
  leadStats: Record<string, number>;
  onStatusClick: (status: Lead["status"] | null) => void;
}) {
  const items = useMemo(
    () => [
      { key: null as Lead["status"] | null, label: "Total Leads", value: leadStats.total ?? 0, icon: <Target className="h-4 w-4 text-muted-foreground" /> },
      { key: "new" as const, label: "New", value: leadStats.new ?? 0 },
      { key: "processing" as const, label: "Processing", value: leadStats.processing ?? 0 },
      { key: "approved" as const, label: "Approved", value: leadStats.approved ?? 0, cls: "text-green-600" },
      { key: "rejected" as const, label: "Rejected", value: leadStats.rejected ?? 0, cls: "text-red-600" },
      { key: "callback" as const, label: "Callback", value: leadStats.callback ?? 0, cls: "text-yellow-600" },
      { key: "spam" as const, label: "Spam", value: leadStats.spam ?? 0, cls: "text-gray-500" },
      { key: "verification" as const, label: "Verification", value: leadStats.verification ?? 0, cls: "text-blue-600" },
      { key: "delivered" as const, label: "Delivered", value: leadStats.delivered ?? 0, cls: "text-emerald-600" },
      { key: "returned" as const, label: "Returned", value: leadStats.returned ?? 0, cls: "text-amber-600" },
    ],
    [leadStats]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
      {items.map((it) => (
        <Card
          key={it.label}
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onStatusClick(it.key)}
          role="button"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{it.label}</CardTitle>
            {it.icon}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${it.cls ?? ""}`}>{it.value}</div>
            <p className="text-xs text-muted-foreground">{it.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ============================
   Seções / Módulos
============================= */

function DashboardContent({
  leadStats,
  onStatusClick,
}: {
  leadStats: Record<string, number>;
  onStatusClick: (status: Lead["status"] | null) => void;
}) {
  return (
    <div className="space-y-6">
      <DashboardCounters leadStats={leadStats} onStatusClick={onStatusClick} />
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
          <CardDescription>Estatísticas gerais do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Esta área pode conter gráficos, relatórios e resumos operacionais.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function LeadsContent({ filterStatus }: { filterStatus: Lead["status"] | null }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    let rows: Lead[] = error ? ((mockLeads as unknown as Lead[]) ?? []) : ((data as unknown as Lead[]) ?? []);

    // FILTRO vindo do card clicado no topo
    if (filterStatus) {
      rows = rows.filter((l) => (l.status || "").toLowerCase() === filterStatus.toLowerCase());
    }

    setLeads(rows);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: Lead["status"]) {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", id);
    if (error) console.error("Erro ao atualizar:", error);
    await fetchLeads();
  }

  useEffect(() => {
    fetchLeads();
    const subscription = supabase
      .channel("leads-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, fetchLeads)
      .subscribe();
    return () => supabase.removeChannel(subscription);
    // quando filterStatus muda, recarrega
  }, [filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📋 Leads</h2>
        {filterStatus && (
          <div className="text-sm text-gray-600">
            Filtro ativo: <Badge className="ml-2 capitalize">{filterStatus}</Badge>
          </div>
        )}
      </div>

      {loading ? (
        <p>Carregando leads...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <Card key={lead.id} className="p-4 shadow-sm">
              <CardHeader>
                <h3 className="font-semibold">{lead.name || "Sem nome"}</h3>
                <p className="text-sm text-gray-500">{lead.email}</p>
                <p className="text-sm">{lead.phone}</p>
                <Badge
                  className={`mt-2 ${
                    lead.status === "approved"
                      ? "bg-green-500"
                      : lead.status === "rejected"
                      ? "bg-red-500"
                      : lead.status === "spam"
                      ? "bg-gray-500"
                      : lead.status === "callback"
                      ? "bg-yellow-500"
                      : lead.status === "delivered"
                      ? "bg-emerald-500"
                      : lead.status === "returned"
                      ? "bg-amber-500"
                      : lead.status === "processing"
                      ? "bg-blue-500"
                      : "bg-indigo-500"
                  }`}
                >
                  {lead.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3 text-gray-600">País: {lead.country || "—"}</p>
                <p className="text-xs text-gray-400">
                  Criado:{" "}
                  {new Date(lead.created_at).toLocaleString("pt-PT", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    "new",
                    "processing",
                    "approved",
                    "rejected",
                    "callback",
                    "spam",
                    "verification",
                    "delivered",
                    "returned",
                  ].map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(lead.id, status as Lead["status"])}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-sm text-gray-500">Manage and track customer orders</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Order
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
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockOrders.map((order) => {
                  const client = mockClients.find((c) => c.id === order.client_id);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client?.name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(order.amount)}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CallModeContent() {
  const demoCalls = (mockLeads as any[]).slice(0, 6).map((l, i) => ({
    id: `call_${i}`,
    lead_name: l.name || `Lead ${i + 1}`,
    phone: l.phone || "—",
    status: i % 3 === 0 ? "completed" : i % 3 === 1 ? "in_progress" : "queued",
    duration: 30 + i * 7,
    agent: mockUsers[i % mockUsers.length]?.name ?? "Agent",
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Call Mode</h2>
          <p className="text-sm text-gray-500">Real-time call operations</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Call
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {demoCalls.map((call) => (
          <Card key={call.id}>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>{call.lead_name}</CardTitle>
                <CardDescription>{call.phone}</CardDescription>
              </div>
              <Badge
                className={
                  call.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : call.status === "in_progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {call.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Agent: {call.agent}</span>
                <span>{call.duration}s</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CallCentersContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Call Centers</h2>
          <p className="text-sm text-gray-500">Manage call center teams and agents</p>
        </div>
        <Button size="sm">
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
                <Badge className={center.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {center.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>{center.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Agents ({center.agents.length})</h4>
                <div className="space-y-2">
                  {center.agents.map((agentId) => {
                    const agent = mockUsers.find((u) => u.id === agentId);
                    const statuses = ["available", "busy", "break"] as const;
                    const status = statuses[agentId.length % 3];
                    const callsToday = (agentId.length % 5) + 3;

                    return (
                      <div key={agentId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={agent?.avatar_url} />
                            <AvatarFallback className="text-xs">
                              {getInitials(agent?.name || "")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{agent?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              status === "available"
                                ? "bg-green-100 text-green-800"
                                : status === "busy"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {status}
                          </Badge>
                          <span className="text-xs text-gray-500">{callsToday} calls</span>
                        </div>
                      </div>
                    );
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ShipmentsContent() {
  return (
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
          <Button size="sm">
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
                  const warehouse = mockWarehouses.find((w) => w.id === shipment.warehouse_id);
                  return (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{shipment.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{shipment.order_id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warehouse?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shipment.tracking_number || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.carrier || "-"}</td>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WarehouseContent() {
  return (
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
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {mockProducts.filter((p) => p.quantity_in_stock < p.min_stock_threshold).length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockProducts
                .filter((p) => p.quantity_in_stock < p.min_stock_threshold)
                .map((product) => (
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
                  const warehouse = mockWarehouses.find((w) => w.id === product.warehouse_id);
                  const isLow = product.quantity_in_stock < product.min_stock_threshold;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${isLow ? "text-orange-600" : "text-gray-900"}`}>
                            {product.quantity_in_stock}
                          </span>
                          {isLow && <AlertTriangle className="h-4 w-4 text-orange-500 ml-2" />}
                        </div>
                        <div className="text-xs text-gray-500">Min: {product.min_stock_threshold}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.unit_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.supplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warehouse?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
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
}

function ClientsContent() {
  return (
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
          <Button size="sm">
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
                      <Badge className={getStatusColor(client.segment)}>{client.segment}</Badge>
                      <div className="mt-1">
                        {client.tags.map((tag: string) => (
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
                      {client.last_order_date ? formatDate(client.last_order_date) : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.acquisition_source}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
  );
}

function HistoryContent() {
  return (
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
                  <AvatarImage src={mockUsers.find((u) => u.id === log.user_id)?.avatar_url} />
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
                          <span className="bg-red-100 text-red-800 px-1 rounded">
                            {String((change as any).old)}
                          </span>
                          <span>→</span>
                          <span className="bg-green-100 text-green-800 px-1 rounded">
                            {String((change as any).new)}
                          </span>
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
  );
}

/* Placeholders simples */
const AnalyticsContent = () => (
  <Card><CardHeader><CardTitle>Analytics</CardTitle></CardHeader><CardContent>Em breve gráficos e KPIs.</CardContent></Card>
);
const MonitoringContent = () => (
  <Card><CardHeader><CardTitle>Monitoring</CardTitle></CardHeader><CardContent>Monitoração do sistema e filas.</CardContent></Card>
);
const AffiliatesContent = () => (
  <Card><CardHeader><CardTitle>Affiliates</CardTitle></CardHeader><CardContent>Gestão de afiliados.</CardContent></Card>
);
const ValidationRulesContent = () => (
  <Card><CardHeader><CardTitle>Validation Rules</CardTitle></CardHeader><CardContent>Regras de validação de leads.</CardContent></Card>
);
const TasksContent = () => (
  <Card><CardHeader><CardTitle>Tasks</CardTitle></CardHeader><CardContent>Gestão de tarefas.</CardContent></Card>
);
const TicketsContent = () => (
  <Card><CardHeader><CardTitle>Tickets</CardTitle></CardHeader><CardContent>Atendimento e suporte.</CardContent></Card>
);

/* ============================
   Página principal
============================= */
export default function IngoCRM() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "leads"
    | "orders"
    | "call-mode"
    | "call-centers"
    | "shipments"
    | "warehouse"
    | "clients"
    | "analytics"
    | "history"
    | "monitoring"
    | "affiliates"
    | "validation-rules"
    | "tasks"
    | "tickets"
    | "contacts"
    | "accounts"
    | "reports"
    | "settings"
  >("dashboard");

  const [filterStatus, setFilterStatus] = useState<Lead["status"] | null>(null);

  const [leadStats, setLeadStats] = useState<Record<string, number>>({
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

  // Contadores com Supabase (e fallback para mocks)
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("leads").select("status");
      const rows = (error ? (mockLeads as any[]) : (data as any[])) ?? [];
      const counts: Record<string, number> = {
        total: rows.length,
        new: 0,
        processing: 0,
        approved: 0,
        rejected: 0,
        callback: 0,
        spam: 0,
        verification: 0,
        delivered: 0,
        returned: 0,
      };
      rows.forEach((l) => {
        const s = (l.status || "").toLowerCase();
        if (counts[s] !== undefined) counts[s] += 1;
      });
      setLeadStats(counts);
    }

    load();
    const ch = supabase
      .channel("realtime-leads")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, load)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  // Clique nos cards do topo: aplica filtro e vai para "Leads"
  function handleStatusClick(status: Lead["status"] | null) {
    setFilterStatus(status);       // null = sem filtro / Total
    setActiveTab("leads");         // navega para a aba Leads automaticamente
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Área principal */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />

        {/* Painel de status dos leads (agora com clique para filtrar) */}
        <div className="p-4 bg-white shadow-sm border-b">
          <DashboardCounters leadStats={leadStats} onStatusClick={handleStatusClick} />
        </div>

        {/* Navegação rápida (mantida) */}
        <div className="flex gap-2 p-4 overflow-x-auto bg-white border-b">
          {[
            ["dashboard", "Dashboard"],
            ["leads", "Leads"],
            ["orders", "Orders"],
            ["call-mode", "Call Mode"],
            ["call-centers", "Call Centers"],
            ["shipments", "Shipments"],
            ["warehouse", "Warehouse"],
            ["clients", "Clients"],
            ["analytics", "Analytics"],
            ["history", "History"],
            ["monitoring", "Monitoring"],
            ["affiliates", "Affiliates"],
            ["validation-rules", "Validation Rules"],
            ["tasks", "Tasks"],
            ["tickets", "Tickets"],
            ["contacts", "Contacts"],
            ["accounts", "Accounts"],
            ["reports", "Reports"],
            ["settings", "Settings"],
          ].map(([key, label]) => (
            <Button
              key={key}
              variant={activeTab === (key as any) ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(key as any)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "dashboard" && <DashboardContent leadStats={leadStats} onStatusClick={handleStatusClick} />}
          {activeTab === "leads" && <LeadsContent filterStatus={filterStatus} />}
          {activeTab === "orders" && <OrdersContent />}
          {activeTab === "call-mode" && <CallModeContent />}
          {activeTab === "call-centers" && <CallCentersContent />}
          {activeTab === "shipments" && <ShipmentsContent />}
          {activeTab === "warehouse" && <WarehouseContent />}
          {activeTab === "clients" && <ClientsContent />}
          {activeTab === "analytics" && <AnalyticsContent />}
          {activeTab === "history" && <HistoryContent />}
          {activeTab === "monitoring" && <MonitoringContent />}
          {activeTab === "affiliates" && <AffiliatesContent />}
          {activeTab === "validation-rules" && <ValidationRulesContent />}
          {activeTab === "tasks" && <TasksContent />}
          {activeTab === "tickets" && <TicketsContent />}

          {activeTab === "contacts" && (
            <Card>
              <CardHeader>
                <CardTitle>Contacts Module</CardTitle>
              </CardHeader>
              <CardContent>Contact management functionality coming soon…</CardContent>
            </Card>
          )}
          {activeTab === "accounts" && (
            <Card>
              <CardHeader>
                <CardTitle>Accounts Module</CardTitle>
              </CardHeader>
              <CardContent>Account management functionality coming soon…</CardContent>
            </Card>
          )}
          {activeTab === "reports" && (
            <Card>
              <CardHeader>
                <CardTitle>Reports Module</CardTitle>
              </CardHeader>
              <CardContent>Advanced reporting functionality coming soon…</CardContent>
            </Card>
          )}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Settings Module</CardTitle>
              </CardHeader>
              <CardContent>System settings functionality coming soon…</CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Dialog genérico */}
      <EditDialog />
    </div>
  );
}

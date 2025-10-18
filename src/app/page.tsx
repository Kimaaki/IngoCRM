"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// UI (shadcn)
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Ícones
import {
  Plus,
  Download,
  Edit,
  MoreHorizontal,
  Eye,
  Target,
  Users,
  AlertTriangle,
  Phone,
  Play,
  Pause,
  DollarSign,
  Copy,
  Calendar,
  Clock,
  Mail,
  Filter,
  Upload,
  Zap,
} from "lucide-react";

// Layout
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import EditDialog from "@/components/dialogs/EditDialog";

// Mocks
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
  mockCalls,           // <-- necessário para Call Mode
  mockAgentStatus,     // <-- necessário para Call Centers
} from "@/lib/mockData";

// Utils
import {
  getStatusColor,
  formatDate,
  formatCurrency,
  getTimeAgo,
  getInitials,
} from "@/lib/utils";

// ---------- Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type LeadStats = {
  total: number;
  new: number;
  processing: number;
  approved: number;
  rejected: number;
  callback: number;
  spam: number;
  verification: number;
  delivered: number;
  returned: number;
};

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

  const [leadStats, setLeadStats] = useState<LeadStats>({
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

  // ---- Realtime: contadores de leads
  useEffect(() => {
    fetchLeadStats();

    const channel = supabase
      .channel("lead-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => fetchLeadStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchLeadStats() {
    const { data, error } = await supabase
      .from("leads")
      .select("status")
      .throwOnError();

    if (error) {
      console.error("Erro ao carregar leads:", error);
      return;
    }

    const counts: LeadStats = {
      total: data?.length ?? 0,
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

    (data ?? []).forEach((row: any) => {
      const s = String(row.status || "").toLowerCase() as keyof LeadStats;
      if (s in counts) {
        // @ts-expect-error indexado por string conhecida
        counts[s] = (counts[s] as number) + 1;
      }
    });

    setLeadStats(counts);
  }

  // ---------- Painel compacto com todos os contadores
  const LeadsSummaryPanel = ({ stats }: { stats: LeadStats }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4">
      {/* Total */}
      <Card className="shadow-sm border">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Todos os leads</p>
        </CardContent>
      </Card>

      {(
        [
          ["new", "New"],
          ["processing", "Processing"],
          ["approved", "Approved"],
          ["rejected", "Rejected"],
          ["callback", "Callback"],
          ["spam", "Spam"],
          ["verification", "Verification"],
          ["delivered", "Delivered"],
          ["returned", "Returned"],
        ] as const
      ).map(([key, label]) => (
        <Card key={key} className="shadow-sm border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats[key as keyof LeadStats] as number}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // ---------- Dashboard
  const DashboardContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
          <CardDescription>Estatísticas gerais do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Esta área pode conter gráficos, relatórios e resumo das operações.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // ---------- Leads (lista + mudar status)
  const LeadsContent = () => {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setLeads(data ?? []);
      }
      setLoading(false);
    }

    async function updateStatus(id: string, newStatus: string) {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) console.error("Erro ao atualizar:", error);
      await load();
    }

    useEffect(() => {
      load();
      const sub = supabase
        .channel("leads-realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "leads" },
          () => load()
        )
        .subscribe();
      return () => supabase.removeChannel(sub);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">📋 Leads</h2>
        {loading ? (
          <p>Carregando leads...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leads.map((lead) => (
              <Card key={lead.id} className="p-4 shadow-lg">
                <CardHeader>
                  <h2 className="font-semibold">{lead.name || "Sem nome"}</h2>
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
                  <p className="text-sm mb-3 text-gray-600">
                    País: {lead.country || "—"}
                  </p>
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
                        onClick={() => updateStatus(lead.id, status)}
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
  };

  // ---------- Orders
  const OrdersContent = () => (
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
          <Button>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.product_name}
                      </td>
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

  // ---------- Call Mode
  const CallModeContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Call Mode</h2>
          <p className="text-sm text-gray-500">Real-time call operations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Call
        </Button>
      </div>

      <div className="grid gap-4">
        {mockCalls.map((call) => {
          const agent = mockUsers.find((u) => u.id === call.agent_id);
          const lead = mockLeads.find((l) => l.id === call.lead_id);
          return (
            <Card key={call.id}>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>{lead?.name || "Lead sem nome"}</CardTitle>
                  <CardDescription>{lead?.phone}</CardDescription>
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
                  <span>Agent: {agent?.name}</span>
                  <span>{call.duration} sec</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // ---------- Call Centers
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
                <Badge className={center.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {center.is_active ? "Active" : "Inactive"}
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
                      const agent = mockUsers.find((u) => u.id === agentId);
                      const status = mockAgentStatus.find((s) => s.user_id === agentId);
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
                                status?.status === "available"
                                  ? "bg-green-100 text-green-800"
                                  : status?.status === "busy"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {status?.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{status?.calls_today} calls</span>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ---------- Shipments
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
                        <Badge className={getStatusColor(shipment.status)}>{shipment.status.replace("_", " ")}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shipment.tracking_number || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shipment.carrier || "-"}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ---------- Warehouse
  const handleEdit = (_entity: any, _type: string) => {
    // placeholder pro botão Edit (mantém visual)
    console.log("Edit:", _type, _entity?.id);
  };

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

      {/* Low Stock */}
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

      {/* Tabela Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Products Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockProducts.map((product) => {
                  const warehouse = mockWarehouses.find((w) => w.id === product.warehouse_id);
                  const isLowStock = product.quantity_in_stock < product.min_stock_threshold;
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
                          <span className={`text-sm font-medium ${isLowStock ? "text-orange-600" : "text-gray-900"}`}>
                            {product.quantity_in_stock}
                          </span>
                          {isLowStock && <AlertTriangle className="h-4 w-4 text-orange-500 ml-2" />}
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
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(product, "product")}>
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

  // ---------- Clients
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        {client.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="mr-1 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.total_orders}</td>
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
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(client, "client")}>
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

  // ---------- Analytics (placeholder — mantém visual)
  const AnalyticsContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Charts & KPIs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Gráficos e indicadores podem ficar aqui.</p>
        </CardContent>
      </Card>
    </div>
  );

  // ---------- History
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
                  <AvatarImage src={mockUsers.find((u) => u.id === log.user_id)?.avatar_url} />
                  <AvatarFallback className="text-xs">{getInitials(log.user_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{log.user_name}</span>
                    <Badge variant="outline" className="text-xs">{log.action}</Badge>
                    <Badge variant="outline" className="text-xs">{log.entity_type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                  {log.changes && (
                    <div className="mt-2 text-xs text-gray-500">
                      {Object.entries(log.changes).map(([field, change]: any) => (
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
  );

  // ---------- Monitoring (placeholder funcional)
  const MonitoringContent = () => {
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
      if (!autoRefresh) return;
      const id = setInterval(() => {
        // Aqui você faria refresh de dados reais
        // console.log("Refreshing monitoring data...");
      }, 10000);
      return () => clearInterval(id);
    }, [autoRefresh]);

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
              onClick={() => setAutoRefresh((v) => !v)}
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
            <span className="text-sm text-gray-500">Auto-refresh: {autoRefresh ? "ON" : "OFF"}</span>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Call Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockMonitoringStatus.map((s) => (
                    <tr key={s.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={mockUsers.find((u) => u.id === s.user_id)?.avatar_url} />
                            <AvatarFallback className="text-xs">{getInitials(s.user_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{s.user_name}</div>
                            <div className="text-sm text-gray-500">
                              {s.is_editing && <span className="text-orange-600">Editing...</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.current_page}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              s.status === "online" ? "bg-green-400" : s.status === "idle" ? "bg-yellow-400" : "bg-red-400"
                            }`}
                          />
                          <Badge
                            className={
                              s.status === "online"
                                ? "bg-green-100 text-green-800"
                                : s.status === "idle"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {s.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.time_active}m</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.call_mode ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Phone className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.ip_address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTimeAgo(s.last_activity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // ---------- Affiliates
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
                <Badge className={affiliate.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
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
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(affiliate.total_commission)}</div>
                    <div className="text-sm text-gray-500">Total Commission</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Commission Rate:</span>
                    <span className="font-medium">{affiliate.commission_rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payout Method:</span>
                    <span className="font-medium">{affiliate.payout_method.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium">{affiliate.phone}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(affiliate, "affiliate")}>
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
  );

  // ---------- Validation Rules
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
                  <Badge className={rule.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {rule.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Conditions</h4>
                  <div className="space-y-1">
                    {rule.conditions.map((condition: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        {index > 0 && condition.logic && (
                          <Badge variant="outline" className="text-xs">
                            {String(condition.logic).toUpperCase()}
                          </Badge>
                        )}
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{condition.field}</span>
                        <span className="text-gray-500">{String(condition.operator).replace("_", " ")}</span>
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
                    {rule.actions.map((action: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Badge className="bg-green-100 text-green-800">{String(action.type).replace("_", " ")}</Badge>
                        <span className="text-gray-600">{JSON.stringify(action.config)}</span>
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
                  <Button variant={rule.is_active ? "destructive" : "default"} size="sm">
                    {rule.is_active ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ---------- Tasks
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
          const assignedUser = mockUsers.find((u) => u.id === task.assigned_to);
          return (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{task.title}</h3>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      <Badge className={getStatusColor(task.priority)}>{task.priority}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due: {task.due_date ? formatDate(task.due_date) : "No due date"}
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
          );
        })}
      </div>
    </div>
  );

  // ---------- Tickets
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
          const assignedUser = mockUsers.find((u) => u.id === ticket.assigned_to);
          return (
            <Card key={ticket.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{ticket.title}</h3>
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      <Badge className={getStatusColor(ticket.priority)}>{ticket.priority}</Badge>
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
          );
        })}
      </div>
    </div>
  );

  // ---------- RENDER
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />

        {/* Painel fixo de contadores (abaixo do Header, visível em todas as abas) */}
        <div className="p-4 bg-white shadow-sm border-b">
          <LeadsSummaryPanel stats={leadStats} />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "leads" && <LeadsContent />}
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
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Contacts Module</h3>
              <p className="text-gray-500">Contact management functionality coming soon...</p>
            </div>
          )}
          {activeTab === "accounts" && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Accounts Module</h3>
              <p className="text-gray-500">Account management functionality coming soon...</p>
            </div>
          )}
          {activeTab === "reports" && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reports Module</h3>
              <p className="text-gray-500">Advanced reporting functionality coming soon...</p>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Module</h3>
              <p className="text-gray-500">System settings functionality coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {/* Edit Dialog (mantém visual) */}
      <EditDialog />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import EditDialog from "@/components/dialogs/EditDialog";

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
} from "@/lib/mockData";

import {
  getStatusColor,
  formatDate,
  formatCurrency,
  getTimeAgo,
  getInitials,
} from "@/lib/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function IngoCRM() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
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
    fetchLeadStats();

    const subscription = supabase
      .channel("lead-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => {
          fetchLeadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchLeadStats() {
    const { data, error } = await supabase.from("leads").select("status");
    if (error) {
      console.error("Erro ao carregar leads:", error);
      return;
    }
    const counts: any = {
      total: data.length,
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
    data.forEach((lead) => {
      const s = lead.status?.toLowerCase();
      if (counts[s] !== undefined) counts[s]++;
    });
    setLeadStats(counts);
  }

  const DashboardCounters = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{leadStats.total}</div>
          <p className="text-xs text-muted-foreground">Todos os leads</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{leadStats.new}</div>
          <p className="text-xs text-muted-foreground">Leads recentes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{leadStats.processing}</div>
          <p className="text-xs text-muted-foreground">Em processamento</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {leadStats.approved}
          </div>
          <p className="text-xs text-muted-foreground">Aprovados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {leadStats.rejected}
          </div>
          <p className="text-xs text-muted-foreground">Rejeitados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Callback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {leadStats.callback}
          </div>
          <p className="text-xs text-muted-foreground">Aguardando retorno</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spam</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-500">
            {leadStats.spam}
          </div>
          <p className="text-xs text-muted-foreground">Marcados como spam</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {leadStats.verification}
          </div>
          <p className="text-xs text-muted-foreground">Em verificação</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {leadStats.delivered}
          </div>
          <p className="text-xs text-muted-foreground">Entregues</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Returned</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">
            {leadStats.returned}
          </div>
          <p className="text-xs text-muted-foreground">Devolvidos</p>
        </CardContent>
      </Card>
    </div>
  );

  // ---------------------- INÍCIO DOS COMPONENTES ----------------------

  const DashboardContent = () => (
    <div className="space-y-6">
      <DashboardCounters />

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
  const LeadsContent = () => {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchLeads() {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Erro ao carregar leads:", error);
      else setLeads(data || []);
      setLoading(false);
    }

    async function updateStatus(id: string, newStatus: string) {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) console.error("Erro ao atualizar:", error);
      else fetchLeads();
    }

    useEffect(() => {
      fetchLeads();
      const subscription = supabase
        .channel("leads-realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "leads" },
          () => fetchLeads()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }, []);

    return (
      <div className="space-y-6">
        <DashboardCounters />
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

  const OrdersContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-sm text-gray-500">
            Manage and track customer orders
          </p>
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
                  const client = mockClients.find(
                    (c) => c.id === order.client_id
                  );
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
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
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

  const CallCentersContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Call Centers</h2>
          <p className="text-sm text-gray-500">
            Manage call center teams and agents
          </p>
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
                <Badge
                  className={
                    center.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {center.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>{center.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    Agents ({center.agents.length})
                  </h4>
                  <div className="space-y-2">
                    {center.agents.map((agentId) => {
                      const agent = mockUsers.find((u) => u.id === agentId);
                      const status = mockAgentStatus.find(
                        (s) => s.user_id === agentId
                      );
                      return (
                        <div
                          key={agentId}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
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
                            <span className="text-xs text-gray-500">
                              {status?.calls_today} calls
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Max Calls/Agent:</span>
                    <span className="ml-2 font-medium">
                      {center.settings.max_calls_per_agent}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Break Duration:</span>
                    <span className="ml-2 font-medium">
                      {center.settings.break_duration}min
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ShipmentsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Shipments</h2>
          <p className="text-sm text-gray-500">
            Track shipments and deliveries
          </p>
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
                  const warehouse = mockWarehouses.find(
                    (w) => w.id === shipment.warehouse_id
                  );
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
                          {shipment.status.replace("_", " ")}
                        </Badge>
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
  const WarehouseContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Warehouse Management</h2>
          <p className="text-sm text-gray-500">
            Inventory and stock management
          </p>
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

      {mockProducts.filter(
        (p) => p.quantity_in_stock < p.min_stock_threshold
      ).length > 0 && (
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
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 bg-white rounded"
                  >
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({product.sku})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-orange-600">
                        {product.quantity_in_stock} /{" "}
                        {product.min_stock_threshold}
                      </div>
                      <div className="text-xs text-gray-500">
                        units remaining
                      </div>
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
                  const warehouse = mockWarehouses.find(
                    (w) => w.id === product.warehouse_id
                  );
                  const isLowStock =
                    product.quantity_in_stock < product.min_stock_threshold;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`text-sm font-medium ${
                              isLowStock
                                ? "text-orange-600"
                                : "text-gray-900"
                            }`}
                          >
                            {product.quantity_in_stock}
                          </span>
                          {isLowStock && (
                            <AlertTriangle className="h-4 w-4 text-orange-500 ml-2" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Min: {product.min_stock_threshold}
                        </div>
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
                            onClick={() => handleEdit(product, "product")}
                          >
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
                      {client.last_order_date ? formatDate(client.last_order_date) : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.acquisition_source}
                    </td>
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
  const LeadsSummaryPanel = ({ leadStats }: { leadStats: any }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-4 mb-6">
      {Object.entries(leadStats).map(([status, count]) => (
        <Card key={status} className="shadow-sm border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium capitalize">{status}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">{count}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  export default function IngoCRM() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [leadStats, setLeadStats] = useState({
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

    // Atualização em tempo real via Supabase
    useEffect(() => {
      async function fetchLeadStats() {
        const { data, error } = await supabase
          .from("leads")
          .select("status");

        if (error) {
          console.error("Erro ao carregar status:", error);
          return;
        }

        const counts: any = {
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

        data.forEach((lead) => {
          if (lead.status && counts.hasOwnProperty(lead.status)) {
            counts[lead.status]++;
          }
        });

        setLeadStats(counts);
      }

      fetchLeadStats();

      const channel = supabase
        .channel("realtime-leads")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "leads" },
          () => fetchLeadStats()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, []);

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

          {/* Painel de status dos leads */}
          <div className="p-4 bg-white shadow-sm border-b">
            <LeadsSummaryPanel leadStats={leadStats} />
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

        {/* Edit Dialog */}
        <EditDialog />
      </div>
    );
  }

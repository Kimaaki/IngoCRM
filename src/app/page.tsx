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

// Mocks e utils
import {
  mockUsers,
  mockLeads,
  mockOrders,
  mockCallCenters,
  mockWarehouses,
  mockShipments,
  mockProducts,
  mockClients,
  mockValidationRules,
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
   DASHBOARD COUNTERS (clicáveis)
============================= */
type CounterKey = "total" | Lead["status"];

function DashboardCounters({
  leadStats,
  active,
  onSelect,
}: {
  leadStats: Record<string, number>;
  active?: Lead["status"] | "all";
  onSelect?: (key: CounterKey) => void;
}) {
  const items = useMemo(
    () => [
      { key: "total" as const, label: "Total Leads", value: leadStats.total ?? 0, icon: <Target className="h-4 w-4 text-muted-foreground" /> },
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

  const isActive = (k: CounterKey) =>
    (active === "all" && k === "total") || active === k;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
      {items.map((it) => (
        <button
          key={it.label}
          onClick={() => onSelect?.(it.key)}
          className={`text-left rounded-lg transition focus:outline-none ${
            isActive(it.key) ? "ring-2 ring-indigo-500" : ""
          }`}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{it.label}</CardTitle>
              {it.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${it.cls ?? ""}`}>
                {it.value}
              </div>
              <p className="text-xs text-muted-foreground">{it.label}</p>
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}

/* ============================
   LEADS (filtráveis)
============================= */
function LeadsContent({ filterStatus }: { filterStatus: Lead["status"] | "all" }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLeads() {
    setLoading(true);
    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (filterStatus !== "all") query = query.eq("status", filterStatus);

    const { data, error } = await query;

    if (error) {
      const all = mockLeads as Lead[];
      setLeads(filterStatus === "all" ? all : all.filter((l) => l.status === filterStatus));
    } else {
      setLeads((data as Lead[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
    const sub = supabase
      .channel("leads-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, fetchLeads)
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📋 Leads</h2>
        {filterStatus !== "all" && (
          <Badge variant="outline" className="capitalize">
            Filtro: {filterStatus}
          </Badge>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================
   PÁGINA PRINCIPAL
============================= */
export default function IngoCRM() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "leads"
    | "orders"
    | "settings"
  >("dashboard");

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

  const [leadFilter, setLeadFilter] = useState<Lead["status"] | "all">("all");

  const handleSelectStatus = (key: CounterKey) => {
    setLeadFilter(key === "total" ? "all" : key);
    setActiveTab("leads");
  };

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />

        {/* Painel de status clicável */}
        <div className="p-4 bg-white shadow-sm border-b">
          <DashboardCounters
            leadStats={leadStats}
            active={leadFilter}
            onSelect={handleSelectStatus}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "dashboard" && (
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Clique em qualquer status acima para filtrar as leads.
                </p>
              </CardContent>
            </Card>
          )}
          {activeTab === "leads" && (
            <LeadsContent filterStatus={leadFilter} />
          )}
          {activeTab === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>Em breve...</CardContent>
            </Card>
          )}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>Configurações gerais</CardContent>
            </Card>
          )}
        </main>
      </div>

      <EditDialog />
    </div>
  );
}

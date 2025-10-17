"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Contadores de status ---
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    callback: 0,
    spam: 0,
    verification: 0,
  });

  // Função para buscar leads
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

  // Atualizar status de lead
  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) console.error("Erro ao atualizar:", error);
    else fetchLeads();
  }

  // Atualizar contadores automaticamente
  useEffect(() => {
    if (leads.length > 0) {
      const counts = {
        total: leads.length,
        approved: leads.filter((l) => l.status === "approved").length,
        rejected: leads.filter((l) => l.status === "rejected").length,
        callback: leads.filter((l) => l.status === "callback").length,
        spam: leads.filter((l) => l.status === "spam").length,
        verification: leads.filter((l) => l.status === "verification").length,
      };
      setStats(counts);
    }
  }, [leads]);

  // Efeito para carregar e ouvir alterações em tempo real
  useEffect(() => {
    fetchLeads();

    const subscription = supabase
      .channel("leads-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload) => {
          console.log("Atualização em tempo real:", payload);
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📋 Leads Dashboard</h1>

      {/* Painel de contadores */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="p-4">
          <CardHeader className="text-center">
            <h2 className="font-semibold">Total</h2>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardHeader>
        </Card>
        <Card className="p-4">
          <CardHeader className="text-center text-green-600">
            <h2 className="font-semibold">Approved</h2>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </CardHeader>
        </Card>
        <Card className="p-4">
          <CardHeader className="text-center text-red-600">
            <h2 className="font-semibold">Rejected</h2>
            <p className="text-2xl font-bold">{stats.rejected}</p>
          </CardHeader>
        </Card>
        <Card className="p-4">
          <CardHeader className="text-center text-yellow-500">
            <h2 className="font-semibold">Callback</h2>
            <p className="text-2xl font-bold">{stats.callback}</p>
          </CardHeader>
        </Card>
        <Card className="p-4">
          <CardHeader className="text-center text-gray-500">
            <h2 className="font-semibold">Spam</h2>
            <p className="text-2xl font-bold">{stats.spam}</p>
          </CardHeader>
        </Card>
        <Card className="p-4">
          <CardHeader className="text-center text-blue-600">
            <h2 className="font-semibold">Verification</h2>
            <p className="text-2xl font-bold">{stats.verification}</p>
          </CardHeader>
        </Card>
      </div>

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
                      : "bg-blue-500"
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
                  {["approved", "rejected", "spam", "callback", "verification"].map(
                    (status) => (
                      <Button
                        key={status}
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(lead.id, status)}
                      >
                        {status}
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Lead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  status: "new" | "approved" | "rejected" | "spam" | "callback";
  created_at: string;
};

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setLeads((data || []) as Lead[]);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: Lead["status"]) {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    }
  }

  useEffect(() => {
    fetchLeads();

    // Realtime updates
    const channel = supabase
      .channel("leads-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, (_payload) => {
        fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📋 Leads</h1>

      {loading ? (
        <p>Carregando leads...</p>
      ) : leads.length === 0 ? (
        <p>Sem leads ainda.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <Card key={lead.id} className="p-4 shadow-lg">
              <CardHeader>
                <h2 className="font-semibold">{lead.name || "Sem nome"}</h2>
                <p className="text-sm text-gray-500">{lead.email || "—"}</p>
                <p className="text-sm">{lead.phone || "—"}</p>

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
                <p className="text-sm mb-3 text-gray-600">País: {lead.country || "—"}</p>
                <p className="text-xs text-gray-400">
                  Criado:{" "}
                  {new Date(lead.created_at).toLocaleString("pt-PT", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {(["approved", "rejected", "spam", "callback", "new"] as Lead["status"][]).map(
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
    if (error) console.error("Erro ao atualizar status:", error);
  }

  useEffect(() => {
    fetchLeads();

    const subscription = supabase
      .channel("leads-changes")
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

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    new: "bg-blue-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
    callback: "bg-yellow-500",
    spam: "bg-gray-500",
    verification: "bg-purple-500",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Leads</h1>
      <p className="text-gray-500 mb-6">
        Gerencie e acompanhe todos os leads e seus status em tempo real.
      </p>

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="🔍 Pesquisar lead por nome, email ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <p>Carregando leads...</p>
      ) : filteredLeads.length === 0 ? (
        <p>Nenhum lead encontrado.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="p-4 shadow-md">
              <CardContent>
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">{lead.name || "Sem nome"}</h2>
                  <Badge className={`${statusColors[lead.status] || "bg-blue-500"}`}>
                    {lead.status}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mt-1">{lead.email}</p>
                <p className="text-sm text-gray-600">{lead.phone}</p>
                <p className="text-sm text-gray-600 mt-2">
                  País: {lead.country || "—"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Criado:{" "}
                  {new Date(lead.created_at).toLocaleString("pt-PT", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
                {/* ID (discreto) para teste de rota direta */}
                <p className="text-[10px] text-gray-400 mt-1 select-all">
                  ID: {lead.id}
                </p>

                {/* Ações */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex flex-wrap gap-2">
                    {["new", "approved", "rejected", "callback", "spam", "verification"].map(
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

                  <div className="flex gap-2">
                    {/* Usando Link do Next para garantir navegação */}
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/leads/${lead.id}`}>👁️ Ver</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/leads/${lead.id}?edit=true`}>✏️ Editar</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔄 Carrega os leads do Supabase
  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar leads:", error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  // 🔍 Filtro de busca
  const filteredLeads = leads.filter((lead) =>
    lead.name?.toLowerCase().includes(search.toLowerCase())
  );

  // 🧭 Navegação
  const handleView = (id: string) => {
    router.push(`/leads/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/leads/${id}?edit=true`);
  };

  const handleNewLead = () => {
    router.push(`/leads/new`);
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export-leads");
      if (!response.ok) throw new Error("Falha ao exportar leads.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      a.click();
    } catch (error) {
      console.error(error);
      alert("Erro ao exportar leads.");
    }
  };

  // 🖼 Renderização principal
  return (
    <div className="p-6 space-y-6">
      {/* Título e botões de ação */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            ⬇ Exportar
          </Button>
          <Button onClick={handleNewLead}>➕ Novo Lead</Button>
        </div>
      </div>

      {/* Campo de busca */}
      <Input
        placeholder="Procurar lead por nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Lista de leads */}
      {loading ? (
        <p>Carregando leads...</p>
      ) : filteredLeads.length === 0 ? (
        <p>Nenhum lead encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <Card
              key={lead.id}
              className="hover:shadow-md transition cursor-pointer"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{lead.name}</h2>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                  <Badge
                    variant={
                      lead.status === "approved"
                        ? "success"
                        : lead.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {lead.status || "new"}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleView(lead.id)}
                  >
                    👁 Ver
                  </Button>
                  <Button size="sm" onClick={() => handleEdit(lead.id)}>
                    ✏️ Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

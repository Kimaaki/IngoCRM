// FILE: src/app/leads/LeadsClient.tsx
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

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  status: string | null;
  created_at: string | null;
};

export default function LeadsClient() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchLeads() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setLeads((data as Lead[]) || []);
    } catch (err) {
      console.error("Erro ao buscar leads:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) =>
    (lead.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // Botões
  const handleView = (id: string) => {
    console.log("Abrindo lead:", id);
    router.push(`/leads/${id}`);
  };

  const handleEdit = (id: string) => {
    console.log("Editando lead:", id);
    router.push(`/leads/${id}?edit=true`);
  };

  const handleNewLead = () => {
    console.log("Novo lead");
    router.push("/leads/new");
  };

  const handleExport = () => {
    console.log("Exportar leads…");
    alert("Exportação ainda não implementada");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            ⬇ Exportar
          </Button>
          <Button onClick={handleNewLead}>➕ Novo Lead</Button>
        </div>
      </div>

      {/* Busca */}
      <Input
        placeholder="Procurar lead por nome…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Lista */}
      {loading ? (
        <p>Carregando leads…</p>
      ) : filteredLeads.length === 0 ? (
        <p>Nenhum lead encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-lg transition">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{lead.name || "Sem nome"}</h2>
                  {lead.phone && (
                    <p className="text-sm text-gray-600">{lead.phone}</p>
                  )}
                  {lead.email && (
                    <p className="text-sm text-gray-600">{lead.email}</p>
                  )}
                  <Badge
                    className={
                      lead.status === "approved"
                        ? "bg-emerald-600"
                        : lead.status === "rejected"
                        ? "bg-red-600"
                        : "bg-gray-500"
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

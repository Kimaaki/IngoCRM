"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
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
      setLeads(data || []);
    } catch (e) {
      console.error("Erro ao carregar leads:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) =>
    lead.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = async (id: string) => {
    try {
      router.push(`/leads/${id}`);
    } catch (e) {
      console.error("Erro ao abrir lead:", e);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      router.push(`/leads/${id}?edit=true`);
    } catch (e) {
      console.error("Erro ao editar lead:", e);
    }
  };

  const handleNewLead = async () => {
    alert("Funcionalidade de novo lead será adicionada em breve.");
  };

  const handleExport = async () => {
    alert("Exportação de leads ainda não implementada.");
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

      {/* Campo de busca */}
      <Input
        placeholder="Procurar lead por nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Lista */}
      {loading ? (
        <p>Carregando leads...</p>
      ) : filteredLeads.length === 0 ? (
        <p>Nenhum lead encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <Card
              key={lead.id}
              className="hover:shadow-lg transition cursor-pointer"
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

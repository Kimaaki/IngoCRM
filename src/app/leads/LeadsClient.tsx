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

export default function LeadsClient() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setLeads(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) =>
    lead.name?.toLowerCase().includes(search.toLowerCase())
  );

  function handleView(id: string) {
    console.log("Ver lead:", id);
    router.push(`/leads/${id}`);
  }

  function handleEdit(id: string) {
    console.log("Editar lead:", id);
    router.push(`/leads/${id}?edit=true`);
  }

  function handleNew() {
    console.log("Novo lead");
    router.push("/leads/new");
  }

  function handleExport() {
    alert("Exportação de leads em breve!");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            ⬇ Exportar
          </Button>
          <Button onClick={handleNew}>➕ Novo Lead</Button>
        </div>
      </div>

      <Input
        placeholder="Procurar lead..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <p>Carregando leads...</p>
      ) : filteredLeads.length === 0 ? (
        <p>Nenhum lead encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-lg transition">
              <CardContent className="p-4 flex justify-between">
                <div>
                  <h2 className="font-semibold">{lead.name}</h2>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                  <Badge variant="secondary">{lead.status || "new"}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleView(lead.id)}>
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

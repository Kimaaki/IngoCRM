// FILE: src/app/leads/[id]/LeadDetailClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  country: string | null;
  city: string | null;
  postal_code: string | null;
  address: string | null;
  status: string | null;
  notes: string | null;
  created_at: string | null;
};

export default function LeadDetailClient() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carrega dados do lead
  async function fetchLead() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) console.error("Erro ao carregar lead:", error);
    else setLead(data);
    setLoading(false);
  }

  // Salva alterações no Supabase
  async function saveLead() {
    if (!lead) return;
    setSaving(true);
    const { error } = await supabase
      .from("leads")
      .update({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        country: lead.country,
        city: lead.city,
        postal_code: lead.postal_code,
        address: lead.address,
        notes: lead.notes,
        status: lead.status,
      })
      .eq("id", id);

    setSaving(false);
    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("Lead atualizado com sucesso!");
      router.push("/leads");
    }
  }

  useEffect(() => {
    fetchLead();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!lead) return <p>Lead não encontrado.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Editar Lead</h1>
      <Card>
        <CardContent className="space-y-3 p-4">
          <Input
            placeholder="Nome"
            value={lead.name || ""}
            onChange={(e) => setLead({ ...lead, name: e.target.value })}
          />
          <Input
            placeholder="Telefone"
            value={lead.phone || ""}
            onChange={(e) => setLead({ ...lead, phone: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={lead.email || ""}
            onChange={(e) => setLead({ ...lead, email: e.target.value })}
          />
          <Input
            placeholder="País"
            value={lead.country || ""}
            onChange={(e) => setLead({ ...lead, country: e.target.value })}
          />
          <Input
            placeholder="Cidade"
            value={lead.city || ""}
            onChange={(e) => setLead({ ...lead, city: e.target.value })}
          />
          <Input
            placeholder="Código Postal"
            value={lead.postal_code || ""}
            onChange={(e) => setLead({ ...lead, postal_code: e.target.value })}
          />
          <Textarea
            placeholder="Endereço"
            value={lead.address || ""}
            onChange={(e) => setLead({ ...lead, address: e.target.value })}
          />
          <Textarea
            placeholder="Notas"
            value={lead.notes || ""}
            onChange={(e) => setLead({ ...lead, notes: e.target.value })}
          />
          <Input
            placeholder="Status (new, approved, rejected)"
            value={lead.status || ""}
            onChange={(e) => setLead({ ...lead, status: e.target.value })}
          />

          <Button onClick={saveLead} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

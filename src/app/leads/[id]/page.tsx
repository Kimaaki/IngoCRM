"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchLead() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) console.error("Erro ao buscar lead:", error);
    else setLead(data);
    setLoading(false);
  }

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
        status: lead.status,
        notes: lead.notes,
      })
      .eq("id", id);

    setSaving(false);
    if (error) console.error("Erro ao salvar lead:", error);
    else {
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
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Editar Lead</h1>

      <Card>
        <CardContent className="space-y-4 p-4">
          <Input
            value={lead.name || ""}
            onChange={(e) => setLead({ ...lead, name: e.target.value })}
            placeholder="Nome"
          />
          <Input
            value={lead.phone || ""}
            onChange={(e) => setLead({ ...lead, phone: e.target.value })}
            placeholder="Telefone"
          />
          <Input
            value={lead.email || ""}
            onChange={(e) => setLead({ ...lead, email: e.target.value })}
            placeholder="Email"
          />
          <Input
            value={lead.country || ""}
            onChange={(e) => setLead({ ...lead, country: e.target.value })}
            placeholder="País"
          />
          <Input
            value={lead.city || ""}
            onChange={(e) => setLead({ ...lead, city: e.target.value })}
            placeholder="Cidade"
          />
          <Input
            value={lead.postal_code || ""}
            onChange={(e) => setLead({ ...lead, postal_code: e.target.value })}
            placeholder="Código Postal"
          />
          <Textarea
            value={lead.address || ""}
            onChange={(e) => setLead({ ...lead, address: e.target.value })}
            placeholder="Endereço"
          />
          <Textarea
            value={lead.notes || ""}
            onChange={(e) => setLead({ ...lead, notes: e.target.value })}
            placeholder="Notas"
          />
          <Input
            value={lead.status || ""}
            onChange={(e) => setLead({ ...lead, status: e.target.value })}
            placeholder="Status (new, approved, rejected)"
          />

          <Button onClick={saveLead} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

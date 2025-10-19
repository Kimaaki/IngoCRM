"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function fetchLead() {
    const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
    if (error) console.error(error);
    else setLead(data);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from("leads").update(lead).eq("id", id);
    if (error) alert("Erro ao salvar: " + error.message);
    else alert("✅ Alterações salvas com sucesso!");
    setSaving(false);
  }

  useEffect(() => {
    fetchLead();
  }, [id]);

  if (!lead) return <p>Carregando lead...</p>;

  return (
    <div className="p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🧾 Detalhes do Lead</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={lead.name || ""}
            onChange={(e) => setLead({ ...lead, name: e.target.value })}
            placeholder="Nome do cliente"
          />
          <Input
            value={lead.phone || ""}
            onChange={(e) => setLead({ ...lead, phone: e.target.value })}
            placeholder="Telefone"
          />
          <Input
            value={lead.email || ""}
            onChange={(e) => setLead({ ...lead, email: e.target.value })}
            placeholder="E-mail"
          />
          <Input
            value={lead.country || ""}
            onChange={(e) => setLead({ ...lead, country: e.target.value })}
            placeholder="País"
          />
          <Textarea
            value={lead.notes || ""}
            onChange={(e) => setLead({ ...lead, notes: e.target.value })}
            placeholder="Comentários ou observações"
          />

          <div className="flex justify-between items-center pt-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "💾 Salvar alterações"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/leads")}>
              ⬅️ Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

// 🔴 MUITO IMPORTANTE: força a rota dinâmica a renderizar no pedido (nada de SSG)
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();
    if (!error) setLead(data);
  }

  async function handleSave() {
    if (!lead) return;
    setSaving(true);
    await supabase.from("leads").update(lead).eq("id", id);
    setSaving(false);
    alert("✅ Dados salvos com sucesso!");
  }

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!lead) return <p className="p-6">Carregando dados do cliente...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>🧾 Pedido #{lead.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label>Nome</label>
            <Input
              value={lead.name || ""}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
            />
          </div>
          <div>
            <label>Telefone</label>
            <Input
              value={lead.phone || ""}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
            />
          </div>
          <div>
            <label>Email</label>
            <Input
              value={lead.email || ""}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
            />
          </div>
          <div>
            <label>Endereço</label>
            <Textarea
              value={lead.address || ""}
              onChange={(e) => setLead({ ...lead, address: e.target.value })}
            />
          </div>
          <div>
            <label>Produto / Offer</label>
            <Input
              value={lead.offer || ""}
              onChange={(e) => setLead({ ...lead, offer: e.target.value })}
            />
          </div>
          <div>
            <label>Status</label>
            <Input
              value={lead.status || ""}
              onChange={(e) => setLead({ ...lead, status: e.target.value })}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} disabled={saving}>
              💾 {saving ? "Salvando..." : "Salvar"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/leads")}>
              ⬅️ Voltar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.open(`tel:${lead.phone}`)}
            >
              ☎️ Ligar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


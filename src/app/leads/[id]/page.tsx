"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchLead() {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
    if (error) console.error("Erro ao carregar lead:", error);
    else setLead(data);
    setLoading(false);
  }

  async function saveChanges() {
    setSaving(true);
    const { error } = await supabase.from("leads").update(lead).eq("id", id);
    if (error) alert("Erro ao salvar alterações!");
    else alert("Alterações salvas com sucesso!");
    setSaving(false);
  }

  useEffect(() => {
    fetchLead();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!lead) return <p>Lead não encontrado.</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-bold mb-4">📞 Detalhes do Lead</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              value={lead.address || ""}
              onChange={(e) => setLead({ ...lead, address: e.target.value })}
              placeholder="Endereço"
            />
          </div>

          <Textarea
            placeholder="Comentário / Observações"
            value={lead.comment || ""}
            onChange={(e) => setLead({ ...lead, comment: e.target.value })}
          />

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="destructive"
              onClick={() => alert(`📞 Ligando para ${lead.phone}...`)}
            >
              📞 Ligar
            </Button>
            <Button
              onClick={() => alert("📴 Chamada finalizada.")}
              variant="outline"
            >
              📴 Desligar
            </Button>
            <Button
              disabled={saving}
              onClick={saveChanges}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? "Salvando..." : "💾 Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

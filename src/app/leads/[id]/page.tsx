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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchLead() {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
    if (error) console.error("Erro ao carregar lead:", error);
    else setLead(data);
    setLoading(false);
  }

  useEffect(() => {
    if (id) fetchLead();
  }, [id]);

  // Função para salvar alterações
  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from("leads")
      .update({
        name: lead.name,
        phone: lead.phone,
        product: lead.product,
        quantity: lead.quantity,
        price: lead.price,
        address: lead.address,
        city: lead.city,
        comment: lead.comment,
      })
      .eq("id", id);
    if (error) alert("Erro ao salvar alterações!");
    else alert("✅ Alterações salvas com sucesso!");
    setSaving(false);
  }

  // Funções de ligação
  async function handleCall(action: "call" | "hangup") {
    await supabase.from("lead_calls").insert([
      {
        lead_id: id,
        action,
        by_user: "Operador",
      },
    ]);
    alert(action === "call" ? "📞 Ligação iniciada" : "🔚 Ligação encerrada");
  }

  if (loading) return <p>Carregando...</p>;
  if (!lead) return <p>Lead não encontrado.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => router.push("/leads")}>
        ← Voltar
      </Button>

      <Card className="mt-4 shadow-lg">
        <CardHeader>
          <CardTitle>
            Pedido #{lead.id?.slice(0, 8)} — {lead.status || "sem status"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Nome</label>
              <Input value={lead.name || ""} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
            </div>
            <div>
              <label>Telefone</label>
              <Input value={lead.phone || ""} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
            </div>

            <div>
              <label>Produto</label>
              <Input value={lead.product || ""} onChange={(e) => setLead({ ...lead, product: e.target.value })} />
            </div>
            <div>
              <label>Quantidade</label>
              <Input
                type="number"
                value={lead.quantity || 1}
                onChange={(e) => setLead({ ...lead, quantity: Number(e.target.value) })}
              />
            </div>

            <div>
              <label>Preço</label>
              <Input
                type="number"
                value={lead.price || 0}
                onChange={(e) => setLead({ ...lead, price: Number(e.target.value) })}
              />
            </div>

            <div>
              <label>Cidade</label>
              <Input value={lead.city || ""} onChange={(e) => setLead({ ...lead, city: e.target.value })} />
            </div>

            <div className="col-span-2">
              <label>Endereço</label>
              <Input value={lead.address || ""} onChange={(e) => setLead({ ...lead, address: e.target.value })} />
            </div>

            <div className="col-span-2">
              <label>Comentário / Observações</label>
              <Textarea
                value={lead.comment || ""}
                onChange={(e) => setLead({ ...lead, comment: e.target.value })}
              />
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-3">
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleCall("call")}>
                📞 Ligar
              </Button>
              <Button className="bg-gray-600 hover:bg-gray-700 text-white" onClick={() => handleCall("hangup")}>
                🔚 Desligar
              </Button>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "💾 Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [editingLead, setEditingLead] = useState<any | null>(null);

  // Carregar leads
  async function loadLeads() {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*");
    if (!error && data) setLeads(data);
    setLoading(false);
  }

  // Registrar chamada (ligar/desligar)
  async function registerCall(lead_id: string, action: "call" | "hangup") {
    await supabase.from("lead_calls").insert({
      lead_id,
      action,
      by_user: "Admin",
    });
    alert(`Ação registrada: ${action === "call" ? "Ligou" : "Desligou"}`);
  }

  // Salvar comentário no lead
  async function saveComment(lead_id: string) {
    await supabase
      .from("lead_notes")
      .insert({ lead_id, note: comment, by_user: "Admin" });
    alert("Comentário salvo!");
    setComment("");
  }

  // Atualizar dados do lead (endereço/cidade/etc)
  async function updateLead(lead: any) {
    await supabase
      .from("leads")
      .update({
        address: lead.address,
        city: lead.city,
        postal_code: lead.postal_code,
      })
      .eq("id", lead.id);
    alert("Lead atualizado!");
    setEditingLead(null);
    loadLeads();
  }

  useEffect(() => {
    loadLeads();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        leads.map((lead) => (
          <Card key={lead.id} className="shadow-sm">
            <CardHeader>
              <CardTitle>{lead.name || "Sem nome"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email: {lead.email}</p>
              <p>Telefone: {lead.phone}</p>
              <p>Endereço: {lead.address || "—"}</p>
              <p>Cidade: {lead.city || "—"}</p>
              <p>CEP: {lead.postal_code || "—"}</p>

              <div className="mt-3 flex gap-2">
                <Button onClick={() => registerCall(lead.id, "call")}>
                  📞 Ligar
                </Button>
                <Button onClick={() => registerCall(lead.id, "hangup")}>
                  🔚 Desligar
                </Button>
                <Button onClick={() => setEditingLead(lead)}>✏️ Editar</Button>
              </div>

              {/* Campo para comentários */}
              <div className="mt-3">
                <textarea
                  placeholder="Adicionar comentário..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border rounded p-2"
                />
                <Button
                  className="mt-2"
                  onClick={() => saveComment(lead.id)}
                  disabled={!comment.trim()}
                >
                  💾 Salvar comentário
                </Button>
              </div>

              {/* Se o operador clicar em editar */}
              {editingLead?.id === lead.id && (
                <div className="mt-4 border-t pt-3">
                  <input
                    type="text"
                    placeholder="Endereço"
                    className="w-full border rounded p-2 mb-2"
                    value={editingLead.address || ""}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, address: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Cidade"
                    className="w-full border rounded p-2 mb-2"
                    value={editingLead.city || ""}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, city: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Código Postal"
                    className="w-full border rounded p-2 mb-2"
                    value={editingLead.postal_code || ""}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        postal_code: e.target.value,
                      })
                    }
                  />
                  <Button onClick={() => updateLead(editingLead)}>✅ Salvar</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export default function RealtimeLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Erro ao buscar leads:", error);
    else setLeads(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();

    const subscription = supabase
      .channel("realtime-leads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload) => {
          console.log("Atualização detectada:", payload);
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📡 Leads em Tempo Real</h1>
      <p className="text-gray-600 mb-6">
        Todos os leads do Supabase atualizados em tempo real.
      </p>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 border rounded-lg shadow-sm bg-white transition hover:shadow-md"
            >
              <h2 className="font-semibold text-lg mb-1">
                {lead.name || "Sem nome"}
              </h2>
              <p className="text-sm text-gray-600">{lead.email || "—"}</p>
              <p className="text-sm text-gray-600 mb-2">{lead.phone || "—"}</p>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  lead.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : lead.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : lead.status === "callback"
                    ? "bg-yellow-100 text-yellow-700"
                    : lead.status === "spam"
                    ? "bg-gray-100 text-gray-700"
                    : lead.status === "verification"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {lead.status}
              </span>

              <p className="mt-3 text-xs text-gray-400">
                País: {lead.country || "—"}
              </p>
              <p className="text-xs text-gray-400">
                Criado:{" "}
                {new Date(lead.created_at).toLocaleString("pt-PT", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

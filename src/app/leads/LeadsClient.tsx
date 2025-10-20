"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Lead = {
  id: string;
  name: string | null;
  phone?: string | null;
  email?: string | null;
  status?: string | null;
  created_at?: string | null;
  notes?: string | null;
};

export default function LeadsClient() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setRows((data ?? []) as Lead[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((l) =>
      [
        l.name ?? "",
        l.email ?? "",
        l.phone ?? "",
        l.status ?? "",
        l.notes ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [rows, q]);

  // Exporta CSV simples no cliente
  const exportCsv = () => {
    const headers = ["id", "name", "email", "phone", "status", "created_at"];
    const lines = [headers.join(",")].concat(
      rows.map((r) =>
        [
          r.id,
          JSON.stringify(r.name ?? ""),
          JSON.stringify(r.email ?? ""),
          JSON.stringify(r.phone ?? ""),
          JSON.stringify(r.status ?? ""),
          JSON.stringify(r.created_at ?? ""),
        ].join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}>⬇ Exportar</Button>
          {/* Link nativo do Next para evitar qualquer bloqueio */}
          <Button asChild>
            <Link href="/leads/new">➕ Novo Lead</Link>
          </Button>
        </div>
      </div>

      <Input
        placeholder="Procurar por nome, email, telefone…"
        className="max-w-md"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {loading ? (
        <p>Carregando…</p>
      ) : filtered.length === 0 ? (
        <p>Nenhum lead encontrado.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((lead) => (
            <Card key={lead.id} className="hover:shadow-sm transition">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{lead.name ?? "—"}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {lead.email ?? "—"} · {lead.phone ?? "—"}
                  </div>
                  <div className="mt-1">
                    <Badge
                      variant={
                        lead.status === "approved"
                          ? "success"
                          : lead.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {lead.status ?? "new"}
                    </Badge>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/leads/${lead.id}`}>👁 Ver</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/leads/${lead.id}?edit=1`}>✏️ Editar</Link>
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

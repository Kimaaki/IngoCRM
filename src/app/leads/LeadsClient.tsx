"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  status: string | null;
  created_at: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LeadsClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setLeads(data as Lead[]);
      setLoading(false);
    })();
  }, []);

  const filtered = leads.filter((l) =>
    (l.name || "").toLowerCase().includes(q.toLowerCase())
  );

  function exportCSV() {
    const rows = [
      ["id", "name", "phone", "email", "status", "created_at"],
      ...leads.map((l) => [
        l.id,
        l.name ?? "",
        l.phone ?? "",
        l.email ?? "",
        l.status ?? "",
        l.created_at ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportCSV}>⬇ Export</Button>
          {/* IMPORTANTE: usar Link, não router.push */}
          <Link href="/leads/new"><Button>➕ Novo Lead</Button></Link>
        </div>
      </div>

      <Input
        placeholder="Buscar pelo nome…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <p>Carregando…</p>
      ) : filtered.length === 0 ? (
        <p>Nenhum lead encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{lead.name || "—"}</div>
                  <div className="text-sm text-muted-foreground">{lead.phone || "—"}</div>
                  <div className="text-sm text-muted-foreground">{lead.email || "—"}</div>
                  <Badge variant={
                    lead.status === "approved" ? "success" :
                    lead.status === "rejected" ? "destructive" : "secondary"
                  }>
                    {lead.status || "new"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {/* Ver (detalhe) */}
                  <Link href={`/leads/${lead.id}`}>
                    <Button variant="outline" size="sm">👁 Ver</Button>
                  </Link>
                  {/* Editar (a mesma página com query edit=1, se você usa isso no detalhe) */}
                  <Link href={`/leads/${lead.id}?edit=1`}>
                    <Button size="sm">✏️ Editar</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

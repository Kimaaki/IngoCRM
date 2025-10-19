"use client";

import { useEffect, useState } from "react";
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

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setLeads(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) =>
    lead.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Leads</h1>

      <Input
        placeholder="Procurar lead por nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <p>Carregando leads...</p>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{lead.name}</h2>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                  <Badge
                    variant={
                      lead.status === "approved"
                        ? "success"
                        : lead.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {lead.status}
                  </Badge>
                </div>

                <Link href={`/leads/${lead.id}`}>
                  <Button variant="outline">Ver Detalhes</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

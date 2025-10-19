"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

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

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    new: "bg-blue-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
    callback: "bg-yellow-500",
    spam: "bg-gray-500",
    verification: "bg-purple-500",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Leads</h1>
      <Input
        placeholder="🔍 Pesquisar lead..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md mb-6"
      />

      {loading ? (
        <p>Carregando...</p>
      ) : filteredLeads.length === 0 ? (
        <p>Nenhum lead encontrado.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredLeads.map((lead) => (
            <Link key={lead.id} href={`/leads/${lead.id}`}>
              <Card className="p-4 hover:shadow-lg transition cursor-pointer">
                <CardContent>
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg">
                      {lead.name || "Sem nome"}
                    </h2>
                    <Badge
                      className={`${statusColors[lead.status] || "bg-blue-500"}`}
                    >
                      {lead.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lead.email}</p>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Criado:{" "}
                    {new Date(lead.created_at).toLocaleString("pt-PT", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

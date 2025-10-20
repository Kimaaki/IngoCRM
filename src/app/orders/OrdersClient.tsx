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

type Order = {
  id: string;
  client: string | null;
  product: string | null;
  status: string | null;
  amount: number | null;
  created_at?: string | null;
};

export default function OrdersClient() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setRows((data ?? []) as Order[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((o) =>
      [o.id, o.client ?? "", o.product ?? "", o.status ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [rows, q]);

  const exportCsv = () => {
    const headers = ["id", "client", "product", "status", "amount", "created_at"];
    const lines = [headers.join(",")].concat(
      rows.map((r) =>
        [
          r.id,
          JSON.stringify(r.client ?? ""),
          JSON.stringify(r.product ?? ""),
          JSON.stringify(r.status ?? ""),
          r.amount ?? "",
          JSON.stringify(r.created_at ?? ""),
        ].join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}>⬇ Export</Button>
          <Button asChild>
            <Link href="/orders/new">➕ New Order</Link>
          </Button>
        </div>
      </div>

      <Input
        placeholder="Search by client, product, status…"
        className="max-w-md"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {loading ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
        <p>No orders.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((o) => (
            <Card key={o.id} className="hover:shadow-sm transition">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{o.client ?? "—"}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {o.product ?? "—"} · ${o.amount ?? 0}
                  </div>
                  <div className="mt-1">
                    <Badge
                      variant={
                        o.status === "delivered"
                          ? "success"
                          : o.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {o.status ?? "new"}
                    </Badge>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/orders/${o.id}`}>👁 View</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/orders/${o.id}?edit=1`}>✏️ Edit</Link>
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

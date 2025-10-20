"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Order = {
  id: string;
  client: string | null;
  product: string | null;
  status: string | null;
  amount: number | null;
  created_at: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setOrders(data as Order[]);
      setLoading(false);
    })();
  }, []);

  function exportCSV() {
    const rows = [
      ["id", "client", "product", "status", "amount", "created_at"],
      ...orders.map((o) => [
        o.id,
        o.client ?? "",
        o.product ?? "",
        o.status ?? "",
        o.amount ?? "",
        o.created_at ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportCSV}>⬇ Export</Button>
          {/* IMPORTANTE: Link ao invés de router.push */}
          <Link href="/orders/new"><Button>➕ New Order</Button></Link>
        </div>
      </div>

      {loading ? (
        <p>Carregando…</p>
      ) : orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <Card key={o.id} className="hover:shadow-md transition">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{o.client || "—"}</div>
                  <div className="text-sm text-muted-foreground">{o.product || "—"}</div>
                  <div className="text-sm text-muted-foreground">
                    Status: {o.status || "—"} • Valor: {o.amount ?? "—"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/orders/${o.id}`}>
                    <Button variant="outline" size="sm">👁 Ver</Button>
                  </Link>
                  <Link href={`/orders/${o.id}?edit=1`}>
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

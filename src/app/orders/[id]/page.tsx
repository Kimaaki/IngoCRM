"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const editMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("edit");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("orders").select("*").eq("id", id).single();
      setOrder(data);
      setLoading(false);
    })();
  }, [id]);

  async function save() {
    const { error } = await supabase.from("orders")
      .update({
        client: order?.client,
        product: order?.product,
        status: order?.status,
        amount: order?.amount,
      })
      .eq("id", id);
    if (!error) router.push("/orders");
  }

  if (loading) return <div className="p-6">Carregando…</div>;
  if (!order) return <div className="p-6">Pedido não encontrado.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
      <Card>
        <CardContent className="space-y-3 p-4">
          <Input value={order.client || ""} onChange={(e)=>setOrder({...order, client: e.target.value})} placeholder="Cliente" disabled={!editMode}/>
          <Input value={order.product || ""} onChange={(e)=>setOrder({...order, product: e.target.value})} placeholder="Produto" disabled={!editMode}/>
          <Input value={order.status || ""} onChange={(e)=>setOrder({...order, status: e.target.value})} placeholder="Status" disabled={!editMode}/>
          <Input value={order.amount ?? ""} onChange={(e)=>setOrder({...order, amount: Number(e.target.value) || null})} placeholder="Valor" disabled={!editMode}/>
          <div className="flex gap-2">
            <Button variant="outline" onClick={()=>router.push("/orders")}>Voltar</Button>
            {editMode && <Button onClick={save}>Salvar</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

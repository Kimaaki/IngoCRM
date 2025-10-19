"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OrdersClient() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  function handleNewOrder() {
    console.log("Novo pedido");
    router.push("/orders/new");
  }

  function handleView(id: string) {
    console.log("Ver pedido", id);
    router.push(`/orders/${id}`);
  }

  function handleEdit(id: string) {
    console.log("Editar pedido", id);
    router.push(`/orders/${id}?edit=true`);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => alert("Exportação em breve!")}>
            ⬇ Exportar
          </Button>
          <Button onClick={handleNewOrder}>➕ Novo Pedido</Button>
        </div>
      </div>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition">
              <CardContent className="p-4 flex justify-between">
                <div>
                  <h2 className="font-semibold">{order.client_name}</h2>
                  <p className="text-sm text-gray-600">{order.product}</p>
                  <p className="text-sm text-gray-600">${order.amount}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleView(order.id)}>
                    👁 Ver
                  </Button>
                  <Button size="sm" onClick={() => handleEdit(order.id)}>
                    ✏️ Editar
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

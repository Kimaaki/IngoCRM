// FILE: src/app/orders/OrdersClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrdersClient() {
  const router = useRouter();

  const handleExport = () => {
    console.log("📦 Exportar pedidos clicado");
    alert("Export ainda não implementado.");
  };

  const handleNewOrder = () => {
    console.log("🆕 Criar novo pedido clicado");
    router.push("/orders/new");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            ⬇ Export
          </Button>
          <Button onClick={handleNewOrder}>＋ New Order</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold">#order-1</div>
            <div className="text-sm text-gray-600">Cliente: Miguel Almeida</div>
            <div className="text-sm text-gray-600">Produto: Eretronh Vita</div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                console.log("👁 Ver pedido #order-1");
                router.push("/orders/1");
              }}
            >
              👁 Ver
            </Button>
            <Button
              size="sm"
              onClick={() => {
                console.log("✏️ Editar pedido #order-1");
                router.push("/orders/1?edit=true");
              }}
            >
              ✏️ Editar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

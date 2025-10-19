// FILE: src/app/orders/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewOrderPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    client: "",
    product: "",
    status: "processing",
    note: "",
    amount: "",
  });

  const onCreate = () => {
    console.log("🆕 Criando novo pedido:", form);
    alert("Simulação: Pedido criado.");
    router.push("/orders");
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Novo Pedido</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid gap-2">
            <label className="text-sm">Cliente</label>
            <Input
              value={form.client}
              onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
              placeholder="Nome do cliente"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Produto</label>
            <Input
              value={form.product}
              onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
              placeholder="Nome do produto"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Status</label>
            <Input
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              placeholder="processing | delivered | returned ..."
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Observações</label>
            <Textarea
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Notas do pedido"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Valor (US$)</label>
            <Input
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="Ex.: 49.90"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/orders")}>
              ← Cancelar
            </Button>
            <Button onClick={onCreate}>Criar Pedido</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

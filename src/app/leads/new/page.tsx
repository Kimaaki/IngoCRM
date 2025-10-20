"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NewLeadPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  async function createLead() {
    const { error } = await supabase.from("leads").insert({
      name, phone, email, status: "new",
    });
    if (!error) router.push("/leads");
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Novo Lead</h1>
      <Card>
        <CardContent className="space-y-3 p-4">
          <Input placeholder="Nome" value={name} onChange={(e)=>setName(e.target.value)} />
          <Input placeholder="Telefone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={()=>router.push("/leads")}>Cancelar</Button>
            <Button onClick={createLead}>Salvar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

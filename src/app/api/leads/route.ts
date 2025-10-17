import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, serviceKey);

// GET /api/leads → lista todos os leads
export async function GET() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, leads: data }, { status: 200 });
}

// POST /api/leads → cria lead
export async function POST(req: Request) {
  try {
    const { name, phone, email, country, source, status } = await req.json();

    const { data, error } = await supabase
      .from("leads")
      .insert([{ name, phone, email, country, source, status }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, lead: data[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/leads?id=123 → apaga lead
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "ID é obrigatório" }, { status: 400 });
  }

  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Lead removido com sucesso" }, { status: 200 });
}

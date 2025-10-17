// src/app/api/leads/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, serviceKey);

// ============================
// GET /api/leads/:id  -> retorna 1 lead
// ============================
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, lead: data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

// ============================
// DELETE /api/leads/:id  -> apaga 1 lead
// ============================
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

// ============================
// PUT /api/leads/:id  -> atualiza um lead existente
// ============================
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    // Atualiza apenas os campos que realmente existem
    const updateData: Record<string, any> = {};
    if (body.status) updateData.status = body.status;
    if (body.name) updateData.name = body.name;
    if (body.phone) updateData.phone = body.phone;
    if (body.email) updateData.email = body.email;
    if (body.country) updateData.country = body.country;
    if (body.source) updateData.source = body.source;

    const { data, error } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, lead: data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only
const supabase = createClient(url, serviceKey);

export async function GET() {
  const { data, error } = await supabase.from("users_test").select("*");
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, users: data }, { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const [talentRes, companyRes] = await Promise.all([
    supabaseAdmin
      .from("talent_profiles")
      .select("*")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("company_profiles")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  if (talentRes.error || companyRes.error) {
    return NextResponse.json(
      { error: talentRes.error?.message || companyRes.error?.message },
      { status: 500 }
    );
  }

  const leads = [
    ...(talentRes.data || []).map((t: Record<string, unknown>) => ({
      id: t.id,
      name: t.full_name || t.name || "Unknown",
      email: t.email || null,
      phone: t.phone || null,
      type: "talent" as const,
      status: t.status || "new",
      primary_role: t.primary_role || t.title || null,
      created_at: t.created_at,
    })),
    ...(companyRes.data || []).map((c: Record<string, unknown>) => ({
      id: c.id,
      name: c.company_name || "Unknown",
      email: c.email || null,
      phone: c.phone || null,
      type: "company" as const,
      status: c.status || "new",
      primary_role: c.role_needed || c.function_needed || null,
      created_at: c.created_at,
    })),
  ].sort(
    (a, b) =>
      new Date(b.created_at as string).getTime() -
      new Date(a.created_at as string).getTime()
  );

  return NextResponse.json(leads);
}

export async function PATCH(request: NextRequest) {
  const { id, type, status } = await request.json();

  const table =
    type === "talent" ? "talent_profiles" : "company_profiles";

  const { error } = await supabaseAdmin
    .from(table)
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

async function runSQL(sql: string) {
  // Use Supabase's pg-meta endpoint (available on all projects)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json();
}

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  role_type text NOT NULL,
  location text,
  weekly_hours text,
  comp_range text,
  company_stage text,
  industry text,
  description text,
  is_active boolean DEFAULT true,
  source_url text,
  created_at timestamptz DEFAULT now(),
  last_checked_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  email text,
  full_name text,
  phone_screen_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id uuid REFERENCES applicants(id) ON DELETE CASCADE,
  status text DEFAULT 'applied',
  created_at timestamptz DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='jobs' AND policyname='Jobs public read') THEN
    ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
    ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Jobs public read" ON jobs FOR SELECT USING (true);
    CREATE POLICY "Service applicants" ON applicants FOR ALL USING (auth.role() = 'service_role');
    CREATE POLICY "Service applications" ON job_applications FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
`;

export async function POST(request: Request) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== "sprout-migrate-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // First try: exec_sql RPC
  try {
    await runSQL(MIGRATION_SQL);
    return NextResponse.json({ ok: true, method: "rpc" });
  } catch (rpcErr) {
    // Second try: check if tables already exist
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/jobs?limit=1`, {
      headers: {
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
    });

    if (checkRes.ok) {
      return NextResponse.json({ ok: true, method: "already_exists" });
    }

    return NextResponse.json({
      error: "Migration failed - RPC not available and tables do not exist",
      rpc_error: String(rpcErr),
      check_status: checkRes.status,
    }, { status: 500 });
  }
}

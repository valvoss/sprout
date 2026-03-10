create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  company text not null,
  role_type text not null,
  location text,
  weekly_hours text,
  comp_range text,
  company_stage text,
  industry text,
  description text,
  is_active boolean default true,
  source_url text,
  created_at timestamptz default now(),
  last_checked_at timestamptz default now()
);

create table if not exists applicants (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  email text,
  full_name text,
  phone_screen_completed boolean default false,
  created_at timestamptz default now()
);

create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  applicant_id uuid references applicants(id) on delete cascade,
  status text default 'applied',
  created_at timestamptz default now(),
  unique(job_id, applicant_id)
);

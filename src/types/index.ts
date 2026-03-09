export interface TalentProfile {
  id: string;
  user_id: string;
  name: string;
  title: string;
  functions: string[];
  industries: string[];
  rate_min: number | null;
  rate_max: number | null;
  hours_per_week: number | null;
  bio: string | null;
  linkedin_url: string | null;
  created_at: string;
}

export interface CompanyProfile {
  id: string;
  user_id: string;
  company_name: string;
  stage: string | null;
  function_needed: string;
  budget_monthly: number | null;
  hours_per_week: number | null;
  description: string | null;
  created_at: string;
}

export interface Match {
  id: string;
  talent_id: string;
  company_id: string;
  score: number;
  status: "pending" | "accepted" | "declined" | "expired";
  scout_reasoning: string | null;
  created_at: string;
}

export interface Introduction {
  id: string;
  match_id: string;
  status: "pending" | "sent" | "accepted" | "declined" | "completed";
  intro_sent_at: string | null;
  meeting_booked_at: string | null;
  outcome: string | null;
  created_at: string;
}

We're building "Sprout" - an AI-powered fractional talent connector. Think Boardy.ai but for fractional executive recruiting (CFO, CMO, COO, CTO, etc.).

Concept: An AI named Scout that matches fractional executives to companies. Companies describe their need, execs describe their availability/skills, Scout makes warm introductions.

MVP Tech Stack:
- Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth) backend
- OpenAI API (GPT-4o) for Scout matching AI
- Stripe for payments
- Resend for email
- Deploy on Vercel

Please do the following:
1. Scaffold the Next.js 14 project in /Users/val/.openclaw/workspace/bench (use --yes flags to skip prompts)
2. Set up project structure (app/, components/, lib/, types/)
3. Build the landing page with:
   - Hero: "Your next fractional hire is waiting." with two CTAs: "I'm hiring" and "I'm a fractional exec"
   - Value prop section (3 benefits)
   - How it works (3 steps: Describe your need, Meet Scout, Get matched)
   - Clean professional design using Tailwind
4. Create lib/supabase.ts client config (use env vars NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
5. Create supabase/schema.sql with tables: talent_profiles, company_profiles, matches, introductions

Brand: Sprout | AI Persona: Scout | Tagline: "Top talent, fractionally yours"
Colors: Dark navy #0F172A, Slate #1E293B, White, Electric blue #3B82F6 accent

Use --permission-mode bypassPermissions to auto-approve all file operations.

When completely finished, run this command:
openclaw system event --text "Sprout MVP scaffold complete - Next.js + Supabase schema done" --mode now

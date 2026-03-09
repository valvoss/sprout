# Scout PRD - Sprout Fractional Talent Marketplace
*Version 0.1 - Working Draft*

---

## What We're Building

Sprout is a fractional exec marketplace. The product is **Scout** - an AI that works like a brilliant, well-connected chief of staff who happens to know every great fractional CFO, CMO, COO, and CTO in the country. Scout doesn't show you a directory. Scout calls you, learns what you actually need, finds the right people, and makes warm introductions. Both parties have to want the connection. If the fit is good, Scout facilitates the meeting.

Boardy does this for general networking. We're doing it specifically for fractional talent - which means higher stakes, better signal, and a clear monetization model (placement fees or SaaS subscription to companies).

---

## How Boardy Actually Works (Research)

Based on public reporting, Boardy's mechanic:

1. **Invite-only entry** - a current member refers you, Boardy calls you
2. **Voice intake call** - AI asks conversational questions, builds a rich profile from the transcript
3. **Passive matching** - as network grows, Boardy identifies potential connections based on what both parties said they want
4. **Double opt-in intro** - Boardy emails/texts *both* people to ask if they want the intro before making it
5. **Warm email intro** - once both confirm, Boardy sends a warm intro email copying both parties
6. **Boardy stays out** - after the intro, it's between the humans

Key insight: Boardy never shows you a list to browse. Matches surface to you. This is the core UX bet - **curation > catalog**.

Raised $22M (a16z, others). Originally viral via Silicon Valley network. The moat is the network size + the quality of the call data.

---

## Scout Product Architecture

### Two Databases

**`talent_profiles`** - Fractional executives
```
id, name, email, phone, linkedin_url
primary_function (CFO/CMO/COO/CTO/Other)
years_experience
industries_served (array)
availability_hours_per_week
rate_min, rate_max (monthly)
bio_raw (what they said on the call, verbatim transcript)
bio_summary (Scout-generated 2-3 sentence profile)
embedding (vector for semantic matching)
status (active/inactive/paused)
placement_count
created_at, last_active_at
```

**`company_profiles`** - Companies hiring fractional
```
id, company_name, contact_name, contact_email, contact_phone
stage (Pre-seed/Seed/Series A/Series B/Growth/PE-backed)
industry
headcount
function_needed (CFO/CMO/COO/CTO/Other)
hours_per_week (10/20/30/40)
budget_monthly_min, budget_monthly_max
challenge_raw (verbatim transcript of what they said they need)
challenge_summary (Scout-generated summary)
embedding (vector)
urgency (immediate/within_30_days/exploring)
status (searching/paused/filled)
created_at
```

**`matches`**
```
id
talent_id (FK talent_profiles)
company_id (FK company_profiles)
score (0.0 - 1.0, algorithm output)
match_reasoning (Scout-generated explanation)
status (pending/talent_notified/talent_interested/talent_passed/
        company_notified/company_interested/company_passed/
        intro_sent/meeting_booked/placed/dead)
talent_interest_at, company_interest_at
intro_sent_at, meeting_booked_at
created_at
```

**`notifications`**
```
id, match_id, recipient_type (talent/company), recipient_id
channel (sms/email), message_body
sent_at, responded_at, response (interested/not_interested/1/2/3)
```

---

## The Full Product Flow

### COMPANY SIDE

**Step 1: Web Form (/hire)**
Company submits: name, company, email, phone, role needed, hours/week, budget, brief description, industry.

Immediately after submit:
- Record saved to `company_profiles` with status=`pending_call`
- Confirmation text sent: *"Got it. Scout will call you in the next few minutes to learn more about what you need. Answer when you see the Sprout number."*

**Step 2: Scout Calls the Company (within 5 min)**

Scout is a Vapi.ai voice agent. The call is warm, conversational, not a survey.

```
SCOUT COMPANY CALL SCRIPT

Scout: "Hey, this is Scout from Sprout - thanks for reaching out.
       I have a few quick questions so I can find the right people for you.
       Is now a good time?"

[If yes]

Scout: "Great. So tell me - what's actually going on at [company]?
       What broke or what are you trying to build that made you
       think you need a fractional [role]?"

[Free response - Scout listens, asks follow-ups]
Example follow-ups:
- "When you say [X], what does that look like day to day?"
- "Is there someone currently trying to do this and it's not working,
   or is it a gap no one is covering?"
- "What does success look like 90 days in?"

Scout: "Got it. And on budget - you put [$range] on the form.
       Is that flexible if the right person came along, or is that firm?"

Scout: "Last thing - how urgent is this? Like, do you need someone
       last week, or are you taking your time to find the right fit?"

Scout: "Perfect. Here's how this works: I'm going to go through our
       network and find two or three people who I think could actually
       help with what you described. I'll text you their profiles -
       just reply with the number of anyone you want to meet.
       If they're interested too, I'll make the intro. Sound good?"

Scout: "One more thing - are you open to a quick intro call or
       do you prefer email first?"

Scout: "Great. You'll hear from me within 24 hours. Thanks [name]."
```

After call:
- Transcript saved, Scout generates `challenge_summary` and `bio_summary`
- Company status updated to `searching`
- Matching algorithm runs

**Step 3: Matching Algorithm Runs**

Two-pass system:

*Pass 1: Hard filters*
- function_needed matches talent primary_function
- company budget_monthly_max >= talent rate_min
- talent availability_hours_per_week >= company hours_per_week
- talent status = active

*Pass 2: Semantic scoring*
- Generate embeddings for `challenge_summary` and `bio_summary` + `industries_served`
- Cosine similarity score
- Boost for industry match (+0.15), stage experience match (+0.1), urgency match (+0.05)
- Rank top candidates

*Output:* Top 3 talent profiles for this company

**Step 4: Scout Texts Company 3 Profiles**

SMS via Twilio:

```
Scout from Sprout here. Found 3 people I think could be right for [Company].

1️⃣ SARAH K. - Fractional CFO, 14 yrs exp. Built finance function at 3
Series A/B SaaS cos. Last engagement: took a company from $2M to $8M ARR.
$8-12k/mo, 20hrs/wk available.

2️⃣ MARCUS T. - Fractional CFO, 18 yrs. Ex-PE operating partner.
Deep in manufacturing + distribution. Built and sold 2 companies.
Strong on fundraising. $10-15k/mo, 15hrs/wk.

3️⃣ DIANA R. - Fractional CFO, 11 yrs. Fintech + healthcare.
Currently advising a Series B. Led 2 successful raises totaling $40M.
$7-10k/mo, 25hrs/wk available.

Reply 1, 2, 3, or multiple (e.g. "1 3") for anyone you want to meet.
Reply NONE if none are a fit and I'll keep looking.
```

**Step 5: Company Replies**
- System parses SMS reply
- Matched profiles flagged as `company_interested`
- Talent notification flow begins (see below)
- If NONE: Scout replies "Got it. I'll look deeper and come back to you."

---

### TALENT SIDE

**Step 1: Web Form (/join)**
Exec submits: name, email, phone, LinkedIn, primary role, years exp, industries, availability, rate expectations, brief bio.

Confirmation text: *"Thanks for applying to Sprout's network. Scout will call you shortly to learn more about your background. This is how we build your profile - no forms, just a quick conversation."*

**Step 2: Scout Calls the Talent**

```
SCOUT TALENT CALL SCRIPT

Scout: "Hey [name], Scout here from Sprout. You just applied
       to join the network - got 10 minutes so I can build
       your profile properly?"

[If yes]

Scout: "Perfect. So forget the resume for a sec - tell me about
       a company you worked with where you actually moved the needle.
       What was the situation when you came in?"

[Free response]

Follow-ups:
- "What did you actually do - like tactically, in the first 60 days?"
- "What was the outcome? Numbers if you have them."
- "What would the CEO say about you if I called them right now?"

Scout: "Nice. What industries are you best in? And are there
       any you'd turn down?"

Scout: "What's your sweet spot engagement look like? Hours per week,
       length of engagement, type of company?"

Scout: "On rate - you put [$X] on the form. Is that negotiable
       based on the company or is that your floor?"

Scout: "Last question: what does a bad client look like for you?
       Like what makes an engagement go sideways?"

Scout: "Here's how Sprout works: when I find a company that
       looks like a fit, I'll text you a quick summary of
       the opportunity. You reply yes or no. If the company
       is also interested, I make the intro. You only hear from
       me when there's a real opportunity. Sound good?"

Scout: "Great. I'll have your profile live in a few hours.
       Thanks [name]."
```

After call:
- Transcript + Scout-generated summary saved
- Status updated to `active`
- Talent added to matching pool

**Step 3: Daily Opportunity Texts to Talent**

This is the key retention/engagement mechanic. Talent doesn't log in anywhere. Scout comes to them.

When a company shows interest in a talent profile, OR when a new company enters the network that matches an existing talent:

```
Scout here. 3 opportunities in your wheelhouse today:

1️⃣ Series A SaaS (Nashville), needs fractional CFO 20hrs/wk.
Building first finance function, prepping Series B in 18 months.
Budget: $8-10k/mo. Urgent.

2️⃣ PE-backed manufacturer (remote-friendly), fractional CFO 15hrs/wk.
EBITDA improvement focus, possible path to full-time. $10-12k/mo.

3️⃣ Pre-revenue healthcare startup (NYC), fractional CFO 10hrs/wk.
Founder needs financial modeling and fundraise prep. $5-7k/mo.

Reply 1, 2, 3 or multiple to express interest.
Reply PASS to skip all.
Reply PAUSE to stop texts for 30 days.
```

Rules:
- Max 1 batch/day, only sent if there are real opportunities
- Only opportunities that pass hard-filter match (budget, hours, function)
- Talent can reply PAUSE if they're busy or STOP to deactivate
- System logs every response to build a preference model over time

**Preference Learning:**
Track what talent responds YES to vs. PASS to. After 10+ responses, Scout can surface:
- Industries they consistently accept vs. skip
- Budget thresholds they actually respond to
- Company stages they prefer
- Use this to re-score the matching algorithm for their profile

---

### MUTUAL INTEREST = INTRO

When both company AND talent have expressed interest in the same match:

**Step 1: Scout confirms with talent**
```
SMS to talent:
"Quick check - [Company Name] (Series A SaaS, Nashville) expressed
interest in connecting with you for a fractional CFO role.
20hrs/wk, $8-10k/mo. Still interested?
Reply YES to confirm or NO to pass."
```

**Step 2: Scout sends the intro email**

```
Subject: Scout intro: [Talent Name] x [Company Name]

Hi [Contact Name] and [Talent Name],

I've been working with both of you and think this is worth a conversation.

[Talent Name] - [2-3 sentence Scout-generated profile]

[Company Name] - [2-3 sentence Scout-generated company summary]

Why I think this fits: [Scout-generated match reasoning, 2-3 sentences]

I'll leave it to you two to find time. [Talent Name], you can reach
[Contact Name] at [email]. [Contact Name], [Talent Name] is at [email].

Let me know how it goes.

- Scout, Sprout
```

**Step 3: Meeting booked**
- Scout follows up 72 hours later via SMS to both parties:
  ```
  "Hey - did you two connect? Just want to make sure the intro landed."
  ```
- If yes: mark match as `meeting_booked`
- If no: Scout offers to help schedule ("Want me to suggest some times?")

**Step 4: Outcome tracking**
- 2 weeks after intro: Scout texts company
  ```
  "Quick check-in on [Talent Name] - did you move forward?
  Reply YES, NO, or STILL TALKING."
  ```
- Placement data feeds back into matching algorithm

---

## Matching Algorithm - V1 Spec

**Start simple, iterate:**

V1 - Rule-based + embeddings:
```python
def score_match(company, talent):
    score = 0.0

    # Hard gates (return 0 if fail)
    if talent.function != company.function_needed:
        return 0.0
    if talent.rate_min > company.budget_monthly_max:
        return 0.0
    if talent.availability_hours < company.hours_per_week:
        return 0.0
    if talent.status != 'active':
        return 0.0

    # Semantic similarity (challenge vs. bio)
    semantic = cosine_similarity(company.embedding, talent.embedding)
    score += semantic * 0.50  # 50% weight

    # Industry match
    if any(ind in talent.industries_served for ind in [company.industry]):
        score += 0.20

    # Stage fit (talent has experience at this stage)
    if company.stage in talent.stage_experience:
        score += 0.10

    # Urgency alignment
    if company.urgency == 'immediate' and talent.availability_hours >= company.hours_per_week * 1.5:
        score += 0.05

    # Track record (placements boost score)
    score += min(talent.placement_count * 0.02, 0.10)

    # Preference learning adjustment
    if talent.preference_model:
        score += talent.preference_model.industry_score(company.industry) * 0.05

    return min(score, 1.0)
```

V2 (after 50+ matches): Fine-tune on outcome data. Placements > meetings > declines. Build a proper recommendation model.

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Voice calls | **Vapi.ai** | Best AI voice infra, handles telephony + LLM + TTS, $0.05/min |
| SMS | **Twilio** | Industry standard, webhook-based reply handling |
| Database | **Supabase** | Already in stack, Postgres + vector extension (pgvector) |
| Embeddings | **OpenAI text-embedding-3-small** | Cheap, fast, good enough |
| LLM (summaries) | **Claude claude-sonnet-4-5** | Generate bio summaries, match reasoning, intro emails |
| Email | **Resend** | Simple API, great deliverability |
| Backend | **Next.js API routes** (or separate Node service) | Already in stack |
| Scheduling | **Inngest** or **cron on Railway** | Trigger daily opportunity texts, follow-ups |

**Vapi.ai specifics:**
- Define Scout as a Vapi assistant with a system prompt + question flow
- Vapi handles the telephony, streams audio, runs LLM, returns transcript + structured data
- Webhook fires when call ends → triggers profile update + matching run
- Cost: ~$0.05/min, a 10-minute intake call = $0.50

---

## What We're NOT Building (V1)

- No login / portal for companies or talent (SMS-first)
- No browsing / directory
- No payments processing (invoice manually for V1)
- No talent-initiated searches
- No video calls (text + email intro only)
- No mobile app

These all come later if traction justifies it.

---

## Monetization

**V1: Placement fee**
- 10-15% of first-year contract value
- Example: $10k/mo x 12 months = $120k contract → $12-18k fee
- Invoice company on signed engagement, net-30

**V2: Subscription**
- Company pays $500-2k/month for active search
- Talent side is always free (supply-side flywheel)

**V3: SaaS + placement hybrid**
- Monthly subscription + reduced placement fee

---

## Success Metrics

| Metric | Definition | V1 Target |
|---|---|---|
| Intake completion rate | % of form submits that complete Scout call | >70% |
| Match rate | % of company searches that yield mutual interest | >60% |
| Intro rate | % of mutual interests that result in intro email | >90% |
| Meeting rate | % of intros that result in meeting | >50% |
| Placement rate | % of meetings that result in placement | >25% |
| Time to intro | Form submit → intro email sent | <48 hours |
| Talent response rate | % of opportunity texts that get a reply | >40% |

---

## Build Sequence

**Phase 1 - Plumbing (Weeks 1-2)**
- [ ] Supabase schema (companies, talent, matches, notifications tables)
- [ ] Vapi.ai assistant setup - company call script
- [ ] Vapi.ai assistant setup - talent call script
- [ ] Webhook: form submit → trigger Vapi call
- [ ] Webhook: call end → save transcript → Claude summarizes → update DB

**Phase 2 - Matching (Weeks 2-3)**
- [ ] pgvector extension on Supabase
- [ ] Embedding generation on profile create/update
- [ ] V1 matching algorithm
- [ ] Match run trigger (after each new company/talent profile)
- [ ] SMS delivery via Twilio (opportunity texts)
- [ ] SMS reply parsing + DB update

**Phase 3 - Intro Flow (Week 3-4)**
- [ ] Double opt-in confirmation SMS
- [ ] Intro email generation (Claude) + send (Resend)
- [ ] Follow-up scheduler (72hr, 2-week)
- [ ] Basic outcome tracking

**Phase 4 - Website**
- [ ] /hire and /join forms (currently building with Claude Code)
- [ ] Deploy to GitHub Pages
- [ ] Point domain

---

## Open Questions

1. **How do we seed the talent network?** Before we have inbound execs, we need supply. Do we manually reach out to fractional execs Beck knows? Set a target of 20-30 before launching company side?

2. **Vapi number:** Do we get a dedicated Sprout phone number for Scout? Should feel like a real person calling, not a spam number.

3. **Call timing:** When do we call? Immediately after form submit, or scheduled? Probably within 5-10 minutes with a heads-up text first.

4. **Talent exclusivity:** Are talent in our network exclusive to Sprout or can they be on other platforms? Probably non-exclusive V1.

5. **Placement fee collection:** Do we need a contract with the company before making the intro? Probably yes - protect the fee. Simple one-pager.

6. **Geography:** US-only to start? Probably yes.

7. **Rate transparency:** Do we show budget range to talent and rate to company in the SMS previews? Yes - filters time-wasters.

---

*Last updated: March 2026 | Owner: Beck*

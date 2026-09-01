# CLOCK-IT 2.0 — Product Vision & Architecture (Revised)

> *"Your glow, on the clock."*
> An all-in-one, milestone-driven self-care companion — skincare, body care, nutrition, fitness, and AI coaching, adapting daily to any countdown you set for yourself.

---

## 0. What Changed From v1 — And Why

| v1 | v2.0 | Reason |
|---|---|---|
| Women-Only Verification (auth-level) | Women-focused brand & tone, open access | Verification is legally unenforceable and a compliance risk; brand identity doesn't need a gate |
| Mandatory AM/PM weigh-ins | Optional, user-toggled tracking | Removes the #1 driver of anxiety-based churn |
| "Debloating," "bloat prevention" copy | "Energy," "recovery," "readiness" copy | Avoids diet-culture framing; same science, healthier narrative |
| Wedding-first onboarding | Milestone-neutral onboarding | Wedding is one scenario among many (races, postpartum return, galas, "just for me" goals) |
| Disclaimer string in AI JSON | RD/trainer-reviewed prompt templates + in-app disclaimers | A disclaimer isn't a substitute for a sane recommendation underneath it |
| Scale as primary progress metric | Scale, measurements, photos, energy/mood — user picks | Removes implicit message that weight is the "real" metric |
| No community layer | Opt-in "Glow Feed" | Activates the "public women-focused community" pillar that v1 named but never built |
| 18-day vision scanner scope: "any machine" | Curated 40-machine library for v1, expandable | Realistic CV scope; ships reliable, not flashy-but-broken |

The goal of this revision: an app that makes people feel **capable and cared for**, not surveilled by a countdown. Reliability and trust compound into retention; pressure and shame do not.

---

## 1. Executive Summary & Vision

**CLOCK-IT** helps anyone preparing for a personally meaningful date — a wedding, a race, a return to fitness after a life change, a milestone birthday, or no occasion at all beyond "the next 90 days of my life" — build daily skincare, body care, nutrition, and fitness habits that intelligently adapt as the date approaches.

It is the only app that unifies all five self-care pillars under a single adaptive engine, instead of forcing users to stitch together five separate apps.

```mermaid
graph LR
    A[Onboarding: Milestone & Goal] --> B[Phase-Driven Countdown Engine]
    B --> C[Daily Routine Checklist]
    B --> D[AI Diet Planner]
    B --> E[AI Personal Trainer + Equipment Vision]
    B --> F[Skincare & Recovery Engine]
    C & D & E & F --> G[Progress & Glow Analytics]
    G --> H[Community Glow Feed - opt-in]
```

---

## 2. Core Pillars & Value Proposition

| Pillar | Description |
|---|---|
| **Milestone-Neutral Design** | Works for weddings, races, postpartum return, competitions, birthdays, or "just because." No single scenario is privileged in copy or UI. |
| **Countdown-Driven Intensity** | Daily requirements adapt across 4 phases (see below) to build sustainably toward peak readiness. |
| **Complete Self-Care Hub** | Skincare, body care, nutrition, fitness, and recovery in one calendar — no app-switching. |
| **Intelligent, Reviewed Nutrition** | AI-generated meal plans, built on templates reviewed by a registered dietitian, tailored to real goals — not generic calorie slashing. |
| **AI Gym Companion + Equipment Vision** | Camera-based machine recognition (curated library) with form guidance and safe substitutions. |
| **Non-Scale Progress Options** | Weight is one optional metric among several — measurements, photos, energy, sleep, mood. |
| **Opt-in Community** | A women-focused, non-competitive social layer for milestones and encouragement — no forced comparison. |

---

## 3. The 4-Phase Adaptive Engine

Renamed and reframed around **readiness**, not restriction.

```
[ Day 180 ── Foundation ── Day 90 ── Build ── Day 30 ── Refine ── Day 7 ── Arrival ── Day 0 ]
```

### Phase 1: Foundation (180–90 Days Out)
- **Fitness**: Baseline strength, form mastery, consistency over intensity.
- **Nutrition**: Sustainable, protein-forward macro balance; hydration habit-building.
- **Skin/Body**: Barrier repair, hair health, habit-stacking (not treatment-heavy yet).
- **Tone**: "Let's build a routine you can actually keep."

### Phase 2: Build (90–30 Days Out)
- **Fitness**: Progressive overload, targeted splits, mobility work.
- **Nutrition**: Slightly tightened adherence, whole-food emphasis, no extreme deficits.
- **Skin/Body**: Targeted treatments, exfoliation cycles, lymphatic self-massage (opt-in).
- **Tone**: "You're getting stronger — let's sharpen the details."

### Phase 3: Refine (30–7 Days Out)
- **Fitness**: Tapering intensity, injury-prevention focus, posture and mobility.
- **Nutrition**: Anti-inflammatory whole foods, no crash-dieting prompts *ever* — the AI is hard-constrained against generating aggressive deficits in this window.
- **Skin/Body**: Deep hydration, gentle glow treatments, stress management, sleep hygiene.
- **Tone**: "You've done the work. Now we protect your energy."

### Phase 4: Arrival (7–0 Days Out)
- **Fitness**: Light movement only, rest prioritized.
- **Nutrition**: Comfort, hydration, avoiding new foods/products that could cause reactions.
- **Skin/Body**: Final prep rituals, calm-focused, no last-minute drastic treatments recommended.
- **Tone**: "Trust the process. You're ready."

### Post-Milestone: "Maintenance & Glow" Mode
- Automatically offered at Day 0 — evergreen habit mode, or set a new milestone.
- Explicitly marketed *during onboarding*, not just at the end, so users know this isn't a one-shot app.

**Hard safety rule baked into the AI orchestrator**: no phase, at any countdown distance, may generate a deficit, workout volume, or routine flagged as aggressive/unsafe by the guardrail layer (see Section 6C). Deadline proximity never overrides the safety ceiling.

---

## 4. Screen & UX Architecture (14 Screens)

```mermaid
flowchart TD
    subgraph Onboarding ["1. Onboarding"]
        S1[1. Welcome & Splash] --> S2[2. Milestone & Goal]
        S2 --> S3[3. Profile & Metrics]
        S3 --> S3b[3b. Tracking Preferences]
    end

    subgraph MainApp ["2. Main App"]
        S3b --> S4[4. Calendar Home]
        S4 <--> S5[5. Day Detail Checklist]
        S4 <--> S6[6. AI Studio]
        S4 <--> S7[7. Progress & Analytics]
        S4 <--> S12[12. Glow Feed - Community]
    end

    subgraph Modals ["3. Sheets & Modals"]
        S6 --> S8[8. Equipment Scanner]
        S6 --> S9[9. Meal Recipe Sheet]
        S6 --> S10[10. Exercise Form Sheet]
        S4 --> S11[11. Settings & Notifications]
        S6 --> S13[13. AI Coach Check-In]
        S7 --> S14[14. Data & Privacy Center]
    end
```

### Key New/Changed Screens

**3b. Tracking Preferences (NEW)** — User chooses which metrics matter to them: weight, measurements, progress photos (private by default), energy/mood, sleep, or "none of the above, just habits." This runs *before* the first daily checklist so tracking never feels mandatory.

**12. Glow Feed (NEW)** — Opt-in, non-competitive community space. Users can share milestone completions, streaks, or encouragement posts. No follower counts, no like-based ranking, no photo requirement. Designed to activate the "community" pillar without becoming a comparison trap.

**13. AI Coach Check-In (NEW)** — Triggered automatically (not user-initiated) when the system detects patterns like: repeated meal-skipping, excessive exercise logging beyond plan, or rapid unplanned weight change entries. Sends a gentle, non-judgmental prompt: *"Want to adjust your plan, or just check in with how you're feeling?"* Never diagnostic, always optional, always exits cleanly if dismissed.

**14. Data & Privacy Center (NEW)** — One place for export, deletion, and clear plain-language explanation of what health data is stored and why (health/biometric data is sensitive-category under GDPR, CCPA, and most emerging state privacy laws — build this in from day one rather than retrofitting).

**4. Calendar Home** — Countdown card now reads *"142 Days to [Your Milestone]"* with phase badge, but weight/measurement trend is **not** shown on this card by default — it lives in Progress & Analytics, opt-in.

**5. Day Detail** — Weight module is now collapsible/optional per user's Screen 3b preference. Diet module defaults to "how do you feel today" energy check before macros.

**6. AI Studio** — Same three tabs (Diet / Workout / Coach), but every AI output passes through the guardrail layer before display (Section 6C).

---

## 5. Technical Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              Mobile Client (Android/iOS)                      │
│         React Native (shared codebase, faster ship)           │
└───────────────────────────────┬───────────────────────────────┘
                                │ HTTPS / JSON REST
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                  Backend: Spring Boot 3.x                    │
│   ├── Auth & JWT Security (standard, no gender-gating)        │
│   ├── Routine & Checklist Service                             │
│   ├── Countdown & Phase Computation Engine                    │
│   ├── AI Orchestrator (Claude API)                             │
│   ├── Safety Guardrail Layer (NEW — validates all AI output)  │
│   ├── Analytics & Progress Service                             │
│   └── Community Service (Glow Feed, moderation queue)          │
└───────────────┬────────────────────────────┬───────────────────┘
                ▼                            ▼
┌───────────────────────────────┐ ┌─────────────────────────────┐
│    PostgreSQL Database         │ │   Redis (Cache & Sessions)  │
│ - Users & Profiles              │ │ - Active JWT Tokens         │
│ - DailyLogs & Habits            │ │ - Daily Routine Cache       │
│ - MealPlans & WorkoutPlans      │ │ - Rate Limiting             │
│ - Equipment Library             │ └─────────────────────────────┘
│ - CommunityPosts (opt-in)       │
│ - ConsentLog (privacy/audit)    │
└───────────────────────────────┘
```

### Core Database Entities (Updated)

1. **User**: `id`, `name`, `email`, `milestone_date`, `milestone_type`, `phase`, `goal`, `height`, `starting_weight` *(nullable)*, `target_weight` *(nullable)*, `tracking_preferences_json`, `created_at`.
2. **DailyLog**: `id`, `user_id`, `date`, `weight_am` *(nullable)*, `weight_pm` *(nullable)*, `energy_score`, `mood_score`, `skincare_am_done`, `skincare_pm_done`, `bodycare_done`, `haircare_done`, `exercise_completed`, `diet_adherence_score`.
3. **MealPlan**: `id`, `user_id`, `date`, `breakfast_json`, `lunch_json`, `dinner_json`, `snacks_json`, `total_calories`, `total_protein`, `total_carbs`, `total_fat`, `guardrail_flags` *(NEW)*.
4. **WorkoutPlan**: `id`, `user_id`, `date`, `split_type`, `phase`, `exercises_json`, `estimated_duration_min`, `completed`, `guardrail_flags` *(NEW)*.
5. **Equipment**: `id`, `name`, `category`, `vision_labels`, `target_muscles`, `instructions`, `safety_notes`.
6. **ChatMessage**: `id`, `user_id`, `session_id`, `sender`, `content`, `timestamp`, `flagged_for_checkin` *(NEW)*.
7. **CommunityPost** *(NEW)*: `id`, `user_id`, `content`, `milestone_tag`, `created_at`, `moderation_status`.
8. **ConsentLog** *(NEW)*: `id`, `user_id`, `consent_type`, `granted_at`, `revoked_at`.

---

## 6. AI Subsystem Design

### A. AI Diet Planner
- **Model**: Claude (via Anthropic API).
- **Input**: Goal, target macros, current phase, dietary restrictions, tracking preferences.
- **Constraint**: Prompt templates reviewed by a registered dietitian before launch; minimum calorie floors enforced server-side, not just prompted for.
- **Output**: Structured JSON meal plan with macros — passed through the guardrail layer before reaching the client.

### B. AI Personal Trainer & Vision Recognition
- **Model**: Claude (vision-capable).
- **Input**: Image of gym equipment (v1: curated library of ~40 common commercial machines).
- **Output**: Machine name, confidence score, muscle groups, setup guide, suggested exercises, safety notes.
- **v1 scope discipline**: if confidence < 0.75, the app says so honestly ("Not sure — here's my best guess, or try another angle") rather than guessing silently. Reliability > flashiness.

### C. Safety Guardrail Layer (NEW — the most important addition)

Every AI-generated meal plan, workout plan, and coach chat response passes through a rules-based validation step *before* the user sees it:

- **Calorie floor check**: rejects/regenerates any plan below evidence-based minimums for the user's stated profile.
- **Deficit-pace check**: flags rapid-weight-loss-oriented language regardless of phase or days-remaining.
- **Volume/intensity check**: rejects workout plans that spike volume sharply in the Refine/Arrival phases.
- **Language filter**: blocks diet-culture terms ("bloat," "detox," "cheat day," "earn your food") from AI output, replacing with neutral, evidence-based phrasing.
- **Escalation**: if a user's chat messages or logging pattern suggest disordered eating or overtraining risk, triggers Screen 13 (AI Coach Check-In) — never a diagnosis, always a gentle, dismissible nudge with an option to see a professional resource.

This layer is what makes the app "promising and reliable" rather than just "an AI wrapper with a disclaimer." It's also a genuine competitive moat — most fitness/diet AI apps don't have this at all.

---

## 7. Trust & Reliability Commitments (NEW SECTION)

These are the promises that differentiate CLOCK-IT from a generic AI diet/fitness app, and should be stated plainly to users in-app:

1. **No plan generated by this app will ever prescribe an unsafe calorie deficit or workout volume, regardless of how close your milestone is.**
2. **Weight tracking is always optional.** You choose what "progress" means to you.
3. **Every AI nutrition template is reviewed by a registered dietitian.** (Commit to this before launch — it's a real line item, not decoration.)
4. **Your health data is yours.** Full export and deletion available anytime from Settings → Data & Privacy.
5. **We'll check in on you, not just track you.** If patterns suggest you might be overdoing it, we'll ask — gently, and only once per pattern unless you want to talk again.

---

## 8. Phased Implementation Roadmap

```mermaid
gantt
    title CLOCK-IT 2.0 Development Phases
    dateFormat  YYYY-MM-DD
    section Phase 1 — Foundation
    Auth, Onboarding & Countdown Engine        :p1, 2026-09-01, 14d
    Tracking Preferences & Data Privacy Center :p1b, after p1, 7d
    section Phase 2 — Core Loop
    Calendar Home & Day Detail Checklist       :p2, after p1b, 14d
    Progress & Analytics (multi-metric)        :p3, after p2, 10d
    section Phase 3 — AI Core
    AI Diet Planner + Guardrail Layer          :p4, after p3, 18d
    AI Coach Chat + Check-In Logic             :p4b, after p4, 10d
    section Phase 4 — Vision & Community
    Equipment Scanner (40-machine library)     :p5, after p4b, 16d
    Glow Feed Community (opt-in)               :p5b, after p5, 10d
    section Phase 5 — Polish & Compliance
    Notifications, Reminders & UI Polish       :p6, after p5b, 12d
    RD/Trainer Content Review & Legal Pass     :p6b, after p6, 10d
```

### Milestones
1. **M1**: UI Design complete in Figma (14 screens).
2. **M2**: Spring Boot backend scaffolded with PostgreSQL schema + guardrail layer stubbed.
3. **M3**: Mobile core (Calendar + Daily Log CRUD) with optional tracking flows.
4. **M4**: AI Diet + Coach live, guardrail layer enforced end-to-end.
5. **M5**: Equipment Vision Scanner tested against 40-machine library at >90% top-1 accuracy.
6. **M6**: RD and certified trainer sign-off on all AI prompt templates before public launch.
7. **M7**: Privacy/legal review complete (health data handling, applicable regions).

---

## 9. Success Metrics & Quality Standards

1. **Adherence Rate**: % of users completing ≥4 of 5 daily modules — tracked, but never surfaced to the user as guilt/shame ("you're behind").
2. **Retention, not just completion**: D30 and D90 retention tracked as the primary health metric of the app — a direct signal of whether the "no-pressure" redesign is working.
3. **AI Response Latency**: <2.5s diet generation, <3s vision recognition.
4. **Guardrail Trigger Rate**: % of AI outputs caught and regenerated by the safety layer — tracked and reviewed monthly; a rising rate means prompt tuning is needed.
5. **Check-In Engagement**: % of users who engage positively (not dismiss immediately) with Screen 13 prompts — signal that the feature feels caring, not intrusive.
6. **Visual Delight**: 60fps calendar transitions, satisfying micro-interactions — but never at the expense of the safety/trust commitments above.

---

## 10. Why This Version Is 100x More Promising

- **Trust compounds; pressure churns.** Users stay in apps that make them feel safe and capable. The guardrail layer and optional tracking are retention features, not just ethics features.
- **A real moat, not just a feature list.** Any team can wrap Claude/Gemini in a diet-planner UI. Few will build a reviewed, guardrailed, escalation-aware AI health layer — that's genuinely hard to copy and hard to fake in an App Store listing.
- **Milestone-neutral from day one** means the wedding market is a wedge, not a ceiling — the same engine expands cleanly to races, postpartum, competitions, or "just for me" without a rebuild.
- **Community without comparison** activates the pillar you already named in v1 but never built, and does it in a way that avoids the toxic-comparison trap that kills most social-fitness features.

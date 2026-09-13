# CLOCK-IT — Solo-Dev MVP Roadmap
### Principle: every milestone is a *running, full-stack, demo-able* app — never a half-built layer.

---

## Why this structure

Building "the whole backend" then "the whole frontend" then "AI" is the #1 way solo projects die — you go months without anything runnable, motivation collapses, and scope creep fills the gap. Instead, each milestone below is a **thin vertical slice**: DB → API → UI → deployed, for one small piece of the product. You can stop after any milestone and still have something real to show in interviews or to users.

Each milestone = roughly 1–2 weeks of solo part-time work. Adjust to your exam schedule.

---

## MVP 0 — "Hello Countdown" (Foundation Slice)
**Goal**: Prove the core loop — a user, a date, a countdown — works end to end.

- **DB**: `User` table only (`id`, `name`, `email`, `milestone_date`, `milestone_type`, `phase`).
- **Backend**: Spring Boot — 1 entity, 1 repository, 2 endpoints (`POST /users`, `GET /users/{id}`). Phase computed server-side from `milestone_date`.
- **Frontend**: One screen — enter name + pick a date → see "142 Days to Go" + phase badge.
- **Ship it**: Deploy backend (Render/Railway free tier), frontend as a simple React Native screen or even a web page first.

**Why first**: This is your entire product's spine. If the countdown/phase engine isn't solid, nothing else matters. Also — this alone is demo-able and portfolio-worthy on day one.

---

## MVP 1 — "Daily Checklist" (Habit Loop Slice)
**Goal**: A user can log one day's self-care checklist and see it persist.

- **DB**: Add `DailyLog` table (`id`, `user_id`, `date`, `skincare_am_done`, `skincare_pm_done`, `exercise_completed`). Skip weight/detailed workout fields for now — just booleans.
- **Backend**: CRUD for `DailyLog`, tied to `user_id` + `date`.
- **Frontend**: Day Detail screen (Screen 5, simplified) — checkboxes only, no fancy modules yet.
- **Ship it**: You now have Calendar Home (even a basic list of dates) + Day Detail working together.

**Why second**: This is the habit-tracking backbone every other module (workout, skincare, bodycare detail) will plug into later. Get the checklist *pattern* right before adding complexity to it.

---

## MVP 2 — "Calendar Home" (Navigation Slice)
**Goal**: Tie countdown + daily logs into a real home screen.

- **Backend**: `GET /users/{id}/calendar?month=X` returning countdown, phase, and daily-log completion status per day.
- **Frontend**: Screen 4 — monthly grid with completion rings, tap a day → Screen 5.
- **No AI yet.** No auth yet if you want to move fast — hardcode a single test user, add auth in MVP 3.

**Why third**: Now you have a genuinely usable habit-tracker app — countdown + calendar + checklist. This alone could be MVP-shipped to a handful of real testers (friends, wedding-prep Facebook groups) for feedback before you write a single line of AI code.

---

## MVP 3 — "Real Users" (Auth Slice)
**Goal**: Multiple real people can use it, not just your test user.

- **Backend**: Spring Security + JWT, signup/login endpoints.
- **Frontend**: Screens 1–3 (splash, milestone setup, profile) wired to real auth.
- **DB**: No schema change — just enforce `user_id` scoping properly everywhere.

**Why now, not first**: Auth is necessary but not *interesting* — building it before you have anything to protect wastes early motivation. Bolt it on once the core loop is proven.

---

## MVP 4 — "AI Workouts + Phase Awareness" (Phase-Adaptive Movement Slice)
**Goal**: Workouts and movement routines that adapt directly to the countdown phase (Foundation → Build → Refine → Arrival) — your core differentiator.

- **DB**: `WorkoutPlan` table.
- **Backend**: `POST /api/users/{id}/workout/today`, phase-aware prompt matching countdown progression and user goal.
- **Frontend**: Workout card on Day Detail with checklist-style exercise items and recovery tips.

**Why this matters as a checkpoint**: This is the moment your app transforms from a generic habit tracker into a true phase-adaptive milestone companion without any restrictive diet baggage.

---

## MVP 5 — "Progress You Can See" (Analytics Slice)
**Goal**: Turn logged routines into retention and motivation.

- **Backend**: Aggregation endpoint — streaks, adherence %, habit trends.
- **Frontend**: Screen 7, simplified — adherence heatmap, streak counters, and non-scale wellness progress.

**Why now**: Retention features compound value once you have a working habit logging loop with active users.

---

## MVP 6 — "Equipment Scanner" (Vision Slice — Hardest, Do It Last)
**Goal**: Flashiest differentiator, built once habit and movement features are completely stable.

- **Backend**: Image upload endpoint → Vision API call → curated 40-machine matching logic.
- **Frontend**: Screen 8 camera view, Screen 10 exercise sheet.

**Why last**: Highest technical risk (vision reliability, camera permissions, larger payloads); built after the foundation is proven.

---

## Deliberately deferred to "v2, if this gets traction"

Don't build these until MVP 0–6 are solid and you have real users:

- Glow Feed / community layer
- AI Coach Check-In escalation logic
- Notification scheduling system
- Data export / full privacy center
- Non-standard custom milestone extensions

---

## How to think about "done" at each stage

At the end of **every** MVP above, ask three questions before moving to the next one:

1. **Does it run, end to end, on a real device?** (not just Postman/localhost)
2. **Could I show this to a stranger and have them understand what it does in 30 seconds?**
3. **Am I building the next slice because it's next in priority, or because it's more fun?** (Be honest — MVP 7 will always be tempting to do early. Resist.)

---

## Suggested weekly rhythm (given your exam schedule)

- Treat each MVP as **one weekend + a couple of weeknight sessions**, not a sprint you need to rush.
- After MVP 2 (Calendar Home), you already have something portfolio-worthy — don't wait until MVP 7 to start mentioning this project in job applications.
- Commit after every MVP, tag the release (`v0.1-countdown`, `v0.2-checklist`, etc.) — this also gives you a clean story to tell in interviews about how you scope and ship incrementally, which is a strong signal for a fresher dev.

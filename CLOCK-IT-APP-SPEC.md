# CLOCK-IT — Master Product Specification & Architecture Document

> *"Your glow, on the clock."*  
> A luxury, women-only event-prep companion combining daily self-care and fitness checklists with an AI-driven diet planner and personal trainer.

---

## 1. Executive Summary & Vision

**CLOCK-IT** is designed for women preparing for major life milestones (weddings, galas, competitions, or personal milestone dates). It bridges the gap between static habit trackers and high-end personal coaching by dynamically adjusting daily self-care, skincare, nutrition, and workout intensity based on a live countdown to the user's **"Big Day"**.

```mermaid
graph LR
    A[Onboarding: Event Date & Goal] --> B[Phase-Driven Countdown Engine]
    B --> C[Daily Routine Checklist]
    B --> D[AI Diet Planner]
    B --> E[AI Personal Trainer & Equipment Vision]
    C & D & E --> F[Progress & Glow Analytics]
```

---

## 2. Core Pillars & Value Proposition

| Pillar | Description |
|---|---|
| **Audience Focus** | Public, women-only community space with an empowering, luxury self-care aesthetic. |
| **Countdown-Driven Intensity** | Daily requirements dynamically adapt across 3 countdown phases to peak on the event date. |
| **Complete Self-Care Hub** | Unifies AM/PM weight, skincare, hair & body care, diet, and gym routines in one calendar interface. |
| **Intelligent Nutrition** | AI generates macro-balanced daily meal plans tailored to body goals (Lose / Tone / Maintain / Glow). |
| **AI Gym Companion** | Generates split-based workouts and uses camera computer vision to identify gym equipment and guide form. |

---

## 3. The 3-Phase Countdown Engine

All routines and recommendations are anchored to the user's countdown to the Big Day:

```
[ Day 180 ────── Foundation ────── Day 90 ────── Intensify ────── Day 30 ────── Final Prep ────── Day 0 ]
```

### Phase 1: Foundation (180–90 Days Out)
- **Fitness Focus**: Baseline strength, form mastering, consistency building.
- **Nutrition**: Sustainable macro balancing, hydration baseline.
- **Skincare/Body**: Long-term skin barrier repair, hair health regimens.

### Phase 2: Intensify (90–30 Days Out)
- **Fitness Focus**: Progressive overload, targeted toning splits (Legs, Glutes, Core, Full Body).
- **Nutrition**: Tightened macro adherence, targeted debloating strategies.
- **Skincare/Body**: Targeted treatments, exfoliation cycles, lymphatic drainage.

### Phase 3: Final Prep & Taper (30–0 Days Out)
- **Fitness Focus**: Tapering workout strain to prevent fatigue/injury, active recovery, posture alignment.
- **Nutrition**: Anti-inflammatory, glow-boosting whole foods, bloat prevention.
- **Skincare/Body**: Deep hydration, gentle glow treatments, resting routines, stress management.

### Post-Event Mode (Day 0+)
- Transitions into an evergreen **"Maintenance & Glow"** mode or allows setting a new milestone date.

---

## 4. Complete Screen & UX Architecture (11 Screens)

```mermaid
flowchart TD
    subgraph Onboarding ["1. Onboarding Flow"]
        S1[Screen 1: Welcome & Splash] --> S2[Screen 2: Event Date & Goal]
        S2 --> S3[Screen 3: Profile & Metrics]
    end

    subgraph MainApp ["2. Main App (Bottom Navigation)"]
        S3 --> S4[Screen 4: Calendar Home]
        S4 <--> S5[Screen 5: Day Detail Checklist]
        S4 <--> S6[Screen 6: AI Studio]
        S4 <--> S7[Screen 7: Progress & Analytics]
    end

    subgraph Modals ["3. Sheets & Modals"]
        S6 --> S8[Screen 8: Equipment Scanner]
        S6 --> S9[Screen 9: Meal Recipe Sheet]
        S6 --> S10[Screen 10: Exercise Form Sheet]
        S4 --> S11[Screen 11: Settings & Notifications]
    end
```

### Screen Breakdown:

#### 1. Splash & Auth (`Screen 1`)
- **Visuals**: Soft blush/peach glow, 3D clock hero, brand tagline *"your glow, on the clock"*.
- **Controls**: "Get started ✦" CTA, "Already prepping? Log in" action, women-only community pledge.
- **Intro Carousel**: 3 slides (Countdown Concept → AI Diet → AI Trainer).

#### 2. Event & Goal Setup (`Screen 2`)
- **Controls**: Date picker for the Big Day, Event Type tag (Wedding, Gala, Vacation, Personal Milestone).
- **Goal Cards**: *Lose Weight*, *Tone & Sculpt*, *Maintain & Glow*.

#### 3. Profile & Baseline Metrics (`Screen 3`)
- **Inputs**: Name, Age, Height (cm/ft), Current Weight, Target Weight.
- **Preferences**: Dietary restrictions (Veg, Vegan, Pescatarian, Gluten-Free, Halal).

#### 4. Calendar Home (`Screen 4` — Tab 1 Hub)
- **Header**: Big Day Countdown card (*"142 Days Remaining"*), Current Phase Badge (*Foundation*), Overall Progress ring.
- **Body**: Interactive monthly calendar grid with daily completion rings.
- **Footer Card**: Today's routine quick-preview with single-tap navigation to Day Detail.

#### 5. Day Detail (`Screen 5` — Tab 2 Checklist)
- **Top Bar**: Date switcher (`< Today, Aug 20 >`).
- **Module 1 (Weight)**: AM and PM weight log fields.
- **Module 2 (Skincare)**: AM (Cleanser, Vitamin C, SPF) and PM (Double cleanse, Retinol, Night cream).
- **Module 3 (Bath & Body)**: Body scrub, lotion, hair oiling / wash day checklist.
- **Module 4 (Diet Blueprint)**: Breakfast, Lunch, Dinner summary with macro bar.
- **Module 5 (Workout Split)**: Split title (e.g., *Legs & Core*) with exercise checklist.

#### 6. AI Studio (`Screen 6` — Tab 3)
- **Top Segmented Switcher**: `[ AI Diet ]` | `[ Workout Plan ]` | `[ AI Coach ]`
- **AI Diet Tab**: Daily 3-meal blueprint, macro ring (Protein / Carbs / Fat), "Swap Meal" and "Regenerate Day" buttons.
- **Workout Plan Tab**: Phase-appropriate exercises (Sets, Reps, Rest timers), "Snap Machine" Floating Action Button (FAB).
- **AI Coach Chat Tab**: Gym form Q&A, dos & don'ts, built-in safety and medical disclaimers.

#### 7. Progress & Analytics (`Screen 7` — Tab 4)
- **Charts**: Dual-line AM vs PM weight trend with goal projection.
- **Habit Consistency**: Monthly adherence heatmap and active streak badge.
- **Milestones**: Phase progression meter and measurement logs (waist, hips, etc.).

#### 8. Equipment Vision Scanner (`Screen 8` — Full Camera)
- **Camera Viewfinder**: Live viewfinder with bounding box and snap trigger.
- **AI Recognition Result**: Machine name, confidence score, target muscle group, and recommended seat/pin setup.

#### 9. Meal Recipe & Macro Sheet (`Screen 9` — Bottom Sheet)
- **Content**: Detailed ingredient list, prep time, step-by-step cooking steps, full micronutrient/macro breakdown.

#### 10. Exercise Form & Cues Sheet (`Screen 10` — Bottom Sheet)
- **Content**: Exercise demo animation, muscle highlights, key form cues, common mistakes to avoid, and safe substitution options.

#### 11. Profile & Settings (`Screen 11`)
- **Settings**: Edit event date, notification schedule (Morning weigh-in alert at 7:00 AM, Night routine alert at 9:30 PM), data export, account deletion.

---

## 5. Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Client (Android)                  │
│       React Native / Jetpack Compose / Responsive Web       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend: Spring Boot 3.x                  │
│   ├── Auth & JWT Security (Women-Only Verification)         │
│   ├── Routine & Checklist Service                           │
│   ├── Countdown & Phase Computation Engine                  │
│   ├── AI Orchestrator (Claude / Gemini API Integration)     │
│   └── Analytics & Progress Service                          │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│    PostgreSQL Database       │ │   Redis (Cache & Sessions) │
│ - Users & Profiles           │ │ - Active JWT Tokens        │
│ - DailyLogs & Habits         │ │ - Daily Routine Cache      │
│ - MealPlans & WorkoutPlans   │ │ - Rate Limiting            │
│ - Equipment Inventories      │ └────────────────────────────┘
└──────────────────────────────┘
```

### Core Database Entities:
1. `User`: `id`, `name`, `email`, `event_date`, `event_type`, `phase`, `goal`, `height`, `starting_weight`, `target_weight`, `created_at`.
2. `DailyLog`: `id`, `user_id`, `date`, `weight_am`, `weight_pm`, `skincare_am_done`, `skincare_pm_done`, `bodycare_done`, `haircare_done`, `exercise_completed`, `diet_adherence_score`.
3. `MealPlan`: `id`, `user_id`, `date`, `breakfast_json`, `lunch_json`, `dinner_json`, `snacks_json`, `total_calories`, `total_protein`, `total_carbs`, `total_fat`.
4. `WorkoutPlan`: `id`, `user_id`, `date`, `split_type`, `phase`, `exercises_json`, `estimated_duration_min`, `completed`.
5. `Equipment`: `id`, `name`, `category`, `vision_labels`, `target_muscles`, `instructions`, `safety_notes`.
6. `ChatMessage`: `id`, `user_id`, `session_id`, `sender` (USER/AI), `content`, `timestamp`.

---

## 6. AI Subsystem Design & Prompts

### A. AI Diet Planner
- **Model**: Claude 3.5 Sonnet / Gemini 1.5 Pro.
- **Input Context**: User Goal (Lose/Tone/Maintain), Target Calories/Macros, Current Phase, Dietary Restrictions.
- **Output**: JSON payload of structured meals with realistic ingredients and macro calculations.

### B. AI Personal Trainer & Vision Recognition
- **Model**: Claude 3.5 Sonnet (Vision) / Gemini 1.5 Flash.
- **Input**: Image upload of gym machine or workout area.
- **Output**:
  ```json
  {
    "machine_name": "Seated Cable Row",
    "confidence": 0.94,
    "primary_muscle": "Upper Back / Rhomboids",
    "secondary_muscle": "Biceps",
    "seat_setup_guide": "Adjust chest pad so arms are fully extended when gripping handles.",
    "suggested_exercises": [
      { "name": "Neutral Grip Cable Row", "sets": 3, "reps": "10-12", "phase_focus": "Foundation" }
    ],
    "safety_disclaimer": "Keep spine neutral. Do not round lower back during heavy pulls."
  }
  ```

---

## 7. Phased Implementation Roadmap

```mermaid
gantt
    title CLOCK-IT Development Phases
    dateFormat  YYYY-MM-DD
    section Phase 1
    Auth, Onboarding & Countdown Setup     :p1, 2026-09-01, 14d
    Calendar Home & Day Detail Checklist    :p2, after p1, 14d
    section Phase 2
    Weight & Progress Trend Analytics      :p3, after p2, 10d
    section Phase 3
    AI Diet Planner & Macro Blueprint      :p4, after p3, 14d
    section Phase 4
    AI Trainer & Vision Machine Scanner    :p5, after p4, 18d
    section Phase 5
    Notifications, Reminders & UI Polish   :p6, after p5, 12d
```

- **Milestone 1**: UI Design complete in Figma (11 screens).
- **Milestone 2**: Spring Boot Backend API scaffolded with PostgreSQL schemas.
- **Milestone 3**: Mobile Frontend Core (Calendar + Daily Log CRUD).
- **Milestone 4**: AI Diet Planner & AI Trainer integration.
- **Milestone 5**: Equipment Vision Scanner testing & full end-to-end polish.

---

## 8. Success Metrics & Quality Standards

1. **Adherence Rate**: Percentage of users completing at least 4 out of 5 daily checklist modules.
2. **AI Response Latency**: < 2.5s for AI Diet Generation and < 3s for Vision Equipment Recognition.
3. **Safety First**: Every AI health, fitness, or diet recommendation contains clear safety guardrails and professional consultation disclaimers.
4. **Visual Delight**: 60fps smooth animations on calendar date transitions and micro-interactions on checklist completions.

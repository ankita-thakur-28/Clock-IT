# CLOCK-IT Domain Model

An all-in-one milestone-driven self-care companion — skincare, body care, phase-adaptive movement, daily habits, and AI coaching, adapting daily to any countdown set by the user.

## Language

### Core Entities & Lifecycle

**Countdown**:
The number of days remaining until the user's milestone date.
_Avoid_: Timer, deadline

**Phase**:
One of four structured progression stages based on days remaining: Foundation (180–90d), Build (90–30d), Refine (30–7d), and Arrival (7–0d), transitioning into Maintenance & Glow (post-milestone).
_Avoid_: Level, tier, difficulty, intensifier

**Daily Log**:
The user's aggregate record for a single calendar date, containing checklist completions, optional metrics (weight, measurements, energy/mood), and routine adherence.
_Avoid_: Daily entry, diary, journal

**Routine Module**:
A specific domain category within the daily checklist (Energy Check, Skincare Protocol, Hair & Body Care, Movement & Workouts, Weight & Measurement Log).
_Avoid_: Category, bucket, task list

**Tracking Preferences**:
User-configured metric visibility (Weight, Measurements, Progress photos, Energy & mood, Habits-only), preventing mandatory scale tracking.
_Avoid_: Weigh-in requirement

**AI Coach**:
The conversational companion providing form cues, habit support, and automated gentle check-ins when overtraining or skipping patterns are detected.
_Avoid_: Gym bot, fitness assistant, diagnostic bot

## Screen Architecture

- **Onboarding (Screens 1–3b)**: Splash & Welcome, Milestone & Goal Setup, Profile & Baseline Metrics, Tracking Preferences.
- **Main App (Screens 4–7, 12)**: Calendar Home, Day Detail Checklist, Movement & Workouts Studio, Progress & Analytics, Glow Feed (opt-in community).
- **Sheets & Modals (Screens 8–11, 13–14)**: Equipment Scanner, Exercise Form Sheet, Settings & Notifications, AI Coach Check-In, Data & Privacy Center.

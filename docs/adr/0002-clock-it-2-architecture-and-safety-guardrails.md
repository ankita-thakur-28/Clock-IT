# ADR 0002: CLOCK-IT 2.0 Product & Architectural Evolution

## Context
Initial design (ADR 0001) specified an 11-screen, 3-phase model focused exclusively on women-only event preparation with mandatory AM/PM weigh-ins. This raised several product and operational risks:
1. Hard women-only verification gates create legal and compliance risks under data privacy laws.
2. Mandatory 2x/day weigh-ins and "debloating" copy encourage anxiety-driven churn and diet-culture framing.
3. A single wedding/event countdown creates a "churn cliff" immediately after the event date.
4. Raw AI prompt disclaimers are insufficient for health, diet, and fitness safety without server-side validation.

## Decision
1. **Milestone-Neutral & Open Brand**: Reposition the app as an empowering, luxury self-care companion open to any milestone (weddings, races, post-partum return, birthdays, or 90-day personal goals) with an automatic post-event "Maintenance & Glow" mode.
2. **4-Phase Countdown Engine**: Refactor progression into Foundation (180–90d), Build (90–30d), Refine (30–7d), and Arrival (7–0d), followed by Maintenance & Glow (Day 0+).
3. **14-Screen Architecture**:
   - Add Screen 3b (Tracking Preferences) so metrics like weight, measurements, and photos are strictly opt-in.
   - Add Screen 12 (Glow Feed) for non-competitive, opt-in community encouragement.
   - Add Screen 13 (AI Coach Check-In) for automated, caring intervention when overtraining or meal-skipping patterns emerge.
   - Add Screen 14 (Data & Privacy Center) for explicit consent logs, data export, and deletion from Day 1.
4. **Safety Guardrail Layer**: Implement a server-side rules engine validating calorie floors, rate-of-loss speed, workout volume spikes, and non-diet-culture terminology before AI output reaches the client.
5. **Curated Equipment Library**: Scope vision recognition to a curated 40-machine library with explicit confidence thresholds (>0.75).

## Status
Accepted (Supersedes ADR 0001 on countdown phases, screen scope, and safety architecture).

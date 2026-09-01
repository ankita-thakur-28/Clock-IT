# Spec: MVP 0 — "Hello Countdown" (Foundation Slice)

## Objective
Implement a running, full-stack, demo-able end-to-end slice of CLOCK-IT that proves the core loop: a user profile, a target milestone date, and a server-computed live countdown with phase badge.

## Scope
1. **Backend**:
   - Spring Boot 3.x REST application.
   - User entity with fields: `id`, `name`, `email`, `milestone_date`, `milestone_type`, `goal`, `tracking_preferences`.
   - Countdown & Phase computation engine:
     - > 90 days: `Foundation`
     - 31–90 days: `Build`
     - 8–30 days: `Refine`
     - 0–7 days: `Arrival`
     - < 0 days: `Maintenance & Glow`
   - Endpoints:
     - `POST /api/users`: Create/register a milestone profile.
     - `GET /api/users/{id}`: Retrieve profile with computed countdown days remaining, current phase, and phase description.
     - `GET /api/health`: Health check endpoint.
2. **Frontend**:
   - Modern React client implementing the design tokens from `clockit-mvp-screens.jsx`.
   - Onboarding flow: Splash Screen $\rightarrow$ Milestone & Goal setup $\rightarrow$ Profile & Tracking Preferences $\rightarrow$ Live Countdown Card.
   - Connected via REST to the Spring Boot backend.
3. **Verification**:
   - Automated backend unit tests for countdown calculation and phase transitions.
   - End-to-end user creation and countdown retrieval verification.

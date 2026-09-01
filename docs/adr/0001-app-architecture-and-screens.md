# ADR 0001: Mobile Architecture and Screen Scope for CLOCK-IT

## Context
CLOCK-IT is a luxury women-only event-prep companion mobile application that adapts routines based on a countdown to a target date. We needed to define the user flow, screen footprint, navigation layout, and technical stack to guide design and implementation.

## Decision
1. **Screen Scope**: Defined 11 specific UI states (3 onboarding screens, 4 primary bottom navigation tabs, and 4 specialized action sheets/modals).
2. **Navigation Model**: Calendar-first bottom navigation (Calendar Home, Day Detail Checklist, AI Studio, Progress & Analytics).
3. **Countdown Model**: 3 fixed phases (*Foundation* 180–90d, *Intensify* 90–30d, *Final Prep* 30–0d) with an evergreen maintenance transition post-event.
4. **Technology Stack**: Mobile Client (Android / React Native), Spring Boot 3.x REST API, PostgreSQL, Redis, and Claude/Gemini AI APIs for nutrition planning and vision-based gym equipment recognition.

## Status
Accepted

# Issue 02: Build MVP 0 Frontend Client with Design System

Status: resolved

## Description
Scaffold the frontend client (React + Vite) using the luxury design tokens (`Playfair Display`, `Poppins`, blush/terracotta palette, `ClockGlyph`, and `BowGlyph` from `clockit-mvp-screens.jsx`), allowing a user to set up a milestone and fetch their live countdown from the backend.

## Acceptance Criteria
- [x] React client initialized with Vite and required fonts/styles.
- [x] Splash screen with brand styling and CTA.
- [x] Milestone & Goal setup flow connected to backend `POST /api/users`.
- [x] Live countdown result card showing computed phase badge, days remaining, and dynamic clock glyph.

## Comments
- Built `App.jsx` with Splash screen, Milestone & Goal setup, and Live countdown card.
- Connected to Spring Boot backend `http://localhost:8088/api/users`.
- Frontend build succeeded with Vite.

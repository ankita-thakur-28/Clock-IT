# 02 — Sign In screen declutter

Status: ready-for-agent

Trim the `login` step in `mobile/App.js` to the "After" state of the Sign-In phone in
`docs/auth-redesign.html`.

## Edits (line refs from clean `main`, c21c2e8)

1. `App.js:1172` — remove nav title `Welcome Back` (keep the back button; header row is
   back-button only). Do NOT remove the navTitle style if the signup/setup screens still use it.
2. `App.js:1183` — headline `Sign In to Clock-IT` → `Welcome back`
3. `App.js:1185` — delete subtitle `Resume your defining countdown and daily rituals.`
4. `App.js:1258` — CTA `Log In & Continue` → `Log In`
5. `App.js:1273` — footer `New to Clock-IT? Create an account` → `New here? Create account`
6. Nudge vertical rhythm so the card doesn't leave a gap where the subtitle was (reference mockup:
   icon `marginTop` ~26, card `marginTop` ~30).

## Out of scope

- Fields/component swap (ticket 01), auth logic, error strings.

## Acceptance

- [ ] Screen reads exactly: `Welcome back` · `Email` · `Password` + `Show` · `Log In` ·
      `New here? Create account` — 11 words total
- [ ] Clock icon, blobs, card, gradient CTA visually unchanged from current
- [ ] Login flow still validates and submits identically

Blocked by: 01

# Spec: Auth screens copy declutter

## Problem

The Sign In and Create Account screens (steps `login` / `signup` in `mobile/App.js`) repeat
themselves: a nav-bar title + a big headline + a two-line subtitle all say the same thing, every
field carries a permanent all-caps label, and CTAs include unnecessary words ("& Continue",
"Continue to Milestone Setup"). For a commercial app this reads as clutter and pushes the form
below the fold on small devices.

## Goal

Cut auth-screen copy by ~60% without changing the visual identity (Playfair serif headings, cream
blush palette, gradient pill CTA, soft-shadow card) or the auth behavior/API.

**Reference design (visual spec):** `docs/auth-redesign.html` — the "After" state of both phones.
Match it, including the floating-label behavior and the helper-text-on-focus pattern.

## Copy contract (before → after)

### Sign In (`login` step)

| Element | Before | After |
|---|---|---|
| Nav title | `Welcome Back` | *(removed — back button only)* |
| Headline | `Sign In to Clock-IT` | `Welcome back` |
| Subtitle | `Resume your defining countdown and daily rituals.` | *(removed)* |
| Field labels | `EMAIL ADDRESS` / `PASSWORD` (static, all-caps) | Floating labels `Email` / `Password` |
| Password placeholder | `Enter your password` | *(none — label does the job)* |
| CTA | `Log In & Continue` | `Log In` |
| Footer | `New to Clock-IT? Create an account` | `New here? Create account` |

Word count: **30 → 11**.

### Create Account (`signup` step)

| Element | Before | After |
|---|---|---|
| Nav title | `Create Account` | *(removed — back button only)* |
| Step indicator | `Step 1 of 2` text | 2-dot indicator, 1st active |
| Headline | `Join Clock-IT` | `Join Clock-IT` *(unchanged)* |
| Subtitle | `Create your private profile to begin crafting your luxury countdown.` | *(removed)* |
| Field labels | `YOUR NAME` / `EMAIL ADDRESS` / `PASSWORD` | Floating labels `Your name` / `Email` / `Password` |
| Password placeholder | `Min. 6 characters` | Helper text shown **only while field is focused** |
| CTA | `Continue to Milestone Setup` | `Continue` |
| Footer | `Already have an account? Log in` | `Have an account? Log in` |

Word count: **36 → 13**.

## Design tokens (from the reference mockup)

- Floating label idle: 15px, `#B9A795`; floated: 10.5px bold uppercase, letterSpacing 1.4, `#C99A6B`
- Input: height 58, borderRadius 16, border 1.5 `#EED7C4`, focus border `#E3B7A4`, text `#3B2A26`
- Progress dots: active `#CF8F9C` (elongated pill), inactive `#E6C9B4`

## Constraints

- No changes to auth logic, validation rules, error strings, or API calls.
- Validation errors stay as they are (e.g. "Password must be at least 6 characters" at
  `App.js:250`) — the focused helper is a hint, not a replacement.
- Mind the repo's Android font-clipping history: keep `includeFontPadding: false` consistent on
  resized labels and verify on Android.
- Line numbers below reference a clean `main` at `c21c2e8`; expect drift after each ticket merges.

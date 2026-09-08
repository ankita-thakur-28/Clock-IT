# 03 — Sign Up screen declutter + progress dots

Status: ready-for-agent

Trim the `signup` step in `mobile/App.js` to the "After" state of the Create-Account phone in
`docs/auth-redesign.html`, and replace text step counters with dots.

## Edits (line refs from clean `main`, c21c2e8)

1. `App.js:1034` — remove nav title `Create Account` (back button only in header).
2. `App.js:1035` — replace `Step 1 of 2` text with a 2-dot indicator: active dot = elongated pill
   `#CF8F9C`, inactive = 9px circle `#E6C9B4` (see `.steps` in the reference mockup CSS).
3. `App.js:1047` — delete subtitle `Create your private profile to begin crafting your luxury
   countdown.` Keep headline `Join Clock-IT` (App.js:1045) unchanged.
4. `App.js:1136` — CTA `Continue to Milestone Setup` → `Continue`
5. `App.js:1151` — footer `Already have an account? Log in` → `Have an account? Log in`
6. ⚠️ `App.js:1292` — the milestone-setup screen also renders navStep `Step 1 of 2`. Verify its
   intended numbering (it is step 2 of 2) and replace with the same dot component, 2nd dot active.
   If the "1 of 2" there is a real bug, call it out in this ticket's Comments rather than silently
   keeping it.
7. Adjust vertical rhythm after subtitle removal (reference mockup: icon `marginTop` ~26,
   card `marginTop` ~30).

## Out of scope

- Fields/component swap (ticket 01), auth logic, validation errors.

## Acceptance

- [ ] Screen reads exactly: `Join Clock-IT` · `Your name` · `Email` · `Password` + `Show` +
      focus-only `Min. 6 characters` · `Continue` · `Have an account? Log in` — 13 words
- [ ] Dots render on both signup (dot 1) and setup (dot 2) screens; no "Step N of N" text remains
- [ ] Signup flow still validates and submits identically

Blocked by: 01

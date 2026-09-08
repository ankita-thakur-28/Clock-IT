# 01 — Floating label input component (shared)

Status: ready-for-agent

Build the floating-label text input used by both auth screens, matching the "After" state of
`docs/auth-redesign.html`.

## Why first

Sign In, Create Account, and the milestone-setup name field all currently use a static all-caps
label above the input (`authFieldLabel` style). The redesign folds label and placeholder into one
element that floats up on focus/typing. All three screens consume this ticket.

## What

1. Create `mobile/src/components/FloatingInput.js`:
   - Props: `label`, `value`, `onChangeText`, `secureTextEntry`, `showPasswordToggle`,
     `helperText` (optional, shown only while focused), `keyboardType`, `autoComplete`,
     `autoCapitalize`, `testID`.
   - Behavior: label sits centered in the field like a placeholder; when the field is focused OR
     `value` is non-empty, it floats to the top of the field and shrinks.
   - Optional trailing Show/Hide button when `secureTextEntry` and toggle enabled (reuse existing
     `passwordToggle`/`passwordToggleText` styles).
   - When `helperText` is provided, render it below the input, visible only while focused.
2. Styles per the spec's design tokens. A simple conditional style for the floated state is fine;
   an `Animated` timing is a nice-to-have, not required.

## Where it gets consumed (do the swap in this ticket)

- Sign In email + password: `mobile/App.js:1197`–`1225`
- Sign Up name + email + password: `mobile/App.js:1059`–`1110` (password placeholder
  `"Min. 6 characters"` at `App.js:1096` becomes `helperText="Min. 6 characters"`)
- Milestone-setup name field placeholder `"Your Name"`: `mobile/App.js:1304`

## Acceptance

- [ ] All five auth/setup inputs use FloatingInput; static `authFieldLabel` Texts removed for them
- [ ] Label floats on focus and stays floated with content; no overlap at 58px height on Android
      (keep `includeFontPadding: false` on the label)
- [ ] Password Show/Hide still works; helper shows only while focused
- [ ] No change to values/validation/handlers

Blocked by: none

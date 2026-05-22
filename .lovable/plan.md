## Goal

Clicking the floating "Sign in" pill on the landing page should open a compact, on-brand modal — not navigate to the two-pane `/signin` page. The modal should feel consistent with the magazine/editorial landing (paper background, hairline borders, serif accents, uppercase tracking) and have a touch of fun and boldness.

## Changes

### 1. New component: `src/components/marketing/SignInDialog.tsx`
- Wraps shadcn `Dialog` (already in project) with a custom editorial skin.
- Trigger is rendered by the parent; component accepts `open` / `onOpenChange`.
- Content:
  - Small uppercase eyelet: `— Welcome back`
  - Bold serif headline using `editorial-display` / `font-serif` italic accent, e.g. "Welcome **back.**"
  - Email + password fields (shadcn `Input` + `Label`) with same zod schema as `SignIn.tsx`.
  - Primary "Sign in" button (full width, matches floating pill styling — pill radius, uppercase tracking).
  - Footer line: "Contact admin for new account setup." in muted small caps.
- Reuses `useAuth().signIn`, toast on success/error, navigates to `/app` on success.
- Visual touches for "fun + bold":
  - Paper texture background (`bg-paper`), hairline border, soft `shadow-paper`.
  - Tiny rotated serif flourish or arrow accent in the corner (decorative).
  - Subtle pop-in animation on the headline words (reuse the `tagline-pop` keyframes pattern already in `SignIn.tsx`, scaled down).

### 2. `src/pages/marketing/Landing.tsx`
- Replace the `<Link to="/signin">` floating pill with a `<button>` that toggles `signInOpen` state.
- If `user` is signed in, keep it as a `<Link to="/app">` showing "Open Studio" (unchanged behavior).
- Render `<SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />`.

### 3. Leave `/signin` route intact
- The existing `SignIn.tsx` page still works for direct URL visits and for `RequireAuth` redirects that include a `?next=` param. No changes to routing.

## Technical notes
- Use existing `Dialog`, `Input`, `Label`, `Button` from `@/components/ui/*`.
- Reuse `useAuth`, `toast`, and the zod schema pattern from `SignIn.tsx` (duplicated locally — small and keeps the page self-contained).
- All styling via existing semantic tokens (`bg-paper`, `text-ink`, `hairline`, `shadow-paper`, `editorial-display`, `font-serif`) — no new color literals.
- No backend or auth-logic changes.

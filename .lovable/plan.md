# Simplify Dashboard & Re-look User Flows

## Why

Today's Dashboard does five jobs at once (greeting, metrics, checklist, three quick-start cards, hero + 4-up recents, activity feed). It reads as a directory, not a place to act. And several flows leak: `/app/new` lives outside the shell with its own header, Templates is a dead-end gallery, and "Recent" appears in three places (sidebar, dashboard hero, dashboard secondary grid).

This pass cuts the Dashboard to **one decision and three glances**, and makes the create flow feel like one continuous app.

---

## 1. Dashboard — simpler, calmer

```text
┌──────────────────────────────────────────────────────┐
│  Studio · Thursday, 14 May                           │  ← eyebrow
│                                                      │
│  Good afternoon, Maya.                               │  ← serif, smaller (was huge)
│  Three drafts underway.                              │  ← single italic line
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  + New video        ⌘N      [Use a template →] │  │  ← single primary action row
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Continue                                  All →     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                         │  ← 4 equal thumbnails
│  │    │ │    │ │    │ │    │                         │
│  └────┘ └────┘ └────┘ └────┘                         │
│                                                      │
│  Recently                                  Log →     │
│  · created "The Async Advantage"   2h                │  ← max 4 lines
│  · regenerated slide 3             3h                │
└──────────────────────────────────────────────────────┘
```

**Removed**
- Three "Begin a draft" cards (paste / template / voice idea) — redundant with the single CTA row and with the New-video screen itself.
- Asymmetric 1-hero-+-4 thumbnails grid → flat 4-up of equal cards.
- Three-column numbered checklist → folded into a one-line ribbon under the lede *only when nothing is done yet* (e.g. "Next: pick a brand color · skip"). Disappears for good once dismissed or completed.
- "Minutes generated" metric (not meaningful for a mocked app). Keep "Videos · Slides" only, and only if > 0.

**Kept, simpler**
- Editorial header with eyebrow + greeting + one-line lede.
- Continue (max 4) and Recently (max 4). Both have a quiet "→" link to their full page.

**Empty state** stays the editorial illustration, but with a single CTA ("Start your first video") — no secondary "Browse templates" button on the empty state, since templates appear inside the New-video screen.

---

## 2. Create-video flow — bring it inside the shell

Today: clicking **+ New video** jumps to `/app/new`, which renders its *own* `<header>` with Wordmark and a "Step 1 of 2 — Setup" eyebrow. The sidebar disappears. It feels like a different app.

Change:
- `/app/new` renders **inside `AppShell`** (remove from `fullBleed` allow-list; remove its internal Wordmark header).
- Topbar shows breadcrumb `Studio › New video` + a quiet `Skip with sample` link on the right.
- Step indicator collapses to a small "Setup → Generate → Edit" hairline progress in the topbar (3 dots, current one filled).
- Page body keeps its two-column layout (Source / Look + Voice) but loses its own page chrome.
- `/app/generating` and `/app/editor/:id` stay full-bleed — they're focus modes.

Net: one continuous shell from Dashboard → Setup, then a deliberate handoff into the focus modes.

---

## 3. Templates — make it a launch pad, not a gallery

Today Templates is a browse page that ends in… nothing actionable beyond "use this template" which then jumps to a fresh New-video screen. The intent is right but the path is long.

Change:
- Templates page keeps the editorial grid, but each card's primary action is **"Start with this →"** which navigates to `/app/new?template=<id>` and pre-selects it (theme + sample text from `seedTemplates.ts`).
- Add a **"Use a template"** secondary button on the New-video screen that opens a lightweight popover with the same templates inline, so users don't have to leave Setup to browse.
- Remove Templates from the sidebar primary nav and put it under the New-video CTA group instead? **No** — keep in sidebar (templates are a discovery surface). But demote slightly: it sits below History.

---

## 4. Sidebar — tighten the duplication

- "Recent" in the sidebar stays (3 items, quick jumps from anywhere).
- Dashboard's "Continue" stays (4 items, with thumbnails). They serve different jobs (nav vs. browse).
- Move the standalone **Search** sidebar item into the topbar `⌘K` chip only — it's already there. Saves one row in the sidebar.
- Footer account tile: keep, but the dropdown loses **Brand kit** (it's already in the nav) and gains **Keyboard shortcuts** (opens a small dialog).

---

## 5. History on Dashboard

- Cap at 4 lines (was 6).
- Keep the hairline divider list — already quiet enough.
- "Full history" link → "Log →" to match the calmer tone.

---

## 6. Out of scope

- No new pages or features.
- No changes to the editor, generating screen, brand kit, or settings beyond removing the Brand-kit dropdown item.
- No backend / persistence changes.
- Auth screens untouched.

---

## Files to touch

- **Edit** `src/pages/app/Dashboard.tsx` — remove "Begin a draft" section, flatten "Continue editing" grid, collapse checklist to one-line ribbon, drop "Minutes generated", trim activity to 4.
- **Edit** `src/components/app-shell/AppShell.tsx` — remove `/app/new` from `fullBleed`; remove the standalone Search row from sidebar; remove Brand kit from account dropdown; add Keyboard-shortcuts item; add 3-dot setup→generate→edit progress component for the topbar (only mounts on `/app/new`).
- **Edit** `src/pages/prototype/InputScreen.tsx` — drop its internal `<header>` (Wordmark + "Step 1 of 2"); rely on the shell's topbar; keep the rest.
- **Edit** `src/pages/app/Templates.tsx` — change card CTA to "Start with this →" routed to `/app/new?template=<id>`; read `?template=` in `InputScreen` to preselect theme/sample.
- **Edit** `src/lib/data/seedTemplates.ts` — minor: ensure each template has a `themeId` + sample-text reference for preselection (verify, no schema change).

No new components, no new dependencies.

---

## Acceptance checks

1. Dashboard fits above the fold at 1280×800 with no scroll for empty + populated states (one-screen rule).
2. Clicking **+ New video** keeps the sidebar visible; breadcrumb shows `Studio › New video`.
3. Clicking a template → lands in Setup with that template's theme already selected and source text prefilled.
4. Sidebar has exactly: New video · Dashboard · Library · History · Templates · Brand kit · Recent (3) · Account.
5. "Continue" and "Recently" on Dashboard never exceed 4 items each.

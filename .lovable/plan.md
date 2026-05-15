## Goal

Replace `/mnt/documents/DESIGN_SYSTEM.md` with a doc that is a **faithful reverse-engineering of the current code** — no aspirational tokens, no fonts/components/patterns that don't exist in the repo. A developer (or Claude Code) following the new doc should rebuild a UI that matches what's shipped today.

## Method

1. Read the source-of-truth files end-to-end and extract only what's actually used:
   - `src/index.css` — every CSS variable, every utility class (`.bg-paper`, `.hairline`, `.shadow-paper`, `.editorial-display`, `.underline-grow`, `.tnum`, `.no-scrollbar`), font stacks, shadow recipes.
   - `tailwind.config.ts` — color mapping, font families, radius scale, shadow aliases (`shadow-paper`, `premium-*`, `primary-glow`), gradients, keyframes & animations.
   - `src/lib/prototype/themes.ts` — the actual slide theme palette (themeId list, accents, fonts).
   - `src/components/ui/button.tsx` + other shadcn primitives — real variants, not invented "premium" CVA.
   - `src/components/app-shell/AppShell.tsx` — sidebar/topbar structure, breadcrumb ("Library"), spacing.
   - `src/pages/prototype/InputScreen.tsx`, `EditorScreen.tsx`, `GeneratingScreen.tsx`, `src/pages/app/{Dashboard,Library,Templates,History,Brand,Settings}.tsx` — real screen patterns.
   - `src/components/prototype/SlideView.tsx`, `SlideThumbnail.tsx`, `editorial/*`, `empty/EmptyState.tsx` — composition patterns.

2. For each section of the doc, cite the file/line range it came from so it's auditable.

3. Drop anything from the previous doc that wasn't backed by code (e.g. invented CVA "premium" button variant, fonts/animations not actually wired, tokens we don't reference).

## New doc structure

```text
1. Overview            — “Premium Light, paper aesthetic, forest-green primary”. One paragraph.
2. Foundations
   2.1 Color tokens    — verbatim from index.css (HSL triplets, light + dark mirror)
   2.2 Typography      — actual 4 families + .editorial-display, .tnum, font-feature-settings
   2.3 Radius          — --radius 0.75rem and the sm/md/lg/xl/2xl scale
   2.4 Shadows         — premium-sm…2xl, shadow-paper, shadow-paper-hover, glows
   2.5 Gradients       — gradient-primary/secondary/subtle
   2.6 Custom utilities — .bg-paper (with the exact SVG noise), .hairline, .underline-grow, .no-scrollbar, .editorial-display
3. Tailwind config     — the real extend block, copy-paste ready
4. Slide themes        — exported THEMES from themes.ts (id, name, bg, text, accent, fonts)
5. Component patterns (only what exists)
   5.1 Button (shadcn variants actually defined)
   5.2 Card (shadcn — paper-lifted via shadow-paper utility, not a custom variant)
   5.3 Input / Textarea / Tabs / Select — shadcn defaults
   5.4 AppShell (sidebar + topbar + breadcrumb)
   5.5 EditorialHeader / MetricRow / EmptyState / SlideThumbnail
6. Screen blueprints   — short ASCII layout for InputScreen, Editor, Library, Dashboard
7. Motion              — only the animations declared in tailwind.config.ts
8. Accessibility & responsive notes — what the code actually does (light-only, .dark mirrors light)
9. Claude Code rebuild prompt — concise, references this doc, no invented APIs
```

## What gets removed vs. previous doc

- Invented `buttonVariants` "premium" CVA → replaced with the real shadcn variants.
- Any color/animation/utility not present in `index.css` or `tailwind.config.ts`.
- Generic "design philosophy" filler that doesn't translate to code.

## Out of scope

- No code changes to the project. Doc-only rewrite at `/mnt/documents/DESIGN_SYSTEM.md` (versioned as `_v2`).
- No new screens, no refactor of components.

## Deliverable

`/mnt/documents/DESIGN_SYSTEM_v2.md` (keeps v1 for comparison) plus a one-line summary in chat of what changed.

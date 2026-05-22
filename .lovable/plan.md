## Scope

Tighten the FrameFlow landing page by stripping non-essential CTAs and editorial scaffolding. Pure presentation — no routing or logic changes.

## Changes

### 1. `src/components/marketing/Masthead.tsx`
- Remove the "Start free" button (signed-out state).
- Keep only the **Sign in** link as the right-side action.
- Signed-in "Open Studio" button: keep as-is.
- Nav (How it works / Themes / Demo) and wordmark: keep.

### 2. `src/components/marketing/MagazineHero.tsx`
- Remove the entire issue-eyebrow strip at the top ("Issue Nº 01 — FrameFlow Quarterly · MAY · MMXXVI · Vol. I · The Studio" + its underline rule).
- Page now opens directly on the "Words become watchable." headline.
- Remove the two hero CTAs ("Start free", "Watch the 30s reel") below the lede paragraph. Lede paragraph stays.
- Remove the right-column "In this issue" table-of-contents block.
- Remove the bottom "↓ Turn the page · 01 / 04" rule.

### 3. `src/components/marketing/ThemeGallery.tsx`
- Editor's Note pull-quote: replace the two-line copy `"Design is our / only moat."` with `Crafted with ♥ in-house` (using the ❤ heart emoji). Keep typography, layout, and the "¶ Editor's Note" eyebrow.
- Remove the "— Internal memo, week one" attribution line beneath the quote.

### 4. `src/components/marketing/Colophon.tsx`
- Remove the **Product**, **Studio**, and **Colophon** column blocks.
- Remove the "Start free / Open Studio" CTA link under the wordmark+lede.
- Keep: left wordmark + serif italic lede, the oversized bleeding "FrameFlow." mark, and the bottom rule (`Vol. I · Issue Nº 01` / `End of issue —`).
- Collapse the 12-col grid down to a single left-aligned block.

## Out of scope

No changes to `Landing.tsx`, `DemoMarquee`, `HowItWorks`, routing, tokens, or anything else.

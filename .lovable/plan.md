
# 15 New Education-Focused Slide Layouts

The deck currently has 17 layouts (title, bullets, quadrant, comparison, image-bg-overlay, etc.) but they skew toward generic business slides. For teaching MBA/MCA/BBA/BCom/MCom/MA/BA video content we need layouts that handle definitions, formulas, processes, case studies, Q&A, citations, examples — and that look visually distinct from each other so a long lecture doesn't feel monotonous.

## The 15 new layouts

Each is a new `LayoutId` rendered in `SlideView.tsx`, with sample variants in `slideVariants.ts` and a chat trigger in `aiChat.ts`.

1. **`definition-card`** — "Term + Definition" hero card. Big term on left in a colored block, definition + etymology/source on right. For "What is Opportunity Cost?", "Define Marginal Utility".
   Fields: `term`, `body`, `caption` (source).

2. **`formula`** — Centered LaTeX-style formula in a framed card with a label above ("Compound Interest") and a one-line plain-language explanation below. Supports `formula` (string), `title`, `body`.
   Fields: `title`, `formula`, `body`.

3. **`worked-example`** — Three numbered steps stacked vertically with a "Problem" header strip and "Answer" footer strip. Each step: short label + line of math/text. For solving a problem on stage.
   Fields: `title` (problem), `bullets` (steps), `body` (final answer).

4. **`learning-objectives`** — "By the end of this lesson you'll be able to…" header with 3–5 checklist items in pill rows, each with a small numbered badge. Distinct from regular bullets — uses pills + accent.
   Fields: `title`, `bullets`.

5. **`key-terms`** — Glossary grid: 4–6 small cards each with `term` (bold) and short definition. Two-column responsive grid. For vocabulary recap slides.
   Fields: `title`, `bullets` (each item parsed `term — definition`), or dedicated `terms` array (we'll reuse bullets with a separator).

6. **`process-flow`** — Horizontal arrow flow with 3–5 numbered nodes (circle + label + 1-line body underneath). Bigger and more visual than the existing bullet "process" variant — this is a full-slide diagram, not a list.
   Fields: `title`, `bullets`.

7. **`timeline`** — Horizontal timeline with 4–6 dated events (year/era + label + short body below the line). For history slides (Renaissance → Industrial Revolution → Information Age) or course roadmaps.
   Fields: `title`, `bullets` (each `year | label | body`).

8. **`pyramid`** — Stacked horizontal bands forming a pyramid (base widest). 3–5 levels, each with label inside and optional small body to the side. For Maslow, Bloom's Taxonomy, AIDA.
   Fields: `title`, `bullets` (top→bottom).

9. **`cycle`** — Circular flow with 4–6 nodes around a circle, arrows between them, central label in the middle. For PDCA, accounting cycle, marketing funnel loop.
   Fields: `title`, `bullets`, `body` (center label).

10. **`case-study`** — Magazine-style: large image on the left (full-height), right side has "CASE STUDY" eyebrow, company/scenario title, 3 short stat chips (e.g. "Revenue +42%", "12 months", "₹120 Cr"), and a body paragraph.
    Fields: `title`, `body`, `imageUrl`, `bullets` (used as stat chips), `caption` (eyebrow).

11. **`question-prompt`** — Centered large "?" iconography with a thought-provoking question in oversized type and 2–3 prompt sub-questions below. For sparking discussion or pause-points in video.
    Fields: `title` (main question), `bullets` (sub-prompts).

12. **`qa-recap`** — Q/A pairs (2–4) styled as alternating left/right speech-style blocks with "Q" and "A" badges. For revision slides.
    Fields: `title`, `bullets` (alternating Q and A lines).

13. **`pros-cons`** — Two columns with green "Pros / Advantages" header and red "Cons / Disadvantages" header, check/cross icons on each row. Distinct from `comparison` (which is neutral helpful/harmful headers and bodies, not lists).
    Fields: `title`, `leftBody` (pros, newline-separated) or `bullets` split, `rightBody` (cons).

14. **`chart-explainer`** — Left side: a simple SVG bar/line chart (data baked into content — `chartType: "bar"|"line"`, `chartData: [{label, value}]`). Right side: title + 2–3 takeaway bullets. For showing GDP trends, market share, survey results.
    Fields: `title`, `bullets`, `chartType`, `chartData`.

15. **`citation-quote`** — Large pull-quote with quotation mark glyph, attribution block below (name, role, source). For citing Drucker, Kotler, Keynes etc. Distinct from `divider` — this is a full content slide with author photo (optional).
    Fields: `body` (quote), `caption` (author + source), `imageUrl` (optional author photo).

## Type system additions

In `types.ts`:
- Extend `LayoutId` union with the 15 new IDs.
- Add to `SlideContent`:
  - `term?: string` (definition-card)
  - `formula?: string` (formula)
  - `chartType?: "bar" | "line"`
  - `chartData?: { label: string; value: number }[]`
- No new `SlideStyle` fields needed — existing color/align/size controls are reused.

## Rendering (`SlideView.tsx`)

Add one rendering branch per layout. Visual distinctness is the goal — use:
- Different background treatments (gradient strips for `learning-objectives`, framed card for `formula`, full-bleed image for `case-study`).
- Theme accent color used differently per layout (left bar in `definition-card`, node fills in `process-flow`, pyramid bands).
- All elements remain `Selectable` with stable `elKey`s so the existing `VoiceoverPanel` editor works without changes (keys: `term`, `formula`, `bullet:N`, `body`, `caption`, `image`).

For `process-flow`, `timeline`, `pyramid`, `cycle`, `chart-explainer`: render with inline SVG (no new deps). The `cycle` uses `transform: rotate` to position nodes around a circle. The chart is a small custom SVG (no recharts) sized to its panel.

## Sample data

Update `sampleDeck.ts`: keep the SWOT deck but append 3–4 demo slides showing the new layouts (e.g. one `formula` for compound interest, one `timeline` for management theory eras, one `case-study`, one `learning-objectives`) so users can see them on first load. Also extend `SAMPLE_TEXT` slightly.

Add education-themed seed content to `slideVariants.ts` so "Regenerate slide" can produce these layouts. Each new layout gets 1–2 variant entries with MBA/teaching content (e.g. `formula` → Compound Interest, NPV; `pyramid` → Maslow's Hierarchy, Bloom's Taxonomy).

Extend `ALL_LAYOUTS` array in `slideVariants.ts` with the 15 new IDs.

## Editor integration

- `EditorScreen.tsx`: append the 15 new layouts to the Layout dropdown, grouped under an "Education" subheading (visual separator only).
- `StyleControls.tsx`: no new controls needed — existing text size/align/color, image shape/treatment, bullet variants all still apply.
- `aiChat.ts`: add intent matchers so commands like "make this a formula slide", "show as timeline", "convert to pyramid", "turn into case study", "show pros and cons", "make a learning objectives slide" switch the slide layout (and seed sensible defaults if fields are empty).

## Files touched

- Edit `src/lib/prototype/types.ts` — 15 new layout IDs, 4 new content fields.
- Edit `src/components/prototype/SlideView.tsx` — 15 new render branches (~400 lines).
- Edit `src/lib/prototype/slideVariants.ts` — variants + extend ALL_LAYOUTS.
- Edit `src/lib/prototype/sampleDeck.ts` — append demo slides + small SAMPLE_TEXT update.
- Edit `src/pages/prototype/EditorScreen.tsx` — extend layout dropdown.
- Edit `src/lib/prototype/aiChat.ts` — new intent triggers.

No new dependencies. No backend.

## Out of scope

- LaTeX rendering engine (KaTeX/MathJax) — formulas use plain text in a styled monospace frame. Can be added later.
- Interactive chart editing — `chart-explainer` data is edited as JSON via a small textarea in the element editor (or via chat). No drag handles.
- Animated transitions between cycle/timeline nodes.
- Per-pyramid-band individual color pickers (uses theme accent gradient).


# More image-rich slides + SWOT sample deck

Two parts:
1. Add new layouts that combine images and text in different ways (right now only `image-left/right/full/grid` exist and the deck barely uses them).
2. Replace the sample deck with a SWOT Analysis deck built from the provided learning content, using a healthy mix of text, image, and image+text layouts.

## Part 1 — New slide layouts

Add these layout IDs to `LayoutId` in `types.ts` and render them in `SlideView.tsx`:

- **`image-bg-overlay`** — Full-bleed image background with a translucent dark/accent overlay; centered title + body on top. Different from `image-full` (which puts text bottom-left over a gradient) — this one is a true centered hero card with adjustable overlay tint.
- **`image-text-overlay`** — Full-bleed image with a solid color text card (≈45% width) docked on the left or right, like a magazine pull-quote. Holds title + body.
- **`quadrant`** — 2×2 colored cells, each with a small icon/label and short body. Designed for SWOT (S/W/O/T) but reusable for any 4-box framework. Per-cell: `q1Title/q1Body … q4Title/q4Body`, with theme-tinted cell backgrounds (accent, accent-soft, neutral, etc.).
- **`comparison`** — Two stacked or side-by-side panels with a header strip ("Helpful" vs "Harmful", or "Before" vs "After"). Uses `leftTitle/leftBody/rightTitle/rightBody` plus a top `title`. Visually distinct from `two-column` (which is plain divider columns) — this one has colored header bars.
- **`image-bullets`** — Image on one side (left or right via style), bullets on the other. Bullets honor the existing `bulletVariant`. Fields: `title`, `bullets`, `imageUrl`.
- **`stat-image`** — Big stat on one side, supporting image on the other. Fields: `stat`, `statLabel`, `imageUrl`.
- **`section-image-bg`** — Section divider with a background image and a tinted accent overlay (replaces flat-color `divider` for chapter breaks).

New optional content fields in `SlideContent` (`types.ts`):
`q1Title, q1Body, q2Title, q2Body, q3Title, q3Body, q4Title, q4Body` (quadrant), and reuse existing `title/body/bullets/imageUrl/leftTitle/...`.

New optional style fields in `SlideStyle`:
- `overlayTint?: "dark" | "light" | "accent"` and `overlayStrength?: "soft" | "medium" | "strong"` (for `image-bg-overlay` / `section-image-bg`).
- `textCardSide?: "left" | "right"` (for `image-text-overlay`).
- `imageSide?: "left" | "right"` (for `image-bullets` / `stat-image`).
- `quadrantPalette?: "swot" | "neutral" | "accent"` (for `quadrant`).

Element selection keys for the new layouts: `q1Title, q1Body, q2Title, q2Body, q3Title, q3Body, q4Title, q4Body`, plus existing `image`, `title`, `body`, `bullets`, `stat`, `statLabel`, `leftTitle`, etc., so they slot into the existing `VoiceoverPanel` element editor with no panel changes (the panel already routes by key prefix).

Layout dropdown in `EditorScreen.tsx`: append the 7 new layouts so users can switch any slide to them.

`slideVariants.ts`: add a couple of `TEXT_VARIANTS` entries for each new layout so "Regenerate slide" can emit them. `ALL_LAYOUTS` extended.

`StyleControls.tsx`: add minimal controls for the new style fields when the relevant element is selected — overlay tint/strength chips on `image` (only when layout is bg-overlay-ish), card-side toggle on `image` for `image-text-overlay`, palette chips when layout is `quadrant` (shown on any quadrant cell selection).

## Part 2 — SWOT sample deck

Replace `SAMPLE_DECK` and `SAMPLE_TEXT` in `sampleDeck.ts` with a ~14-slide SWOT Analysis deck using the supplied learning content. Layout mix is intentionally varied:

```
 1. title                  — "SWOT Analysis" + "A practical guide to strategic thinking"
 2. image-bg-overlay       — "What is SWOT?" definition over a strategy/whiteboard image
 3. quadrant (swot palette)— S / W / O / T four-box, internal vs external
 4. image-text-overlay     — "Strengths" with internal-advantages body, photo on right
 5. image-bullets          — "Weaknesses" with examples list (variant: checklist), image left
 6. image-right            — "Opportunities" with body + market-growth image
 7. image-bullets          — "Threats" examples (variant: cards), image right
 8. comparison             — "Helpful vs Harmful" matrix recap
 9. section-image-bg       — "How to conduct a SWOT" chapter break, image background
10. bullets (numbered)     — 5 steps: Define / Gather / List / Prioritize / Build strategy
11. quadrant (accent palette)— SO / WO / ST / WT strategy combinations
12. stat-image             — "2.4x" higher strategic alignment, supporting photo
13. two-column             — Advantages vs Limitations
14. image-full             — Closing: "SWOT is not the output. The value is in the decisions."
```

Each slide gets a script line drawn from the source material (concise, narration-friendly). All quadrant cells, bullets, and bodies are filled with the actual SWOT content from the user's brief (definitions, the four key tests, the SO/WO/ST/WT examples, the online-education example for the stat slide context).

`SAMPLE_TEXT` becomes a condensed prose version of the SWOT learning material so the input screen still has a meaningful seed.

## Files touched

- Edit: `src/lib/prototype/types.ts` (new layout IDs, new content + style fields)
- Edit: `src/components/prototype/SlideView.tsx` (render the 7 new layouts, overlay/card-side/quadrant logic)
- Edit: `src/lib/prototype/sampleDeck.ts` (full SWOT deck + new SAMPLE_TEXT)
- Edit: `src/lib/prototype/slideVariants.ts` (variants for new layouts, extend ALL_LAYOUTS)
- Edit: `src/components/prototype/StyleControls.tsx` (new chips for overlay, card side, quadrant palette)
- Edit: `src/pages/prototype/EditorScreen.tsx` (layout dropdown options)
- Edit: `src/lib/prototype/aiChat.ts` (recognize "make it a quadrant", "image background", "swap image side" intents → mutate layout/style)

No new dependencies. No backend.

## Out of scope

- Real icon library inside quadrant cells (use simple letter badges S/W/O/T).
- Drag-to-reposition of the text card in `image-text-overlay` (toggle only).
- Per-quadrant individual color pickers (palette presets only).

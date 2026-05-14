## Goal

Fix the broken-feeling New Video screen (`/app/new`). Today the left column is a single short Script card while the right column stacks three tall cards (Visual style, Motion, Voice over), creating a long scroll and visually unbalanced layout. The redesign keeps a two-column structure but compresses everything so all inputs are visible in the first fold on a typical laptop (≈1024×700 and up).

## Layout

Two equal columns under a shrunken hero. The hero (title input + helper line) becomes one tight row instead of a 200px section. The sticky generate bar stays at the bottom.

```text
┌─────────────────────────────────────────────────────────────┐
│  New video · [Untitled video__________________]  ⌘↵ generate │  (one row, ~64px)
├──────────────────────────────┬──────────────────────────────┤
│  SCRIPT                      │  STYLE   [swatch row →]      │
│  [paste | upload | audio]    │  MOTION  [○ ○ ● ○]           │
│                              │  VOICE   [avatar ▾] pace tone│
│  ┌────────────────────────┐  │                              │
│  │  textarea / dropzone   │  │  (each row ~72px, no cards   │
│  │                        │  │   stacked — single grouped   │
│  │                        │  │   panel with hairline rows)  │
│  └────────────────────────┘  │                              │
│  word/scene meter            │                              │
└──────────────────────────────┴──────────────────────────────┘
[ sticky bottom bar: meter · ⌘↵ · Generate video → ]
```

Both columns share the same height (`grid-cols-2` with `items-stretch`). Right column becomes one container with three hairline-divided rows instead of three separate Cards.

## Changes per section

### Hero (top of `InputScreen.tsx`)
- Replace the 5xl serif title block + serif tagline with a single 28px input row plus a small "New video" eyebrow on the same line.
- Drop ~140px of vertical space.

### Left column — Script (only thing kept "as is" conceptually)
- Keep the paste/upload/audio tabs, but reduce the textarea min-height from `280px` to a flexible `min-h-0` that fills available column height (`flex-1`), so it grows to match the right column.
- Move the "Use sample (SWOT)" pill into the bottom hairline row of the card so it doesn't add vertical space.
- Word/scene meter stays inside the card footer (already there).

### Right column — Style, Motion, Voice (compressed)
Replace three stacked Cards with a single Card containing three hairline-separated rows. Each row is ~one-third of the right column height.

1. **Visual style row**
   - Eyebrow on left: `STYLE`.
   - Horizontal scrollable swatch strip of theme thumbnails (square, ~56×42 each) with name on hover. Selected theme gets the primary ring.
   - Trailing button: small "Upload template" icon button (custom template). Selected custom template shows as a chip; remove on click.
   - Removes: large 3-column theme grid, full-width "Upload your own template" panel.

2. **Motion row**
   - Eyebrow on left: `MOTION`.
   - 4 inline chips: Subtle · Dynamic · Dramatic · Cinematic. Selected chip filled. Tiny dot + one-word descriptor under each chip.
   - Removes: animated 2×2 preview grid (keep its concept as a tooltip on hover instead).

3. **Voice row**
   - Eyebrow on left: `VOICE`.
   - AI/Recording segmented toggle (compact, 28px tall).
   - When AI: voice avatar + dropdown to pick from the 6 voices (replaces 2×2 voice grid). Inline play/pause button next to the avatar.
   - Pace and Tone become two small segmented controls on the same row (right-aligned).
   - When Recording: replace dropzone with a single 56px row "Upload your voice over (.mp3, .wav)" + filename chip on success.
   - Removes: large 2×2 voice grid, the language helper line (move to a tooltip on the language icon).

### Sticky bottom bar
- Unchanged in structure, but tighter padding (`py-2`) so it doesn't eat into the fold.

### Removed entirely
- Step dots in the topbar (`StepDots`) — already redundant now that the screen is one fold.
- The big "Use sample (SWOT)" pill becomes a small text link in the script footer.

## Behavior / state
- All existing state (`themeId`, `voice`, `voiceMode`, `motion`, `pace`, `tone`, `customTemplate`, `uploadedDoc`, `uploadedAudioScript`, `uploadedVoice`) stays intact — only the presentation changes. No store or type changes.
- Defaults remain the same (Dynamic motion, Warm tone, Normal pace, first theme, first AI voice).
- Cmd/Ctrl+Enter still triggers `onGenerate`.

## Responsive
- ≥1024px: two equal columns as described, fits the first fold.
- 768–1024px: same two columns but right rows allowed to wrap chips to two lines.
- <768px: stack to single column (script first, then a single right-rail-style settings card). Scroll allowed on mobile only.

## Out of scope
- No changes to the editor, generating page, or routing.
- No data/store changes.
- No changes to other screens (Dashboard, Library, Templates, History).

## Files touched
- `src/pages/prototype/InputScreen.tsx` — full structural rewrite of the JSX inside `InputScreen`. Helpers (`Eyebrow`, `voiceGradient`, `MotionPreview`, `StepDots`) get pruned/inlined as needed; `MotionPreview` becomes optional (used in tooltip only) and `StepDots` is removed.

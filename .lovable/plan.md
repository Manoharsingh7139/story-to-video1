# Redesign: New Video page → "Studio Workbench"

Rebuild `/app/new` (`src/pages/prototype/InputScreen.tsx` and the surrounding shell) into a light-mode, editorial split-canvas experience matching the selected prototype.

## Design tokens (locked)

- **Palette**: cream `#f5f0e0` (page), warm off-white `#e8e4dd` (panels), deep emerald `#0d7a5f` (primary/ink), gold `#c9a84c` (accent), slate ink for body copy. Light mode only.
- **Type**: `Instrument Serif` (italic display) + `Work Sans` (UI/body). Installed via `@fontsource/instrument-serif` and `@fontsource/work-sans`; imported in `src/main.tsx`; wired into `tailwind.config.ts` as `font-display` / `font-sans`.
- Tokens registered as HSL CSS variables in `src/index.css` (e.g. `--canvas`, `--panel`, `--ink`, `--emerald`, `--gold`) plus Tailwind theme extension — no hard-coded hex in components.

## Layout

```text
┌─ AppShell (existing sidebar) ──────────────────────────────┐
│ ┌─ Hero header ────────────────────────────────────────┐   │
│ │ breadcrumb · eyebrow "NEW VIDEO" · italic serif H1   │   │
│ └──────────────────────────────────────────────────────┘   │
│ ┌────── Script (60%) ──────┐ ┌─── Studio rail (40%) ───┐   │
│ │ tabs (Paste/Doc/Audio)   │ │ Visual Style (3 cards)  │   │
│ │ big serif-tinted editor  │ │ Motion (2×2 tiles)      │   │
│ │ sample chip · char count │ │ Voice card (toggle,     │   │
│ │                          │ │  select, pace, tone)    │   │
│ └──────────────────────────┘ └─────────────────────────┘   │
│ ┌─ Sticky action bar (blurred cream) ──────────────────┐   │
│ │ Words · Scenes · Runtime      [ Generate Video → ]   │   │
│ └──────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

## Component work

1. **`src/pages/prototype/InputScreen.tsx`** — full rebuild to the split-canvas structure. Preserves all current functionality: editable title, breadcrumb, Paste/Document/Audio tabs, textarea + word/scene/runtime counters, sample loader, style/motion/voice state, `Generate` CTA (⌘↩ shortcut kept).
2. **New sub-components** under `src/components/prototype/input/`:
   - `HeroHeader.tsx` — eyebrow + breadcrumb + inline-editable serif title with gold focus underline.
   - `ScriptPanel.tsx` — tabs with gold sweep underline, cream/paper textarea, sample chip, char counter.
   - `StyleTemplateGrid.tsx` — 3 aspect-4/5 cards; hover scales background image, gold border on hover, emerald ring on selected.
   - `MotionPresetGrid.tsx` — 2×2 tiles with dot indicator; selected = emerald border, hover = gold border + micro-lift.
   - `VoiceCard.tsx` — segmented AI/My recording toggle, custom select, Pace/Tone sliders with emerald/gold accents, inline preview button.
   - `ActionBar.tsx` — sticky bottom, cream `backdrop-blur`, metric columns + primary CTA with animated emerald gradient sweep.
3. **`src/components/app-shell/AppShell.tsx`** — no structural change; verify the shell background does not fight the new cream canvas (make the main pane transparent so the page owns the canvas color).
4. **Micro-interactions** (Tailwind + a small amount of Framer Motion already in project):
   - Tab active underline sweeps from left with `transition-transform`.
   - Style/motion cards: `hover:-translate-y-0.5` + shadow bloom; selected state shows a tiny animated "playing" preview (subtle bars / drifting lines) so the user can feel the difference.
   - CTA: gradient sweep + arrow nudge; press = scale 0.98 spring.
   - Sample chip pulses a gold dot until first interaction, then fades.
5. **Empty & sample states** — when the textarea is empty, show a soft italic serif placeholder plus the sample chip anchored bottom-left of the paper; once user types, chip fades out.

## Fonts + tokens setup

- `bun add @fontsource/instrument-serif @fontsource/work-sans`
- Import both in `src/main.tsx`.
- Extend `tailwind.config.ts`:
  ```ts
  fontFamily: {
    sans: ['"Work Sans"', ...],
    display: ['"Instrument Serif"', 'serif'],
  }
  ```
- Add semantic HSL tokens to `:root` in `src/index.css` for `canvas`, `panel`, `ink`, `ink-muted`, `emerald`, `emerald-deep`, `gold`, `gold-soft`, `paper`; wire into `tailwind.config.ts` `colors`.

## Out of scope

- Dark mode (explicitly deferred).
- Slide editor side panel (already redesigned in prior turns).
- Any backend/data changes — visual + interaction only.

## Verification

- `bun run build` clean.
- Playwright screenshot of `/app/new` at 1440×900 to confirm parity with the selected prototype.
- Keyboard: Tab order through Script → Style → Motion → Voice → Generate; ⌘↩ still fires generate.

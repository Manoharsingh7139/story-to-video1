# Content Studio — "Soft-tech optimism" rebrand

A complete visual rework that keeps the app calm and human, but adds warmth, optimism, and software-grade precision. Light mode only. Warm neutrals (sand → stone → espresso) anchored by a single glowing **amber** accent. Display serif headlines paired with a clean neo-grotesk for everything else. Every detail — type, spacing, motion, focus rings, slide themes — touched.

## 1. Brand identity

- **Name:** Content Studio
- **Personality:** soft, optimistic, considered, software-y. Not blue. Not corporate. Not playful-cartoon.
- **Tagline:** "Where words become watchable."
- **Logo mark:** new SVG mark — a serif "Cs" monogram inside a softly rounded amber-to-sand square (4px radius), paired with a Fraunces wordmark "Content Studio". Standalone monogram available for favicon / tight UI. Replaces the current dot wordmark.
- **Favicon:** generated from the same monogram on amber bg.

## 2. Color system (light only, all HSL)

A warm neutral spine + one luminous accent.


| Token                    | HSL          | Hex     | Use                 |
| ------------------------ | ------------ | ------- | ------------------- |
| `--background`           | 38 33% 96%   | #F7F1E6 | Sand canvas         |
| `--foreground`           | 25 18% 14%   | #2A221C | Espresso ink        |
| `--card`                 | 36 40% 99%   | #FDFAF4 | Elevated paper      |
| `--card-foreground`      | 25 18% 14%   | —       | &nbsp;              |
| `--popover` / fg         | same as card | —       | &nbsp;              |
| `--muted`                | 36 22% 92%   | #EFE7DA | Hover, subtle fills |
| `--muted-foreground`     | 28 10% 38%   | #6A5F54 | Secondary text      |
| `--secondary`            | 36 22% 92%   | —       | Secondary buttons   |
| `--secondary-foreground` | 25 18% 14%   | —       | &nbsp;              |
| `--accent`               | 36 30% 88%   | #E8DDC9 | Ghost hover         |
| `--accent-foreground`    | 25 18% 14%   | —       | &nbsp;              |
| `--border`               | 32 18% 84%   | #DFD5C5 | Hairlines           |
| `--input`                | 32 18% 84%   | —       | &nbsp;              |
| `--ring`                 | 32 92% 50%   | #F08A0F | Amber focus ring    |
| `--primary`              | 25 18% 14%   | #2A221C | Ink primary         |
| `--primary-foreground`   | 38 33% 96%   | —       | &nbsp;              |
| `--destructive`          | 8 70% 48%    | #CF3F22 | Errors              |


Brand tokens (used directly via `brand-*` classes):

- `--brand` 32 92% 50% (#F08A0F) — amber, the single accent: CTAs, focus, brand mark, links, progress.
- `--brand-foreground` 25 18% 14% — ink text on amber.
- `--brand-soft` 36 96% 86% (#FBE3B6) — amber tint for highlights, badges, selected chip backgrounds.
- `--brand-2` 168 32% 32% (#3A6E61) — pine support (rare, for charts / success-ish secondary).
- `--brand-3` 14 36% 38% (#7B463A) — terracotta deep, supporting only.

`--radius` set to **0.5rem** (slightly softer than current 0.375 — matches "optimism"). `md`/`sm` follow.

Sidebar tokens realigned to the same paper/ink palette.

`.dark` block kept intact but unused (light only).

## 3. Typography

Google Fonts in `index.html` (replace current import):

- **Display / serif:** Fraunces (variable, opsz 9..144). Headings, slide titles, brand wordmark. Slight optical-size and tracking treatment (`-0.02em`).
- **UI / sans:** **Geist** (or Inter as fallback). 400/500/600. Geist gives the "soft-tech" feel; Inter remains in stack as fallback so nothing breaks if Geist fails to load.
- **Mono:** JetBrains Mono — eyebrow micro-labels, tabular figures.

Tailwind `fontFamily`:

```
display: ['Fraunces', 'Georgia', 'serif']
sans:    ['Geist', 'Inter', 'system-ui', 'sans-serif']
mono:    ['JetBrains Mono', 'ui-monospace', 'monospace']
```

Type roles:

- Hero H1: `font-display text-5xl md:text-6xl tracking-[-0.02em] leading-[1.02]`
- Section H2: `font-display text-2xl tracking-tight`
- Eyebrow: `font-mono uppercase text-[10.5px] tracking-[0.2em] text-muted-foreground`
- Body: `text-sm/[1.55]` default, `text-base` for editor content

## 4. Components

- **Button** (`button.tsx`):
  - `default` = ink bg / paper text, radius 0.5rem, 1px shadow, slight hover lift
  - `brand` = amber bg / ink text, hover deepens to 32 92% 44%, subtle inner highlight (`shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_0_rgba(0,0,0,0.06)]`)
  - `outline` = transparent + 1px border, hover muted
  - `ghost` = hover muted
  - `link` = amber with underline-offset
- **Card**: `bg-card` (paper-white) on sand bg, 1px border, `shadow-[0_1px_2px_rgba(42,34,28,0.04)]`, hover `shadow-md` + border darkens. Radius matches `--radius`.
- **Input / Textarea**: transparent bg, 1px `border-input`, focus → 2px amber ring with 2px offset; placeholder muted.
- **Chips / pills (voice, tone, pace)**: unselected = muted bg + ink text; selected = amber-soft bg + ink text + 1px `border-brand` (amber stays restrained — never full-saturation for chips).
- **Tabs (Source: paste/upload/audio)**: muted track, active tab = paper card with thin amber underline (2px) instead of full background swap.
- **Focus everywhere**: amber ring; never blue.

## 5. Slide themes (rebuilt to match brand)

Replace `THEME_LIST` to 3 truly distinct, tasteful options. `THEMES` map keeps legacy ids so saved decks still render.

1. **Studio** (default) — sand/ink/amber
  - bg #F7F1E6, surface #FDFAF4, text #2A221C, muted #6A5F54, accent #F08A0F, accentText #2A221C, head Fraunces, body Geist, radius 6px
2. **Editorial** — porcelain + deep terracotta, serif-heavy
  - bg #F4ECDF, surface #FBF5EA, text #1F140F, muted #7A6A55, accent #7B463A, accentText #F4ECDF, head Fraunces, body Geist, radius 2px
3. **Midnight** — warm noir for high-contrast variety
  - bg #16130F, surface #1F1B16, text #F2E9D8, muted #9A8E7C, accent #F0B458 (warm amber-gold), accentText #16130F, head Fraunces, body Geist, radius 4px

(Old `minimal`, `corporate`, `playful`, `darktech`, `warm`, `noir` ids retained in `THEMES` for back-compat; only `THEME_LIST` and the default `studio` show in pickers.)

## 6. Screens

- `**InputScreen.tsx**`
  - Header: new logo (monogram + Fraunces wordmark), step pill in mono.
  - Hero: smaller eyebrow ("New presentation"), refined H1 ("Where words become watchable."), inline-editable title in Fraunces 5xl with amber caret-style underline on focus, supporting copy in muted.
  - Source card: tabs restyled with amber underline; dropzones get a soft sand inner card and amber dashed border on hover; "Use sample" chip becomes amber-soft.
  - Look card: 3 themes, mini slide previews keep current proportions but get a subtle inner shadow + amber check on selected.
  - Voice section: voice gradients restrained to warm hues only (rebuild `voiceGradient` to stay within H 20–50, S 60%, L 70–82% — no more rainbow pastels). Selected voice gets amber-soft halo. Tone/pace chips per spec above.
  - Generate CTA: amber `brand` button, full-width on mobile, fixed bottom dock with `backdrop-blur` + sand gradient fade.
- `**GeneratingScreen.tsx**`
  - New mark with subtle pulse (amber dot orbits the monogram). Progress list gets amber tick on completed step, `bg-brand-soft` on current step. Refined H1 in Fraunces.
- `**EditorScreen.tsx**`
  - Top bar: new wordmark + monogram, project title input gets amber focus underline, Export button → `brand` variant.
  - Toolbar: layout/theme selects use `border-input` + amber focus ring; "X selected" pill switches from blue to `bg-brand-soft text-foreground border border-brand/30` (kills the blue residue).
  - Slide canvas wrapper: warmer shadow `shadow-[0_8px_30px_rgba(42,34,28,0.08)]`, rounded to match `--radius`.
- `**Index.tsx**`: stays a thin wrapper over InputScreen (no marketing page in this scope).
- `**NotFound.tsx**`: small re-skin to use new tokens + Wordmark.

## 7. Logo mark + favicon

- New `src/components/Wordmark.tsx`:
  - SVG monogram: rounded square (radius 4) filled `--brand`, ink "Cs" set in Fraunces 600 italic, slight optical centering.
  - Modes: `iconOnly`, `sm | md | lg`, optional `mono` (ink-on-paper) variant for dark surfaces.
- `public/favicon.svg`: same monogram exported as standalone SVG. `index.html` updated to reference it; old `favicon.ico` left in place as fallback.

## 8. Motion + micro-interactions

- All hover transitions normalized to `transition-[colors,box-shadow,transform] duration-200 ease-out`.
- CTAs lift `translate-y-[-1px]` on hover, settle on press.
- Cards fade-in on mount via existing `animate-in` utilities (already used) — kept, just retimed to 220ms, 60ms stagger.
- Generating screen amber dot uses a 1.6s breathing pulse (CSS keyframes added in `index.css`).

## 9. Files touched

Edit:

- `index.html` (fonts: Fraunces + Geist + JetBrains Mono; title/meta refresh; favicon link)
- `src/index.css` (all tokens + breathing keyframes + body font features)
- `tailwind.config.ts` (font stack: Geist primary; `brand-soft` color; keep brand-2/3)
- `src/components/ui/button.tsx` (refined `brand` variant + shadow)
- `src/components/ui/input.tsx`, `textarea.tsx` (focus ring tweak — minimal)
- `src/components/Wordmark.tsx` (rewrite to monogram + wordmark SVG)
- `src/lib/prototype/themes.ts` (new Studio/Editorial/Midnight; updated `THEME_LIST`)
- `src/lib/prototype/store.ts` (default `themeId` = `"studio"` — already is, verify)
- `src/pages/prototype/InputScreen.tsx` (header, hero, tabs, dropzones, voice palette, chips, CTA dock)
- `src/pages/prototype/GeneratingScreen.tsx` (mark, pulse, list styling)
- `src/pages/prototype/EditorScreen.tsx` (header, "selected" pill blue → amber-soft, export CTA, canvas shadow)
- `src/pages/NotFound.tsx` (token cleanup + wordmark)
- `README.md` (name + tagline)

Create:

- `public/favicon.svg`

## 10. Out of scope

- No dark-mode toggle (light only).
- No marketing/landing page (would be the "Everything incl. marketing" tier).
- No changes to slide layout logic, sample SWOT content, voice list, AI chat, or store data shape.
- No route changes; existing saved decks keep rendering via legacy theme ids.

## Palette quick reference

```text
sand   #F7F1E6   paper  #FDFAF4   muted  #EFE7DA   border #DFD5C5
ink    #2A221C   sub    #6A5F54
amber  #F08A0F   amber-soft #FBE3B6
pine   #3A6E61   terracotta #7B463A
midnight bg #16130F  surface #1F1B16
```
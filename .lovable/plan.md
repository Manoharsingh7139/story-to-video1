# Adopt Clockwise's design system in Content Studio

Port Clockwise's "premium light" system — deep forest green on warm off-white, Inter + Plus Jakarta Sans, 0.75rem radius, layered premium shadows and forest gradients — and fit it to Content Studio's surfaces (Input, Generating, Editor, slide themes, brand mark).

## 1. Tokens (`src/index.css`)

Replace the current sand/amber tokens with Clockwise's exact HSL values.

| Token | HSL | Notes |
|---|---|---|
| `--background` | 45 20% 98% | warm off-white |
| `--foreground` | 160 15% 15% | deep forest ink |
| `--card` / `--popover` | 0 0% 100% | crisp white |
| `--card-foreground` | 222 47% 11% | |
| `--primary` | 160 35% 25% | deep forest green |
| `--primary-foreground` | 45 30% 97% | |
| `--secondary` / `--muted` / `--accent` | 40 15% 95% | warm neutral |
| `--muted-foreground` | 215 14% 45% | |
| `--success` | 160 84% 39% | |
| `--warning` | 45 93% 47% | amber/gold (no orange) |
| `--destructive` | 350 72% 51% | |
| `--border` / `--input` | 35 10% 88% | warmer hairlines |
| `--ring` | 160 35% 25% | forest focus |
| `--radius` | 0.75rem | softer corners |
| Sidebar tokens | forest variants | as in Clockwise |

Drop `--brand`, `--brand-soft`, `--brand-2`, `--brand-3`. Replace usages of `bg-brand` / `text-brand` / `border-brand` / `bg-brand-soft` with `bg-primary` / `text-primary` / `border-primary` / `bg-primary/10`.

Add Clockwise's gradient + shadow tokens:
- `--gradient-primary`, `--gradient-secondary`, `--gradient-subtle` (forest)
- `--shadow-sm/md/lg/xl/2xl`, `--shadow-primary`, `--glow-primary`, `--glow-accent`, `--shimmer`

`.dark` block mirrors `:root` (light-only behavior, same as Clockwise).

Replace the amber breathing keyframe with Clockwise's `pulse-glow` (already used on the Generating screen idea).

## 2. Tailwind (`tailwind.config.ts`)

- `fontFamily`: `sans: ['Inter', ...]`, `display: ['Plus Jakarta Sans', ...]`. Drop Fraunces, Geist, JetBrains Mono families.
- Remove `brand` color group.
- Add Clockwise's `chart` color group, `boxShadow` premium scale, extra `borderRadius` (`xl`, `2xl`), and animations (`fade-in-up`, `fade-in`, `scale-in`, `shimmer`, `pulse-glow`, `slide-up`, `gradient-shift`, `float`).
- Add `backgroundImage`: `gradient-primary`, `gradient-subtle`.

## 3. Fonts (`index.html`)

Replace the current Fraunces/Geist/JetBrains link with:
```
Inter:wght@400;500;600;700
Plus+Jakarta+Sans:wght@500;600;700;800
```
Title/meta stay as Content Studio. Favicon stays (will be re-themed in step 5).

## 4. Components

- `button.tsx`:
  - Remove `brand` variant.
  - `default` = forest primary with `shadow-premium` and hover lift (`-translate-y-px`).
  - `link` switched from `text-brand` to `text-primary`.
- `card.tsx`: keep structure; rely on new `--radius` and `--shadow-md`.
- `input.tsx` / `textarea.tsx`: forest focus ring (already via `--ring`).
- All `font-mono` eyebrow labels become `font-sans uppercase tracking-[0.18em]` (no mono in Clockwise system).
- All `font-display` usages (currently Fraunces serif) automatically become Plus Jakarta Sans — no class changes needed, just the family swap.

## 5. Brand mark (`src/components/Wordmark.tsx`, `public/favicon.svg`)

Rebuild monogram in the new identity:
- Square fill: `hsl(var(--primary))` (deep forest), radius 22% of side.
- Initials: "Cs" in **Plus Jakarta Sans 700**, off-white (`hsl(var(--background))`). Drop the italic Fraunces look.
- Wordmark "Content Studio" in Plus Jakarta Sans 600, tracking `-0.01em`.
- `mono` variant flips to ink-on-paper for dark surfaces.
- `public/favicon.svg`: same monogram, forest bg with off-white "Cs".

## 6. Slide themes (`src/lib/prototype/themes.ts`)

Rebuild the curated three so picker matches the new brand. Legacy ids stay in `THEMES` map for back-compat.

1. **Studio** (default) — Clockwise-aligned
   - bg `#FAF8F2`, surface `#FFFFFF`, text `#1F2A26`, muted `#6A7470`, accent `#2A5A48` (forest), accentText `#FAF8F2`, head Plus Jakarta Sans, body Inter, radius 12px.
2. **Editorial** — porcelain + deep forest, more ink
   - bg `#F1ECE0`, surface `#FBF7EC`, text `#15201C`, muted `#6F6553`, accent `#2A5A48`, accentText `#F1ECE0`, head Plus Jakarta Sans, body Inter, radius 4px.
3. **Midnight** — high-contrast forest noir
   - bg `#0F1715`, surface `#16201D`, text `#ECE6D5`, muted `#8C9A93`, accent `#5BB39A` (lifted forest), accentText `#0F1715`, head Plus Jakarta Sans, body Inter, radius 8px.

`THEME_LIST = [studio, editorial, midnight]`. Default `themeId` stays `"studio"`.

## 7. Screens

- **`InputScreen.tsx`**
  - Header: new Wordmark (forest monogram + Plus Jakarta wordmark). Replace `font-mono` step pill with sans uppercase tracking.
  - Hero H1: `font-display` (now Plus Jakarta Sans) — keeps "Where words become watchable." line; tracking adjusts naturally.
  - "Use sample" chip: `bg-primary/10 text-primary border border-primary/30`.
  - Selected theme card / selected voice card: `border-primary ring-2 ring-primary/20` + `bg-primary text-primary-foreground` check dot.
  - Voice avatar gradients: rebuild palette to forest-warm range (H 140–180 with warm 25–45 partner) — feels of-a-piece with the brand.
  - Generate CTA: drop `variant="brand"`, use default (forest primary) `Button` with `shadow-primary-glow` on hover.
  - Bottom action bar: `bg-background/85 backdrop-blur` (unchanged) but with `border-border` (now warmer).
- **`GeneratingScreen.tsx`**
  - Monogram pulses with `animate-pulse-glow` instead of breathing dot.
  - Step icons: completed `bg-primary text-primary-foreground`, current `bg-primary/15` with `animate-pulse-glow` dot.
- **`EditorScreen.tsx`**
  - Top bar Wordmark + new monogram. Export button: default variant (forest primary).
  - "X selected" pill: `bg-primary/10 text-primary border border-primary/30`.
  - Slide canvas wrapper: `shadow-premium-xl` from new shadow scale.
- **`NotFound.tsx`**: swap amber CTA (`bg-brand`) for forest (`bg-primary text-primary-foreground hover:bg-primary/90`).

## 8. Files touched

Edit:
- `index.html` (fonts swap)
- `src/index.css` (tokens, gradients, shadows, animations; remove brand vars)
- `tailwind.config.ts` (font stack, remove brand, add chart/shadow/animation/backgroundImage)
- `src/components/ui/button.tsx` (remove `brand` variant, update default + link)
- `src/components/Wordmark.tsx` (new monogram in Plus Jakarta + forest)
- `public/favicon.svg` (forest "Cs")
- `src/lib/prototype/themes.ts` (Studio/Editorial/Midnight rebuilt)
- `src/lib/prototype/types.ts` — already includes `midnight`, no change
- `src/pages/prototype/InputScreen.tsx` (chip, voice gradient, CTA, ring colors, eyebrow font)
- `src/pages/prototype/GeneratingScreen.tsx` (pulse-glow, primary tints)
- `src/pages/prototype/EditorScreen.tsx` (selected pill, export button, canvas shadow)
- `src/pages/NotFound.tsx` (CTA color)
- `src/components/prototype/SlideView.tsx` (`outline-brand/40` → `outline-primary/40`)
- `src/components/prototype/VoiceoverPanel.tsx` (`bg-brand` → `bg-primary`)
- `README.md` — no change

Create: nothing new (favicon path stays).

## 9. Out of scope

- No marketing/landing rebuild.
- No dark-mode toggle (light only, matching Clockwise).
- No changes to slide layout logic, sample SWOT content, voice list, AI chat, or store data shape.
- No copy changes beyond what's already there.

## Palette quick reference

```text
bg     #FAF6E9   card    #FFFFFF   muted   #F2EFE8   border  #E2DDD4
ink    #1F2A26   sub     #6A7470
forest #2A5A48 (primary)   forest-glow rgba(forest,0.35)
gold   #F0B41E (warning)   success #15B57A   destructive #E63E5C
```

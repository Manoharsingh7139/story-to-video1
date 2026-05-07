# Rebrand to Content Studio

A fresh, light-mode identity that replaces the current generic slate/blue defaults with a distinctive warm-neutral palette, refined typography, and consistent component styling. No blue anywhere.

## 1. Brand identity

- **Name:** Content Studio
- **Voice:** Considered, editorial, calm, premium. Studio software, not a SaaS toy.
- **Logo mark:** Replace the dark square + Sparkles icon with a small wordmark "Content Studio" set in the display serif, plus a 6px square accent dot in Terracotta. Keep an icon-only version (square with the dot) for tight spaces.
- **Tagline (used on input screen):** "Turn your words into watchable stories."

## 2. Color system (light only)

A warm paper-and-ink palette with terracotta as the single accent. All values stored as HSL in `index.css`.

| Token | HSL | Hex | Use |
|---|---|---|---|
| `--background` | 36 30% 97% | #FAF6F0 | App canvas (warm off-white "paper") |
| `--foreground` | 24 14% 12% | #221E1A | Primary text ("ink") |
| `--card` | 0 0% 100% | #FFFFFF | Elevated surfaces |
| `--card-foreground` | 24 14% 12% | — | |
| `--popover` / `--popover-foreground` | same as card | — | |
| `--muted` | 36 22% 92% | #F0EAE0 | Subtle surfaces, hover |
| `--muted-foreground` | 30 8% 42% | #736A60 | Secondary text |
| `--secondary` | 36 22% 92% | — | Secondary buttons |
| `--secondary-foreground` | 24 14% 12% | — | |
| `--accent` | 36 22% 90% | #ECE4D7 | Hover bg for ghost items |
| `--accent-foreground` | 24 14% 12% | — | |
| `--border` | 30 14% 86% | #E2DBD0 | Hairlines |
| `--input` | 30 14% 86% | — | |
| `--ring` | 14 72% 50% | #DC5A2A | Focus ring (terracotta) |
| `--primary` | 24 14% 12% | #221E1A | Primary buttons (ink on paper) |
| `--primary-foreground` | 36 30% 97% | #FAF6F0 | |
| `--destructive` | 0 65% 48% | #C82828 | Errors |
| `--destructive-foreground` | 36 30% 97% | — | |

**Brand accent (used directly, not as a shadcn token):**
- Terracotta `--brand` 14 72% 50% (#DC5A2A) — CTAs' subtle highlights, focus ring, brand dot, links.
- Optional warm support: Olive `--brand-2` 70 22% 36% (#5C6A3A) for chart secondary / success-ish.

`--radius` lowered from 0.5rem to **0.375rem** for a more editorial, less bubbly feel.

Sidebar tokens are realigned to the same paper/ink palette (no more separate gray sidebar look).

The `.dark` block is left intact in `index.css` but the app does not toggle it (light only).

## 3. Typography

Add Google Fonts in `index.html`:
- **Display / headings:** Fraunces (variable, opsz). Used for slide titles, screen H1s, brand wordmark. Slightly tightened tracking.
- **UI / body:** Inter (already used). Default weights 400/500/600.
- **Mono (code, labels):** JetBrains Mono (already pulled by darktech theme). Reused for the eyebrow micro-labels.

Tailwind extension in `tailwind.config.ts`:
```
fontFamily: {
  display: ['"Fraunces"', 'Georgia', 'serif'],
  sans: ['"Inter"', 'system-ui', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
}
```

Type scale (suggested usage, not new tokens):
- H1 screen title: `font-display text-4xl md:text-5xl tracking-tight`
- Section title: `font-display text-2xl`
- Eyebrow: `font-mono uppercase text-[11px] tracking-[0.18em] text-muted-foreground`
- Body: `text-sm` / `text-base`

## 4. Component styling conventions

- **Buttons:** Default = ink bg / paper text, radius 0.375rem, subtle shadow (`shadow-[0_1px_0_rgba(0,0,0,0.04)]`). A new `brand` variant added to `button.tsx` for the primary CTA on the input screen (terracotta bg, paper text, hover darker terracotta). Secondary stays muted.
- **Cards:** White surface on warm paper bg, 1px border `--border`, no heavy shadow. Hover lifts with `shadow-md` + border darkens slightly.
- **Inputs / textarea:** Transparent bg, 1px border, focus ring uses `--ring` (terracotta) at 2px offset.
- **Chips / pills (voice, tone, pace):** muted bg unselected; selected = ink bg + paper text (not terracotta — keeps accent rare).
- **Focus:** Always terracotta ring; never blue.

## 5. Built-in slide themes

Replace the three input-screen themes in `src/lib/prototype/themes.ts` so the default ("Studio") matches the new brand:

1. **Studio** (default, replaces `minimal`)
   - bg #FAF6F0, surface #FFFFFF, text #221E1A, muted #736A60, accent #DC5A2A, accentText #FAF6F0, head Fraunces, body Inter, radius 4px.
2. **Editorial** (kept, slightly retuned)
   - bg #F5EFE6, accent #9A3B1F (deep terracotta), head Fraunces (was Playfair) for consistency with brand.
3. **Noir** (replaces `darktech` in the picker; high-contrast dark slide style still available for variety)
   - bg #161310, surface #221E1A, text #F5EFE6, muted #9A9085, accent #E8B86A (warm gold — non-blue), head Fraunces, body Inter, radius 2px.

`THEMES` map keeps all existing entries (so saved decks don't break); only `THEME_LIST` is changed to `[studio, editorial, noir]`.

## 6. Surfaces to update

- `src/index.css` — all CSS variables above; add `@import` for Fraunces if not in `index.html`.
- `index.html` — add Google Fonts links (Fraunces, JetBrains Mono); update `<title>` to "Content Studio"; update meta description.
- `tailwind.config.ts` — add `fontFamily` extension and a `brand` color reading `hsl(var(--brand))`.
- `src/components/ui/button.tsx` — add `brand` variant.
- `src/lib/prototype/themes.ts` — add `studio` + `noir`, update `THEME_LIST`.
- `src/pages/prototype/InputScreen.tsx`
  - Replace top "Sparkles in dark square" header with the new wordmark (Fraunces "Content Studio" + terracotta dot).
  - H1 swapped to display serif: "Turn your words into watchable stories."
  - Generate CTA uses new `brand` variant.
  - Theme cards re-rendered with the 3 new themes.
- `src/pages/prototype/EditorScreen.tsx` and `src/pages/prototype/GeneratingScreen.tsx` — swap header logo block + any "Sparkles" branding for the wordmark; ensure default theme select shows Studio first.
- `src/pages/Index.tsx` — update any hardcoded product name / hero copy.
- `README.md` — rename to Content Studio, one-line tagline.

## 7. Out of scope

- No dark-mode toggle work (light only, as requested).
- No changes to slide layout logic, voice data, or sample SWOT content.
- Existing saved decks using removed theme ids (e.g. `corporate`, `playful`, `warm`, `darktech`) keep rendering because the `THEMES` map retains them; only the picker list changes.

## Visual reference (palette swatches)

```text
 paper #FAF6F0   ink #221E1A   muted #F0EAE0   border #E2DBD0
 brand #DC5A2A   olive #5C6A3A   gold #E8B86A   noir-bg #161310
```

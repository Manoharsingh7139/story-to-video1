# Element editor: style & visual variants (not just text)

Right now selecting an element on a slide only lets you change its text. This makes the Element panel a real design tool: each element type gets its own style controls, and bullet lists can transform into SmartArt-style visuals (numbered steps, process arrows, pillars, checklist cards, etc.).

## What the user gets

**Bullets → SmartArt picker** (the headline change)
When you select any bullet (or a new "Group: Bullets" header at the top of the bullet element), the Element panel shows a visual gallery of 6 ways to render the same list:

```
[ • List ]   [ ① Numbered ]   [ → Process ]
[ ▦ Cards ]  [ ⏃ Pillars ]    [ ✓ Checklist ]
```

Click one and the slide swaps to that visual instantly. The underlying bullet text stays — only the rendering changes. Each variant has its own look:
- **List** — current dot bullets
- **Numbered** — large circled numbers beside each item
- **Process** — horizontal arrow chain with short labels
- **Cards** — equal-width tiles in a row, item text inside
- **Pillars** — vertical columns with accent top-bar
- **Checklist** — checkmarks in accent color

**Text elements (title, subtitle, body, etc.) get a Style section** below the text input:
- Size: S / M / L / XL toggle
- Weight: Regular / Bold
- Align: Left / Center / Right
- Color: swatch row (theme text, muted, accent, +3 neutrals)
- Emphasis: optional accent underline bar (on/off)

**Image elements get a Style section**:
- Shape: Square / Rounded / Circle / Soft-blob
- Treatment: None / Grayscale / Duotone (accent) / Subtle blur backdrop
- Border: None / Thin / Thick accent
- Caption position (image-grid only): Below / Overlay / Hidden

**Stat element gets**:
- Size: M / L / XL / Display
- Color: theme accent / text / custom swatch
- Decoration: None / Underline bar / Circle backdrop / Gradient fill

## How it looks in the panel

The Element tab gets two stacked sections separated by a thin divider:

```
┌────────────────────────────┐
│ CONTENT                    │
│ [text input / image well]  │
├────────────────────────────┤
│ STYLE                      │
│ [variant gallery / chips]  │
└────────────────────────────┘
```

For bullets, "Content" lists every bullet inline (compact rows with drag handle, edit, delete, + Add bullet). "Style" is the SmartArt gallery. This means selecting any single bullet OR the bullet group shows the same gallery — the user can restyle the whole list from one bullet click.

## Technical plan

### New types & store (`src/lib/prototype/types.ts`, `store.ts`)
- Add `style?: SlideStyle` to `SlideContent` — optional bag, missing = defaults.
- `SlideStyle` fields: `bulletVariant?: "list" | "numbered" | "process" | "cards" | "pillars" | "checklist"`, `titleSize`, `titleWeight`, `titleAlign`, `titleColor`, `titleAccentBar`, similar `body*`/`subtitle*` keys, `statSize`, `statColor`, `statDecoration`, `imageShape`, `imageTreatment`, `imageBorder`, `captionPosition`.
- Store action: `setSlideStyle(id, patch: Partial<SlideStyle>)` — shallow-merges into `content.style`.

### Slide rendering (`src/components/prototype/SlideView.tsx`)
- Read `c.style` once per slide; compute resolved values with defaults.
- Title/subtitle/body/stat: apply size (font-size scale), weight, align, color (resolve `"accent" | "text" | "muted" | hex`), and render the optional accent bar div.
- Image renderer: apply `borderRadius` for shape (`circle` = 50%, `blob` = irregular `border-radius` string), CSS filter for treatment (`grayscale(1)`, duotone via `mix-blend-mode` overlay, blur backdrop), border style/width.
- Bullets: switch on `bulletVariant`:
  - `list` — current.
  - `numbered` — circle with index, larger gap.
  - `process` — flex row, each item in pill, arrow `→` between (use `›` glyph styled with accent).
  - `cards` — `grid-cols-{n}` of bordered cards, item text inside.
  - `pillars` — same grid but each card has a 6px accent top bar.
  - `checklist` — `✓` in accent circle instead of dot.

### Element panel (`VoiceoverPanel.tsx`)
- Restructure `renderElementEditor` into `<ContentSection>` + `<StyleSection>` per element type.
- New file `src/components/prototype/StyleControls.tsx` exporting:
  - `<TextStyleControls keyPrefix="title" />` — size toggle, weight, align, color swatches, accent bar switch. Reads/writes through `setSlideStyle`.
  - `<ImageStyleControls />`
  - `<StatStyleControls />`
  - `<BulletSmartArtPicker />` — 2×3 grid of variant cards with tiny SVG previews + label; selected variant has accent ring.
- For bullets: also add a "Bullets" group header so the panel can be opened from either a single bullet or a new "bullet-group" element key. Add element key `bullets` (whole group) — `SlideView` triggers it when the user clicks the empty area between bullets, and a small "Style list" button appears next to the layout dropdown when the layout is `bullets`.
- Auto-switch to Element tab logic stays.

### AI chat hooks (`src/lib/prototype/aiChat.ts`)
- Add intent matching for: "make bullets numbered/process/cards/pillars/checklist", "bigger title", "center the title", "make the image a circle", "grayscale the photo", "accent color stat". Each maps to a `setSlideStyle` mutation surfaced as a chat-applied edit (undoable like existing ones).

### Sample deck (`sampleDeck.ts`)
- Set one of the bullet sample slides to `bulletVariant: "process"` so the feature is discoverable on first load.

## Out of scope
- Free font picker (themes still own typography family).
- Per-bullet individual styling (style applies to the group).
- Animated transitions between variants (instant swap).
- Real duotone color picker (preset accent only).

## Files touched
- New: `src/components/prototype/StyleControls.tsx`
- Edit: `types.ts`, `store.ts`, `SlideView.tsx`, `VoiceoverPanel.tsx`, `aiChat.ts`, `sampleDeck.ts`, `EditorScreen.tsx` (add the "Style list" affordance for bullet layouts).

No new dependencies. No backend.

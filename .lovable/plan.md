# Side Panel Redesign — Element Editor

## Problem

The current "Element" tab in the right panel (`VoiceoverPanel.tsx` + `StyleControls.tsx`) stacks every control as a flat list — Background Image, Image search, slider, Slide header, Bullet textarea, Add/Remove buttons all visible at once. With background image, image search, transparency, header, bullets, font color, alignment, size, bullet marker, and add/remove all wedged into one column it reads as a wall of pills and inputs with no hierarchy.

## Goal

Restructure the panel into clear, collapsible groups with a consistent visual rhythm so the user always sees:
1. **What** element they're editing (sticky context header).
2. **Content** edits first (text, bullets, image source).
3. **Style** edits second, grouped by concern (typography, color, layout, marker).
4. **Slide-level** controls (background, theme override) as a separate section that's always reachable but not mixed with element style.

## New panel structure

```
┌─ Right Panel ──────────────────────────────┐
│ [ Voiceover ] [ Element ]                  │  ← existing tabs
├────────────────────────────────────────────┤
│ ▸ Selected: "Bullet 2"          [Deselect] │  ← sticky context bar
├────────────────────────────────────────────┤
│ ▼ CONTENT                                  │  ← Accordion, open by default
│   • Bullet list editor                     │
│     ├ drag handle  [text input]  [⋯]       │
│     │   └ menu: Duplicate / Delete         │
│     └ [+ Add bullet]                       │
│                                            │
│ ▼ TYPOGRAPHY                               │  ← open by default for text
│   Size      [S] [M] [L] [XL]               │
│   Weight    [Regular] [Bold]               │
│   Align     [⬅] [⬌] [➡]   (icon chips)     │
│   Color     ● ● ● ● ● ● (swatches)         │
│                                            │
│ ▸ BULLET MARKER                            │  ← collapsed by default
│   Style     [• List] [1. Num] [✓ Check]    │
│   SmartArt  (existing 6-tile grid)         │
│                                            │
│ ▸ SLIDE BACKGROUND                         │  ← always present, collapsed
│   Image preview / Upload / Search          │
│   Opacity slider                           │
│   [Remove background]                      │
└────────────────────────────────────────────┘
[ Export Video ]                              ← unchanged footer
```

The same shell adapts per selection:

| Selected element | Sections shown (in order) |
|---|---|
| Title / Subtitle / generic text | Content · Typography · (Accent bar for title) · Slide background |
| Bullet / Bullets group | Content (list editor) · Typography · Bullet marker · Slide background |
| Image | Content (preview, replace, search, remove, caption) · Image style (shape, treatment, border) · Layout (side / overlay) · Slide background |
| Stat | Content · Stat style (size, color, decoration) · Slide background |
| Quadrant cell | Content · Typography · Quadrant palette · Slide background |
| Nothing selected | Slide background (expanded) · hint to click an element |

## Visual / interaction rules

- **Accordion**: use existing `@/components/ui/accordion` (single-or-multiple, multiple open allowed, state persisted per session in `usePrototypeStore`).
- **Section header**: small uppercase eyebrow (10px tracked) + chevron, identical to current `SectionHeader` typography so it doesn't feel like a new design system. Hover row highlights.
- **Sticky context bar** at top of the Element tab shows the friendly element label from `ELEMENT_LABELS` plus a "Deselect" ghost button (calls `selectElement(null)`).
- **Slide background** moves out of the element-specific block into its own always-available accordion section so it's no longer first thing the user sees when editing a bullet.
- **Bullet row**: drag handle · input · overflow menu (`⋯`) with Duplicate / Delete instead of an always-visible trash. Keeps the row to one line and removes visual noise. "Add bullet" stays as a full-width dashed button at the end of the list.
- **Alignment** becomes icon chips (`AlignLeft`, `AlignCenter`, `AlignRight` from lucide) instead of text "Left / Center / Right" — saves a row and matches industry convention.
- **Color swatches**: keep round swatches but lay them out in a 6-column grid with a tiny "+" tile that opens a popover for custom hex (out of scope for v1, just reserve the slot).
- **Bullet marker** gets its own section combining `bulletVariant` SmartArt picker + a simpler "marker only" row (•, 1., ✓, –, ▸) for quick changes without committing to full SmartArt.
- Consistent **12px padding** inside sections, **16px between sections**, hairline borders only between accordion items.

## Files to change

- `src/components/prototype/VoiceoverPanel.tsx` — rebuild `renderElementEditor()` around the accordion + sticky context bar; move slide background here from wherever it currently lives.
- `src/components/prototype/StyleControls.tsx` — swap text "Left/Center/Right" chips for icon chips, tighten swatch grid, add `BulletMarkerControls` (marker glyph row).
- `src/lib/prototype/store.ts` — add `duplicateBullet(slideId, index)` action and `panelSections: Record<string, boolean>` for accordion persistence.
- `src/lib/prototype/types.ts` — add `bulletMarker` field (`"dot" | "number" | "check" | "dash" | "triangle"`) to `SlideStyle` (separate from `bulletVariant` SmartArt).
- `src/components/prototype/SlideView.tsx` — honor the new `bulletMarker` field when rendering the `list` variant.

## Out of scope for this pass

- Background image upload backend (already mocked).
- Custom hex color picker (slot reserved, popover deferred).
- Multi-element selection.

## Build order

1. Add accordion shell + sticky context bar (no logic change). Verify all existing controls still reachable.
2. Move Slide background into its own accordion section; remove duplicates.
3. Replace alignment text chips with icon chips; tighten swatch + size layout.
4. Add `BulletMarkerControls`, wire `bulletMarker` through types/store/SlideView.
5. Replace per-row Trash with `⋯` overflow menu (Duplicate / Delete); add `duplicateBullet` store action.
6. Polish: persist open/closed accordion state in store; verify panel at 320px width without horizontal scroll.

Approve and I'll implement in this order.

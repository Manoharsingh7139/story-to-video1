## Goal
Add image-based layouts, per-element editing, slide regeneration, and shrink the chat panel.

## 1. New layouts (with image placeholders)
Add 4 new layouts to `LayoutId` and `SlideContent` (extend with `imageUrl`, `imageUrl2`, `imageUrl3`, `imageUrl4`, `caption`):

- **image-left** — Image left half, title + body right half
- **image-right** — Title + body left half, image right half
- **image-full** — Full-bleed image with overlaid title + subtitle (gradient scrim)
- **image-grid** — Title at top, 2x2 grid of 4 images each with optional caption

Images use Unsplash placeholder URLs (e.g. `https://images.unsplash.com/...?w=1280`) seeded per slide. Add 2 sample image-based slides to `SAMPLE_DECK` so they're discoverable.

Update layout dropdown in `EditorScreen` to list all 10 layouts (group: Text / Image).

## 2. Element-level selection & editing
Currently the whole canvas is editable inline. Switch to a "selected element" model like PPT:

- Add `selectedElementKey` to the store (e.g. `"title"`, `"body"`, `"image"`, `"bullet:2"`, `"image:1"` for grid).
- In `SlideView`, wrap each element (title, subtitle, body, each bullet, each image, stat, etc.) in a clickable container. Clicking selects it; selected element gets a blue outline + small floating toolbar.
- Floating toolbar actions per element type:
  - **Text**: edit inline (contentEditable as today), delete, "Ask AI" shortcut that prefills chat scoped to that element.
  - **Image**: "Replace image" (opens small dialog with: paste URL, pick from 6 stock thumbnails, "Generate with AI" mock button that swaps in a different Unsplash URL after a 1s spinner), "Remove".
- Right panel ("Properties") becomes context-aware: shows the selected element's editable fields (text content, font size hint, image URL, caption). Falls back to the existing voiceover view when nothing is selected — add a small tab toggle: **Voiceover | Element**.

## 3. Regenerate entire slide
- Add a "Regenerate slide" button on the canvas toolbar (next to layout/theme selectors) and in the thumbnail rail's per-slide menu.
- Clicking shows a small popover with 3 options:
  - Regenerate (keep layout)
  - Regenerate (try a different layout)
  - Regenerate from custom prompt (text input)
- Behavior is mocked: 1.2s shimmer overlay on the canvas, then swap content with a variant pulled from a small `slideVariants.ts` lookup keyed by layout (3 canned variants per layout). Voiceover script also gets rewritten. Recorded as an undoable entry in the chat history.

## 4. Reduce chat height
- Change chat panel container in `EditorScreen` from `h-72` (288px) to `h-44` (176px).
- Make it collapsible: header gets a chevron that toggles to a 36px collapsed bar showing only "AI assistant • slide N" + input. Default = collapsed when viewport height < 800px.
- Inside `ChatPanel`, drop suggestion chips when collapsed; reduce message vertical padding from `py-3` to `py-2`, gap from `space-y-3` to `space-y-2`.

## 5. AI chat additions
Extend `processChatMessage` with patterns:
- "image left/right/full/grid" → switch to corresponding layout
- "replace image" / "new image" → swap `imageUrl` to a different stock URL
- "regenerate" / "redo this slide" → trigger the regeneration flow

## Technical notes
- Files touched: `types.ts`, `themes.ts` (no change), `sampleDeck.ts`, `store.ts` (add `selectedElementKey`, `setSelectedElement`, `regenerateSlide`), `aiChat.ts`, `SlideView.tsx` (big refactor — element wrappers, image rendering), `EditorScreen.tsx` (layout list, regenerate button, chat height, properties tab), `ChatPanel.tsx` (collapsible, denser), `VoiceoverPanel.tsx` (add Element tab), new `ImageReplaceDialog.tsx`, new `slideVariants.ts`.
- Stock image pool: 12 curated Unsplash URLs in a constant.
- No backend; all mocked. No new deps.

## Out of scope
- Real image upload from disk (would need Lovable Cloud storage)
- Real AI image generation
- Free drag-to-position elements (still layout-based)

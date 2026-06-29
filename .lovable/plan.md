## Rich Text Editing for Slide Elements

Replace the plain `<textarea>` content editor (and the basic contentEditable on the canvas) with an inline rich text editor that lets users select any character/word/line and apply formatting, line breaks, and per-line bullet markers.

### UX flow

**1. Two editing surfaces, one model**
- **On-canvas inline editing** (primary): clicking an element on the slide makes it directly editable in place — exactly where the text lives. A **floating selection toolbar** appears above the highlighted text when the user selects any range.
- **Side panel mirror** (Element tab → CONTENT): same content shown in a compact rich editor so users can edit even when not double-clicking the slide. Both stay in sync via the store.

**2. Floating selection toolbar (bubble menu)**
Appears on text selection, anchored above the selection. Contains:
- **B** Bold · **I** Italic · **U** Underline · **S** Strike
- **A▾** Text color (swatch popover using theme tokens)
- **🖍 Highlight** (subtle accent tints)
- **Size** small numeric stepper (overrides only the selected span)
- **Link** (for future; hidden v1)
- **✕ Clear formatting**

Hides on blur/escape. Keyboard: ⌘B / ⌘I / ⌘U / ⌘\ (clear).

**3. Per-line controls (left gutter handle)**
For multi-line elements (body, bullets), each line/paragraph gets a small **⋮⋮ handle** on hover at the left margin. Clicking it opens a popover:
- Turn line into: **Paragraph · Bulleted · Numbered · Checklist · Quote**
- Bullet marker for this line: **• ▪ – ▸ ✓ 1.**
- Indent / Outdent
- Duplicate line · Delete line · Insert line below

This replaces the current global "Bullet marker" section for bullet slides — markers become per-line so users can mix (e.g., 3 bullets + 1 checkmark).

**4. Line breaks**
- **Enter** = new paragraph / new bullet
- **Shift+Enter** = soft line break inside same paragraph/bullet
- **Backspace at line start** = outdent or merge into previous

**5. Side-panel CONTENT section redesign**
- Replace `<textarea>` with the same Tiptap editor in a bordered container
- Above the editor: a compact **static toolbar** (B I U • 1. ✓ ↶ ↷) for users who prefer toolbar over selection bubble
- Below: "Clear text" stays. Remove the now-redundant global "Bullet marker" accordion section (markers are per-line).

**6. Visual treatment**
- Selection toolbar: rounded pill, paper-tone surface, hairline border, subtle shadow, small icons (`h-3.5 w-3.5`), 28px tall — matches the existing editorial palette already in `index.css`.
- Active state for marks uses `bg-primary/10` + `text-foreground`.
- All colors via existing semantic tokens (no hardcoded hex).

### Technical implementation

**Library**
- Add **Tiptap** (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-text-style`, `@tiptap/extension-color`, `@tiptap/extension-highlight`, `@tiptap/extension-task-list`, `@tiptap/extension-task-item`, `@tiptap/extension-bubble-menu`). Tiptap is the standard headless rich-text framework for React and ships all needed primitives.

**Data model migration**
- `SlideContent` text fields (`title`, `subtitle`, `body`, `bullets[]`, `leftBody`, `rightBody`, `q1Body`…`q4Body`, `caption`…) become **HTML strings** instead of plain strings.
- Backward compatible: a helper `toRichHtml(value)` wraps legacy plain strings in `<p>…</p>` on read so existing decks render unchanged.
- Per-line bullet marker is encoded as a `data-marker` attribute on `<li>` via a custom Tiptap node attribute, read by `SlideView` to render the chosen glyph.

**New files**
- `src/components/prototype/RichTextEditor.tsx` — Tiptap wrapper. Props: `value`, `onChange`, `mode: "inline" | "panel"`, `singleLine?`, `allowLists?`. Mounts BubbleMenu with formatting buttons.
- `src/components/prototype/RichTextToolbar.tsx` — static toolbar variant for the side panel.
- `src/components/prototype/LineMenu.tsx` — hover gutter popover for line-level actions (turn-into, marker, indent, duplicate, delete).
- `src/lib/prototype/richText.ts` — `toRichHtml`, `htmlToPlain`, sanitization helpers.

**Edited files**
- `src/components/prototype/SlideView.tsx` — render text fields with `dangerouslySetInnerHTML` (sanitized), respect per-`<li>` `data-marker`. Replace inline contentEditable with mounting `<RichTextEditor mode="inline">` on the focused element.
- `src/components/prototype/VoiceoverPanel.tsx` — swap `<textarea>` for `<RichTextEditor mode="panel">`; remove standalone `BulletMarkerControls` section (now per-line).
- `src/lib/prototype/store.ts` — `setSlideContent` / `setSlideBullet` accept HTML strings; add `setSlideContentHtml` if needed. No structural change to bullets array (still `string[]` of HTML fragments).
- `src/lib/prototype/types.ts` — note: text fields hold HTML; add `BulletMarker` per-line via inline attribute (no schema change needed).

**Sanitization**
- Use a small allowlist sanitizer (DOMPurify already used? if not, add `dompurify`) before rendering. Only allow: `p, br, strong, em, u, s, span[style], ul, ol, li[data-marker], blockquote, mark`.

**Out of scope (v1)**
- Tables, images inside text, links, collaborative cursors, font-family per span (we already have global font).
- Migration of stored decks beyond the read-time wrapper.

### Build order
1. Add Tiptap + DOMPurify deps, create `richText.ts` helpers
2. Build `RichTextEditor` with BubbleMenu (B/I/U/S, color, clear)
3. Swap side-panel textarea → `RichTextEditor mode="panel"` with static toolbar
4. Update `SlideView` to render HTML safely; mount inline editor on focus
5. Add `LineMenu` for per-line marker + turn-into + indent/duplicate/delete
6. Remove redundant global "Bullet marker" section
7. Verify legacy plain-text decks still render via `toRichHtml` shim

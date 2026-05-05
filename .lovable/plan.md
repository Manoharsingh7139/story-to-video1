# Polish the Input Screen — Studio-grade redesign

The current `InputScreen` is a single narrow column that stacks every control vertically: title → text → voiceover upload → theme grid → CTA. There's no voice (TTS) selection, themes feel like generic cards, and the page lacks the visual hierarchy of a finished product. This redesign turns it into a confident, two-column "Studio Setup" surface — the kind of first screen a user screenshots.

## What changes

### 1. Layout & framing
- Switch to a **two-column workspace** at `lg+` (left = content/script, right = look & voice). Single-column on mobile.
- Wider canvas (`max-w-6xl`), generous breathing room (`py-16`), refined header with breadcrumb-style label ("Step 1 · Setup") and a subtle right-side action ("Skip to editor with sample").
- Add a quiet **hero block**: project title becomes a large inline-editable headline (no boxy input — borderless, font-serif feel on focus), with a one-line helper "Give your video a name. You can change it anytime."
- Add a thin sticky bottom action bar on scroll containing: word count · estimated slides · estimated duration · primary CTA. This makes the "Generate" feel anchored and present at all times.

### 2. Source content (left column)
- Replace the bare textarea + scattered links with a **single rounded "Source" card**:
  - Tab strip at the top: **Paste text** · **Upload document** · **From URL** (URL is visual-only, marked "soon").
  - Cleaner textarea: no visible border, large font (15px), monospace word count chip in the corner.
  - Footer row inside the card: "Use sample (SWOT)" pill on the left; live stats on the right (`128 words · ~6 slides · ~2 min video`).
  - Upload tab shows a proper dropzone (dashed, centered icon, "Drop .pdf, .docx, or .txt"). When a file is attached it shows a clean file chip with size + remove.

### 3. Look & feel (right column, top)
- Section heading "Look" with a small "Preview" link.
- **Refined theme cards**: slightly larger (aspect 4/3), each shows a *real miniature slide* (title + accent bar + 2 dot bullets) rendered with that theme's actual fonts/colors — so the user previews the design language, not a swatch. Selected card gets a thin ring + a small filled checkmark in the top-right corner (not the current bottom row).
- Grid is `grid-cols-2` in this column (was 3 across full width) — fewer, larger, more tactile.
- "Upload custom template" becomes a separate **secondary tile** below the grid (full width, dashed, with icon + helper text), not mixed into the theme grid. This separates "pick a preset" from "bring your own."

### 4. Voice (right column, bottom) — NEW
This is the main feature add. Replace the current "Voiceover (optional) — upload MP3" card with a proper **Voice section** that has two modes via a segmented control:

**Mode A — AI voice** (default)
- Grid of voice chips (2 cols). Each chip shows:
  - Circular avatar with first initial on a colored gradient (deterministic by name)
  - Name + descriptor ("Sarah", "warm female")
  - Small play button on the right that previews `/preview.mp3`
  - Selected chip: ring + filled check
- Below the grid: 2 small sliders — **Pace** (slow / normal / fast as a 3-stop segmented) and **Tone** (neutral / warm / energetic). Visual only for prototype but wires into store later.
- Language dropdown ("English (US)") — visual only, marked default.

**Mode B — My recording**
- The existing dropzone (cleaner styling), accepts `.mp3` / `.wav`. When a file is added, show a tiny waveform placeholder bar (static SVG) + filename + remove. Helper text: "We'll sync slides to your audio automatically."

Switching modes is instant; the underlying state is the existing `voice` (string) for AI, `uploadedVoice` (file name) for upload. Add a `voiceMode: 'ai' | 'upload'` to the Zustand store.

### 5. Primary CTA
- Move "Generate presentation" to the **sticky bottom bar** (always visible) AND keep a secondary instance at the end of the right column for users who scroll naturally.
- CTA copy: "Generate presentation →"; disabled state shows reason ("Add some text or upload a document").
- Add a subtle secondary link beside it: "Or start from a blank deck".

### 6. Micro-polish
- Replace the current header logo block with a slightly smaller, more refined wordmark; add a `kbd`-style hint on the right ("⌘ Enter to generate").
- All section headings use a consistent eyebrow style: `text-xs uppercase tracking-[0.14em] text-muted-foreground font-medium` + a one-line description below.
- Subtle entrance: stagger fade-up on the two columns (Tailwind `animate-in fade-in slide-in-from-bottom-2`, 60ms stagger).
- Typography tightening: titles `tracking-tight`, body `text-[15px] leading-relaxed`.
- Light gradient wash on the page background (`from-background to-muted/30`) to lift the cards without losing the minimal feel.

## Final layout sketch

```text
┌─────────────────────────────────────────────────────────────┐
│  Reel        Step 1 · Setup            Skip with sample →   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   The Async Advantage                       (inline title)  │
│   Give your video a name.                                   │
│                                                             │
│   ┌─────────────────────────┐   ┌─────────────────────────┐ │
│   │ SOURCE                  │   │ LOOK                    │ │
│   │ [Paste|Upload|URL]      │   │ ┌────┐ ┌────┐           │ │
│   │                         │   │ │Min.│ │Edit│           │ │
│   │  textarea…              │   │ └────┘ └────┘           │ │
│   │                         │   │ ┌────┐ ┌────┐           │ │
│   │  [Use sample]           │   │ │Corp│ │Play│           │ │
│   │  128 w · 6 slides · 2m  │   │ └────┘ └────┘  …        │ │
│   └─────────────────────────┘   │ + Upload custom template│ │
│                                 ├─────────────────────────┤ │
│                                 │ VOICE                   │ │
│                                 │ [AI voice | My recording]│ │
│                                 │ ◉ Sarah ▶  ○ James  ▶   │ │
│                                 │ ○ Aria  ▶  ○ Marcus ▶   │ │
│                                 │ Pace [slow|norm|fast]   │ │
│                                 │ Tone [neutral|warm|engy]│ │
│                                 └─────────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ 128 words · ~6 slides · ~2 min      [Generate presentation→]│ (sticky)
└─────────────────────────────────────────────────────────────┘
```

## Files to change

- **`src/pages/prototype/InputScreen.tsx`** — full rewrite with two-column layout, sticky CTA, refined theme cards rendered with actual theme tokens, segmented voice picker, dropzone polish.
- **`src/lib/prototype/store.ts`** — add `voiceMode: 'ai' | 'upload'` (default `'ai'`), `setVoiceMode`. Keep `voice` for AI selection.
- No changes to `themes.ts`, `sampleDeck.ts`, or downstream editor.

## What's deliberately out of scope

- Real TTS preview audio per voice (we keep one shared `/preview.mp3` for the prototype).
- Persisting pace/tone (visual-only sliders for now — easy to wire up later).
- "From URL" tab fetches nothing — labeled "soon" pill so it doesn't promise behavior.

This keeps the change surgical (one screen + one tiny store field) while making the first impression feel like a finished product.
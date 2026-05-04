
# Text-to-Video Generator — Clickable Prototype

A fully navigable UI prototype of the text-to-video tool. No real AI, voice synthesis, or video rendering — every action uses mocked data, fake delays, and placeholder media so the entire flow feels real and reviewable.

## Goal

Validate the UX end-to-end: input → generation → PPT-style editor (with AI chat) → voiceover → export. Stakeholders can click through every screen and interaction.

## Screens & flow

```text
1. Input screen   →  2. Fake "Generating…"  →  3. Editor (PPT-style)  →  4. Export modal  →  5. Done screen
```

### 1. Input screen
- Hero with product name + one-line pitch
- Large textarea (pre-filled with sample text via "Use sample" link)
- Title input
- Theme picker — 6 cards with live mini-previews:
  Minimal · Editorial · Corporate · Playful · Dark Tech · Warm
- "Generate presentation" button → goes to step 2

### 2. Fake generation screen
- Centered progress UI with messages cycling: "Reading your text…", "Drafting slide 3 of 8…", "Writing voiceover…"
- 3–4 second simulated delay, then routes to the editor with a hardcoded 8-slide deck

### 3. Editor (PowerPoint-style) — the main screen

```text
┌──────────┬─────────────────────────────────┬──────────────────────┐
│          │  [Layout ▾]  [Theme ▾]          │  Voiceover script    │
│  Slide   │                                 │  ┌────────────────┐  │
│  thumbs  │                                 │  │ editable text  │  │
│  1 ▌ 2   │   Selected slide (16:9)         │  └────────────────┘  │
│  3 ▌ 4   │                                 │  Est. duration: 24s  │
│  5 ▌ 6   │                                 │  [▶ Preview]         │
│  7 ▌ 8   │                                 │  [Regenerate audio]  │
│  + Add   │                                 │  Voice: Sarah ▾      │
├──────────┴─────────────────────────────────┴──────────────────────┤
│  💬 AI assistant — Editing slide 3                                │
│  > "Make the title shorter"                                       │
│  ✓ Updated title to "Why it matters"                  [Undo]      │
│  [ Type an instruction…                            ]   [Send]     │
└───────────────────────────────────────────────────────────────────┘
```

- **Top bar**: project title, "Export video" button (top right)
- **Left rail**: 8 numbered thumbnails, click to select, drag to reorder, "+ Add slide" duplicates a blank
- **Canvas**: renders the selected slide at fixed 1920×1080, scaled to fit. Inline-editable title/body/bullets (contentEditable). Layout dropdown swaps among the 6 layouts; theme dropdown re-skins the whole deck.
- **Right panel**:
  - Editable voiceover textarea
  - Estimated duration computed live from word count (~150 wpm)
  - "▶ Preview" plays a short placeholder audio clip (same file for every slide)
  - "Regenerate audio" shows a 1.5s spinner then a toast "Audio updated"
  - Voice picker with ~10 named presets (no real samples — just labels)
- **Bottom AI chat**:
  - Scoped to the current slide (badge updates when you switch slides)
  - User types instructions; assistant replies after a fake 800ms delay with a canned confirmation and applies a scripted edit (e.g. any message containing "shorter" trims the title; "two column" switches the layout; "casual" rewrites the script to a preset casual version). A small library of pattern-matched responses keeps it feeling alive.
  - Each applied edit shows an Undo chip
  - Chat history persists per slide while on the page

### 4. Export modal
- Click "Export video" → modal with a fake render progress bar (~5 seconds, stepped messages: "Composing slides…", "Mixing audio…", "Encoding MP4…")
- On complete: "Download MP4" button (downloads a tiny placeholder MP4 file bundled in `public/`)

### 5. Done screen / back to editor
- Toast: "Your video is ready" with link back to editor

## Mocked data & behaviors

- One hardcoded 8-slide deck, varied across all 6 layouts so every layout is visible
- Six themes implemented as real CSS token sets — switching is instant and visible
- One placeholder MP3 in `public/` used for every "Preview"
- One placeholder MP4 in `public/` used for "Download"
- AI chat uses simple keyword matching against ~10 patterns; falls back to "Got it — I tweaked the slide." with a no-op
- Everything lives in React state; no persistence, refresh resets the prototype

## Out of scope for the prototype

- Lovable Cloud, auth, database
- Real Lovable AI calls
- Real ElevenLabs voiceover
- Real Remotion video rendering
- File uploads, sharing, collaboration

Once you're happy with the flow, we can swap each mocked piece for the real implementation in follow-up steps.


# FrameFlow — Launch Video Plan

A ~28-second "mini trailer" rendered as two MP4s (16:9 for Twitter/Reddit/YouTube and 9:16 for TikTok/Reels/Shorts), on-brand with the landing page's editorial-bold aesthetic, funky enough to travel.

## Creative direction

- **Vibe**: Editorial-bold meets kinetic poster — same DNA as the landing page (serif drama, ink-on-paper, primary accent pops, hairline rules, tiny uppercase eyelets like `Sec. 01`, `Fig. 02`).
- **Palette** (pulled from the site's tokens):
  - Paper `#F4EFE6`, Ink `#141414`, Primary accent `#E85D3A` (warm ember from current theme), soft cream `#EBE4D6`. One bold scene inverts to ink background with paper type for contrast.
- **Typography**: 2 fonts max
  - Display: **Instrument Serif** (italic for accents) — matches `editorial-display`
  - UI/eyelet: **Inter** (uppercase 0.22em tracking) — matches landing eyelets
- **Motion system**:
  - Default entrance: clip-path reveal upward + 6px blur→0
  - Accent moment: spring scale-in with subtle overshoot (damping 14) for hero word
  - Default easing: `easeInOutCubic` for everything non-accent
  - Scene transitions: 2 only — `wipe(from-left)` and a hairline-rule "page turn" slide. Reused consistently.
- **Motifs**:
  1. Hairline rules + tiny tnum figure labels (`Fig. 01 / 06`) drifting in corners
  2. Big italic single word per beat (Words. Become. Watch·able.)
  3. Tiny rotating "live" slide thumbnails from the existing SlideView aesthetic (rendered as static styled cards, not the actual component)

## Story / scene breakdown (28s @ 30fps = 840 frames)

```
[00:00–00:03]  Scene 1 — Cold open
               Black paper. Tiny eyelet "— FrameFlow / Est. MMXXVI" fades up.
               Big italic serif "Words." slams in with spring overshoot.

[00:03–00:08]  Scene 2 — The pitch (kinetic type)
               "become" slides in offset-right.
               "watch·able." with primary "·able." flourish.
               Hairline underline draws across.

[00:08–00:14]  Scene 3 — Three acts montage
               Three numerals 01 / 02 / 03 stamp in with their tiny labels
               (Script · Cut · Voice). Rapid stagger, 8-frame gaps.
               Each numeral pulses with its accent illustration sketch.

[00:14–00:20]  Scene 4 — Theme reel
               Marquee strip of 5 mini "slide cards" in different theme
               palettes (editorial / noir / midnight / warm / playful) scrolls
               horizontally with slight tilt + parallax.
               Overlay eyelet: "Sec. 04 — One signature."

[00:20–00:25]  Scene 5 — The promise
               Inverted ink scene. Huge italic "watch·able." centered with
               accent dot punching in. Pull-quote style.

[00:25–00:28]  Scene 6 — Logo lockup + CTA
               FrameFlow wordmark assembles (Frame in display, Flow in
               italic serif), tagline "The Content Studio" fades under,
               tiny URL "frameflow — out now" in the corner.
```

## Audio

- Generate a single ~28s funky/editorial instrumental via **ElevenLabs Music API** (`/v1/music`), prompt tuned for "confident editorial indie-pop, warm analog drums, mid-tempo 110bpm, soft brass hit on downbeats, cinematic but playful, no vocals". Saved to `remotion/public/audio/launch.mp3` and mounted via Remotion `<Audio>`.
- One subtle SFX swell at the Scene 5 inversion via ElevenLabs SFX (`/v1/sound-generation`, "soft paper whoosh + low brass hit, 1s").
- Note: the sandbox ffmpeg lacks `libfdk_aac`. Render with `muted: true` in the Remotion render script, then **mux audio in post with ffmpeg** (`ffmpeg -i video.mp4 -i launch.mp3 -c:v copy -c:a aac -shortest out.mp4`) to embed audio cleanly.

## Outputs

- `/mnt/documents/frameflow-launch-16x9.mp4` (1920×1080, 30fps, ~28s, h264, with audio)
- `/mnt/documents/frameflow-launch-9x16.mp4` (1080×1920, 30fps, ~28s, h264, with audio) — re-composed (not just cropped) so the kinetic type re-flows for vertical
- Both delivered via `<presentation-artifact>` tags.

## Technical approach

- **Remotion project** scaffolded at `remotion/` (per video-creator skill) with two compositions: `main-16x9` and `main-9x16`, sharing scene components but with viewport-aware layout tokens.
- **Frame-driven motion only** (`useCurrentFrame` + `interpolate` / `spring`). No CSS transitions or Framer Motion.
- **Fonts**: `@remotion/google-fonts/InstrumentSerif` + `@remotion/google-fonts/Inter` loaded at module scope.
- **Audio pipeline**: generate MP3 via a small Node script using `LOVABLE_*` env / `ELEVENLABS_API_KEY` (will check secrets first; if missing, ask user to add `ELEVENLABS_API_KEY`).
- **Render**: programmatic `scripts/render-remotion.mjs` with `chrome-for-testing` + `muted: true` per sandbox rules, then ffmpeg mux for audio. Each render kept under the 600s exec timeout (28s @ 30fps × 2 comps, concurrency 2).
- **QA**: render `bunx remotion still` snapshots at frames 30 / 120 / 300 / 540 / 720 for both comps and visually inspect for overflow, contrast, alignment before final render.

## What I'll need from you

- Confirm I can use **ElevenLabs** for music + SFX. If `ELEVENLABS_API_KEY` isn't already set, I'll ask you to add it before generating audio. If you'd rather skip generated audio entirely, I'll ship the video silent and you can add a track in post.

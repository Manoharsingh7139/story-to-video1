## Goal

Ship a public landing page at `/` that is a **work of art** — a bold, expressive, editorial-magazine layout for FrameFlow. Forest-green + warm paper brand stays locked; energy is dialed to 5 (loud, expressive, magazine-cover scale).

Currently `/` redirects to `/signin` or `/app`. We'll change that so unauthenticated visitors land on the marketing page; signed-in users still go to `/app`.

## Visual direction (locked taste)

- **Palette**: existing forest (`hsl(160 35% 25%)`) on warm paper (`hsl(45 20% 98%)`), ink black, hairline borders. No new colors except one accent moment (warm ember pulled from existing chart tokens) for the live demo band.
- **Type**: Fraunces (editorial display) at magazine-cover scale — `clamp(72px, 12vw, 200px)` for the hero word. Plus Jakarta Sans for sub-display. Inter for body. Italic Fraunces for ledes. Tabular nums where numbers appear.
- **Energy = 5**: oversized type that bleeds to edges, asymmetric pull-quotes, rotated/tilted scene cards, marquee-style horizontal scroll, paper grain visible, big hairline rules with eyebrow labels like a print masthead ("ISSUE 01 — FRAMEFLOW QUARTERLY").
- **Texture**: reuse `.bg-paper` SVG grain, `.hairline`, `.shadow-paper`, `.editorial-display`, `.tnum` — no new utilities invented.

## Page structure

```text
┌─────────────────────────────────────────────────────────┐
│ Masthead bar — wordmark · nav (Product/Themes/Pricing)  │
│                  · Sign in · "Start free" (primary)     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ISSUE 01 — FRAMEFLOW QUARTERLY · MAY 2026             │
│   ───────────────────────────────────────────           │
│                                                         │
│       Words                  (massive Fraunces,         │
│       become                  staggered baseline,       │
│       watch·able.             "able" italic, leaf       │
│                               mark inline)              │
│                                                         │
│   Italic lede paragraph (2 lines, max-w-prose)          │
│   [Start free →]  [Watch the 30s reel]                  │
│                                                         │
│   ↓ scroll hint                                         │
├─────────────────────────────────────────────────────────┤
│ LIVE DEMO STRIP — full-bleed horizontal marquee of     │
│ 8 generated scene thumbnails (uses real SlideThumbnail │
│ + sampleDeck). Tilted ±2°, paper shadow, hover lifts.  │
│ Auto-scrolls slowly; pauses on hover.                  │
├─────────────────────────────────────────────────────────┤
│ HOW IT WORKS — 3 acts, asymmetric magazine spread      │
│                                                         │
│   01 / SCRIPT      02 / SCENES       03 / VOICE        │
│   ────────────    ────────────       ────────────      │
│   Drop a take.    We cut the         Clone your        │
│   We listen.      story into         voice. Press      │
│                   frames.            play.             │
│                                                         │
│   Each act: oversize numeral (Fraunces 240px outline), │
│   illustration from EditorialIllustrations.tsx,        │
│   short italic lede, hairline divider, micro-caption.  │
├─────────────────────────────────────────────────────────┤
│ THEME GALLERY — masonry of 9 theme cards               │
│ (studio · editorial · midnight · minimal · noir ·      │
│  corporate · playful · darktech · warm)                │
│ Each card renders a real <SlideView/> at 16:9 with    │
│ the theme applied. Hover: scale-105, accent glow.     │
│ Pull-quote interrupts the grid 2/3 down ("Design is   │
│ our only moat." — set in 96px italic Fraunces).        │
├─────────────────────────────────────────────────────────┤
│ COLOPHON FOOTER — masthead-style                       │
│ Three columns: Product / Themes / About                │
│ Big closing wordmark bleeding off bottom edge.         │
│ © FrameFlow MMXXVI · set in small caps                 │
└─────────────────────────────────────────────────────────┘
```

## Files

**New**
- `src/pages/marketing/Landing.tsx` — composes the sections.
- `src/components/marketing/Masthead.tsx` — top nav with wordmark + CTAs.
- `src/components/marketing/MagazineHero.tsx` — oversized Fraunces hero w/ issue eyebrow.
- `src/components/marketing/DemoMarquee.tsx` — auto-scrolling thumbnail strip (pure CSS `@keyframes` marquee via tailwind `animation`).
- `src/components/marketing/HowItWorks.tsx` — 3-act spread.
- `src/components/marketing/ThemeGallery.tsx` — masonry of theme previews + interrupting pull-quote.
- `src/components/marketing/Colophon.tsx` — footer.

**Modified**
- `src/App.tsx` — add public route `/` → `Landing`. Move existing `Index` redirect to handle the signed-in case inside `Landing` (or wrap with a `PublicOnly` that sends authed users to `/app`).
- `src/pages/Index.tsx` — keep as-is or repurpose; simplest path is to point `/` directly at `Landing` and let the in-page CTAs route signed-in users to `/app`.

**No changes** to `index.css`, `tailwind.config.ts`, brand tokens, Wordmark, or AppShell.

## Reused building blocks (no reinvention)

- `<Wordmark>` for nav + footer marks.
- `<SlideThumbnail>` / `<SlideView>` from `src/components/preview/` and `src/components/prototype/` for the demo strip and theme gallery — guarantees the marketing page shows the actual product output.
- `THEMES` from `src/lib/prototype/themes.ts` for the gallery (all 9).
- `sampleDeck` from `src/lib/prototype/sampleDeck.ts` for demo scenes.
- `EditorialIllustrations` for the how-it-works act illustrations.
- shadcn `Button` (`default` + `outline` + `ghost` variants only — no invented variants).
- Existing animations: `animate-fade-in-up`, `animate-fade-in`, `animate-float`. Add one new keyframe `marquee` inline via Tailwind arbitrary `[animation:marquee_40s_linear_infinite]` so we don't touch `tailwind.config.ts`.

## Motion & interaction

- Hero word: letters fade-up with 60ms stagger on mount.
- Demo strip: infinite horizontal marquee, pauses on `:hover`.
- Scene cards: 200ms `transition-transform`, lift + un-tilt on hover.
- Theme gallery cards: `hover:scale-[1.02]`, accent-colored glow ring via `shadow-[0_20px_60px_-20px_theme.accent]` inline style.
- Scroll-triggered reveals on section enter using `IntersectionObserver` + `animate-fade-in-up`.
- Respect `prefers-reduced-motion` — marquee freezes, reveals become instant.

## Routing & auth

- `/` becomes public `Landing`.
- Hero CTAs: "Start free" → `/signup`, "Sign in" → `/signin`, signed-in visitors see "Open Studio" → `/app` instead (read `useAuth()`).
- `/app/*` and `/signin`, `/signup` unchanged.

## SEO

- Page-level `<title>` and meta description already in `index.html` reference FrameFlow — keep.
- Single `<h1>` ("Words become watchable.").
- Semantic `<section>` per band with `aria-label`.
- Alt text on all illustrations and theme previews ("Editorial theme preview — dark serif on cream").
- Theme cards lazy-loaded below the fold.

## Out of scope

- No pricing page, no FAQ, no testimonials (user excluded these).
- No blog, no docs, no waitlist form.
- No new color tokens, no new fonts, no Wordmark or AppShell changes.
- No backend, no analytics wiring.

## Acceptance

1. Visiting `/` while signed-out shows the new Landing page (not signin).
2. Visiting `/` while signed-in still gives a clear path to `/app` (CTA swap).
3. Hero, demo strip, how-it-works, theme gallery, footer all render with real product components and real theme data.
4. All colors come from existing CSS variables; no hex codes added.
5. Page passes a manual viewport check at 1440 / 1024 / 768 / 375 — nothing clips, marquee scrolls smoothly, type stays inside the page.

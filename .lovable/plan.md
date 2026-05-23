# Make the landing page fun & funky

Keep everything that already works (Masthead → MagazineHero → DemoMarquee → HowItWorks → ThemeGallery → Colophon). Layer the following on top so the page feels alive, curious, and a little mischievous — without breaking the editorial design language.

## 1. Motion polish on what already exists

- **Hero kinetic headline** — animate the MagazineHero title with a staggered word reveal (clip-path + translateY), plus a subtle, slow parallax on the eyebrow/byline as the user scrolls.
- **Cursor-reactive accents** — large headline letters tilt 2–3° toward the cursor (magnetic effect). Reduces to none on touch / reduced-motion.
- **Scroll-linked underline** — the rule under the masthead grows from 0→100% width as the user scrolls past the hero, like an editorial progress bar.
- **DemoMarquee upgrade** — pause on hover, items scale + lift, and reveal a tiny "Play" affordance that scrubs a 2s loop of the demo video inline.
- **HowItWorks number tickers** — step numbers (01, 02, 03) flip-animate into view; cards rise with a 60ms stagger on scroll.
- **ThemeGallery hover** — each theme tile cross-fades to a moving preview (Ken Burns) and tilts on cursor; click → ripple before navigation.
- **Sticky CTA pill** — morphs from "Sign in" to "Start your story →" after the user scrolls past HowItWorks. Subtle breathing glow.

## 2. Two new sections to add curiosity

**A. "Watch it think" — live transformation strip** (after DemoMarquee)
A horizontal three-pane strip: raw text on the left → storyboard frames in the middle → final video thumbnail on the right. Auto-cycles through 3 sample stories every 5s with a smooth morph between states. Gives the visitor an "aha" in under 5 seconds.

```text
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Your idea  │ →  │  Storyboard │ →  │   Video     │
│  (typing…)  │    │  (frames)   │    │  (playing)  │
└─────────────┘    └─────────────┘    └─────────────┘
```

**B. "Try a prompt" — interactive teaser** (before Colophon)
A single input that says *"Tell me a story about…"*. As the user types, animated tag chips below light up (mood, length, voice). On submit → page scrolls to a pre-rendered example video matching their vibe, and the sign-in dialog opens with the prompt preserved. No backend needed; it's a curiosity hook.

## 3. Personality details (small, high-impact)

- **Floating editorial marginalia** — pull-quotes ("made in 4 minutes", "no editor required") fade in/out at the page edges as you scroll.
- **Easter egg** — typing `story` anywhere on the page triggers a one-time confetti of typographic glyphs (✺ ✦ ❋) in the sage palette.
- **Cursor ribbon** — a thin sage trail follows the cursor inside the hero only. Disabled on touch.
- **Section transitions** — replace flat section breaks with a torn-paper SVG divider that shifts horizontally on scroll.
- **Sound toggle (off by default)** — a tiny speaker icon in the corner; when on, hovers and section reveals get a soft typewriter/paper click.

## 4. Technical notes

- All motion via **Framer Motion** (`motion/react`) with `useReducedMotion` honored everywhere.
- Scroll effects via `useScroll` + `useTransform` — no third-party scroll libraries.
- Cursor effects gated by `(pointer: fine)` media query.
- New sections live as `src/components/marketing/LiveTransform.tsx` and `PromptTeaser.tsx`, slotted into `Landing.tsx` between existing sections.
- Confetti via a tiny local component (no library) using CSS transforms.
- Zero changes to colors / typography / spacing tokens — everything uses existing semantic tokens.

## 5. Suggested build order

1. Hero kinetic headline + scroll underline + sticky CTA morph
2. DemoMarquee hover-play + ThemeGallery tilt previews
3. New section: **Watch it think**
4. New section: **Try a prompt**
5. Marginalia, cursor ribbon, easter egg, sound toggle

Each step is independently shippable — we can stop after any of them.

---

**Open question before I build:** want me to do **all five** in one pass, or start with steps 1–3 (motion polish + the "Watch it think" section) so you can react before we add the interactive prompt teaser?

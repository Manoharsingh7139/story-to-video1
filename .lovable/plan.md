## Add Logo to Landing Page

### Context
The nav bar was removed in a prior edit, so the page currently opens straight into the "Words become watchable." headline with zero brand identification. The `frameflow-logo.png` asset exists but is only used as a tiny 22–36 px icon inside the `<Wordmark>` component.

### Goal
Place the logo boldly and meaningfully — bookending the page — so the brand is unmistakable without cluttering the editorial layout.

### Changes

#### 1. MagazineHero — Masthead logo above the headline
- Insert the logo image as a large rounded mark (80–100 px) at the very top of the hero, before the headline.
- Style it with `shadow-paper` and a subtle `border hairline` so it feels like a physical publication stamp.
- Keep it aligned left with the rest of the hero content (inside the `max-w-[1400px]` container).
- Fade it in with the same `animate-fade-in-up` timing as the headline.

#### 2. Colophon — Oversized watermark logo
- Add a second, very large (200–280 px), low-opacity (`text-foreground/[0.04]`) logo mark behind/overlapping the colophon text block, similar to the oversized "FrameFlow." text already there.
- Position it absolutely so it acts as a watermark rather than pushing content down.
- This creates a bold visual bookend at the bottom of the page.

### Technical notes
- Import the PNG directly into each component: `import logoSrc from "@/assets/frameflow-logo.png"`.
- Use a rounded container (`rounded-[14px] overflow-hidden`) to match the logo's square mark shape used in `<Wordmark>`.
- No changes to routing, auth, or other sections.

### Files to edit
- `src/components/marketing/MagazineHero.tsx`
- `src/components/marketing/Colophon.tsx`
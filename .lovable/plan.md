
# /app — Editorial Redesign

You're right. The current shell is generic. It uses placeholder gradient blocks as fake thumbnails, default shadcn cards stacked at equal weight, and primitive SVG empty-state illustrations. Nothing about it would survive a design review at Linear, Notion, or Arc. This plan is **not** about new features — it's about rebuilding the surfaces we already shipped with the same obsession the editor has.

## The diagnosis (what's wrong, specifically)

1. **Fake thumbnails everywhere** — every project/template card is `bg-gradient-to-br from-primary/15 to-primary/5` + centered text. The laziest possible move. Reads as a wireframe, not a product.
2. **Wordmark is a generic "Cs" rounded square monogram** — no character, no relationship to the forest brand.
3. **Empty states use primitive SVGs** — concentric circles + a leaf shape. They look like a placeholder kit.
4. **Dashboard has no rhythm** — stats / checklist / quick-start / recent / activity are all `Card`s of similar weight with `font-display text-xl` headers. No hero, no editorial pacing.
5. **Sidebar is default shadcn** — no signature header, no project switcher feel, account row is cramped.
6. **Topbar is a thin border strip** — no eyebrow rhythm, breadcrumbs missing on subpages, no "saved" indicator pattern.
7. **Quick-start cards** — Lucide icon top-left, title, gray subhead. Identical to every AI-generated dashboard on the internet.
8. **Universal `hover:-translate-y-0.5 hover:shadow-premium`** on every card. Lazy.
9. **Generic spacing** — `max-w-6xl px-6 py-8 space-y-10` everywhere. No considered grid, no asymmetry.

## The direction

**Editorial software.** Think the marriage of Are.na's restraint, Linear's density, and Stripe's typographic confidence. Forest palette stays. Every surface earns its space.

### Design principles for this pass

- **Earn the pixel** — no element exists without a reason. Remove before adding.
- **Asymmetric grids** — break the equal-column reflex. Hero cells, supporting cells.
- **Typography is the UI** — Fraunces (serif display) reintroduced for hero moments alongside Plus Jakarta. Numbers in tabular lining figures with `font-feature-settings: "tnum"`.
- **Real previews, not gradients** — a `<SlideThumbnail>` component that renders the actual first slide of a project at 1/6 scale using the existing `SlideView` engine. Same for templates.
- **Texture, sparingly** — a paper-grain noise overlay (8% opacity SVG) on signature surfaces (auth panel, dashboard hero, empty states). Already hinted at by the warm off-white background.
- **Custom marks, not stock** — every illustration drawn for this product. Empty states get hand-composed editorial scenes, not concentric circles.
- **Motion with restraint** — no universal hover lift. Different surfaces move differently: cards reveal a 1px primary underline on hover; sidebar items slide a 2px accent bar; thumbnails crossfade to a "play" affordance.

## Scope of this pass (what changes, file by file)

### Foundation (`src/index.css`, `tailwind.config.ts`)

- Add **Fraunces** as `--font-serif` for editorial moments (hero greetings, empty-state titles, quote panels). Keep Plus Jakarta as `--font-display` for UI titles, Inter for body.
- New tokens: `--surface` (slightly warmer than card for nested surfaces), `--ink` (true near-black for headlines vs. softer `--foreground`), `--hairline` (border at 35% opacity for ultra-fine dividers).
- New shadow: `--shadow-paper` (a single 1px hairline + 8px soft drop) for the editorial "card lifted off paper" feel.
- A reusable `bg-paper` utility — base color + inline SVG noise data-URL at ~6% opacity.
- Tabular figures utility `.tnum`.

### New signature components

- **`<SlideThumbnail project={p} />`** — renders the actual slide via a memoized scaled `SlideView` (scale ~0.16, pointer-events-none, `aspect-video`, hairline border, paper shadow). Replaces every gradient block in Dashboard / Library / Templates / Continue editing rail. This single change carries 70% of the perceived quality lift.
- **`<EditorialHeader>`** — reusable hero block: small caps eyebrow, large Fraunces title (`text-4xl md:text-5xl tracking-[-0.025em] leading-[1.05]`), supporting line in muted, optional inline metric row with tabular figures and hairline dividers.
- **`<MetricRow>`** — replaces the three boxed stat cards. A single row of label/value pairs separated by hairlines, no boxes. Numbers are large Fraunces with `tnum`, labels are 10px tracked uppercase.
- **`<HoverPreviewCard>`** — project card with: real thumbnail, title in Plus Jakarta Medium, meta line (slides · theme dot · updated), context menu trigger appearing on hover only. Hover state: thumbnail scales 1.02 inside its frame, title gains a 1px underline animating from left to right, no card translation.
- **`<KBD>`** — keyboard-shortcut chip for the new command palette and tooltips.

### Wordmark redesign (`src/components/Wordmark.tsx`)

Drop the "Cs" rounded square. New mark: a custom SVG glyph — a bracketed serif "C" with a small leaf notch (3 strokes, hand-tuned), in `hsl(var(--primary))`. Wordmark uses Fraunces for "Studio" and Plus Jakarta Medium for "Content" — bilingual typography that signals what the product is (writing → video). Already-shipped sizing API kept.

### Empty-state illustrations (`src/components/empty/EmptyState.tsx`)

Replace the three primitive SVGs with hand-composed editorial scenes (still inline SVG, still tinted via `currentColor`):

- **Library empty** — a small "shelf": three stacked sheets of paper with a folded corner, a thin shadow, one sheet slightly askew. Reads as a manuscript pile.
- **History empty** — a vertical timeline rule with three small stamps (●, ○, ●) and a tiny pen-mark crossing through one. Suggests a logbook.
- **Dashboard / first-run** — a single sheet of paper with three lines of "writing" rendered as varied-length strokes, transforming into a tiny 16:9 frame at the bottom-right. The metaphor of the product, drawn.

Each illustration ~140×140, line-only at 1.25–1.5px stroke, paired with a Fraunces headline and a single CTA.

### `AppShell.tsx` — sidebar + topbar overhaul

**Sidebar:**
- Header: full Wordmark (collapsed → just the new mark). Below it, a single `New video` row that is *not* a button — it's a sidebar item with a `+` mark and a `⌘N` `<KBD>` on the right. Feels native, not bolted on.
- Nav: items get a 2px left accent bar on active (currently a pill background). Icons at 16px stroke 1.75. Labels in Inter 13/500.
- A new "Recent" group below the main nav showing the 3 most-recent projects with tiny thumbnail dots — gives the sidebar life and utility.
- Footer: account row redesigned as a single hairline-bordered tile with avatar + name + a chevron; opens the dropdown. Settings moves into that dropdown. Less crowding.

**Topbar:**
- 56px tall (currently 56), but the eyebrow + title pattern becomes a left-aligned breadcrumb (`Library / All videos`) in Inter 12, with the active crumb in foreground. The big Fraunces page title moves *into the page* as the editorial header, where it belongs.
- Right side: contextual actions + a global `⌘K` command launcher button (chip styled, monospace shortcut visible).
- Subtle bottom hairline only when content scrolls (use `IntersectionObserver` on a sentinel — already a pattern Linear/Vercel use).

### Page-by-page rework

**Dashboard (`Dashboard.tsx`)**
- Top: editorial hero — Fraunces greeting at `text-5xl`, a one-line italic subtitle ("Three drafts open. One published this week."), `MetricRow` of Videos / Slides / Minutes underneath as a hairline strip — *not* boxed cards.
- Welcome checklist redesigned as a horizontal "card" with three numbered steps separated by vertical hairlines, each with its own micro-illustration. The next step has a single `→` that shifts on hover. No `animate-pulse-glow`.
- Quick-start: dropped from three equal cards to **one hero "Paste your writing" card (8 cols)** plus two stacked supporting actions (Templates, From a doc, 4 cols). The hero card has a real, animated cursor in a faux text field — invites action.
- Continue editing: 2-up large + 4-up small asymmetric grid using real `SlideThumbnail`s.
- Recent activity: a quiet list with hairline rows, `tnum` timestamps right-aligned, type icon at 12px. No `Card` wrapper.

**Library (`Library.tsx`)**
- Header: `EditorialHeader` with project count as part of the eyebrow ("Library · 12 videos").
- Toolbar: search becomes a borderless input with a hairline underline that thickens on focus; sort and view-toggle become a single segmented control on the right. Add a list-view that's a true table with sortable headers (Title, Slides, Theme, Voice, Updated) — for power users.
- Grid: real thumbnails. Card has no border by default — only a hairline that becomes primary on hover. Title underlines on hover (no translation). Context menu appears on hover only.

**History (`History.tsx`)**
- Centered `max-w-3xl` is correct, but reframe as a **logbook**: the day labels become large Fraunces dates ("Today · 11 May") with a long hairline beside them. Each entry: timestamp in `tnum` at the left gutter (88px), icon, action sentence in serif italics for the verb. Subtle, premium, opinionated.

**Templates (`Templates.tsx`)**
- Real preview thumbnails (render the seed deck's first slide).
- Category headings get oversized Fraunces numbers ("01 — Pitches", "02 — Courses") in a side gutter — editorial table-of-contents feel.
- Hover reveals a "Preview" affordance that opens a quick-look dialog showing 3 sample slides before "Use template".

**Brand (`Brand.tsx`)**
- Two-column layout: left rail = the kit (logo, color, voice). Right rail = a **live preview card** rendering a sample slide using the current brand kit values. Changing the accent updates it in real time. This is the moment the page earns its existence.
- Color picker: replace the freeform HSL string field (terrible UX — was forced by the constraint of HSL values) with a curated palette of 8 forest-friendly accents *plus* an HSL custom field for power users. Show the resulting color name (e.g. "Moss", "Pine", "Ink") for personality.

**Settings, SignIn, SignUp**
- Settings: same editorial header pattern. Sections separated by Fraunces section titles + hairlines, no nested cards.
- Auth pages: keep the split-screen, but replace the static gradient panel with a slow Ken Burns-style loop of three editorial slides (text → quote → mark). One thoughtful detail.

### Command palette (`⌘K`) — small new addition

A `cmdk`-based palette (`shadcn/ui` already exposes it) that does: jump to project, jump to nav item, create new video, switch theme. This is the difference between an app and a tool. Wired into the topbar chip. Five files, ~150 LOC.

## Out of scope for this pass

- New features beyond the command palette
- Real backend / Cloud
- The editor itself (separate obsession session)
- Mobile-first redesign
- Dark mode (still mirroring light per current setup)

## Technical notes

- New files: `src/components/preview/SlideThumbnail.tsx`, `src/components/editorial/EditorialHeader.tsx`, `src/components/editorial/MetricRow.tsx`, `src/components/editorial/HoverPreviewCard.tsx`, `src/components/ui/kbd.tsx`, `src/components/CommandPalette.tsx`, `src/assets/illustrations/*.tsx` (3 inline SVG components).
- Edits: `src/index.css` (tokens, paper utility, Fraunces font-face), `tailwind.config.ts` (`fontFamily.serif`), `src/components/Wordmark.tsx` (new mark + bilingual type), `src/components/empty/EmptyState.tsx` (swap illustrations, add serif title variant), `src/components/app-shell/AppShell.tsx` (sidebar + topbar rework), all six `src/pages/app/*.tsx` files.
- Fraunces loaded via `<link>` in `index.html` with `display=swap`, weights 400/500/600, optical sizing for headings.
- The `SlideThumbnail` component will use the existing `SlideView` inside a fixed-aspect frame with `transform: scale(0.16)` and `transform-origin: top left`, sized via the parent's width — no re-implementation of the slide engine.
- No new dependencies needed (`cmdk` already in `shadcn/ui`).

## Why this matters

The editor screen is where the product is impressive today. The shell needs to set the same expectation from the very first second after sign-in — otherwise the contrast makes the editor feel accidental. After this pass, every surface from `/signin` to `/app/editor/:id` will share one voice.

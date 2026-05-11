# Content Studio — App Shell, Auth & Workspace

Turn the current single-flow prototype (Input → Generating → Editor) into a complete app: mocked email/password auth, collapsible sidebar shell, and the workspace surfaces a real product needs (Dashboard, Library, History, Templates, Brand kit, Settings). All data stays mocked in `localStorage` per your choice — no backend yet, but the shape is production-ready so we can swap in Lovable Cloud later without rewrites.

## Information architecture

```text
/ (public)
  /signin              Email + password (mocked)
  /signup              Email + password (mocked)

/app (protected shell — sidebar + topbar)
  /app                 Dashboard (home)
  /app/new             InputScreen (current "/" flow)
  /app/generating      GeneratingScreen
  /app/editor/:id      EditorScreen (loads project by id)
  /app/library         All saved videos (grid + list)
  /app/history         Activity timeline
  /app/templates       Starter templates gallery
  /app/brand           Brand kit (logo, colors, default voice)
  /app/settings        Profile, preferences, danger zone
```

`/` redirects to `/app` when signed in, else `/signin`.

## App shell

Built on shadcn `Sidebar` (`collapsible="icon"`) inside a `SidebarProvider`.

- **Sidebar (left)**: Wordmark, primary nav (Dashboard, Library, History, Templates, Brand kit), bottom: Settings + user menu (avatar, email, sign out). Collapses to 56px icon rail with tooltips. Active route highlighted with `bg-primary/10 text-primary`.
- **Topbar (in each route)**: route title, breadcrumbs, contextual actions (e.g. "New video" CTA on Dashboard/Library, "Export" on Editor).
- **Global "New video" FAB-style CTA** in the sidebar header — primary forest button, always one click away.
- Responsive: sidebar becomes a Sheet drawer below `md`.

## Auth (mocked)

A tiny `useAuth()` hook backed by `localStorage` (`cs.user`, `cs.users`). No real cryptography — this is a design prototype.

- `/signin`, `/signup`: split-screen layout, left = form, right = editorial forest panel with a rotating quote/serif headline ("Turn writing into watchable stories.").
- Validation with `zod`: email format, password ≥8 chars. Inline errors, loading state, success toast.
- `RequireAuth` wrapper around `/app/*` redirects to `/signin?next=…`.
- Sign-out clears session and routes home.
- We will note in the UI (small text under form) that this is a demo account stored locally.

## First-user experience

Every list view ships with an obsessed-over empty state — large serif headline, one-line muted subhead, illustrative SVG (simple geometric forest motif using design tokens), and a single primary CTA.

- **Dashboard empty**: "Welcome, {name}. Let's make your first video." → "Start from text" + "Browse templates".
- **Library empty**: "Your library is quiet." → "Create video".
- **History empty**: "Nothing's happened yet." (subtle).
- **Templates**: never empty (seeded), but each card hover reveals "Use template".
- **Brand kit**: prefilled with sensible defaults plus "Personalize your brand" callout banner that dismisses to `localStorage`.

A first-run **welcome checklist** appears on Dashboard until dismissed: (1) Create your first video, (2) Set your brand colors, (3) Pick a default voice. Each item links to the relevant screen and checks itself off on completion.

## Dashboard

- Greeting (serif, time-of-day aware) + project count stat row (Videos, Drafts, Minutes generated — mocked).
- **Quick start** cards: Paste text, Upload doc, From template.
- **Continue editing** rail: last 4 projects (thumbnail, title, edited-ago, hover → Open / Duplicate / Delete).
- **Recent activity** (last 5 items from history) with "View all".

## Library

- Grid of project cards: slide-1 mini preview, title, slide count, theme chip, updated-at, voice.
- Toolbar: search, sort (Recent / Name / Duration), view toggle (grid/list), filter by theme.
- Card menu: Open, Duplicate, Rename, Export, Delete (with confirm).
- Bulk select for delete.

## History

Timeline grouped by Today / Yesterday / This week / Earlier. Each entry: icon + verb + project link + timestamp.
Tracked events: project created, slide regenerated, slide edited via chat, layout changed, theme changed, exported.
Hooked into existing `usePrototypeStore` mutations via a thin `historyLog` middleware.

## Templates

8–12 seeded starter decks (Pitch, Course intro, Product launch, Weekly recap, Tutorial, Case study, Onboarding, Founder update). Card preview + "Use template" duplicates the seed deck into a new project and routes to `/app/editor/:id`.

## Brand kit

- Logo upload (stored as data URL in mock).
- Brand color picker (tied to a project-level accent override).
- Default voice + pace + tone.
- Default theme.
- Saved values become the defaults for new projects.

## Settings

- Profile (name, email, avatar initials).
- Preferences (default theme, default voice, reduced motion).
- Danger zone (clear all local data, sign out everywhere).

## Data model (localStorage, typed)

```ts
type Project = {
  id; title; createdAt; updatedAt;
  themeId; voice; voiceMode;
  slides: Slide[];           // existing type
  thumbnail?: string;        // first-slide snapshot (later)
};
type HistoryEntry = { id; projectId; type; label; at };
type BrandKit = { logoDataUrl?; accentHsl?; defaultVoice; defaultTheme; defaultPace; defaultTone };
type User = { id; email; name; createdAt };
```

Stored under `cs.projects`, `cs.history`, `cs.brand`, `cs.user`. A `useProjects()` hook (zustand, persisted) replaces the in-memory deck for cross-route persistence. Existing `usePrototypeStore` becomes the "active editor session" and syncs back to the project on save.

## Editor integration

- Editor loads project by `:id`, hydrates `usePrototypeStore`, and writes back on every mutation (debounced).
- Topbar shows breadcrumb `Library / {title}` + "Saved · 2s ago" indicator.
- Back button returns to Library, not `/`.

## Visual polish (carries the forest system)

- All new surfaces use existing tokens (`bg-card`, `border-border`, `shadow-premium`, `--gradient-primary`).
- Empty-state illustrations: lightweight inline SVGs (concentric arcs, single leaf-like mark) tinted with `hsl(var(--primary))`.
- Micro-interactions: `animate-fade-in-up` on cards, `animate-pulse-glow` on the welcome checklist's next step.
- Sidebar uses Plus Jakarta Sans for labels; topbar titles use Fraunces (or Plus Jakarta — match Wordmark).

---

## Technical notes

**New files**
- `src/lib/auth/useAuth.tsx` — context, sign in/up/out, persisted user.
- `src/lib/auth/RequireAuth.tsx`.
- `src/lib/data/useProjects.ts` — zustand `persist` middleware → `cs.projects`.
- `src/lib/data/useHistory.ts` — log + read.
- `src/lib/data/useBrandKit.ts`.
- `src/lib/data/seedTemplates.ts`.
- `src/components/app-shell/AppShell.tsx`, `AppSidebar.tsx`, `Topbar.tsx`, `UserMenu.tsx`.
- `src/components/empty/EmptyState.tsx` (+ inline SVG illustrations).
- `src/components/welcome/WelcomeChecklist.tsx`.
- `src/pages/auth/SignIn.tsx`, `SignUp.tsx`.
- `src/pages/app/Dashboard.tsx`, `Library.tsx`, `History.tsx`, `Templates.tsx`, `Brand.tsx`, `Settings.tsx`.

**Edits**
- `src/App.tsx` — new route tree, `AuthProvider`, `RequireAuth`, nest prototype routes under `/app`.
- `src/pages/Index.tsx` — redirect to `/app` or `/signin`.
- `src/pages/prototype/InputScreen.tsx` — on generate, create a `Project`, route to `/app/generating?id=…`.
- `src/pages/prototype/GeneratingScreen.tsx` — on done, route to `/app/editor/:id`.
- `src/pages/prototype/EditorScreen.tsx` — load by `:id`, autosave back, breadcrumb, back-to-Library.
- `src/lib/prototype/store.ts` — add `loadProject(project)` + `serialize()` for sync.

**Out of scope (v1)**
- Real backend / Lovable Cloud (we leave clean seams: every hook is the only place that touches storage).
- Collaboration, comments, sharing.
- Real video render/export (existing dialog stays mocked).
- Password reset, OAuth, email verification.
- Mobile-first redesign of the editor (shell will be responsive; editor stays desktop-optimized).

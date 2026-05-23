import type { HistoryEntry } from "./types";

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

interface MockSeed {
  type: HistoryEntry["type"];
  title: string;
  label: string;
  offset: number; // ms before now
  slideCount?: number;
  errorDetail?: string;
}

const SEEDS: MockSeed[] = [
  // Today
  { type: "project.created", title: "Q4 Investor Update — Cold Open", label: "Created “Q4 Investor Update — Cold Open”", offset: 8 * MIN, slideCount: 9 },
  { type: "slide.regenerated", title: "Brand Manifesto v3", label: "Regenerated slide 4 with a fresh layout", offset: 42 * MIN, slideCount: 12 },
  { type: "project.exported", title: "Launch Trailer — 16:9", label: "Exported “Launch Trailer — 16:9”", offset: 2 * HOUR + 15 * MIN, slideCount: 14 },
  { type: "theme.changed", title: "Onboarding Walkthrough", label: "Switched theme to Studio", offset: 3 * HOUR + 40 * MIN, slideCount: 7 },
  { type: "slide.edited", title: "Pricing Page Explainer", label: "Edited title on slide 2", offset: 5 * HOUR + 10 * MIN, slideCount: 6 },

  // Yesterday
  { type: "project.duplicated", title: "Series A Pitch (copy)", label: "Duplicated “Series A Pitch”", offset: DAY + 2 * HOUR, slideCount: 18 },
  { type: "project.exported", title: "Customer Story — Northwind", label: "Exported “Customer Story — Northwind”", offset: DAY + 5 * HOUR, slideCount: 11 },
  { type: "project.deleted", title: "Old Draft — Untitled", label: "Deleted “Old Draft — Untitled”", offset: DAY + 7 * HOUR, errorDetail: "Removed by you — recoverable for 30 days" },

  // This week
  { type: "project.created", title: "Weekly Recap — May 18", label: "Created “Weekly Recap — May 18”", offset: 3 * DAY + 4 * HOUR, slideCount: 5 },
  { type: "slide.regenerated", title: "Feature Tour — Editor", label: "Regenerated slide 7 (kept layout)", offset: 4 * DAY + 6 * HOUR, slideCount: 10 },
  { type: "project.renamed", title: "Hero Reel v2", label: "Renamed to “Hero Reel v2”", offset: 5 * DAY + 3 * HOUR, slideCount: 8 },

  // Earlier
  { type: "project.exported", title: "Brand Film — Director's Cut", label: "Exported “Brand Film — Director's Cut”", offset: 12 * DAY, slideCount: 22 },
  { type: "project.created", title: "Conference Teaser", label: "Created “Conference Teaser”", offset: 19 * DAY, slideCount: 6 },
];

export const MOCK_HISTORY: HistoryEntry[] = SEEDS.map((s, i) => ({
  id: `mock-${i}`,
  projectId: undefined,
  projectTitle: s.title,
  type: s.type,
  label: s.label,
  at: Date.now() - s.offset,
}));

export const MOCK_SLIDE_COUNTS: Record<string, number> = SEEDS.reduce(
  (acc, s, i) => {
    if (typeof s.slideCount === "number") acc[`mock-${i}`] = s.slideCount;
    return acc;
  },
  {} as Record<string, number>,
);

export const MOCK_ERROR_DETAILS: Record<string, string> = SEEDS.reduce(
  (acc, s, i) => {
    if (s.errorDetail) acc[`mock-${i}`] = s.errorDetail;
    return acc;
  },
  {} as Record<string, string>,
);

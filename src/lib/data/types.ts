import type { Slide, ThemeId } from "@/lib/prototype/types";

export interface Project {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  themeId: ThemeId;
  voice: string;
  voiceMode: "ai" | "upload";
  slides: Slide[];
  source?: string;
  templateId?: string;
}

export type HistoryType =
  | "project.created"
  | "project.exported"
  | "project.deleted"
  | "project.duplicated"
  | "project.renamed"
  | "slide.regenerated"
  | "slide.edited"
  | "theme.changed";

export interface HistoryEntry {
  id: string;
  projectId?: string;
  projectTitle?: string;
  type: HistoryType;
  label: string;
  at: number;
}

export interface BrandKit {
  logoDataUrl?: string;
  accentHsl?: string;
  defaultVoice: string;
  defaultTheme: ThemeId;
  defaultPace: "Slow" | "Normal" | "Fast";
  defaultTone: "Neutral" | "Warm" | "Energetic";
}

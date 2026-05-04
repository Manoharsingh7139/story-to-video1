export type ThemeId = "minimal" | "editorial" | "corporate" | "playful" | "darktech" | "warm";

export type LayoutId =
  | "title"
  | "title-body"
  | "two-column"
  | "bullets"
  | "stat"
  | "divider";

export interface SlideContent {
  title?: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  stat?: string;
  statLabel?: string;
  leftTitle?: string;
  leftBody?: string;
  rightTitle?: string;
  rightBody?: string;
}

export interface Slide {
  id: string;
  layout: LayoutId;
  content: SlideContent;
  script: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  edit?: { before: Slide; after: Slide };
}

export interface Theme {
  id: ThemeId;
  name: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  fontHead: string;
  fontBody: string;
  radius: string;
}

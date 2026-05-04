export type ThemeId = "minimal" | "editorial" | "corporate" | "playful" | "darktech" | "warm";

export type LayoutId =
  | "title"
  | "title-body"
  | "two-column"
  | "bullets"
  | "stat"
  | "divider"
  | "image-left"
  | "image-right"
  | "image-full"
  | "image-grid";

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
  imageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  caption?: string;
  caption2?: string;
  caption3?: string;
  caption4?: string;
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

// Element selection keys: "title" | "subtitle" | "body" | "stat" | "statLabel"
//   | "leftTitle" | "leftBody" | "rightTitle" | "rightBody"
//   | "image" | "image:1" | "image:2" | "image:3" | "image:4"
//   | "caption:1" ... | "bullet:0" | "bullet:1" ...
export type ElementKey = string;

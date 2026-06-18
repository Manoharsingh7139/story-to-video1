export type ThemeId = "minimal" | "editorial" | "corporate" | "playful" | "darktech" | "warm" | "studio" | "noir" | "midnight";

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
  | "image-grid"
  | "image-bg-overlay"
  | "image-text-overlay"
  | "quadrant"
  | "comparison"
  | "image-bullets"
  | "stat-image"
  | "section-image-bg"
  | "definition-card"
  | "formula"
  | "worked-example"
  | "learning-objectives"
  | "key-terms"
  | "process-flow"
  | "timeline"
  | "pyramid"
  | "cycle"
  | "case-study"
  | "question-prompt"
  | "qa-recap"
  | "pros-cons"
  | "chart-explainer"
  | "citation-quote";

export type OverlayTint = "dark" | "light" | "accent";
export type OverlayStrength = "soft" | "medium" | "strong";
export type SideChoice = "left" | "right";
export type QuadrantPalette = "swot" | "neutral" | "accent";

export type TextSize = "s" | "m" | "l" | "xl";
export type TextWeight = "regular" | "bold";
export type TextAlign = "left" | "center" | "right";
export type TextColor = "text" | "muted" | "accent" | "neutral1" | "neutral2" | "neutral3";
export type BulletVariant = "list" | "numbered" | "process" | "cards" | "pillars" | "checklist";
export type BulletMarker = "dot" | "square" | "dash" | "triangle" | "check" | "number";
export type ImageShape = "square" | "rounded" | "circle" | "blob";
export type ImageTreatment = "none" | "grayscale" | "duotone" | "blur";
export type ImageBorder = "none" | "thin" | "thick";
export type CaptionPosition = "below" | "overlay" | "hidden";
export type StatSize = "m" | "l" | "xl" | "display";
export type StatDecoration = "none" | "underline" | "circle" | "gradient";

export interface SlideStyle {
  bulletVariant?: BulletVariant;
  titleSize?: TextSize; titleWeight?: TextWeight; titleAlign?: TextAlign; titleColor?: TextColor; titleAccentBar?: boolean;
  subtitleSize?: TextSize; subtitleWeight?: TextWeight; subtitleAlign?: TextAlign; subtitleColor?: TextColor;
  bodySize?: TextSize; bodyWeight?: TextWeight; bodyAlign?: TextAlign; bodyColor?: TextColor;
  statSize?: StatSize; statColor?: TextColor; statDecoration?: StatDecoration;
  imageShape?: ImageShape; imageTreatment?: ImageTreatment; imageBorder?: ImageBorder;
  captionPosition?: CaptionPosition;
  overlayTint?: OverlayTint;
  overlayStrength?: OverlayStrength;
  textCardSide?: SideChoice;
  imageSide?: SideChoice;
  quadrantPalette?: QuadrantPalette;
}

export interface SlideContent {
  title?: string;
  style?: SlideStyle;
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
  q1Title?: string; q1Body?: string;
  q2Title?: string; q2Body?: string;
  q3Title?: string; q3Body?: string;
  q4Title?: string; q4Body?: string;
  term?: string;
  formula?: string;
  chartType?: "bar" | "line";
  chartData?: { label: string; value: number }[];
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

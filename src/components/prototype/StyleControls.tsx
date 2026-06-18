import { usePrototypeStore } from "@/lib/prototype/store";
import { THEMES } from "@/lib/prototype/themes";
import type {
  SlideStyle, BulletVariant, BulletMarker, TextSize, TextWeight, TextAlign, TextColor,
  ImageShape, ImageTreatment, ImageBorder, CaptionPosition, StatSize, StatDecoration,
  LayoutId, OverlayTint, OverlayStrength, SideChoice, QuadrantPalette,
} from "@/lib/prototype/types";
import { cn } from "@/lib/utils";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
    {children}
  </div>
);

const Chip = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={cn(
      "px-2.5 py-1 rounded text-xs border transition",
      active ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-muted",
    )}
  >
    {children}
  </button>
);

const ChipRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap gap-1.5">{children}</div>
);

const useStyle = (slideId: string): SlideStyle => {
  const slides = usePrototypeStore((s) => s.slides);
  return slides.find((s) => s.id === slideId)?.content.style ?? {};
};

// ============ TEXT ============
type TextField = "title" | "subtitle" | "body";

interface TextProps { slideId: string; field: TextField; }

export const TextStyleControls = ({ slideId, field }: TextProps) => {
  const setSlideStyle = usePrototypeStore((s) => s.setSlideStyle);
  const themeId = usePrototypeStore((s) => s.themeId);
  const theme = THEMES[themeId];
  const style = useStyle(slideId);

  const sizeKey = `${field}Size` as keyof SlideStyle;
  const weightKey = `${field}Weight` as keyof SlideStyle;
  const alignKey = `${field}Align` as keyof SlideStyle;
  const colorKey = `${field}Color` as keyof SlideStyle;
  const barKey = "titleAccentBar" as const;

  const size = (style[sizeKey] as TextSize) ?? "m";
  const weight = (style[weightKey] as TextWeight) ?? (field === "title" ? "bold" : "regular");
  const align = (style[alignKey] as TextAlign) ?? "left";
  const color = (style[colorKey] as TextColor) ?? "text";

  const swatches: { id: TextColor; bg: string }[] = [
    { id: "text", bg: theme.text },
    { id: "muted", bg: theme.muted },
    { id: "accent", bg: theme.accent },
    { id: "neutral1", bg: "#111827" },
    { id: "neutral2", bg: "#6b7280" },
    { id: "neutral3", bg: "#f59e0b" },
  ];

  return (
    <div className="space-y-3">
      <Section label="Size">
        <ChipRow>
          {(["s", "m", "l", "xl"] as TextSize[]).map((s) => (
            <Chip key={s} active={size === s} onClick={() => setSlideStyle(slideId, { [sizeKey]: s } as any)}>
              {s.toUpperCase()}
            </Chip>
          ))}
        </ChipRow>
      </Section>
      <Section label="Weight">
        <ChipRow>
          <Chip active={weight === "regular"} onClick={() => setSlideStyle(slideId, { [weightKey]: "regular" } as any)}>Regular</Chip>
          <Chip active={weight === "bold"} onClick={() => setSlideStyle(slideId, { [weightKey]: "bold" } as any)}>Bold</Chip>
        </ChipRow>
      </Section>
      <Section label="Align">
        <ChipRow>
          {([
            { id: "left" as TextAlign, Icon: AlignLeft },
            { id: "center" as TextAlign, Icon: AlignCenter },
            { id: "right" as TextAlign, Icon: AlignRight },
          ]).map(({ id, Icon }) => (
            <Chip key={id} active={align === id} onClick={() => setSlideStyle(slideId, { [alignKey]: id } as any)} title={id}>
              <Icon className="h-3.5 w-3.5" />
            </Chip>
          ))}
        </ChipRow>
      </Section>
      <Section label="Color">
        <div className="flex flex-wrap gap-1.5">
          {swatches.map((sw) => (
            <button
              key={sw.id}
              type="button"
              onClick={() => setSlideStyle(slideId, { [colorKey]: sw.id } as any)}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition",
                color === sw.id ? "border-primary scale-110" : "border-border",
              )}
              style={{ background: sw.bg }}
              title={sw.id}
            />
          ))}
        </div>
      </Section>
      {field === "title" && (
        <Section label="Accent bar">
          <ChipRow>
            <Chip active={!style[barKey]} onClick={() => setSlideStyle(slideId, { titleAccentBar: false })}>Off</Chip>
            <Chip active={!!style[barKey]} onClick={() => setSlideStyle(slideId, { titleAccentBar: true })}>On</Chip>
          </ChipRow>
        </Section>
      )}
    </div>
  );
};

// ============ BULLETS / SMARTART ============
const VARIANTS: { id: BulletVariant; name: string; icon: React.ReactNode }[] = [
  { id: "list", name: "List", icon: <BulletPreview kind="list" /> },
  { id: "numbered", name: "Numbered", icon: <BulletPreview kind="numbered" /> },
  { id: "process", name: "Process", icon: <BulletPreview kind="process" /> },
  { id: "cards", name: "Cards", icon: <BulletPreview kind="cards" /> },
  { id: "pillars", name: "Pillars", icon: <BulletPreview kind="pillars" /> },
  { id: "checklist", name: "Checklist", icon: <BulletPreview kind="checklist" /> },
];

function BulletPreview({ kind }: { kind: BulletVariant }) {
  const a = "currentColor";
  switch (kind) {
    case "list":
      return (
        <svg viewBox="0 0 60 36" className="w-full h-full">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(4 ${6 + i * 11})`}>
              <circle cx="3" cy="3" r="2" fill={a} />
              <rect x="10" y="1.5" width="40" height="3" rx="1" fill={a} opacity="0.5" />
            </g>
          ))}
        </svg>
      );
    case "numbered":
      return (
        <svg viewBox="0 0 60 36" className="w-full h-full">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(4 ${6 + i * 11})`}>
              <circle cx="4" cy="3" r="3.5" fill={a} />
              <text x="4" y="4.7" fontSize="4" fill="white" textAnchor="middle" fontWeight="700">{i + 1}</text>
              <rect x="11" y="1.5" width="38" height="3" rx="1" fill={a} opacity="0.5" />
            </g>
          ))}
        </svg>
      );
    case "process":
      return (
        <svg viewBox="0 0 60 36" className="w-full h-full">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${3 + i * 19} 14)`}>
              <rect width="14" height="8" rx="2" fill={a} opacity="0.7" />
              {i < 2 && <text x="16" y="6.5" fontSize="6" fill={a}>›</text>}
            </g>
          ))}
        </svg>
      );
    case "cards":
      return (
        <svg viewBox="0 0 60 36" className="w-full h-full">
          {[0, 1, 2].map((i) => (
            <rect key={i} x={4 + i * 18} y="8" width="14" height="20" rx="2" fill="none" stroke={a} strokeWidth="1.2" />
          ))}
        </svg>
      );
    case "pillars":
      return (
        <svg viewBox="0 0 60 36" className="w-full h-full">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${4 + i * 18} 8)`}>
              <rect width="14" height="2.5" fill={a} />
              <rect y="3.5" width="14" height="16.5" fill="none" stroke={a} strokeWidth="1" opacity="0.5" />
            </g>
          ))}
        </svg>
      );
    case "checklist":
      return (
        <svg viewBox="0 0 60 36" className="w-full h-full">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(4 ${6 + i * 11})`}>
              <rect width="6" height="6" rx="1" fill={a} />
              <path d="M1.5 3.2 L2.7 4.4 L4.7 1.8" stroke="white" strokeWidth="1" fill="none" />
              <rect x="10" y="1.5" width="40" height="3" rx="1" fill={a} opacity="0.5" />
            </g>
          ))}
        </svg>
      );
  }
}

export const BulletSmartArtPicker = ({ slideId }: { slideId: string }) => {
  const setSlideStyle = usePrototypeStore((s) => s.setSlideStyle);
  const style = useStyle(slideId);
  const current = style.bulletVariant ?? "list";
  return (
    <Section label="SmartArt">
      <div className="grid grid-cols-3 gap-1.5">
        {VARIANTS.map((v) => {
          const active = current === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setSlideStyle(slideId, { bulletVariant: v.id })}
              className={cn(
                "flex flex-col items-center gap-1 p-1.5 rounded border transition text-foreground",
                active ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:bg-muted",
              )}
            >
              <div className="w-full h-9 flex items-center justify-center text-foreground">{v.icon}</div>
              <span className="text-[10px] font-medium">{v.name}</span>
            </button>
          );
        })}
      </div>
    </Section>
  );
};

// ============ IMAGE ============
export const ImageStyleControls = ({ slideId, isGrid, layout }: { slideId: string; isGrid?: boolean; layout?: LayoutId }) => {
  const setSlideStyle = usePrototypeStore((s) => s.setSlideStyle);
  const style = useStyle(slideId);
  const shape = style.imageShape ?? "square";
  const treatment = style.imageTreatment ?? "none";
  const border = style.imageBorder ?? "none";
  const cap = style.captionPosition ?? "below";
  const isOverlay = layout === "image-bg-overlay" || layout === "section-image-bg";
  const isTextCard = layout === "image-text-overlay";
  const isSideLayout = layout === "image-bullets" || layout === "stat-image";
  const tint = style.overlayTint ?? (layout === "section-image-bg" ? "accent" : "dark");
  const strength = style.overlayStrength ?? (layout === "section-image-bg" ? "strong" : "medium");
  const cardSide = style.textCardSide ?? "left";
  const imgSide = style.imageSide ?? (layout === "stat-image" ? "right" : "left");

  return (
    <div className="space-y-3">
      {isOverlay && (
        <>
          <Section label="Overlay tint">
            <ChipRow>
              {(["dark", "light", "accent"] as OverlayTint[]).map((t) => (
                <Chip key={t} active={tint === t} onClick={() => setSlideStyle(slideId, { overlayTint: t })}>{t[0].toUpperCase() + t.slice(1)}</Chip>
              ))}
            </ChipRow>
          </Section>
          <Section label="Overlay strength">
            <ChipRow>
              {(["soft", "medium", "strong"] as OverlayStrength[]).map((s) => (
                <Chip key={s} active={strength === s} onClick={() => setSlideStyle(slideId, { overlayStrength: s })}>{s[0].toUpperCase() + s.slice(1)}</Chip>
              ))}
            </ChipRow>
          </Section>
        </>
      )}
      {isTextCard && (
        <Section label="Text card side">
          <ChipRow>
            {(["left", "right"] as SideChoice[]).map((s) => (
              <Chip key={s} active={cardSide === s} onClick={() => setSlideStyle(slideId, { textCardSide: s })}>{s[0].toUpperCase() + s.slice(1)}</Chip>
            ))}
          </ChipRow>
        </Section>
      )}
      {isSideLayout && (
        <Section label="Image side">
          <ChipRow>
            {(["left", "right"] as SideChoice[]).map((s) => (
              <Chip key={s} active={imgSide === s} onClick={() => setSlideStyle(slideId, { imageSide: s })}>{s[0].toUpperCase() + s.slice(1)}</Chip>
            ))}
          </ChipRow>
        </Section>
      )}
      <Section label="Shape">
        <ChipRow>
          {(["square", "rounded", "circle", "blob"] as ImageShape[]).map((s) => (
            <Chip key={s} active={shape === s} onClick={() => setSlideStyle(slideId, { imageShape: s })}>
              {s[0].toUpperCase() + s.slice(1)}
            </Chip>
          ))}
        </ChipRow>
      </Section>
      <Section label="Treatment">
        <ChipRow>
          {(["none", "grayscale", "duotone", "blur"] as ImageTreatment[]).map((t) => (
            <Chip key={t} active={treatment === t} onClick={() => setSlideStyle(slideId, { imageTreatment: t })}>
              {t[0].toUpperCase() + t.slice(1)}
            </Chip>
          ))}
        </ChipRow>
      </Section>
      <Section label="Border">
        <ChipRow>
          {(["none", "thin", "thick"] as ImageBorder[]).map((b) => (
            <Chip key={b} active={border === b} onClick={() => setSlideStyle(slideId, { imageBorder: b })}>
              {b[0].toUpperCase() + b.slice(1)}
            </Chip>
          ))}
        </ChipRow>
      </Section>
      {isGrid && (
        <Section label="Caption">
          <ChipRow>
            {(["below", "overlay", "hidden"] as CaptionPosition[]).map((c) => (
              <Chip key={c} active={cap === c} onClick={() => setSlideStyle(slideId, { captionPosition: c })}>
                {c[0].toUpperCase() + c.slice(1)}
              </Chip>
            ))}
          </ChipRow>
        </Section>
      )}
    </div>
  );
};

export const QuadrantStyleControls = ({ slideId }: { slideId: string }) => {
  const setSlideStyle = usePrototypeStore((s) => s.setSlideStyle);
  const style = useStyle(slideId);
  const palette = style.quadrantPalette ?? "swot";
  return (
    <Section label="Quadrant palette">
      <ChipRow>
        {(["swot", "neutral", "accent"] as QuadrantPalette[]).map((p) => (
          <Chip key={p} active={palette === p} onClick={() => setSlideStyle(slideId, { quadrantPalette: p })}>{p[0].toUpperCase() + p.slice(1)}</Chip>
        ))}
      </ChipRow>
    </Section>
  );
};

// ============ STAT ============
export const StatStyleControls = ({ slideId }: { slideId: string }) => {
  const setSlideStyle = usePrototypeStore((s) => s.setSlideStyle);
  const themeId = usePrototypeStore((s) => s.themeId);
  const theme = THEMES[themeId];
  const style = useStyle(slideId);
  const size = style.statSize ?? "xl";
  const color = style.statColor ?? "accent";
  const dec = style.statDecoration ?? "none";

  const swatches: { id: TextColor; bg: string }[] = [
    { id: "accent", bg: theme.accent },
    { id: "text", bg: theme.text },
    { id: "muted", bg: theme.muted },
    { id: "neutral3", bg: "#f59e0b" },
  ];
  return (
    <div className="space-y-3">
      <Section label="Size">
        <ChipRow>
          {(["m", "l", "xl", "display"] as StatSize[]).map((s) => (
            <Chip key={s} active={size === s} onClick={() => setSlideStyle(slideId, { statSize: s })}>
              {s === "display" ? "Display" : s.toUpperCase()}
            </Chip>
          ))}
        </ChipRow>
      </Section>
      <Section label="Color">
        <div className="flex flex-wrap gap-1.5">
          {swatches.map((sw) => (
            <button
              key={sw.id}
              type="button"
              onClick={() => setSlideStyle(slideId, { statColor: sw.id })}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition",
                color === sw.id ? "border-primary scale-110" : "border-border",
              )}
              style={{ background: sw.bg }}
              title={sw.id}
            />
          ))}
        </div>
      </Section>
      <Section label="Decoration">
        <ChipRow>
          {(["none", "underline", "circle", "gradient"] as StatDecoration[]).map((d) => (
            <Chip key={d} active={dec === d} onClick={() => setSlideStyle(slideId, { statDecoration: d })}>
              {d[0].toUpperCase() + d.slice(1)}
            </Chip>
          ))}
        </ChipRow>
      </Section>
    </div>
  );
};

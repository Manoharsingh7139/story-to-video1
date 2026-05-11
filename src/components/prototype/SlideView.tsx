import { useEffect, useRef, useState } from "react";
import type { Slide, Theme, ElementKey, SlideStyle, TextSize, TextAlign, TextColor, TextWeight, BulletVariant, OverlayTint, OverlayStrength, QuadrantPalette } from "@/lib/prototype/types";

interface SlideViewProps {
  slide: Slide;
  theme: Theme;
  editable?: boolean;
  selectedKey?: ElementKey | null;
  onSelectElement?: (key: ElementKey | null) => void;
  onEdit?: (key: string, value: string) => void;
  onEditBullet?: (index: number, value: string) => void;
  scale?: number | "auto";
  className?: string;
}

const BASE_W = 1280;
const BASE_H = 720;

interface ElProps {
  elKey: ElementKey;
  selectedKey?: ElementKey | null;
  onSelect?: (k: ElementKey | null) => void;
  editable?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const Selectable = ({ elKey, selectedKey, onSelect, editable, children, style, className = "" }: ElProps) => {
  if (!editable) return <div style={style} className={className}>{children}</div>;
  const active = selectedKey === elKey;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(elKey);
      }}
      style={{
        ...style,
        outline: active ? "3px solid #3b82f6" : "none",
        outlineOffset: 4,
        cursor: "pointer",
        borderRadius: 4,
        transition: "outline-color 80ms",
      }}
      className={`hover:outline hover:outline-2 hover:outline-primary/40 ${className}`}
    >
      {children}
    </div>
  );
};

const EditableText = ({
  value, onChange, style, multiline = false, active,
}: {
  value: string; onChange?: (v: string) => void; style?: React.CSSProperties; multiline?: boolean; active?: boolean;
}) => {
  if (!onChange || !active) {
    return <div style={style} className={multiline ? "whitespace-pre-wrap" : ""}>{value}</div>;
  }
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent ?? "")}
      onClick={(e) => e.stopPropagation()}
      style={{ ...style, outline: "none", cursor: "text" }}
    >
      {value}
    </div>
  );
};

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'><rect width='16' height='9' fill='%23e5e7eb'/></svg>";

// ----- style resolvers -----
const NEUTRAL: Record<TextColor, string | null> = {
  text: null, muted: null, accent: null,
  neutral1: "#111827", neutral2: "#6b7280", neutral3: "#f59e0b",
};
const resolveColor = (c: TextColor | undefined, theme: Theme, fallback: string) => {
  if (!c) return fallback;
  if (c === "text") return theme.text;
  if (c === "muted") return theme.muted;
  if (c === "accent") return theme.accent;
  return NEUTRAL[c] ?? fallback;
};
const sizeMul = (s: TextSize | undefined): number => ({ s: 0.75, m: 1, l: 1.25, xl: 1.55 }[s ?? "m"]);
const weightVal = (w: TextWeight | undefined, fallback: number): number => (w === "bold" ? 700 : w === "regular" ? 400 : fallback);
const alignVal = (a: TextAlign | undefined): React.CSSProperties["textAlign"] => a ?? "left";

const imageShapeRadius = (shape: string | undefined): string => {
  switch (shape) {
    case "rounded": return "16px";
    case "circle": return "50%";
    case "blob": return "62% 38% 55% 45% / 48% 60% 40% 52%";
    default: return "0px";
  }
};
const imageFilter = (t: string | undefined): string => {
  switch (t) {
    case "grayscale": return "grayscale(1)";
    case "blur": return "blur(2px) brightness(1.05)";
    default: return "none";
  }
};

const overlayBg = (tint: OverlayTint | undefined, strength: OverlayStrength | undefined, theme: Theme): string => {
  const base =
    tint === "light" ? "255,255,255" :
    tint === "accent" ? hexToRgb(theme.accent) :
    "0,0,0";
  const alpha = strength === "soft" ? 0.3 : strength === "strong" ? 0.75 : 0.55;
  return `rgba(${base}, ${alpha})`;
};

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

const quadrantColors = (palette: QuadrantPalette | undefined, theme: Theme): { bg: string; fg: string; badge: string }[] => {
  if (palette === "neutral") {
    return [
      { bg: theme.surface, fg: theme.text, badge: theme.accent },
      { bg: theme.surface, fg: theme.text, badge: theme.accent },
      { bg: theme.surface, fg: theme.text, badge: theme.accent },
      { bg: theme.surface, fg: theme.text, badge: theme.accent },
    ];
  }
  if (palette === "accent") {
    const a = theme.accent;
    return [
      { bg: `rgba(${hexToRgb(a)}, 0.10)`, fg: theme.text, badge: a },
      { bg: `rgba(${hexToRgb(a)}, 0.18)`, fg: theme.text, badge: a },
      { bg: `rgba(${hexToRgb(a)}, 0.26)`, fg: theme.text, badge: a },
      { bg: `rgba(${hexToRgb(a)}, 0.34)`, fg: theme.text, badge: a },
    ];
  }
  // SWOT default — green / red / blue / amber soft tints
  return [
    { bg: "rgba(34,197,94,0.14)",  fg: theme.text, badge: "#16a34a" },
    { bg: "rgba(239,68,68,0.14)",  fg: theme.text, badge: "#dc2626" },
    { bg: "rgba(59,130,246,0.14)", fg: theme.text, badge: "#2563eb" },
    { bg: "rgba(245,158,11,0.16)", fg: theme.text, badge: "#d97706" },
  ];
};

export const SlideView = ({
  slide, theme, editable = false, selectedKey = null, onSelectElement,
  onEdit, onEditBullet, scale = "auto", className = "",
}: SlideViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(1);

  useEffect(() => {
    if (scale !== "auto") return;
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setAutoScale(Math.min(rect.width / BASE_W, rect.height / BASE_H));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scale]);

  const s = scale === "auto" ? autoScale : scale;
  const st: SlideStyle = slide.content.style ?? {};

  const headFont = theme.fontHead;
  const bodyFont = theme.fontBody;

  const titleStyle = (baseSize: number): React.CSSProperties => ({
    fontFamily: headFont,
    color: resolveColor(st.titleColor, theme, theme.text),
    fontWeight: weightVal(st.titleWeight, 700),
    fontSize: baseSize * sizeMul(st.titleSize),
    textAlign: alignVal(st.titleAlign),
    lineHeight: 1.1,
  });
  const subtitleStyle = (baseSize: number): React.CSSProperties => ({
    fontFamily: bodyFont,
    color: resolveColor(st.subtitleColor, theme, theme.muted),
    fontWeight: weightVal(st.subtitleWeight, 400),
    fontSize: baseSize * sizeMul(st.subtitleSize),
    textAlign: alignVal(st.subtitleAlign),
  });
  const bodyStyle = (baseSize: number): React.CSSProperties => ({
    fontFamily: bodyFont,
    color: resolveColor(st.bodyColor, theme, theme.text),
    fontWeight: weightVal(st.bodyWeight, 400),
    fontSize: baseSize * sizeMul(st.bodySize),
    textAlign: alignVal(st.bodyAlign),
    lineHeight: 1.5,
  });
  const mutedStyle = { fontFamily: bodyFont, color: theme.muted };

  const renderText = (key: string, value: string, style: React.CSSProperties, multiline = false) => (
    <Selectable elKey={key} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
      <EditableText
        value={value}
        onChange={onEdit ? (v) => onEdit(key, v) : undefined}
        style={style}
        multiline={multiline}
        active={editable && selectedKey === key}
      />
    </Selectable>
  );

  const accentBar = (color: string) => st.titleAccentBar === false ? null : null;

  // image renderer with style
  const renderImage = (key: string, url: string | undefined, style: React.CSSProperties) => {
    const radius = imageShapeRadius(st.imageShape);
    const filter = imageFilter(st.imageTreatment);
    const borderW = st.imageBorder === "thick" ? 6 : st.imageBorder === "thin" ? 2 : 0;
    const isDuotone = st.imageTreatment === "duotone";
    return (
      <Selectable elKey={key} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable} style={style}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: radius, overflow: "hidden", border: borderW ? `${borderW}px solid ${theme.accent}` : "none" }}>
          <img
            src={url || PLACEHOLDER_IMG}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: isDuotone ? "grayscale(1) contrast(1.1)" : filter }}
            draggable={false}
          />
          {isDuotone && (
            <div style={{ position: "absolute", inset: 0, background: theme.accent, mixBlendMode: "multiply", opacity: 0.55 }} />
          )}
        </div>
      </Selectable>
    );
  };

  // bullets
  const renderBullets = () => {
    const c = slide.content;
    const variant: BulletVariant = st.bulletVariant ?? "list";
    const items = c.bullets ?? [];
    const renderItem = (b: string, i: number, inner: React.ReactNode) => {
      const k = `bullet:${i}`;
      const active = editable && selectedKey === k;
      return (
        <Selectable key={i} elKey={k} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
          <EditableText
            value={b}
            onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined}
            style={{ fontFamily: bodyFont, color: theme.text, fontSize: 28, lineHeight: 1.35 }}
            active={active}
          />
        </Selectable>
      );
    };

    if (variant === "list") {
      return (
        <ul className="flex flex-col gap-7">
          {items.map((b, i) => (
            <li key={i} className="flex gap-6 items-start">
              <span style={{ width: 14, height: 14, borderRadius: 999, background: theme.accent, marginTop: 16, flexShrink: 0 }} />
              <Selectable elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                <EditableText
                  value={b}
                  onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined}
                  style={{ fontFamily: bodyFont, color: theme.text, fontSize: 36, lineHeight: 1.4 }}
                  active={editable && selectedKey === `bullet:${i}`}
                />
              </Selectable>
            </li>
          ))}
        </ul>
      );
    }
    if (variant === "numbered") {
      return (
        <ol className="flex flex-col gap-6">
          {items.map((b, i) => (
            <li key={i} className="flex gap-6 items-center">
              <span style={{ width: 56, height: 56, borderRadius: 999, background: theme.accent, color: theme.accentText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fontHead, fontWeight: 700, fontSize: 28, flexShrink: 0 }}>{i + 1}</span>
              <Selectable elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} style={{ fontFamily: bodyFont, color: theme.text, fontSize: 32, lineHeight: 1.3 }} active={editable && selectedKey === `bullet:${i}`} />
              </Selectable>
            </li>
          ))}
        </ol>
      );
    }
    if (variant === "process") {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          {items.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <Selectable elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                <div style={{ background: theme.accent, color: theme.accentText, padding: "16px 22px", borderRadius: 999, fontFamily: bodyFont, fontWeight: 600, fontSize: 22, minWidth: 140, textAlign: "center" }}>
                  <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ color: theme.accentText, fontSize: 22 }} />
                </div>
              </Selectable>
              {i < items.length - 1 && <span style={{ color: theme.accent, fontSize: 40, fontWeight: 700 }}>›</span>}
            </div>
          ))}
        </div>
      );
    }
    if (variant === "cards") {
      const cols = Math.min(items.length || 1, 4);
      return (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {items.map((b, i) => (
            <Selectable key={i} elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
              <div style={{ border: `2px solid ${theme.accent}33`, borderRadius: 12, padding: 24, background: theme.surface, minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ color: theme.accent, fontWeight: 700, fontFamily: theme.fontHead, fontSize: 18, marginBottom: 8 }}>0{i + 1}</div>
                <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ fontFamily: bodyFont, color: theme.text, fontSize: 22, lineHeight: 1.35 }} />
              </div>
            </Selectable>
          ))}
        </div>
      );
    }
    if (variant === "pillars") {
      const cols = Math.min(items.length || 1, 4);
      return (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {items.map((b, i) => (
            <Selectable key={i} elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
              <div style={{ borderRadius: 6, overflow: "hidden", background: theme.surface, minHeight: 200 }}>
                <div style={{ height: 8, background: theme.accent }} />
                <div style={{ padding: 24 }}>
                  <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ fontFamily: bodyFont, color: theme.text, fontSize: 22, lineHeight: 1.4 }} />
                </div>
              </div>
            </Selectable>
          ))}
        </div>
      );
    }
    if (variant === "checklist") {
      return (
        <ul className="flex flex-col gap-5">
          {items.map((b, i) => (
            <li key={i} className="flex gap-5 items-center">
              <span style={{ width: 36, height: 36, borderRadius: 8, background: theme.accent, color: theme.accentText, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, flexShrink: 0 }}>✓</span>
              <Selectable elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ fontFamily: bodyFont, color: theme.text, fontSize: 30, lineHeight: 1.35 }} />
              </Selectable>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  // stat decoration
  const renderStatBlock = (statValue: string, labelValue: string) => {
    const sizePx = ({ m: 140, l: 200, xl: 240, display: 320 } as const)[st.statSize ?? "xl"];
    const color = resolveColor(st.statColor, theme, theme.accent);
    const dec = st.statDecoration ?? "none";
    const inner = (
      <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center", padding: dec === "circle" ? 64 : 0, background: dec === "circle" ? `${color}1A` : "transparent", borderRadius: dec === "circle" ? 999 : 0 }}>
        <div
          style={{
            fontFamily: theme.fontHead,
            color: dec === "gradient" ? "transparent" : color,
            background: dec === "gradient" ? `linear-gradient(135deg, ${color}, ${theme.text})` : "transparent",
            WebkitBackgroundClip: dec === "gradient" ? "text" : undefined,
            backgroundClip: dec === "gradient" ? ("text" as any) : undefined,
            fontSize: sizePx,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontWeight: 700,
          }}
        >
          {statValue}
        </div>
        {dec === "underline" && <div style={{ width: "60%", height: 6, background: color, marginTop: 12 }} />}
      </div>
    );
    return (
      <div className="h-full w-full flex flex-col items-center justify-center px-32 text-center gap-8">
        <Selectable elKey="stat" selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
          {editable && selectedKey === "stat" ? (
            <EditableText value={statValue} onChange={onEdit ? (v) => onEdit("stat", v) : undefined} style={{ fontFamily: theme.fontHead, color, fontSize: sizePx, lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 700 }} active />
          ) : (
            inner
          )}
        </Selectable>
        {renderText("statLabel", labelValue, { fontFamily: theme.fontBody, color: theme.text, fontSize: 40, maxWidth: 900 })}
      </div>
    );
  };

  const renderLayout = () => {
    const c = slide.content;
    switch (slide.layout) {
      case "title":
        return (
          <div className="h-full w-full flex flex-col justify-center px-32 gap-8">
            {renderText("title", c.title ?? "", { ...titleStyle(96), letterSpacing: "-0.02em" })}
            {renderText("subtitle", c.subtitle ?? "", subtitleStyle(36))}
            {st.titleAccentBar !== false && <div style={{ width: 80, height: 6, background: theme.accent }} />}
          </div>
        );
      case "title-body":
        return (
          <div className="h-full w-full flex flex-col justify-center px-32 gap-10">
            {renderText("title", c.title ?? "", titleStyle(72))}
            {st.titleAccentBar && <div style={{ width: 60, height: 5, background: theme.accent }} />}
            {renderText("body", c.body ?? "", { ...bodyStyle(32), maxWidth: 900 }, true)}
          </div>
        );
      case "two-column":
        return (
          <div className="h-full w-full flex flex-col px-24 py-20">
            <div className="grid grid-cols-2 gap-16 flex-1">
              <div className="flex flex-col gap-6 justify-center" style={{ borderLeft: `4px solid ${theme.accent}`, paddingLeft: 32 }}>
                {renderText("leftTitle", c.leftTitle ?? "", { fontFamily: theme.fontHead, color: theme.text, fontWeight: 700, fontSize: 44 })}
                {renderText("leftBody", c.leftBody ?? "", { fontFamily: theme.fontBody, color: theme.text, fontSize: 26, lineHeight: 1.5 }, true)}
              </div>
              <div className="flex flex-col gap-6 justify-center" style={{ borderLeft: `4px solid ${theme.accent}`, paddingLeft: 32 }}>
                {renderText("rightTitle", c.rightTitle ?? "", { fontFamily: theme.fontHead, color: theme.text, fontWeight: 700, fontSize: 44 })}
                {renderText("rightBody", c.rightBody ?? "", { fontFamily: theme.fontBody, color: theme.text, fontSize: 26, lineHeight: 1.5 }, true)}
              </div>
            </div>
          </div>
        );
      case "bullets":
        return (
          <div
            className="h-full w-full flex flex-col px-32 py-24 gap-10"
            onClick={(e) => {
              if (!editable) return;
              e.stopPropagation();
              onSelectElement?.("bullets");
            }}
          >
            {renderText("title", c.title ?? "", titleStyle(64))}
            {st.titleAccentBar && <div style={{ width: 60, height: 5, background: theme.accent }} />}
            <div onClick={(e) => e.stopPropagation()}>{renderBullets()}</div>
          </div>
        );
      case "stat":
        return renderStatBlock(c.stat ?? "", c.statLabel ?? "");
      case "divider":
        return (
          <div className="h-full w-full flex flex-col items-center justify-center px-32 text-center gap-8" style={{ background: theme.accent }}>
            {renderText("title", c.title ?? "", { fontFamily: theme.fontHead, fontWeight: 700, fontSize: 96, color: theme.accentText, lineHeight: 1.1 })}
            {renderText("subtitle", c.subtitle ?? "", { fontFamily: theme.fontBody, fontSize: 36, color: theme.accentText, opacity: 0.9 })}
          </div>
        );
      case "image-left":
        return (
          <div className="h-full w-full grid grid-cols-2 gap-8 p-8">
            {renderImage("image", c.imageUrl, { height: "100%" })}
            <div className="flex flex-col justify-center px-8 gap-8">
              {renderText("title", c.title ?? "", titleStyle(56))}
              {renderText("body", c.body ?? "", bodyStyle(26), true)}
            </div>
          </div>
        );
      case "image-right":
        return (
          <div className="h-full w-full grid grid-cols-2 gap-8 p-8">
            <div className="flex flex-col justify-center px-8 gap-8">
              {renderText("title", c.title ?? "", titleStyle(56))}
              {renderText("body", c.body ?? "", bodyStyle(26), true)}
            </div>
            {renderImage("image", c.imageUrl, { height: "100%" })}
          </div>
        );
      case "image-full":
        return (
          <div className="h-full w-full relative">
            {renderImage("image", c.imageUrl, { position: "absolute", inset: 0 })}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.75) 100%)" }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-20 gap-4">
              {renderText("title", c.title ?? "", { fontFamily: theme.fontHead, fontWeight: 700, fontSize: 88, color: "#fff", lineHeight: 1.05 })}
              {renderText("subtitle", c.subtitle ?? "", { fontFamily: theme.fontBody, fontSize: 32, color: "#fff", opacity: 0.9 })}
            </div>
          </div>
        );
      case "image-grid": {
        const capPos = st.captionPosition ?? "below";
        return (
          <div className="h-full w-full flex flex-col px-16 py-12 gap-6">
            {renderText("title", c.title ?? "", titleStyle(48))}
            <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
              {[1, 2, 3, 4].map((n) => {
                const url = (c as any)[n === 1 ? "imageUrl" : `imageUrl${n}`] as string | undefined;
                const cap = (c as any)[n === 1 ? "caption" : `caption${n}`] as string | undefined;
                return (
                  <div key={n} className="flex flex-col gap-2 min-h-0 relative">
                    {renderImage(`image:${n}`, url, { flex: 1, minHeight: 0, overflow: "hidden" })}
                    {capPos === "below" && renderText(`caption:${n}`, cap ?? "", { fontFamily: theme.fontBody, color: theme.muted, fontSize: 20, textAlign: "center" })}
                    {capPos === "overlay" && cap && (
                      <div className="absolute left-2 right-2 bottom-2 px-3 py-1.5 rounded text-center" style={{ background: "rgba(0,0,0,0.55)", color: "#fff", fontFamily: theme.fontBody, fontSize: 18 }}>{cap}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      case "image-bg-overlay": {
        const tint = st.overlayTint ?? "dark";
        return (
          <div className="h-full w-full relative">
            {renderImage("image", c.imageUrl, { position: "absolute", inset: 0 })}
            <div className="absolute inset-0 pointer-events-none" style={{ background: overlayBg(tint, st.overlayStrength, theme) }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-32 gap-6">
              {renderText("title", c.title ?? "", { fontFamily: theme.fontHead, fontWeight: 700, fontSize: 88 * sizeMul(st.titleSize), color: tint === "light" ? theme.text : "#fff", lineHeight: 1.1, textAlign: "center", maxWidth: 1000 })}
              {c.body && renderText("body", c.body, { fontFamily: theme.fontBody, fontSize: 28, color: tint === "light" ? theme.text : "#fff", opacity: 0.95, textAlign: "center", maxWidth: 900, lineHeight: 1.5 }, true)}
              {c.subtitle && renderText("subtitle", c.subtitle, { fontFamily: theme.fontBody, fontSize: 28, color: tint === "light" ? theme.muted : "#fff", opacity: 0.9, textAlign: "center" })}
            </div>
          </div>
        );
      }
      case "image-text-overlay": {
        const side = st.textCardSide ?? "left";
        const cardStyle: React.CSSProperties = {
          position: "absolute", top: 80, bottom: 80, width: "45%",
          [side]: 80, background: theme.surface, padding: 56,
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 20,
          borderRadius: 8, boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        };
        return (
          <div className="h-full w-full relative">
            {renderImage("image", c.imageUrl, { position: "absolute", inset: 0 })}
            <div style={cardStyle}>
              <div style={{ width: 50, height: 5, background: theme.accent }} />
              {renderText("title", c.title ?? "", { fontFamily: theme.fontHead, fontWeight: 700, fontSize: 56 * sizeMul(st.titleSize), color: theme.text, lineHeight: 1.15 })}
              {renderText("body", c.body ?? "", { fontFamily: theme.fontBody, fontSize: 24, color: theme.text, lineHeight: 1.55 }, true)}
            </div>
          </div>
        );
      }
      case "quadrant": {
        const cells = quadrantColors(st.quadrantPalette, theme);
        const data = [
          { key: "q1", title: c.q1Title ?? "Strengths",     body: c.q1Body ?? "", badge: "S" },
          { key: "q2", title: c.q2Title ?? "Weaknesses",    body: c.q2Body ?? "", badge: "W" },
          { key: "q3", title: c.q3Title ?? "Opportunities", body: c.q3Body ?? "", badge: "O" },
          { key: "q4", title: c.q4Title ?? "Threats",       body: c.q4Body ?? "", badge: "T" },
        ];
        return (
          <div className="h-full w-full flex flex-col px-16 py-10 gap-5">
            {c.title && renderText("title", c.title, titleStyle(44))}
            <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
              {data.map((d, i) => {
                const col = cells[i];
                return (
                  <div key={d.key} className="flex flex-col gap-3 p-7 rounded-lg" style={{ background: col.bg }}>
                    <div className="flex items-center gap-3">
                      <span style={{ width: 40, height: 40, borderRadius: 8, background: col.badge, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fontHead, fontWeight: 800, fontSize: 22 }}>{d.badge}</span>
                      {renderText(`${d.key}Title`, d.title, { fontFamily: theme.fontHead, fontWeight: 700, fontSize: 28, color: col.fg })}
                    </div>
                    {renderText(`${d.key}Body`, d.body, { fontFamily: theme.fontBody, fontSize: 18, color: col.fg, lineHeight: 1.5, opacity: 0.9 }, true)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      case "comparison": {
        const panels = [
          { key: "left", title: c.leftTitle ?? "Helpful", body: c.leftBody ?? "", color: "#16a34a" },
          { key: "right", title: c.rightTitle ?? "Harmful", body: c.rightBody ?? "", color: "#dc2626" },
        ];
        return (
          <div className="h-full w-full flex flex-col px-20 py-14 gap-6">
            {c.title && renderText("title", c.title, titleStyle(48))}
            <div className="grid grid-cols-2 gap-6 flex-1">
              {panels.map((p) => (
                <div key={p.key} className="flex flex-col rounded-lg overflow-hidden" style={{ background: theme.surface, border: `1px solid ${theme.muted}33` }}>
                  <div style={{ background: p.color, color: "#fff", padding: "16px 24px", fontFamily: theme.fontHead, fontWeight: 700, fontSize: 22 }}>
                    {renderText(`${p.key}Title`, p.title, { color: "#fff", fontFamily: theme.fontHead, fontWeight: 700, fontSize: 26 })}
                  </div>
                  <div className="p-7 flex-1">
                    {renderText(`${p.key}Body`, p.body, { fontFamily: theme.fontBody, fontSize: 22, color: theme.text, lineHeight: 1.55 }, true)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "image-bullets": {
        const side = st.imageSide ?? "left";
        const ImageCol = <div className="h-full">{renderImage("image", c.imageUrl, { height: "100%" })}</div>;
        const TextCol = (
          <div className="flex flex-col justify-center px-8 gap-8 min-w-0">
            {c.title && renderText("title", c.title, titleStyle(48))}
            <div onClick={(e) => e.stopPropagation()}>{renderBullets()}</div>
          </div>
        );
        return (
          <div className="h-full w-full grid grid-cols-2 gap-8 p-8">
            {side === "left" ? ImageCol : TextCol}
            {side === "left" ? TextCol : ImageCol}
          </div>
        );
      }
      case "stat-image": {
        const side = st.imageSide ?? "right";
        const ImageCol = <div className="h-full">{renderImage("image", c.imageUrl, { height: "100%" })}</div>;
        const StatCol = (
          <div className="flex items-center justify-center p-12">
            {renderStatBlock(c.stat ?? "", c.statLabel ?? "")}
          </div>
        );
        return (
          <div className="h-full w-full grid grid-cols-2 gap-8 p-8">
            {side === "left" ? ImageCol : StatCol}
            {side === "left" ? StatCol : ImageCol}
          </div>
        );
      }
      case "section-image-bg": {
        return (
          <div className="h-full w-full relative">
            {renderImage("image", c.imageUrl, { position: "absolute", inset: 0 })}
            <div className="absolute inset-0 pointer-events-none" style={{ background: overlayBg(st.overlayTint ?? "accent", st.overlayStrength ?? "strong", theme) }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-32 gap-6">
              {renderText("title", c.title ?? "", { fontFamily: theme.fontHead, fontWeight: 700, fontSize: 96, color: theme.accentText, lineHeight: 1.05, textAlign: "center" })}
              {c.subtitle && renderText("subtitle", c.subtitle, { fontFamily: theme.fontBody, fontSize: 32, color: theme.accentText, opacity: 0.9, textAlign: "center" })}
            </div>
          </div>
        );
      }
      case "definition-card": {
        return (
          <div className="h-full w-full grid grid-cols-5 gap-0">
            <div className="col-span-2 flex flex-col justify-center items-center text-center p-12 gap-4" style={{ background: theme.accent, color: theme.accentText }}>
              <div style={{ fontFamily: theme.fontBody, fontSize: 22, opacity: 0.85, letterSpacing: "0.18em", textTransform: "uppercase" }}>Definition</div>
              {renderText("term", c.term ?? c.title ?? "Term", { fontFamily: theme.fontHead, fontWeight: 800, fontSize: 88, color: theme.accentText, lineHeight: 1.05, textAlign: "center" })}
            </div>
            <div className="col-span-3 flex flex-col justify-center px-16 gap-6">
              {renderText("body", c.body ?? "", { fontFamily: theme.fontBody, fontSize: 32, color: theme.text, lineHeight: 1.5 }, true)}
              {c.caption && renderText("caption", c.caption, { fontFamily: theme.fontBody, fontSize: 20, color: theme.muted, fontStyle: "italic" })}
            </div>
          </div>
        );
      }
      case "formula": {
        return (
          <div className="h-full w-full flex flex-col items-center justify-center px-24 gap-10 text-center">
            {renderText("title", c.title ?? "Formula", { fontFamily: theme.fontHead, fontWeight: 700, fontSize: 48, color: theme.text, textAlign: "center" })}
            <Selectable elKey="formula" selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
              <div style={{ background: theme.surface, border: `2px solid ${theme.accent}`, borderRadius: 12, padding: "48px 72px", boxShadow: `0 12px 40px ${theme.accent}22`, minWidth: 600 }}>
                <EditableText
                  value={c.formula ?? "y = mx + c"}
                  onChange={onEdit ? (v) => onEdit("formula", v) : undefined}
                  style={{ fontFamily: "'Cambria Math', 'Times New Roman', serif", fontStyle: "italic", fontSize: 80, color: theme.accent, lineHeight: 1.2, textAlign: "center" }}
                  active={editable && selectedKey === "formula"}
                />
              </div>
            </Selectable>
            {renderText("body", c.body ?? "", { fontFamily: theme.fontBody, fontSize: 26, color: theme.muted, textAlign: "center", maxWidth: 900 }, true)}
          </div>
        );
      }
      case "worked-example": {
        const steps = c.bullets ?? [];
        return (
          <div className="h-full w-full flex flex-col px-20 py-12 gap-5">
            <div style={{ background: theme.accent, color: theme.accentText, padding: "16px 28px", borderRadius: 8, fontFamily: theme.fontHead, fontWeight: 700, fontSize: 28 }}>
              {renderText("title", c.title ?? "Problem", { color: theme.accentText, fontFamily: theme.fontHead, fontWeight: 700, fontSize: 28 })}
            </div>
            <div className="flex flex-col gap-3 flex-1 justify-center">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-5 items-center" style={{ background: theme.surface, padding: "18px 24px", borderRadius: 8, borderLeft: `4px solid ${theme.accent}` }}>
                  <span style={{ width: 44, height: 44, borderRadius: 999, background: theme.accent, color: theme.accentText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fontHead, fontWeight: 800, fontSize: 22, flexShrink: 0 }}>{i + 1}</span>
                  <Selectable elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                    <EditableText value={s} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ fontFamily: theme.fontBody, color: theme.text, fontSize: 24, lineHeight: 1.4 }} />
                  </Selectable>
                </div>
              ))}
            </div>
            <div style={{ background: "#16a34a", color: "#fff", padding: "16px 28px", borderRadius: 8, fontFamily: theme.fontHead, fontWeight: 700, fontSize: 26, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ opacity: 0.85, fontSize: 18, letterSpacing: "0.15em" }}>ANSWER</span>
              {renderText("body", c.body ?? "", { color: "#fff", fontFamily: theme.fontHead, fontWeight: 700, fontSize: 26 })}
            </div>
          </div>
        );
      }
      case "learning-objectives": {
        const items = c.bullets ?? [];
        return (
          <div className="h-full w-full flex flex-col px-20 py-14 gap-8">
            <div className="flex flex-col gap-2">
              <div style={{ fontFamily: theme.fontBody, fontSize: 20, color: theme.accent, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>Learning Objectives</div>
              {renderText("title", c.title ?? "By the end of this lesson, you will be able to…", { fontFamily: theme.fontHead, fontWeight: 700, fontSize: 44, color: theme.text, lineHeight: 1.2 })}
            </div>
            <div className="flex flex-col gap-3 flex-1 justify-center">
              {items.map((b, i) => (
                <Selectable key={i} elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                  <div className="flex items-center gap-5" style={{ background: `linear-gradient(90deg, ${theme.accent}1a, transparent)`, borderLeft: `4px solid ${theme.accent}`, padding: "20px 24px", borderRadius: 8 }}>
                    <span style={{ width: 48, height: 48, borderRadius: 999, background: theme.accent, color: theme.accentText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fontHead, fontWeight: 800, fontSize: 22, flexShrink: 0 }}>{i + 1}</span>
                    <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ fontFamily: theme.fontBody, color: theme.text, fontSize: 26, lineHeight: 1.35 }} />
                  </div>
                </Selectable>
              ))}
            </div>
          </div>
        );
      }
      case "key-terms": {
        const items = c.bullets ?? [];
        const cols = items.length > 4 ? 3 : 2;
        return (
          <div className="h-full w-full flex flex-col px-16 py-12 gap-6">
            {renderText("title", c.title ?? "Key Terms", titleStyle(48))}
            <div className="grid gap-4 flex-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {items.map((b, i) => {
                const [term, ...rest] = b.split(" — ");
                const def = rest.join(" — ");
                return (
                  <Selectable key={i} elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                    <div style={{ background: theme.surface, border: `1px solid ${theme.muted}33`, borderTop: `4px solid ${theme.accent}`, borderRadius: 8, padding: 24, height: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ fontFamily: theme.fontHead, fontWeight: 800, fontSize: 26, color: theme.accent }}>{term}</div>
                      <EditableText value={def || b} onChange={onEditBullet ? (v) => onEditBullet(i, `${term} — ${v}`) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ fontFamily: theme.fontBody, fontSize: 18, color: theme.text, lineHeight: 1.5 }} />
                    </div>
                  </Selectable>
                );
              })}
            </div>
          </div>
        );
      }
      case "process-flow": {
        const items = c.bullets ?? [];
        const n = Math.max(1, items.length);
        return (
          <div className="h-full w-full flex flex-col px-16 py-14 gap-12">
            {renderText("title", c.title ?? "Process", titleStyle(48))}
            <div className="flex-1 flex items-center">
              <div className="relative w-full">
                {/* connector line behind circles, spanning between first and last circle centers */}
                <div style={{ position: "absolute", left: `${100 / n / 2}%`, right: `${100 / n / 2}%`, top: 48, height: 4, background: theme.accent, opacity: 0.25 }} />
                <div className="grid relative" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                  {items.map((b, i) => (
                    <div key={i} className="flex flex-col items-center text-center px-3 gap-4">
                      <Selectable elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                        <div style={{ width: 96, height: 96, borderRadius: 999, background: theme.accent, color: theme.accentText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fontHead, fontWeight: 800, fontSize: 44, boxShadow: `0 8px 24px ${theme.accent}44`, position: "relative", zIndex: 1 }}>
                          {i + 1}
                        </div>
                      </Selectable>
                      <Selectable elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                        <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ fontFamily: theme.fontBody, color: theme.text, fontSize: 22, lineHeight: 1.3, fontWeight: 600 }} />
                      </Selectable>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case "timeline": {
        const items = c.bullets ?? [];
        const n = Math.max(1, items.length);
        return (
          <div className="h-full w-full flex flex-col px-16 py-14 gap-10">
            {renderText("title", c.title ?? "Timeline", titleStyle(48))}
            <div className="flex-1 relative">
              {/* horizontal line spanning between first and last dots */}
              <div style={{ position: "absolute", left: `${100 / n / 2}%`, right: `${100 / n / 2}%`, top: "50%", height: 4, background: theme.accent, opacity: 0.3 }} />
              <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                {items.map((b, i) => {
                  const parts = b.split(" | ");
                  const [year, label, body] = [parts[0] ?? "", parts[1] ?? "", parts[2] ?? ""];
                  const above = i % 2 === 0;
                  return (
                    <div key={i} className="relative">
                      {/* dot pinned to vertical center */}
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 22, height: 22, borderRadius: 999, background: theme.accent, border: `4px solid ${theme.bg}`, boxShadow: `0 0 0 2px ${theme.accent}`, zIndex: 2 }} />
                      <Selectable elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                        <div style={{ position: "absolute", left: 8, right: 8, [above ? "bottom" : "top"]: "calc(50% + 28px)", textAlign: "center" }}>
                          <div style={{ fontFamily: theme.fontHead, fontWeight: 800, fontSize: 24, color: theme.accent }}>{year}</div>
                          <div style={{ fontFamily: theme.fontBody, fontSize: 18, color: theme.text, fontWeight: 600, marginTop: 2 }}>{label}</div>
                          {body && <div style={{ fontFamily: theme.fontBody, fontSize: 14, color: theme.muted, lineHeight: 1.3, marginTop: 4 }}>{body}</div>}
                        </div>
                      </Selectable>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
      case "pyramid": {
        const items = c.bullets ?? [];
        const n = items.length || 1;
        return (
          <div className="h-full w-full flex flex-col px-16 py-12 gap-6">
            {renderText("title", c.title ?? "Pyramid", titleStyle(44))}
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              {items.map((b, i) => {
                // top narrow → base wide; ensure top band is wide enough for ~16-char labels
                const widthPct = n === 1 ? 70 : 38 + (i / (n - 1)) * 55;
                return (
                  <Selectable key={i} elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                    <div style={{
                      width: `${widthPct}%`,
                      minWidth: 240,
                      maxWidth: 900,
                      background: theme.accent,
                      color: theme.accentText,
                      padding: "16px 24px",
                      borderRadius: 4,
                      textAlign: "center",
                      fontFamily: theme.fontHead,
                      fontWeight: 700,
                      fontSize: 24,
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      filter: `brightness(${1 + (n - 1 - i) * 0.05})`,
                      boxShadow: `0 2px 0 ${theme.bg}`,
                    }}>
                      <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ color: theme.accentText, fontFamily: theme.fontHead, fontWeight: 700, fontSize: 24 }} />
                    </div>
                  </Selectable>
                );
              })}
            </div>
          </div>
        );
      }
      case "cycle": {
        const items = c.bullets ?? [];
        const n = items.length || 1;
        // Square diagram: SVG and HTML nodes share a 0–100 percent coordinate space.
        return (
          <div className="h-full w-full grid grid-cols-2 gap-6 p-8">
            <div className="relative flex items-center justify-center min-h-0">
              <div className="relative" style={{ width: "min(100%, 520px)", aspectRatio: "1 / 1", maxHeight: "100%" }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                  <circle cx="50" cy="50" r="38" fill="none" stroke={theme.accent} strokeWidth="0.6" strokeDasharray="2 1.5" opacity="0.5" />
                </svg>
                {/* Center label */}
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "44%", textAlign: "center" }}>
                  {renderText("body", c.body ?? c.title ?? "Cycle", { fontFamily: theme.fontHead, fontWeight: 800, fontSize: 26, color: theme.accent, textAlign: "center", lineHeight: 1.2 })}
                </div>
                {/* Nodes around the orbit */}
                {items.map((b, i) => {
                  const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
                  const xPct = 50 + Math.cos(angle) * 38;
                  const yPct = 50 + Math.sin(angle) * 38;
                  return (
                    <div key={i} style={{ position: "absolute", left: `${xPct}%`, top: `${yPct}%`, transform: "translate(-50%, -50%)", width: 130 }}>
                      <Selectable elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                        <div style={{ background: theme.accent, color: theme.accentText, padding: "12px 14px", borderRadius: 999, textAlign: "center", fontFamily: theme.fontBody, fontWeight: 700, fontSize: 18, boxShadow: `0 6px 16px ${theme.accent}55` }}>
                          <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ color: theme.accentText, fontFamily: theme.fontBody, fontWeight: 700, fontSize: 18 }} />
                        </div>
                      </Selectable>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col justify-center px-8 gap-6 min-w-0">
              {renderText("title", c.title ?? "", titleStyle(44))}
              <ol className="flex flex-col gap-3">
                {items.map((b, i) => (
                  <li key={i} className="flex gap-3 items-baseline" style={{ fontFamily: theme.fontBody, fontSize: 22, color: theme.text }}>
                    <span style={{ color: theme.accent, fontWeight: 800, fontSize: 22, minWidth: 28 }}>{i + 1}.</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        );
      }
      case "case-study": {
        const chips = c.bullets ?? [];
        return (
          <div className="h-full w-full grid grid-cols-2 gap-0">
            <div className="h-full">{renderImage("image", c.imageUrl, { height: "100%" })}</div>
            <div className="flex flex-col justify-center px-14 gap-6">
              <div style={{ fontFamily: theme.fontBody, fontSize: 18, color: theme.accent, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 800 }}>
                {renderText("caption", c.caption ?? "Case Study", { color: theme.accent, fontFamily: theme.fontBody, fontSize: 18, fontWeight: 800 })}
              </div>
              {renderText("title", c.title ?? "", { fontFamily: theme.fontHead, fontWeight: 800, fontSize: 56, color: theme.text, lineHeight: 1.1 })}
              <div className="flex flex-wrap gap-3">
                {chips.map((b, i) => (
                  <Selectable key={i} elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                    <div style={{ background: theme.accent, color: theme.accentText, padding: "10px 18px", borderRadius: 999, fontFamily: theme.fontHead, fontWeight: 700, fontSize: 18 }}>
                      <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ color: theme.accentText, fontFamily: theme.fontHead, fontWeight: 700, fontSize: 18 }} />
                    </div>
                  </Selectable>
                ))}
              </div>
              {renderText("body", c.body ?? "", { fontFamily: theme.fontBody, fontSize: 22, color: theme.text, lineHeight: 1.55 }, true)}
            </div>
          </div>
        );
      }
      case "question-prompt": {
        const subs = c.bullets ?? [];
        return (
          <div className="h-full w-full flex flex-col items-center justify-center text-center px-24 gap-8" style={{ background: `radial-gradient(circle at 50% 40%, ${theme.accent}1a, transparent 60%)` }}>
            <div style={{ width: 120, height: 120, borderRadius: 999, background: theme.accent, color: theme.accentText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fontHead, fontWeight: 800, fontSize: 84, lineHeight: 1, boxShadow: `0 12px 40px ${theme.accent}55` }}>?</div>
            {renderText("title", c.title ?? "What do you think?", { fontFamily: theme.fontHead, fontWeight: 800, fontSize: 64, color: theme.text, lineHeight: 1.15, textAlign: "center", maxWidth: 1000 })}
            <div className="flex flex-col gap-3 items-center">
              {subs.map((b, i) => (
                <Selectable key={i} elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                  <div style={{ fontFamily: theme.fontBody, fontSize: 24, color: theme.muted, fontStyle: "italic" }}>
                    <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ fontFamily: theme.fontBody, fontSize: 24, color: theme.muted, fontStyle: "italic" }} />
                  </div>
                </Selectable>
              ))}
            </div>
          </div>
        );
      }
      case "qa-recap": {
        const items = c.bullets ?? [];
        return (
          <div className="h-full w-full flex flex-col px-20 py-12 gap-6">
            {renderText("title", c.title ?? "Quick Recap", titleStyle(44))}
            <div className="flex flex-col gap-4 flex-1 justify-center">
              {items.map((b, i) => {
                const isQ = i % 2 === 0;
                return (
                  <Selectable key={i} elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                    <div className="flex gap-4 items-start" style={{ justifyContent: isQ ? "flex-start" : "flex-end", paddingLeft: isQ ? 0 : 80, paddingRight: isQ ? 80 : 0 }}>
                      {isQ && <span style={{ width: 44, height: 44, borderRadius: 8, background: theme.accent, color: theme.accentText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fontHead, fontWeight: 800, fontSize: 22, flexShrink: 0 }}>Q</span>}
                      <div style={{ background: isQ ? theme.surface : `${theme.accent}1a`, border: `1px solid ${isQ ? theme.muted + "33" : theme.accent + "55"}`, padding: "16px 22px", borderRadius: 12, flex: 1 }}>
                        <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ fontFamily: theme.fontBody, fontSize: 22, color: theme.text, lineHeight: 1.45 }} />
                      </div>
                      {!isQ && <span style={{ width: 44, height: 44, borderRadius: 8, background: theme.text, color: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fontHead, fontWeight: 800, fontSize: 22, flexShrink: 0 }}>A</span>}
                    </div>
                  </Selectable>
                );
              })}
            </div>
          </div>
        );
      }
      case "pros-cons": {
        const pros = (c.leftBody ?? "").split("\n").filter(Boolean);
        const cons = (c.rightBody ?? "").split("\n").filter(Boolean);
        return (
          <div className="h-full w-full flex flex-col px-20 py-12 gap-6">
            {renderText("title", c.title ?? "Pros & Cons", titleStyle(48))}
            <div className="grid grid-cols-2 gap-6 flex-1">
              <div className="flex flex-col rounded-lg overflow-hidden" style={{ background: theme.surface, border: "1px solid #16a34a55" }}>
                <div style={{ background: "#16a34a", color: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24, fontWeight: 800 }}>✓</span>
                  {renderText("leftTitle", c.leftTitle ?? "Advantages", { color: "#fff", fontFamily: theme.fontHead, fontWeight: 700, fontSize: 24 })}
                </div>
                <div className="p-6 flex-1 flex flex-col gap-3">
                  {pros.map((p, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span style={{ color: "#16a34a", fontWeight: 800, fontSize: 22, lineHeight: 1.3 }}>✓</span>
                      <div style={{ fontFamily: theme.fontBody, fontSize: 22, color: theme.text, lineHeight: 1.4 }}>{p}</div>
                    </div>
                  ))}
                  {pros.length === 0 && renderText("leftBody", "", { fontFamily: theme.fontBody, fontSize: 22, color: theme.muted })}
                </div>
              </div>
              <div className="flex flex-col rounded-lg overflow-hidden" style={{ background: theme.surface, border: "1px solid #dc262655" }}>
                <div style={{ background: "#dc2626", color: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24, fontWeight: 800 }}>✕</span>
                  {renderText("rightTitle", c.rightTitle ?? "Disadvantages", { color: "#fff", fontFamily: theme.fontHead, fontWeight: 700, fontSize: 24 })}
                </div>
                <div className="p-6 flex-1 flex flex-col gap-3">
                  {cons.map((p, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span style={{ color: "#dc2626", fontWeight: 800, fontSize: 22, lineHeight: 1.3 }}>✕</span>
                      <div style={{ fontFamily: theme.fontBody, fontSize: 22, color: theme.text, lineHeight: 1.4 }}>{p}</div>
                    </div>
                  ))}
                  {cons.length === 0 && renderText("rightBody", "", { fontFamily: theme.fontBody, fontSize: 22, color: theme.muted })}
                </div>
              </div>
            </div>
            {/* Hidden editable raw fields for selection */}
            {editable && selectedKey === "leftBody" && (
              <textarea defaultValue={c.leftBody ?? ""} onBlur={(e) => onEdit?.("leftBody", e.target.value)} className="absolute opacity-0 pointer-events-none" />
            )}
          </div>
        );
      }
      case "chart-explainer": {
        const data = c.chartData ?? [
          { label: "Q1", value: 30 }, { label: "Q2", value: 55 }, { label: "Q3", value: 70 }, { label: "Q4", value: 90 },
        ];
        const type = c.chartType ?? "bar";
        const max = Math.max(...data.map((d) => d.value), 1);
        const W = 560, H = 360, pad = 40;
        const innerW = W - pad * 2, innerH = H - pad * 2;
        return (
          <div className="h-full w-full grid grid-cols-2 gap-8 px-12 py-10">
            <div className="flex items-center justify-center" style={{ background: theme.surface, borderRadius: 12, padding: 16 }}>
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
                <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke={theme.muted} strokeWidth="2" />
                <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke={theme.muted} strokeWidth="2" />
                {type === "bar" && data.map((d, i) => {
                  const bw = innerW / data.length * 0.65;
                  const bh = (d.value / max) * innerH;
                  const x = pad + (innerW / data.length) * i + (innerW / data.length - bw) / 2;
                  const y = H - pad - bh;
                  return (
                    <g key={i}>
                      <rect x={x} y={y} width={bw} height={bh} fill={theme.accent} rx="4" />
                      <text x={x + bw / 2} y={H - pad + 22} textAnchor="middle" fontSize="14" fill={theme.text} fontFamily={theme.fontBody}>{d.label}</text>
                      <text x={x + bw / 2} y={y - 8} textAnchor="middle" fontSize="13" fill={theme.text} fontFamily={theme.fontBody} fontWeight="700">{d.value}</text>
                    </g>
                  );
                })}
                {type === "line" && (
                  <>
                    <polyline
                      fill="none"
                      stroke={theme.accent}
                      strokeWidth="3"
                      points={data.map((d, i) => {
                        const x = pad + (innerW / Math.max(1, data.length - 1)) * i;
                        const y = H - pad - (d.value / max) * innerH;
                        return `${x},${y}`;
                      }).join(" ")}
                    />
                    {data.map((d, i) => {
                      const x = pad + (innerW / Math.max(1, data.length - 1)) * i;
                      const y = H - pad - (d.value / max) * innerH;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="6" fill={theme.accent} />
                          <text x={x} y={H - pad + 22} textAnchor="middle" fontSize="14" fill={theme.text} fontFamily={theme.fontBody}>{d.label}</text>
                        </g>
                      );
                    })}
                  </>
                )}
              </svg>
            </div>
            <div className="flex flex-col justify-center gap-6">
              {renderText("title", c.title ?? "", titleStyle(44))}
              <ul className="flex flex-col gap-3">
                {(c.bullets ?? []).map((b, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: theme.accent, marginTop: 12, flexShrink: 0 }} />
                    <Selectable elKey={`bullet:${i}`} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                      <EditableText value={b} onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined} active={editable && selectedKey === `bullet:${i}`} style={{ fontFamily: theme.fontBody, fontSize: 22, color: theme.text, lineHeight: 1.45 }} />
                    </Selectable>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }
      case "citation-quote": {
        return (
          <div className="h-full w-full flex flex-col items-center justify-center px-32 gap-8 text-center" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.bg})` }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 200, color: theme.accent, lineHeight: 0.7, opacity: 0.7 }}>“</div>
            {renderText("body", c.body ?? "Insert a meaningful quote here.", { fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 48, color: theme.text, lineHeight: 1.3, textAlign: "center", maxWidth: 1100 }, true)}
            <div className="flex items-center gap-5">
              {c.imageUrl && (
                <div style={{ width: 72, height: 72, borderRadius: 999, overflow: "hidden", flexShrink: 0 }}>
                  {renderImage("image", c.imageUrl, { width: 72, height: 72 })}
                </div>
              )}
              <div className="flex flex-col items-start text-left">
                <div style={{ width: 40, height: 3, background: theme.accent, marginBottom: 8 }} />
                {renderText("caption", c.caption ?? "— Author, Source", { fontFamily: theme.fontBody, fontSize: 24, color: theme.muted, fontWeight: 600 })}
              </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: theme.bg }}
      onClick={() => editable && onSelectElement?.(null)}
    >
      <div
        style={{
          width: BASE_W,
          height: BASE_H,
          transform: `scale(${s})`,
          transformOrigin: "top left",
          background: theme.bg,
          position: "absolute",
          top: scale === "auto" ? `calc(50% - ${(BASE_H * s) / 2}px)` : 0,
          left: scale === "auto" ? `calc(50% - ${(BASE_W * s) / 2}px)` : 0,
        }}
      >
        {renderLayout()}
      </div>
    </div>
  );
};

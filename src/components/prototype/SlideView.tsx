import { useEffect, useRef, useState } from "react";
import type { Slide, Theme, ElementKey } from "@/lib/prototype/types";

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
      className={`hover:outline hover:outline-2 hover:outline-blue-300/60 ${className}`}
    >
      {children}
    </div>
  );
};

const EditableText = ({
  value,
  onChange,
  style,
  multiline = false,
  active,
}: {
  value: string;
  onChange?: (v: string) => void;
  style?: React.CSSProperties;
  multiline?: boolean;
  active?: boolean;
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

export const SlideView = ({
  slide,
  theme,
  editable = false,
  selectedKey = null,
  onSelectElement,
  onEdit,
  onEditBullet,
  scale = "auto",
  className = "",
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

  const titleStyle = { fontFamily: theme.fontHead, color: theme.text, fontWeight: 700 };
  const bodyStyle = { fontFamily: theme.fontBody, color: theme.text };
  const mutedStyle = { fontFamily: theme.fontBody, color: theme.muted };

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

  const renderImage = (key: string, url: string | undefined, style: React.CSSProperties) => (
    <Selectable elKey={key} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable} style={style}>
      <img
        src={url || PLACEHOLDER_IMG}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        draggable={false}
      />
    </Selectable>
  );

  const renderLayout = () => {
    const c = slide.content;
    switch (slide.layout) {
      case "title":
        return (
          <div className="h-full w-full flex flex-col justify-center px-32 gap-8">
            {renderText("title", c.title ?? "", { ...titleStyle, fontSize: 96, lineHeight: 1.05, letterSpacing: "-0.02em" })}
            {renderText("subtitle", c.subtitle ?? "", { ...mutedStyle, fontSize: 36 })}
            <div style={{ width: 80, height: 6, background: theme.accent }} />
          </div>
        );
      case "title-body":
        return (
          <div className="h-full w-full flex flex-col justify-center px-32 gap-10">
            {renderText("title", c.title ?? "", { ...titleStyle, fontSize: 72, lineHeight: 1.1 })}
            {renderText("body", c.body ?? "", { ...bodyStyle, fontSize: 32, lineHeight: 1.5, maxWidth: 900 }, true)}
          </div>
        );
      case "two-column":
        return (
          <div className="h-full w-full flex flex-col px-24 py-20">
            <div className="grid grid-cols-2 gap-16 flex-1">
              <div className="flex flex-col gap-6 justify-center" style={{ borderLeft: `4px solid ${theme.accent}`, paddingLeft: 32 }}>
                {renderText("leftTitle", c.leftTitle ?? "", { ...titleStyle, fontSize: 44 })}
                {renderText("leftBody", c.leftBody ?? "", { ...bodyStyle, fontSize: 26, lineHeight: 1.5 }, true)}
              </div>
              <div className="flex flex-col gap-6 justify-center" style={{ borderLeft: `4px solid ${theme.accent}`, paddingLeft: 32 }}>
                {renderText("rightTitle", c.rightTitle ?? "", { ...titleStyle, fontSize: 44 })}
                {renderText("rightBody", c.rightBody ?? "", { ...bodyStyle, fontSize: 26, lineHeight: 1.5 }, true)}
              </div>
            </div>
          </div>
        );
      case "bullets":
        return (
          <div className="h-full w-full flex flex-col px-32 py-24 gap-12">
            {renderText("title", c.title ?? "", { ...titleStyle, fontSize: 64 })}
            <ul className="flex flex-col gap-7">
              {(c.bullets ?? []).map((b, i) => {
                const k = `bullet:${i}`;
                const active = editable && selectedKey === k;
                return (
                  <li key={i} className="flex gap-6 items-start">
                    <span style={{ width: 14, height: 14, borderRadius: 999, background: theme.accent, marginTop: 18, flexShrink: 0 }} />
                    <Selectable elKey={k} selectedKey={selectedKey} onSelect={onSelectElement} editable={editable}>
                      <EditableText
                        value={b}
                        onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined}
                        style={{ ...bodyStyle, fontSize: 36, lineHeight: 1.4 }}
                        active={active}
                      />
                    </Selectable>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      case "stat":
        return (
          <div className="h-full w-full flex flex-col items-center justify-center px-32 text-center gap-10">
            {renderText("stat", c.stat ?? "", { ...titleStyle, color: theme.accent, fontSize: 240, lineHeight: 1, letterSpacing: "-0.04em" })}
            {renderText("statLabel", c.statLabel ?? "", { ...bodyStyle, fontSize: 40, maxWidth: 900 })}
          </div>
        );
      case "divider":
        return (
          <div className="h-full w-full flex flex-col items-center justify-center px-32 text-center gap-8" style={{ background: theme.accent }}>
            {renderText("title", c.title ?? "", { fontFamily: theme.fontHead, fontWeight: 700, fontSize: 96, color: theme.accentText, lineHeight: 1.1 })}
            {renderText("subtitle", c.subtitle ?? "", { fontFamily: theme.fontBody, fontSize: 36, color: theme.accentText, opacity: 0.9 })}
          </div>
        );
      case "image-left":
        return (
          <div className="h-full w-full grid grid-cols-2">
            {renderImage("image", c.imageUrl, { height: "100%" })}
            <div className="flex flex-col justify-center px-16 gap-8">
              {renderText("title", c.title ?? "", { ...titleStyle, fontSize: 56, lineHeight: 1.1 })}
              {renderText("body", c.body ?? "", { ...bodyStyle, fontSize: 26, lineHeight: 1.5 }, true)}
            </div>
          </div>
        );
      case "image-right":
        return (
          <div className="h-full w-full grid grid-cols-2">
            <div className="flex flex-col justify-center px-16 gap-8">
              {renderText("title", c.title ?? "", { ...titleStyle, fontSize: 56, lineHeight: 1.1 })}
              {renderText("body", c.body ?? "", { ...bodyStyle, fontSize: 26, lineHeight: 1.5 }, true)}
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
      case "image-grid":
        return (
          <div className="h-full w-full flex flex-col px-16 py-12 gap-6">
            {renderText("title", c.title ?? "", { ...titleStyle, fontSize: 48 })}
            <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
              {[1, 2, 3, 4].map((n) => {
                const url = (c as any)[n === 1 ? "imageUrl" : `imageUrl${n}`] as string | undefined;
                const cap = (c as any)[n === 1 ? "caption" : `caption${n}`] as string | undefined;
                return (
                  <div key={n} className="flex flex-col gap-2 min-h-0">
                    {renderImage(`image:${n}`, url, { flex: 1, minHeight: 0, borderRadius: 6, overflow: "hidden" })}
                    {renderText(`caption:${n}`, cap ?? "", { ...mutedStyle, fontSize: 20, textAlign: "center" })}
                  </div>
                );
              })}
            </div>
          </div>
        );
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

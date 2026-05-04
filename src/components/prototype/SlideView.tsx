import { useEffect, useRef, useState } from "react";
import type { Slide, Theme } from "@/lib/prototype/types";

interface SlideViewProps {
  slide: Slide;
  theme: Theme;
  editable?: boolean;
  onEdit?: (key: string, value: string) => void;
  onEditBullet?: (index: number, value: string) => void;
  scale?: number | "auto";
  className?: string;
}

const BASE_W = 1280;
const BASE_H = 720;

export const SlideView = ({
  slide,
  theme,
  editable = false,
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
      const sx = rect.width / BASE_W;
      const sy = rect.height / BASE_H;
      setAutoScale(Math.min(sx, sy));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scale]);

  const s = scale === "auto" ? autoScale : scale;

  const Editable = ({
    value,
    onChange,
    style,
    multiline = false,
  }: {
    value: string;
    onChange?: (v: string) => void;
    style?: React.CSSProperties;
    multiline?: boolean;
  }) => {
    if (!editable || !onChange) {
      return (
        <div style={style} className={multiline ? "whitespace-pre-wrap" : ""}>
          {value}
        </div>
      );
    }
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange(e.currentTarget.textContent ?? "")}
        style={{
          ...style,
          outline: "none",
          cursor: "text",
        }}
        className="hover:ring-2 hover:ring-blue-300/40 rounded-sm focus:ring-2 focus:ring-blue-400/60"
      >
        {value}
      </div>
    );
  };

  const renderLayout = () => {
    const c = slide.content;
    const titleStyle = { fontFamily: theme.fontHead, color: theme.text, fontWeight: 700 };
    const bodyStyle = { fontFamily: theme.fontBody, color: theme.text };
    const mutedStyle = { fontFamily: theme.fontBody, color: theme.muted };

    switch (slide.layout) {
      case "title":
        return (
          <div className="h-full w-full flex flex-col justify-center px-32">
            <Editable
              value={c.title ?? ""}
              onChange={(v) => onEdit?.("title", v)}
              style={{ ...titleStyle, fontSize: 96, lineHeight: 1.05, letterSpacing: "-0.02em" }}
            />
            <Editable
              value={c.subtitle ?? ""}
              onChange={(v) => onEdit?.("subtitle", v)}
              style={{ ...mutedStyle, fontSize: 36, marginTop: 32 }}
            />
            <div style={{ width: 80, height: 6, background: theme.accent, marginTop: 48 }} />
          </div>
        );
      case "title-body":
        return (
          <div className="h-full w-full flex flex-col justify-center px-32 gap-10">
            <Editable
              value={c.title ?? ""}
              onChange={(v) => onEdit?.("title", v)}
              style={{ ...titleStyle, fontSize: 72, lineHeight: 1.1 }}
            />
            <Editable
              value={c.body ?? ""}
              onChange={(v) => onEdit?.("body", v)}
              style={{ ...bodyStyle, fontSize: 32, lineHeight: 1.5, maxWidth: 900 }}
              multiline
            />
          </div>
        );
      case "two-column":
        return (
          <div className="h-full w-full flex flex-col px-24 py-20">
            <div className="grid grid-cols-2 gap-16 flex-1">
              <div className="flex flex-col gap-6 justify-center" style={{ borderLeft: `4px solid ${theme.accent}`, paddingLeft: 32 }}>
                <Editable value={c.leftTitle ?? ""} onChange={(v) => onEdit?.("leftTitle", v)} style={{ ...titleStyle, fontSize: 44 }} />
                <Editable value={c.leftBody ?? ""} onChange={(v) => onEdit?.("leftBody", v)} style={{ ...bodyStyle, fontSize: 26, lineHeight: 1.5 }} multiline />
              </div>
              <div className="flex flex-col gap-6 justify-center" style={{ borderLeft: `4px solid ${theme.accent}`, paddingLeft: 32 }}>
                <Editable value={c.rightTitle ?? ""} onChange={(v) => onEdit?.("rightTitle", v)} style={{ ...titleStyle, fontSize: 44 }} />
                <Editable value={c.rightBody ?? ""} onChange={(v) => onEdit?.("rightBody", v)} style={{ ...bodyStyle, fontSize: 26, lineHeight: 1.5 }} multiline />
              </div>
            </div>
          </div>
        );
      case "bullets":
        return (
          <div className="h-full w-full flex flex-col px-32 py-24 gap-12">
            <Editable value={c.title ?? ""} onChange={(v) => onEdit?.("title", v)} style={{ ...titleStyle, fontSize: 64 }} />
            <ul className="flex flex-col gap-7">
              {(c.bullets ?? []).map((b, i) => (
                <li key={i} className="flex gap-6 items-start">
                  <span style={{ width: 14, height: 14, borderRadius: 999, background: theme.accent, marginTop: 18, flexShrink: 0 }} />
                  <Editable
                    value={b}
                    onChange={(v) => onEditBullet?.(i, v)}
                    style={{ ...bodyStyle, fontSize: 36, lineHeight: 1.4 }}
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      case "stat":
        return (
          <div className="h-full w-full flex flex-col items-center justify-center px-32 text-center gap-10">
            <Editable
              value={c.stat ?? ""}
              onChange={(v) => onEdit?.("stat", v)}
              style={{ ...titleStyle, color: theme.accent, fontSize: 240, lineHeight: 1, letterSpacing: "-0.04em" }}
            />
            <Editable
              value={c.statLabel ?? ""}
              onChange={(v) => onEdit?.("statLabel", v)}
              style={{ ...bodyStyle, fontSize: 40, maxWidth: 900 }}
            />
          </div>
        );
      case "divider":
        return (
          <div
            className="h-full w-full flex flex-col items-center justify-center px-32 text-center gap-8"
            style={{ background: theme.accent, color: theme.accentText }}
          >
            <Editable
              value={c.title ?? ""}
              onChange={(v) => onEdit?.("title", v)}
              style={{ fontFamily: theme.fontHead, fontWeight: 700, fontSize: 96, color: theme.accentText, lineHeight: 1.1 }}
            />
            <Editable
              value={c.subtitle ?? ""}
              onChange={(v) => onEdit?.("subtitle", v)}
              style={{ fontFamily: theme.fontBody, fontSize: 36, color: theme.accentText, opacity: 0.9 }}
            />
          </div>
        );
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`} style={{ background: theme.bg }}>
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

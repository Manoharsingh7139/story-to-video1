import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS, Orientation } from "./tokens";

// Tiny eyelet labels and figure markers that drift in corners across the whole video.
// Editorial poster vibe — like the landing page hairline eyelets.
export const PersistentChrome: React.FC<{ orientation: Orientation; inverted?: boolean }> = ({
  orientation,
  inverted = false,
}) => {
  const frame = useCurrentFrame();
  const isPortrait = orientation === "portrait";
  const color = inverted ? COLORS.paper : COLORS.ink;
  const fadeIn = interpolate(frame, [0, 30], [0, 0.55], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, 840], [0, -12]);

  const pad = isPortrait ? 36 : 56;
  const eyeletStyle: React.CSSProperties = {
    fontFamily: FONTS.ui,
    fontSize: isPortrait ? 11 : 13,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color,
    opacity: fadeIn,
    fontWeight: 500,
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Top-left: brand mark */}
      <div style={{ position: "absolute", top: pad, left: pad, ...eyeletStyle, transform: `translateY(${drift}px)` }}>
        FrameFlow <span style={{ opacity: 0.55 }}>·</span> Est. MMXXVI
      </div>
      {/* Top-right: figure counter */}
      <div style={{ position: "absolute", top: pad, right: pad, ...eyeletStyle, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        Iss. №01 <span style={{ opacity: 0.55 }}>—</span> Launch
      </div>
      {/* Bottom hairline */}
      <div
        style={{
          position: "absolute",
          left: pad,
          right: pad,
          bottom: pad + (isPortrait ? 28 : 32),
          height: 1,
          background: inverted ? COLORS.paperHairline : COLORS.hairline,
          opacity: fadeIn * 1.5,
        }}
      />
      <div style={{ position: "absolute", bottom: pad, left: pad, ...eyeletStyle, fontVariantNumeric: "tabular-nums" }}>
        Sec. 0{Math.min(6, Math.floor(frame / 140) + 1)} <span style={{ opacity: 0.55 }}>/</span> 06
      </div>
      <div style={{ position: "absolute", bottom: pad, right: pad, ...eyeletStyle, fontStyle: "italic", textTransform: "none", letterSpacing: "0.02em", fontFamily: FONTS.display, fontSize: isPortrait ? 14 : 17 }}>
        words → watch·able.
      </div>
    </AbsoluteFill>
  );
};

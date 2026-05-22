import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS, Orientation } from "../components/tokens";

// Scene 5 — Inverted promise (frames 0..150)
export const Scene5Promise: React.FC<{ orientation: Orientation }> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isPortrait = orientation === "portrait";

  // Wipe-in panel from left
  const panelW = interpolate(frame, [0, 18], [0, 100], { extrapolateRight: "clamp" });

  const lineSpring = spring({ frame: frame - 20, fps, config: { damping: 16, stiffness: 100 } });
  const lineY = interpolate(lineSpring, [0, 1], [40, 0]);
  const lineOp = interpolate(frame, [20, 38], [0, 1], { extrapolateRight: "clamp" });

  const line2Spring = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 95 } });
  const line2Y = interpolate(line2Spring, [0, 1], [50, 0]);
  const line2Op = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });

  const dot = spring({ frame: frame - 86, fps, config: { damping: 8, stiffness: 200 } });

  const exit = interpolate(frame, [135, 150], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.paper, overflow: "hidden", opacity: exit }}>
      {/* Ink panel wipe */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: COLORS.ink,
          clipPath: `inset(0 ${100 - panelW}% 0 0)`,
        }}
      />
      <AbsoluteFill style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", padding: isPortrait ? "0 50px" : "0 120px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONTS.ui,
            fontSize: isPortrait ? 12 : 14,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: COLORS.paper,
            opacity: lineOp * 0.55,
            transform: `translateY(${-lineY * 0.4}px)`,
            marginBottom: isPortrait ? 30 : 40,
            fontWeight: 500,
          }}
        >
          ¶ Editor's Note
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: isPortrait ? "clamp(72px, 16vw, 200px)" : "clamp(120px, 11vw, 220px)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
            color: COLORS.paper,
            transform: `translateY(${lineY}px)`,
            opacity: lineOp,
            fontWeight: 400,
          }}
        >
          Paste a script.
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontStyle: "italic",
            fontSize: isPortrait ? "clamp(64px, 14vw, 180px)" : "clamp(100px, 10vw, 200px)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            color: COLORS.primaryGlow,
            transform: `translateY(${line2Y}px)`,
            opacity: line2Op,
            marginTop: isPortrait ? 8 : 16,
            fontWeight: 400,
          }}
        >
          Ship a film
          <span style={{ display: "inline-block", width: isPortrait ? 20 : 30, height: isPortrait ? 20 : 30, borderRadius: "50%", background: COLORS.primary, marginLeft: isPortrait ? 16 : 24, transform: `scale(${dot}) translateY(${isPortrait ? -8 : -14}px)`, verticalAlign: "middle" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

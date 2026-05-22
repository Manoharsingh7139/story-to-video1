import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS, Orientation } from "../components/tokens";

// Scene 6 — Logo lockup + CTA (frames 0..120)
export const Scene6Lockup: React.FC<{ orientation: Orientation }> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isPortrait = orientation === "portrait";

  const markSpring = spring({ frame, fps, config: { damping: 12, stiffness: 110, mass: 1.1 } });
  const markScale = interpolate(markSpring, [0, 1], [0.4, 1]);
  const markOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  const frameOp = interpolate(frame, [18, 36], [0, 1], { extrapolateRight: "clamp" });
  const frameX = interpolate(frame, [18, 36], [-30, 0], { extrapolateRight: "clamp" });

  const flowOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const flowX = interpolate(frame, [30, 50], [30, 0], { extrapolateRight: "clamp" });

  const taglineOp = interpolate(frame, [52, 74], [0, 1], { extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [52, 74], [12, 0], { extrapolateRight: "clamp" });

  const ctaOp = interpolate(frame, [74, 95], [0, 1], { extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [74, 95], [16, 0], { extrapolateRight: "clamp" });

  const markSize = isPortrait ? 140 : 180;
  const wordFs = isPortrait ? 88 : 130;

  return (
    <AbsoluteFill style={{ background: COLORS.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isPortrait ? 30 : 40, padding: 40 }}>
        {/* Logo mark */}
        <div
          style={{
            width: markSize,
            height: markSize,
            borderRadius: 24,
            background: COLORS.primary,
            transform: `scale(${markScale})`,
            opacity: markOp,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 30px 60px -20px rgba(232,93,58,0.4)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontStyle: "italic",
              fontSize: markSize * 0.6,
              color: COLORS.paper,
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            F
          </div>
        </div>

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "baseline", gap: isPortrait ? 6 : 10, lineHeight: 1 }}>
          <div
            style={{
              fontFamily: FONTS.ui,
              fontWeight: 500,
              fontSize: wordFs * 0.78,
              letterSpacing: "-0.02em",
              color: COLORS.ink,
              opacity: frameOp,
              transform: `translateX(${frameX}px)`,
            }}
          >
            Frame
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontStyle: "italic",
              fontSize: wordFs,
              letterSpacing: "-0.03em",
              color: COLORS.ink,
              opacity: flowOp,
              transform: `translateX(${flowX}px)`,
              fontWeight: 400,
            }}
          >
            Flow
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: FONTS.ui,
            fontSize: isPortrait ? 13 : 15,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: COLORS.ink,
            opacity: taglineOp * 0.65,
            transform: `translateY(${taglineY}px)`,
            fontWeight: 500,
          }}
        >
          The Content Studio
        </div>

        {/* CTA pill */}
        <div
          style={{
            marginTop: isPortrait ? 16 : 24,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: isPortrait ? "14px 24px" : "18px 30px",
            background: COLORS.ink,
            color: COLORS.paper,
            borderRadius: 999,
            fontFamily: FONTS.ui,
            fontSize: isPortrait ? 13 : 15,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
            opacity: ctaOp,
            transform: `translateY(${ctaY}px)`,
            boxShadow: "0 14px 30px -12px rgba(20,20,20,0.4)",
          }}
        >
          <span>Now Live</span>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.primary }} />
          <span style={{ fontFamily: FONTS.display, fontStyle: "italic", textTransform: "none", letterSpacing: "-0.01em", fontSize: isPortrait ? 16 : 18 }}>
            try frameflow
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

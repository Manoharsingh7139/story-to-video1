import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS, Orientation } from "../components/tokens";

// Scene 2 — Kinetic pitch (frames 0..150 within sequence)
// "become" → "watch·able." with hairline underline draw.
export const Scene2Kinetic: React.FC<{ orientation: Orientation }> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isPortrait = orientation === "portrait";

  // "become" enters
  const becomeSpring = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 110 } });
  const becomeX = interpolate(becomeSpring, [0, 1], [isPortrait ? -200 : -400, 0]);
  const becomeOp = interpolate(frame, [4, 22], [0, 1], { extrapolateRight: "clamp" });

  // "watch·able." enters
  const watchSpring = spring({ frame: frame - 38, fps, config: { damping: 12, stiffness: 90, mass: 1.2 } });
  const watchScale = interpolate(watchSpring, [0, 1], [0.8, 1]);
  const watchOp = interpolate(frame, [38, 58], [0, 1], { extrapolateRight: "clamp" });
  const watchBlur = interpolate(frame, [38, 58], [8, 0], { extrapolateRight: "clamp" });

  // Underline draws
  const underlineW = interpolate(frame, [68, 100], [0, 1], { extrapolateRight: "clamp" });

  // Accent dot pops
  const dotSpring = spring({ frame: frame - 92, fps, config: { damping: 8, stiffness: 180 } });

  const exit = interpolate(frame, [135, 150], [1, 0], { extrapolateRight: "clamp" });

  const wordFs = isPortrait ? "clamp(120px, 28vw, 320px)" : "clamp(160px, 16vw, 280px)";
  const watchFs = isPortrait ? "clamp(140px, 32vw, 380px)" : "clamp(200px, 19vw, 340px)";

  return (
    <AbsoluteFill style={{ background: COLORS.paperSoft, overflow: "hidden", opacity: exit }}>
      <AbsoluteFill style={{ flexDirection: "column", justifyContent: "center", paddingLeft: isPortrait ? 60 : 140, paddingRight: isPortrait ? 60 : 140, gap: isPortrait ? 10 : 0 }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: wordFs,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: COLORS.ink,
            transform: `translateX(${becomeX}px)`,
            opacity: becomeOp,
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          become
        </div>
        <div style={{ position: "relative", display: "inline-block", alignSelf: "flex-end" }}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: watchFs,
              lineHeight: 0.88,
              letterSpacing: "-0.045em",
              color: COLORS.ink,
              transform: `scale(${watchScale})`,
              transformOrigin: "right bottom",
              opacity: watchOp,
              filter: `blur(${watchBlur}px)`,
              textAlign: "right",
              fontWeight: 400,
            }}
          >
            watch
            <span style={{ color: COLORS.primary, fontStyle: "italic" }}>·able.</span>
          </div>
          {/* Hairline underline */}
          <div
            style={{
              position: "absolute",
              bottom: isPortrait ? -10 : -8,
              right: 0,
              height: 3,
              width: `${underlineW * 100}%`,
              background: COLORS.primary,
              transformOrigin: "right",
            }}
          />
          {/* Accent dot punch */}
          <div
            style={{
              position: "absolute",
              top: "-8%",
              right: "-3%",
              width: isPortrait ? 28 : 36,
              height: isPortrait ? 28 : 36,
              borderRadius: "50%",
              background: COLORS.primary,
              transform: `scale(${dotSpring})`,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

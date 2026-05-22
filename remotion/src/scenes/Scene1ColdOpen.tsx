import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { COLORS, FONTS, Orientation } from "../components/tokens";

// Scene 1 — Cold open (frames 0..90)
// Big italic "Words." slams in, eyelet "— FrameFlow / The Content Studio" rises under.
export const Scene1ColdOpen: React.FC<{ orientation: Orientation }> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isPortrait = orientation === "portrait";

  const wordSpring = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 95, mass: 1.1 } });
  const wordScale = interpolate(wordSpring, [0, 1], [0.84, 1]);
  const wordY = interpolate(wordSpring, [0, 1], [40, 0]);
  const wordBlur = interpolate(frame, [8, 30], [10, 0], { extrapolateRight: "clamp" });
  const wordOpacity = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" });

  const eyeletOp = interpolate(frame, [22, 40], [0, 1], { extrapolateRight: "clamp" });
  const eyeletY = interpolate(frame, [22, 40], [12, 0], { extrapolateRight: "clamp" });

  const exit = interpolate(frame, [78, 90], [1, 0], { extrapolateRight: "clamp" });

  const fontSize = isPortrait ? "clamp(180px, 42vw, 480px)" : "clamp(220px, 22vw, 380px)";

  return (
    <AbsoluteFill style={{ background: COLORS.paper, overflow: "hidden", opacity: exit }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: isPortrait ? 28 : 36 }}>
        <div
          style={{
            fontFamily: FONTS.ui,
            fontSize: isPortrait ? 13 : 15,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: COLORS.ink,
            opacity: eyeletOp * 0.7,
            transform: `translateY(${-eyeletY}px)`,
            fontWeight: 500,
          }}
        >
          — Act 01 —
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize,
            lineHeight: 0.82,
            letterSpacing: "-0.045em",
            color: COLORS.ink,
            transform: `scale(${wordScale}) translateY(${wordY}px)`,
            filter: `blur(${wordBlur}px)`,
            opacity: wordOpacity,
          }}
        >
          Words<span style={{ color: COLORS.primary, fontStyle: "italic", fontWeight: 400 }}>.</span>
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontStyle: "italic",
            fontSize: isPortrait ? 28 : 34,
            color: COLORS.ink,
            opacity: eyeletOp * 0.85,
            transform: `translateY(${eyeletY}px)`,
            letterSpacing: "-0.01em",
          }}
        >
          The Content Studio.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

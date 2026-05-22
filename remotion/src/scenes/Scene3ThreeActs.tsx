import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS, Orientation } from "../components/tokens";

const ACTS = [
  { n: "01", label: "Script", body: "Drop a take." },
  { n: "02", label: "Cut", body: "We frame the story." },
  { n: "03", label: "Voice", body: "Clone, press play." },
];

// Scene 3 — Three acts montage (frames 0..180)
export const Scene3ThreeActs: React.FC<{ orientation: Orientation }> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isPortrait = orientation === "portrait";

  const exit = interpolate(frame, [165, 180], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.paper, overflow: "hidden", opacity: exit }}>
      {/* Eyelet header */}
      <div
        style={{
          position: "absolute",
          top: isPortrait ? "10%" : "12%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONTS.ui,
          fontSize: isPortrait ? 12 : 14,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: COLORS.ink,
          opacity: interpolate(frame, [0, 18], [0, 0.7], { extrapolateRight: "clamp" }),
          fontWeight: 500,
        }}
      >
        Sec. 03 — Three Acts, One Take
      </div>

      <AbsoluteFill
        style={{
          flexDirection: isPortrait ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isPortrait ? 36 : 80,
          padding: isPortrait ? "0 60px" : "0 120px",
        }}
      >
        {ACTS.map((act, i) => {
          const delay = 18 + i * 16;
          const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 110 } });
          const y = interpolate(s, [0, 1], [60, 0]);
          const op = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateRight: "clamp" });
          const pulse = interpolate(frame % 60, [0, 30, 60], [1, 1.02, 1]);
          const labelOp = interpolate(frame, [delay + 14, delay + 30], [0, 0.7], { extrapolateRight: "clamp" });
          const bodyOp = interpolate(frame, [delay + 24, delay + 44], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div
              key={act.n}
              style={{
                transform: `translateY(${y}px)`,
                opacity: op,
                textAlign: "center",
                flex: isPortrait ? "none" : "1 1 0",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: isPortrait ? "clamp(140px, 32vw, 280px)" : "clamp(160px, 14vw, 240px)",
                  lineHeight: 0.85,
                  letterSpacing: "-0.06em",
                  color: COLORS.ink,
                  fontVariantNumeric: "tabular-nums",
                  transform: `scale(${pulse})`,
                  fontWeight: 400,
                }}
              >
                {act.n}
              </div>
              <div
                style={{
                  marginTop: isPortrait ? 8 : 14,
                  fontFamily: FONTS.ui,
                  fontSize: isPortrait ? 11 : 13,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: COLORS.primary,
                  opacity: labelOp / 0.7,
                  fontWeight: 500,
                }}
              >
                The {act.label}
              </div>
              <div
                style={{
                  marginTop: isPortrait ? 8 : 12,
                  fontFamily: FONTS.display,
                  fontStyle: "italic",
                  fontSize: isPortrait ? 30 : 32,
                  color: COLORS.ink,
                  opacity: bodyOp * 0.92,
                  letterSpacing: "-0.01em",
                }}
              >
                {act.body}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

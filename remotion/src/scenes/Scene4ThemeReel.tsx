import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS, Orientation } from "../components/tokens";

type ThemeCard = { name: string; bg: string; fg: string; accent: string; tag: string };

const THEMES: ThemeCard[] = [
  { name: "Editorial", bg: "#F4EFE6", fg: "#141414", accent: "#E85D3A", tag: "Cream" },
  { name: "Noir", bg: "#0E0E0E", fg: "#F4EFE6", accent: "#C9A84C", tag: "Gold" },
  { name: "Midnight", bg: "#0B1F1A", fg: "#E8F0EC", accent: "#5CCBA0", tag: "Emerald" },
  { name: "Warm", bg: "#F5E7D2", fg: "#3A1F12", accent: "#C45A2D", tag: "Sienna" },
  { name: "Studio", bg: "#E6E2DA", fg: "#1A1A1A", accent: "#3B6FA0", tag: "Indigo" },
  { name: "Playful", bg: "#F8E8D8", fg: "#1A1A1A", accent: "#E84393", tag: "Hot" },
];

// Scene 4 — Theme reel (frames 0..180)
// A horizontal marquee of mini "magazine" cards, tilted, with parallax.
export const Scene4ThemeReel: React.FC<{ orientation: Orientation }> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isPortrait = orientation === "portrait";

  const headerOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [165, 180], [1, 0], { extrapolateRight: "clamp" });

  // Continuous marquee
  const trackX = interpolate(frame, [0, 180], [0, isPortrait ? -1100 : -1400]);

  const cards = [...THEMES, ...THEMES];
  const cardW = isPortrait ? 320 : 440;
  const cardH = isPortrait ? 200 : 260;
  const gap = isPortrait ? 30 : 44;

  return (
    <AbsoluteFill style={{ background: COLORS.paper, overflow: "hidden", opacity: exit }}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: isPortrait ? "9%" : "14%",
          left: isPortrait ? "8%" : "8%",
          right: isPortrait ? "8%" : "8%",
          opacity: headerOp,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.ui,
            fontSize: isPortrait ? 12 : 14,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: COLORS.ink,
            opacity: 0.65,
            marginBottom: 18,
            fontWeight: 500,
          }}
        >
          Sec. 04 — The Wardrobe
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: isPortrait ? "clamp(64px, 16vw, 140px)" : "clamp(80px, 9vw, 160px)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: COLORS.ink,
            fontWeight: 400,
          }}
        >
          One engine.<br />
          <span style={{ fontStyle: "italic", color: COLORS.primary }}>Many wardrobes.</span>
        </div>
      </div>

      {/* Marquee track */}
      <div
        style={{
          position: "absolute",
          bottom: isPortrait ? "12%" : "12%",
          left: 0,
          right: 0,
          display: "flex",
          gap,
          transform: `translateX(${trackX}px) translateX(${isPortrait ? 60 : 120}px)`,
          width: "max-content",
        }}
      >
        {cards.map((t, i) => {
          const tilt = i % 2 === 0 ? -2.5 : 2;
          const inSpring = spring({ frame: frame - 14 - i * 4, fps, config: { damping: 18 } });
          const y = interpolate(inSpring, [0, 1], [40, 0]);
          const op = interpolate(frame, [14 + i * 4, 32 + i * 4], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                width: cardW,
                flexShrink: 0,
                transform: `translateY(${y}px) rotate(${tilt}deg)`,
                opacity: op,
              }}
            >
              <div
                style={{
                  width: cardW,
                  height: cardH,
                  background: t.bg,
                  color: t.fg,
                  boxShadow: "0 30px 60px -30px rgba(20,20,20,0.35), 0 8px 18px -10px rgba(20,20,20,0.25)",
                  borderRadius: 6,
                  padding: isPortrait ? "20px 22px" : "28px 30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONTS.ui, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.6, fontWeight: 500 }}>
                  <span>{t.tag}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>№ 0{(i % 6) + 1}</span>
                </div>
                <div>
                  <div style={{ fontFamily: FONTS.display, fontSize: isPortrait ? 44 : 60, lineHeight: 0.92, letterSpacing: "-0.025em", fontWeight: 400 }}>
                    {t.name}
                  </div>
                  <div style={{ fontFamily: FONTS.display, fontStyle: "italic", fontSize: isPortrait ? 18 : 22, opacity: 0.7, marginTop: 4 }}>
                    a scene from your script
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONTS.ui, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.85, fontWeight: 500 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent }} />
                  <span>Theme</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

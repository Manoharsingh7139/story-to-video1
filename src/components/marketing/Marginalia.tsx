import { useEffect, useState } from "react";

const NOTES = [
  { text: "made in 4 minutes", side: "right" as const, top: "22%" },
  { text: "no editor required", side: "left" as const, top: "44%" },
  { text: "your voice, your reel", side: "right" as const, top: "62%" },
  { text: "Sec. ¶ — a quiet aside", side: "left" as const, top: "80%" },
];

/**
 * Floating editorial marginalia — pull-quotes that fade in along
 * the page edges based on scroll depth. Hidden on small screens.
 */
export function Marginalia() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden lg:block" aria-hidden>
      {NOTES.map((n, i) => {
        const trigger = (i + 0.5) / NOTES.length;
        const dist = Math.abs(progress - trigger);
        const opacity = Math.max(0, 1 - dist * 6);
        const tx = (1 - opacity) * (n.side === "right" ? 12 : -12);
        return (
          <div
            key={i}
            className="absolute font-serif italic text-[12px] text-foreground/45 transition-opacity"
            style={{
              top: n.top,
              [n.side]: "1.25rem",
              opacity,
              transform: `translateX(${tx}px) rotate(${n.side === "right" ? 90 : -90}deg)`,
              transformOrigin: n.side === "right" ? "right top" : "left top",
              whiteSpace: "nowrap",
              letterSpacing: "0.05em",
            }}
          >
            ¶ {n.text}
          </div>
        );
      })}
    </div>
  );
}

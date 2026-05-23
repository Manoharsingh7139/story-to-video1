import { useEffect, useState } from "react";

const GLYPHS = ["✺", "✦", "❋", "✶", "❖", "✷", "§", "¶"];

type Piece = { id: number; x: number; glyph: string; delay: number; rot: number; dur: number };

/**
 * Easter egg: type "story" anywhere on the landing page to summon
 * a one-time burst of editorial glyphs in the sage palette.
 */
export function GlyphConfetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    let buf = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-12);
      if (buf.endsWith("story")) {
        const next: Piece[] = Array.from({ length: 36 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          delay: Math.random() * 0.4,
          rot: (Math.random() - 0.5) * 180,
          dur: 2.4 + Math.random() * 1.6,
        }));
        setPieces(next);
        buf = "";
        setTimeout(() => setPieces([]), 4500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute -top-10 text-primary"
          style={{
            left: `${p.x}%`,
            fontSize: `${18 + Math.random() * 22}px`,
            animation: `ff-glyph-fall ${p.dur}s cubic-bezier(.22,.61,.36,1) ${p.delay}s forwards`,
            transform: `rotate(${p.rot}deg)`,
            opacity: 0.85,
          }}
        >
          {p.glyph}
        </span>
      ))}
      <style>{`
        @keyframes ff-glyph-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.9; }
          100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

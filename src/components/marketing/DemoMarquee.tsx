import { SlideView } from "@/components/prototype/SlideView";
import { THEMES } from "@/lib/prototype/themes";
import { SAMPLE_DECK } from "@/lib/prototype/sampleDeck";
import type { ThemeId } from "@/lib/prototype/types";

const PICKS: { idx: number; theme: ThemeId; tilt: number }[] = [
  { idx: 0, theme: "editorial", tilt: -2 },
  { idx: 2, theme: "studio", tilt: 1.5 },
  { idx: 3, theme: "noir", tilt: -1 },
  { idx: 5, theme: "midnight", tilt: 2 },
  { idx: 11, theme: "warm", tilt: -1.5 },
  { idx: 7, theme: "minimal", tilt: 1 },
  { idx: 9, theme: "darktech", tilt: -2 },
  { idx: 23, theme: "playful", tilt: 1.5 },
];

export function DemoMarquee() {
  // Duplicate twice for seamless loop
  const reel = [...PICKS, ...PICKS];

  return (
    <section
      id="demo"
      aria-label="Live demo strip"
      className="relative overflow-hidden border-b hairline py-12 md:py-20 bg-paper"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-10 mb-8 md:mb-12 flex items-end justify-between gap-6">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-3 font-medium">
            Sec. 02 — On the cutting room floor
          </div>
          <h2 className="editorial-display text-foreground text-[32px] sm:text-[40px] md:text-[56px] leading-[0.95]">
            A reel of <span className="italic text-primary">just-baked</span> scenes.
          </h2>
        </div>
        <p className="hidden md:block font-serif italic text-[15px] text-foreground/65 max-w-[280px] text-right">
          Every frame below was generated from a paragraph of text. Hover to pause the carousel.
        </p>
      </div>

      {/* Marquee */}
      <div className="group/marquee relative">
        {/* Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        <div
          className="flex gap-5 md:gap-8 w-max ff-marquee"
          style={{ animation: "ff-marquee 60s linear infinite" }}
        >
          {reel.map((p, i) => {
            const theme = THEMES[p.theme];
            const slide = SAMPLE_DECK[p.idx] ?? SAMPLE_DECK[0];
            return (
              <div
                key={i}
                className="shrink-0 transition-transform duration-300 ease-out hover:!rotate-0 hover:scale-[1.03]"
                style={{ transform: `rotate(${p.tilt}deg)` }}
              >
                <div
                  className="w-[300px] sm:w-[400px] md:w-[520px] aspect-video bg-card overflow-hidden rounded-md"
                  style={{ boxShadow: "var(--shadow-paper)" }}
                >
                  <div className="w-full h-full pointer-events-none select-none">
                    <SlideView slide={slide} theme={theme} scale="auto" />
                  </div>
                </div>
                <div className="mt-3 px-1 flex items-center justify-between text-[10.5px] uppercase tracking-[0.18em] text-foreground/55 tnum">
                  <span>{theme.name}</span>
                  <span>Fig. {String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyframes — local to this component */}
      <style>{`
        @keyframes ff-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .group\\/marquee:hover .ff-marquee { animation-play-state: paused !important; }
        @media (prefers-reduced-motion: reduce) {
          .ff-marquee { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

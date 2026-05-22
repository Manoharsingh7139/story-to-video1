import { SlideView } from "@/components/prototype/SlideView";
import { THEMES } from "@/lib/prototype/themes";
import { SAMPLE_DECK } from "@/lib/prototype/sampleDeck";
import type { ThemeId } from "@/lib/prototype/types";

// Curated mapping: theme → which sample slide reads best for that theme.
const GALLERY: { id: ThemeId; slide: number; size: "tall" | "wide" | "square" }[] = [
  { id: "editorial", slide: 0, size: "tall" },
  { id: "studio", slide: 11, size: "wide" },
  { id: "noir", slide: 13, size: "square" },
  { id: "midnight", slide: 2, size: "wide" },
  { id: "playful", slide: 19, size: "tall" },
  { id: "minimal", slide: 17, size: "square" },
  { id: "warm", slide: 23, size: "wide" },
  { id: "darktech", slide: 20, size: "square" },
  { id: "corporate", slide: 24, size: "tall" },
];

function ThemeCard({ id, slideIdx }: { id: ThemeId; slideIdx: number }) {
  const theme = THEMES[id];
  const slide = SAMPLE_DECK[slideIdx] ?? SAMPLE_DECK[0];
  return (
    <figure className="group/card relative">
      <div
        className="aspect-video w-full overflow-hidden rounded-md bg-card transition-transform duration-300 ease-out group-hover/card:scale-[1.015]"
        style={{
          boxShadow: "var(--shadow-paper)",
        }}
      >
        <div className="w-full h-full pointer-events-none select-none">
          <SlideView slide={slide} theme={theme} scale="auto" />
        </div>
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between text-[11px] uppercase tracking-[0.2em] text-foreground/60 tnum">
        <span className="flex items-center gap-2 text-foreground/80 font-medium">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: theme.accent }}
            aria-hidden
          />
          {theme.name}
        </span>
        <span>Theme</span>
      </figcaption>
    </figure>
  );
}

export function ThemeGallery() {
  return (
    <section
      id="themes"
      aria-label="Theme gallery"
      className="border-b hairline bg-paper"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-10 py-16 md:py-32">
        <div className="flex items-end justify-between gap-6 mb-10 md:mb-16">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-3 font-medium">
              Sec. 04 — The Wardrobe
            </div>
            <h2 className="editorial-display text-foreground text-[36px] sm:text-[48px] md:text-[72px] leading-[0.95]">
              Multiple themes. <span className="italic">One signature.</span>
            </h2>
          </div>
          <p className="hidden md:block font-serif italic text-[15px] text-foreground/65 max-w-[300px] text-right">
            Same engine, multiple wardrobes — from editorial cream to noir gold to midnight emerald.
          </p>
        </div>

        {/* First half of the grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-24">
          {GALLERY.slice(0, 6).map((g) => (
            <ThemeCard key={g.id} id={g.id} slideIdx={g.slide} />
          ))}
        </div>

        {/* Interrupting pull-quote */}
        <blockquote className="relative my-10 md:my-20 py-10 md:py-20 border-y hairline">
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-6 font-medium text-center">
            ¶ Editor's Note
          </div>
          <p
            className="editorial-display italic text-center text-foreground mx-auto px-4"
            style={{
              fontSize: "clamp(32px, 7vw, 96px)",
              lineHeight: 1.05,
              maxWidth: "18ch",
            }}
          >
            Crafted with <span aria-label="love" className="not-italic">❤</span> in-house
          </p>
        </blockquote>

        {/* Second half */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {GALLERY.slice(6).map((g) => (
            <ThemeCard key={g.id} id={g.id} slideIdx={g.slide} />
          ))}
        </div>
      </div>
    </section>
  );
}

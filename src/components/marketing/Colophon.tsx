import { Wordmark } from "@/components/Wordmark";

export function Colophon() {
  return (
    <footer aria-label="Footer" className="relative overflow-hidden bg-background border-t hairline">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-10">
        <div className="max-w-[640px]">
          <Wordmark size="md" />
          <p className="mt-5 font-serif italic text-[18px] leading-[1.4] text-foreground/70 max-w-prose">
            Where words become watchable. A studio for writers who'd rather ship a film than fight a timeline.
          </p>
        </div>

        <div
          aria-hidden
          className="editorial-display italic select-none text-foreground/[0.06] leading-none mt-16 md:mt-24 -mb-6 md:-mb-12 overflow-hidden"
          style={{
            fontSize: "clamp(96px, 22vw, 340px)",
            letterSpacing: "-0.05em",
          }}
        >
          FrameFlow.
        </div>

        <div className="border-t hairline pt-5 flex items-center justify-between text-[10.5px] uppercase tracking-[0.22em] text-foreground/50 font-medium tnum">
          <span>Vol. I · Issue Nº 01</span>
          <span>End of issue —</span>
        </div>
      </div>
    </footer>
  );
}

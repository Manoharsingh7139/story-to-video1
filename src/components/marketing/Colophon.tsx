import { Wordmark } from "@/components/Wordmark";
import logoSrc from "@/assets/frameflow-logo.png";

export function Colophon() {
  return (
    <footer aria-label="Footer" className="relative overflow-hidden bg-background border-t hairline">
      <img
        src={logoSrc}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-16 md:-right-24 top-1/2 -translate-y-1/2 w-[280px] md:w-[460px] h-[280px] md:h-[460px] object-cover rounded-[40px] opacity-[0.07]"
      />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-10 relative">
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

import { useEffect, useRef, useState } from "react";
import logoSrc from "@/assets/frameflow-logo.png";

/** Magnetic word — letters tilt + drift slightly toward cursor on pointer:fine. */
function MagneticWord({
  children,
  className,
  style,
  italicAccent,
}: {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  italicAccent?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const letters = el.querySelectorAll<HTMLElement>("[data-letter]");
        letters.forEach((l) => {
          const r = l.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = (e.clientX - cx) / 80;
          const dy = (e.clientY - cy) / 80;
          const dist = Math.hypot(dx, dy);
          const fall = Math.max(0, 1 - dist / 6);
          l.style.transform = `translate(${dx * fall * 4}px, ${dy * fall * 4}px) rotate(${dx * fall * 1.2}deg)`;
        });
      });
    };
    const onLeave = () => {
      const letters = el.querySelectorAll<HTMLElement>("[data-letter]");
      letters.forEach((l) => (l.style.transform = ""));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Split into letters; preserve italic accent token like "·able."
  const text = children;
  const accentIdx = italicAccent ? text.indexOf(italicAccent) : -1;
  const main = accentIdx >= 0 ? text.slice(0, accentIdx) : text;
  const accent = accentIdx >= 0 ? text.slice(accentIdx) : "";

  return (
    <span ref={ref} className={className} style={style}>
      <span className="ff-kinetic inline-block">
        {Array.from(main).map((ch, i) => (
          <span
            key={i}
            data-letter
            className="inline-block transition-transform duration-300 ease-out will-change-transform"
            style={{
              animation: `ff-letter-rise 0.7s cubic-bezier(.2,.7,.2,1) ${i * 22}ms both`,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
        {accent && (
          <span
            className="italic text-primary"
            style={{ fontWeight: 400, animation: "ff-letter-rise 0.8s cubic-bezier(.2,.7,.2,1) 380ms both" }}
          >
            {accent}
          </span>
        )}
      </span>
    </span>
  );
}

export function MagazineHero() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight;
      setProgress(Math.min(1, window.scrollY / (h * 0.9)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section aria-label="Hero" className="relative overflow-hidden border-b hairline">
      {/* Scroll progress rule */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-primary z-10 origin-left transition-transform duration-150 ease-out"
        style={{ width: "100%", transform: `scaleX(${progress})` }}
      />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-10 pt-10 md:pt-16 pb-12 md:pb-24 relative">
        <div
          className="mb-8 md:mb-14 flex items-center gap-3 md:gap-4 animate-fade-in-up"
          style={{ transform: `translateY(${progress * -20}px)`, opacity: 1 - progress * 0.4 }}
        >
          <span
            className="inline-flex items-center justify-center overflow-hidden rounded-[12px] md:rounded-[14px] border hairline bg-primary shrink-0 h-[64px] w-[64px] md:h-[88px] md:w-[88px]"
            style={{ boxShadow: "var(--shadow-paper)" }}
            aria-hidden="true"
          >
            <img src={logoSrc} alt="" className="h-full w-full object-cover" />
          </span>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[10px] md:text-[10.5px] uppercase tracking-[0.22em] md:tracking-[0.28em] text-foreground/55 font-medium truncate">
              FrameFlow · Est. MMXXVI
            </span>
            <span className="font-serif italic text-[16px] md:text-[20px] text-foreground/80 leading-none">
              The Content Studio
            </span>
          </div>
        </div>

        <h1
          className="editorial-display text-foreground"
          style={{
            fontSize: "clamp(64px, 13.5vw, 220px)",
            lineHeight: 0.88,
            letterSpacing: "-0.045em",
          }}
        >
          <MagneticWord className="block">Words</MagneticWord>
          <MagneticWord className="block pl-[8%] md:pl-[14%]">become</MagneticWord>
          <MagneticWord className="block" italicAccent="·able.">
            watch·able.
          </MagneticWord>
        </h1>

        <div className="mt-10 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-7 md:col-start-1">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-3 font-medium">
              The Pitch
            </div>
            <p className="font-serif italic text-[18px] md:text-[24px] leading-[1.4] md:leading-[1.35] text-foreground/85 max-w-prose">
              Drop a script, a lecture, or a half-formed take. FrameFlow cuts it
              into beautifully designed scenes, clones your voice, and hands you
              back a narrated film.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ff-letter-rise {
          0% { opacity: 0; transform: translateY(0.6em) skewY(6deg); }
          60% { opacity: 1; }
          100% { opacity: 1; transform: translateY(0) skewY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ff-kinetic [data-letter] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}

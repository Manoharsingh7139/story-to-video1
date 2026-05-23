import { useEffect, useState } from "react";

type Stage = {
  prompt: string;
  frames: string[];
  title: string;
  accent: string;
};

const STAGES: Stage[] = [
  {
    prompt: "A short essay on why slow mornings make better decisions.",
    frames: ["Cold brew", "An empty page", "The first sentence"],
    title: "Slow Mornings",
    accent: "hsl(var(--primary))",
  },
  {
    prompt: "Explain quantum entanglement to a curious 11-year-old.",
    frames: ["Two coins", "A long hallway", "One flip, two answers"],
    title: "Spooky at a Distance",
    accent: "#7a5cff",
  },
  {
    prompt: "A founder's note announcing the company's first hire.",
    frames: ["The empty desk", "A handshake", "Week one ships"],
    title: "Hello, Team",
    accent: "#c97a3a",
  },
];

function useTypewriter(text: string, speed = 22) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

export function LiveTransform() {
  const [idx, setIdx] = useState(0);
  const stage = STAGES[idx];
  const typed = useTypewriter(stage.prompt);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % STAGES.length), 7500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      aria-label="Watch it think"
      className="relative overflow-hidden border-b hairline bg-background"
    >
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 md:px-10 py-16 md:py-28">
        <div className="flex items-end justify-between gap-6 mb-12 md:mb-20">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-3 font-medium">
              Sec. 02½ — Watch it think
            </div>
            <h2 className="editorial-display text-foreground text-[32px] sm:text-[40px] md:text-[60px] leading-[0.95]">
              From a sentence <span className="italic text-primary">to a film,</span> in three steps.
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10.5px] uppercase tracking-[0.2em] text-foreground/55 tnum">
            {STAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Show example ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === idx ? 28 : 10,
                  background:
                    i === idx ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.2)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Vertical stepper */}
        <ol className="relative">
          {/* Connecting rail */}
          <div
            aria-hidden
            className="absolute left-[19px] md:left-[27px] top-2 bottom-2 w-px bg-foreground/15"
          />

          <Step
            n="01"
            label="Your idea"
            caption="Paste a sentence, a paragraph, or an entire script."
          >
            <div
              className="rounded-md border hairline bg-card p-5 md:p-6"
              style={{ boxShadow: "var(--shadow-paper)" }}
            >
              <div className="text-[10px] uppercase tracking-[0.22em] text-foreground/55 mb-3 font-medium tnum">
                Prompt
              </div>
              <div className="font-serif italic text-[17px] md:text-[20px] leading-[1.5] text-foreground/90 min-h-[64px]">
                "{typed}
                <span className="inline-block w-[2px] h-[1em] align-[-2px] ml-[2px] bg-primary animate-[ff-blink_1s_steps(2)_infinite]" />"
              </div>
            </div>
          </Step>

          <Step
            n="02"
            label="Storyboard"
            caption="FrameFlow breaks it into scenes and lays out the frames."
          >
            <div
              className="rounded-md border hairline bg-card p-5 md:p-6"
              style={{ boxShadow: "var(--shadow-paper)" }}
            >
              <div className="text-[10px] uppercase tracking-[0.22em] text-foreground/55 mb-4 font-medium tnum">
                Scenes
              </div>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {stage.frames.map((f, i) => (
                  <div
                    key={stage.title + i}
                    className="aspect-[3/4] rounded-sm border hairline bg-paper relative overflow-hidden animate-[ff-frame-in_0.6s_ease-out_both]"
                    style={{ animationDelay: `${i * 140}ms` }}
                  >
                    <div
                      className="absolute inset-x-2 top-2 h-1 rounded-full"
                      style={{ background: stage.accent, opacity: 0.85 }}
                    />
                    <div className="absolute inset-x-2 bottom-2 text-[9.5px] uppercase tracking-[0.18em] text-foreground/70 leading-tight">
                      {f}
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] tnum text-foreground/35">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Step>

          <Step
            n="03"
            label="Final film"
            caption="Voice cloned, scenes scored, exported and ready to ship."
            last
          >
            <div
              key={stage.title}
              className="relative aspect-video rounded-md overflow-hidden animate-[ff-frame-in_0.7s_ease-out_both]"
              style={{
                background: `linear-gradient(135deg, ${stage.accent} 0%, hsl(var(--foreground)) 140%)`,
                boxShadow: "var(--shadow-paper)",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
              <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-between text-[#faf8f3]">
                <div className="text-[9.5px] uppercase tracking-[0.22em] opacity-80">
                  FrameFlow · Reel
                </div>
                <div>
                  <div className="font-serif italic text-[26px] md:text-[34px] leading-[1.05]">
                    {stage.title}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-80 tnum">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-foreground">
                      ▶
                    </span>
                    Auto-narrated · 1:24
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.18)_50%,transparent_60%)] bg-[length:200%_100%] animate-[ff-shimmer_3.5s_linear_infinite]" />
            </div>
          </Step>
        </ol>
      </div>

      <style>{`
        @keyframes ff-blink { to { opacity: 0; } }
        @keyframes ff-frame-in {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ff-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -100% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-[ff-"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

function Step({
  n,
  label,
  caption,
  children,
  last,
}: {
  n: string;
  label: string;
  caption: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <li className={`relative pl-14 md:pl-20 ${last ? "" : "pb-12 md:pb-16"}`}>
      {/* Numeral marker */}
      <div
        className="absolute left-0 top-0 h-10 w-10 md:h-14 md:w-14 rounded-full bg-card border hairline flex items-center justify-center text-[12px] md:text-[13px] tnum font-medium text-foreground tracking-wider"
        style={{ boxShadow: "var(--shadow-paper)" }}
      >
        {n}
      </div>

      <div className="mb-4 md:mb-5">
        <div className="text-[10.5px] uppercase tracking-[0.22em] text-primary font-medium mb-1.5">
          Step {n} — {label}
        </div>
        <p className="font-serif italic text-[15px] md:text-[17px] text-foreground/65 max-w-[52ch]">
          {caption}
        </p>
      </div>

      {children}
    </li>
  );
}

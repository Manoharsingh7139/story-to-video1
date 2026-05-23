import { useEffect, useState } from "react";

type Stage = {
  prompt: string;
  frames: string[]; // 3 short labels for storyboard
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
    const id = setInterval(() => setIdx((i) => (i + 1) % STAGES.length), 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      aria-label="Watch it think"
      className="relative overflow-hidden border-b hairline bg-background"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-10 py-16 md:py-28">
        <div className="flex items-end justify-between gap-6 mb-10 md:mb-16">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-3 font-medium">
              Sec. 02½ — Watch it think
            </div>
            <h2 className="editorial-display text-foreground text-[32px] sm:text-[40px] md:text-[60px] leading-[0.95]">
              From a sentence <span className="italic text-primary">to a film,</span> live.
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

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-4 md:gap-6">
          {/* Pane 1 — typed prompt */}
          <Pane label="01 · Your idea">
            <div className="font-serif italic text-[15px] md:text-[17px] leading-[1.5] text-foreground/85 min-h-[120px] md:min-h-[160px]">
              "{typed}
              <span className="inline-block w-[2px] h-[1em] align-[-2px] ml-[2px] bg-primary animate-[ff-blink_1s_steps(2)_infinite]" />"
            </div>
          </Pane>

          <Arrow />

          {/* Pane 2 — storyboard frames */}
          <Pane label="02 · Storyboard">
            <div className="flex gap-2 md:gap-3 h-full items-stretch">
              {stage.frames.map((f, i) => (
                <div
                  key={stage.title + i}
                  className="flex-1 aspect-[3/4] rounded-sm border hairline bg-card relative overflow-hidden animate-[ff-frame-in_0.6s_ease-out_both]"
                  style={{ animationDelay: `${i * 140}ms` }}
                >
                  <div
                    className="absolute inset-x-2 top-2 h-1 rounded-full"
                    style={{ background: stage.accent, opacity: 0.85 }}
                  />
                  <div className="absolute inset-x-2 bottom-2 text-[9.5px] uppercase tracking-[0.18em] text-foreground/70 leading-tight">
                    {f}
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] tnum text-foreground/40">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          </Pane>

          <Arrow />

          {/* Pane 3 — final film */}
          <Pane label="03 · Final film">
            <div
              key={stage.title}
              className="relative aspect-video rounded-sm overflow-hidden animate-[ff-frame-in_0.7s_ease-out_both]"
              style={{
                background: `linear-gradient(135deg, ${stage.accent} 0%, hsl(var(--foreground)) 140%)`,
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
              <div className="absolute inset-0 p-4 flex flex-col justify-between text-[#faf8f3]">
                <div className="text-[9.5px] uppercase tracking-[0.22em] opacity-80">
                  FrameFlow · Reel
                </div>
                <div>
                  <div className="font-serif italic text-[22px] md:text-[26px] leading-[1.05]">
                    {stage.title}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-80 tnum">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-foreground">
                      ▶
                    </span>
                    Auto-narrated · 1:24
                  </div>
                </div>
              </div>
              {/* sweeping shimmer */}
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.18)_50%,transparent_60%)] bg-[length:200%_100%] animate-[ff-shimmer_3.5s_linear_infinite]" />
            </div>
          </Pane>
        </div>
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

function Pane({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border hairline bg-card p-4 md:p-5 flex flex-col gap-3" style={{ boxShadow: "var(--shadow-paper)" }}>
      <div className="text-[10px] uppercase tracking-[0.22em] text-foreground/55 font-medium tnum">
        {label}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden md:flex items-center justify-center text-foreground/35 text-[20px]">
      <span className="animate-[ff-arrow_2s_ease-in-out_infinite]">→</span>
      <style>{`@keyframes ff-arrow { 0%,100% { transform: translateX(0); } 50% { transform: translateX(4px); } }`}</style>
    </div>
  );
}

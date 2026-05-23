import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const CHIPS = [
  { id: "warm", label: "Warm", match: ["love", "family", "morning", "coffee", "memory", "home"] },
  { id: "bold", label: "Bold", match: ["launch", "ship", "build", "founder", "win", "first"] },
  { id: "curious", label: "Curious", match: ["why", "how", "explain", "quantum", "wonder", "what"] },
  { id: "cinematic", label: "Cinematic", match: ["night", "city", "ocean", "rain", "alone", "drive"] },
  { id: "playful", label: "Playful", match: ["funny", "weird", "kid", "cat", "joke", "tiny"] },
  { id: "noir", label: "Noir", match: ["dark", "secret", "lost", "ghost", "shadow", "alone"] },
];

export function PromptTeaser({ onSubmit }: { onSubmit?: (prompt: string) => void }) {
  const [value, setValue] = useState("");

  const active = useMemo(() => {
    const v = value.toLowerCase();
    const set = new Set<string>();
    CHIPS.forEach((c) => c.match.forEach((m) => v.includes(m) && set.add(c.id)));
    if (set.size === 0 && v.trim().length > 12) set.add("warm");
    return set;
  }, [value]);

  return (
    <section
      aria-label="Try a prompt"
      className="relative overflow-hidden border-b hairline bg-paper"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-10 py-16 md:py-28">
        <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-3 font-medium">
          Sec. 05 — A small invitation
        </div>
        <h2 className="editorial-display text-foreground text-[32px] sm:text-[44px] md:text-[68px] leading-[0.95] max-w-[14ch]">
          Tell us a story <span className="italic text-primary">about…</span>
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) onSubmit?.(value.trim());
          }}
          className="mt-10 md:mt-14 max-w-[860px]"
        >
          <div
            className="relative flex items-center gap-3 rounded-full border hairline bg-card pl-6 pr-2 py-2"
            style={{ boxShadow: "var(--shadow-paper)" }}
          >
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="…the night the lights went out in our kitchen."
              className="flex-1 bg-transparent outline-none font-serif italic text-[16px] md:text-[20px] text-foreground placeholder:text-foreground/35 py-3"
              maxLength={140}
            />
            <button
              type="submit"
              className="group inline-flex items-center gap-2 h-11 pl-5 pr-4 rounded-full bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.18em] font-medium border hairline transition-transform hover:-translate-y-[1px]"
            >
              <span>Begin</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {CHIPS.map((c) => {
              const on = active.has(c.id);
              return (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border hairline text-[10.5px] uppercase tracking-[0.2em] font-medium transition-all duration-300"
                  style={{
                    background: on ? "hsl(var(--primary))" : "transparent",
                    color: on ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground) / 0.55)",
                    transform: on ? "translateY(-1px)" : "none",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: on ? "currentColor" : "hsl(var(--foreground) / 0.25)" }}
                  />
                  {c.label}
                </span>
              );
            })}
          </div>

          <p className="mt-6 font-serif italic text-[14px] text-foreground/55 max-w-prose">
            We'll pick a wardrobe to match the mood, score it, and start cutting.
          </p>
        </form>
      </div>
    </section>
  );
}

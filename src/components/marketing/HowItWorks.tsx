import {
  ManuscriptIllustration,
  StudioIllustration,
  LogbookIllustration,
} from "@/assets/illustrations/EditorialIllustrations";

const ACTS = [
  {
    n: "01",
    label: "The Script",
    title: "Drop a take.",
    body: "Paste writing, upload an .mp3, or talk into the mic. We transcribe, clean, and listen for narrative structure.",
    Illustration: ManuscriptIllustration,
    align: "left" as const,
  },
  {
    n: "02",
    label: "The Cut",
    title: "We frame the story.",
    body: "Your words are paced into scenes — titles, quadrants, charts, image-bleeds — composed by the same editorial system the studio runs on.",
    Illustration: StudioIllustration,
    align: "right" as const,
  },
  {
    n: "03",
    label: "The Voice",
    title: "Clone, then press play.",
    body: "Train a voice from sixty seconds of audio. FrameFlow narrates each scene, syncs the cuts, and exports a film you can ship.",
    Illustration: LogbookIllustration,
    align: "left" as const,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      aria-label="How it works"
      className="border-b hairline bg-background"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-32">
        <div className="flex items-end justify-between gap-6 mb-16 md:mb-24">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-3 font-medium">
              Sec. 03 — The Production
            </div>
            <h2 className="editorial-display text-foreground text-[42px] md:text-[72px] leading-[0.95]">
              Three acts, <span className="italic">one take.</span>
            </h2>
          </div>
          <p className="hidden md:block font-serif italic text-[15px] text-foreground/65 max-w-[300px] text-right">
            From half-formed sentence to a film ready to publish — in under five minutes.
          </p>
        </div>

        <div className="space-y-24 md:space-y-40">
          {ACTS.map((act, i) => {
            const Illo = act.Illustration;
            const isLeft = act.align === "left";
            return (
              <article
                key={act.n}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
              >
                {/* Big numeral — bleeds large */}
                <div
                  className={
                    isLeft
                      ? "md:col-span-5 md:col-start-1 order-1"
                      : "md:col-span-5 md:col-start-8 md:row-start-1 order-1 md:order-2"
                  }
                >
                  <div className="relative">
                    <div
                      className="editorial-display tnum text-foreground/[0.08] leading-none select-none"
                      style={{
                        fontSize: "clamp(180px, 28vw, 380px)",
                        letterSpacing: "-0.06em",
                      }}
                    >
                      {act.n}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Illo className="w-32 md:w-44 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Copy */}
                <div
                  className={
                    isLeft
                      ? "md:col-span-5 md:col-start-7 order-2"
                      : "md:col-span-5 md:col-start-2 md:row-start-1 order-2 md:order-1"
                  }
                >
                  <div className="text-[10.5px] uppercase tracking-[0.22em] text-primary mb-4 font-medium tnum">
                    Act {act.n} — {act.label}
                  </div>
                  <h3 className="editorial-display text-foreground text-[32px] md:text-[44px] leading-[1.02] mb-5">
                    {act.title}
                  </h3>
                  <div className="h-px w-12 bg-foreground/25 mb-5" />
                  <p className="font-serif italic text-[18px] md:text-[20px] leading-[1.45] text-foreground/75 max-w-prose">
                    {act.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

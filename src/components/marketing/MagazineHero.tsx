export function MagazineHero() {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden border-b hairline"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-14 md:pb-24 relative">
        <h1
          className="editorial-display text-foreground"
          style={{
            fontSize: "clamp(64px, 13.5vw, 220px)",
            lineHeight: 0.88,
            letterSpacing: "-0.045em",
          }}
        >
          <span className="block animate-fade-in-up">Words</span>
          <span
            className="block pl-[8%] md:pl-[14%] animate-fade-in-up"
            style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
          >
            become
          </span>
          <span
            className="block animate-fade-in-up"
            style={{ animationDelay: "160ms", animationFillMode: "backwards" }}
          >
            watch
            <span
              className="italic text-primary"
              style={{ fontWeight: 400 }}
            >
              ·able.
            </span>
          </span>
        </h1>

        <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-7 md:col-start-1">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-3 font-medium">
              The Pitch
            </div>
            <p className="font-serif italic text-[20px] md:text-[24px] leading-[1.35] text-foreground/85 max-w-prose">
              Drop a script, a lecture, or a half-formed take. FrameFlow cuts it
              into beautifully designed scenes, clones your voice, and hands you
              back a narrated film.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

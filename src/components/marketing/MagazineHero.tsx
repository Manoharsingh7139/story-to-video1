import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import { ArrowUpRight, Play } from "lucide-react";

const ISSUE_DATE = "MAY · MMXXVI";

export function MagazineHero() {
  const { user } = useAuth();
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden border-b hairline"
    >
      {/* Masthead rule */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-10 md:pt-16">
        <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 tnum font-medium">
          <span>Issue Nº 01 — FrameFlow Quarterly</span>
          <span className="hidden sm:block">{ISSUE_DATE}</span>
          <span className="hidden md:block">Vol. I · The Studio</span>
        </div>
        <div className="mt-4 h-px bg-foreground/20" />
      </div>

      {/* Title */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-14 md:pb-24 relative">
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

        {/* Lede + CTAs grid */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-5 md:col-start-1">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-3 font-medium">
              The Pitch
            </div>
            <p className="font-serif italic text-[20px] md:text-[24px] leading-[1.35] text-foreground/85 max-w-prose">
              Drop a script, a lecture, or a half-formed take. FrameFlow cuts it
              into beautifully designed scenes, clones your voice, and hands you
              back a narrated film.
            </p>
            <div className="mt-7 flex items-center gap-3 flex-wrap">
              {user ? (
                <Button asChild size="lg" className="rounded-full h-11 px-6 text-[13.5px]">
                  <Link to="/app">
                    Open Studio <ArrowUpRight className="h-4 w-4 ml-1.5" strokeWidth={2} />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="rounded-full h-11 px-6 text-[13.5px]">
                  <Link to="/signup">
                    Start free <ArrowUpRight className="h-4 w-4 ml-1.5" strokeWidth={2} />
                  </Link>
                </Button>
              )}
              <a
                href="#demo"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border hairline text-[13.5px] text-foreground/80 hover:bg-foreground/[0.04] transition-colors"
              >
                <Play className="h-3.5 w-3.5" fill="currentColor" /> Watch the 30s reel
              </a>
            </div>
          </div>

          {/* Right column — pull-stat / colophon */}
          <div className="md:col-span-5 md:col-start-8 flex flex-col gap-6 md:items-end md:text-right">
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-3 font-medium">
                In this issue
              </div>
              <ul className="font-serif text-[15px] text-foreground/75 space-y-1.5 leading-snug">
                <li>
                  <span className="tnum text-foreground/50 mr-3">p. 02</span>
                  The live demo strip
                </li>
                <li>
                  <span className="tnum text-foreground/50 mr-3">p. 03</span>
                  Three acts of production
                </li>
                <li>
                  <span className="tnum text-foreground/50 mr-3">p. 04</span>
                  Nine themes, one signature
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer rule */}
        <div className="mt-16 md:mt-24 flex items-end justify-between gap-6">
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/45 font-medium">
            ↓ Turn the page
          </div>
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/45 font-medium tnum hidden sm:block">
            01 / 04
          </div>
        </div>
      </div>
    </section>
  );
}

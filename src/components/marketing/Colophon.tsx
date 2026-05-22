import { Link } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
import { useAuth } from "@/lib/auth/useAuth";

const YEAR = new Date().getFullYear();

export function Colophon() {
  const { user } = useAuth();
  return (
    <footer aria-label="Footer" className="relative overflow-hidden bg-background border-t hairline">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-10">
        {/* Top — three column masthead */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5">
            <Wordmark size="md" />
            <p className="mt-5 font-serif italic text-[18px] leading-[1.4] text-foreground/70 max-w-prose">
              Where words become watchable. A studio for writers who'd rather ship a film than fight a timeline.
            </p>
            <div className="mt-7">
              <Link
                to={user ? "/app" : "/signup"}
                className="inline-flex items-center gap-2 text-[13px] underline-grow text-foreground font-medium"
              >
                {user ? "Open Studio" : "Start free"} →
              </Link>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-7">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-4 font-medium">
              Product
            </div>
            <ul className="space-y-2 text-[13px] text-foreground/75">
              <li><a className="underline-grow hover:text-foreground" href="#how">How it works</a></li>
              <li><a className="underline-grow hover:text-foreground" href="#themes">Themes</a></li>
              <li><a className="underline-grow hover:text-foreground" href="#demo">Demo</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-4 font-medium">
              Studio
            </div>
            <ul className="space-y-2 text-[13px] text-foreground/75">
              <li><Link className="underline-grow hover:text-foreground" to="/signin">Sign in</Link></li>
              <li><Link className="underline-grow hover:text-foreground" to="/signup">Create account</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/55 mb-4 font-medium">
              Colophon
            </div>
            <ul className="space-y-2 text-[13px] text-foreground/75">
              <li>Set in Fraunces &amp; Inter</li>
              <li>Printed on warm paper</li>
              <li className="tnum">© FrameFlow {YEAR}</li>
            </ul>
          </div>
        </div>

        {/* Big closing mark — bleeds */}
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

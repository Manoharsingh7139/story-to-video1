import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagazineHero } from "@/components/marketing/MagazineHero";
import { DemoMarquee } from "@/components/marketing/DemoMarquee";
import { LiveTransform } from "@/components/marketing/LiveTransform";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ThemeGallery } from "@/components/marketing/ThemeGallery";
import { Colophon } from "@/components/marketing/Colophon";
import { SignInDialog } from "@/components/marketing/SignInDialog";
import { GlyphConfetti } from "@/components/marketing/GlyphConfetti";
import { Marginalia } from "@/components/marketing/Marginalia";
import { useAuth } from "@/lib/auth/useAuth";
import { ArrowUpRight } from "lucide-react";


export default function Landing() {
  const { user } = useAuth();
  const [signInOpen, setSignInOpen] = useState(false);
  const [morphed, setMorphed] = useState(false);
  const seededPrompt = useRef<string>("");

  useEffect(() => {
    const onScroll = () => setMorphed(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const label = user ? "Open Studio" : morphed ? "Start your story" : "Sign in";

  const pillClass =
    "fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group inline-flex items-center gap-2 h-11 pl-5 pr-4 rounded-full bg-primary text-primary-foreground text-[12.5px] uppercase tracking-[0.18em] font-medium border hairline shadow-paper hover:translate-y-[-1px] transition-all duration-300 ff-cta-pill";

  return (
    <main className="min-h-screen bg-background text-foreground bg-paper">
      <MagazineHero />
      <DemoMarquee />
      <LiveTransform />
      <HowItWorks />
      <ThemeGallery />
      <PromptTeaser
        onSubmit={(p) => {
          seededPrompt.current = p;
          if (!user) setSignInOpen(true);
        }}
      />
      <Colophon />

      <Marginalia />
      <GlyphConfetti />

      {user ? (
        <Link to="/app" aria-label="Open Studio" className={pillClass} data-morphed={morphed}>
          <span>{label}</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
        </Link>
      ) : (
        <button type="button" onClick={() => setSignInOpen(true)} aria-label={label} className={pillClass} data-morphed={morphed}>
          <span>{label}</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
        </button>
      )}

      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />

      <style>{`
        .ff-cta-pill[data-morphed="true"] {
          box-shadow: 0 0 0 0 hsl(var(--primary) / 0.4), var(--shadow-paper);
          animation: ff-cta-pulse 2.6s ease-in-out infinite;
        }
        @keyframes ff-cta-pulse {
          0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.35), var(--shadow-paper); }
          50% { box-shadow: 0 0 0 10px hsl(var(--primary) / 0), var(--shadow-paper); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ff-cta-pill[data-morphed="true"] { animation: none !important; }
        }
      `}</style>
    </main>
  );
}

import { Link } from "react-router-dom";
import { MagazineHero } from "@/components/marketing/MagazineHero";
import { DemoMarquee } from "@/components/marketing/DemoMarquee";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ThemeGallery } from "@/components/marketing/ThemeGallery";
import { Colophon } from "@/components/marketing/Colophon";
import { useAuth } from "@/lib/auth/useAuth";
import { ArrowUpRight } from "lucide-react";

export default function Landing() {
  const { user } = useAuth();
  return (
    <main className="min-h-screen bg-background text-foreground bg-paper">
      <MagazineHero />
      <DemoMarquee />
      <HowItWorks />
      <ThemeGallery />
      <Colophon />

      {/* Floating editorial Sign in / Open Studio */}
      <Link
        to={user ? "/app" : "/signin"}
        aria-label={user ? "Open Studio" : "Sign in"}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group inline-flex items-center gap-2 h-11 pl-5 pr-4 rounded-full bg-primary text-primary-foreground text-[12.5px] uppercase tracking-[0.18em] font-medium border hairline shadow-paper hover:translate-y-[-1px] transition-transform"
      >
        <span>{user ? "Open Studio" : "Sign in"}</span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
      </Link>
    </main>
  );
}

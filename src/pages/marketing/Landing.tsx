import { Masthead } from "@/components/marketing/Masthead";
import { MagazineHero } from "@/components/marketing/MagazineHero";
import { DemoMarquee } from "@/components/marketing/DemoMarquee";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ThemeGallery } from "@/components/marketing/ThemeGallery";
import { Colophon } from "@/components/marketing/Colophon";

export default function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground bg-paper">
      <Masthead />
      <MagazineHero />
      <DemoMarquee />
      <HowItWorks />
      <ThemeGallery />
      <Colophon />
    </main>
  );
}

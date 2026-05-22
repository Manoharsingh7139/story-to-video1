import { Link } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import { ArrowUpRight } from "lucide-react";

export function Masthead() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b hairline">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
        <Link to="/" aria-label="FrameFlow — home">
          <Wordmark size="sm" />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[12.5px] text-foreground/70">
          <a href="#how" className="underline-grow hover:text-foreground transition-colors">How it works</a>
          <a href="#themes" className="underline-grow hover:text-foreground transition-colors">Themes</a>
          <a href="#demo" className="underline-grow hover:text-foreground transition-colors">Demo</a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild size="sm" className="h-8 rounded-full px-4 text-[12.5px]">
              <Link to="/app">
                Open Studio <ArrowUpRight className="h-3.5 w-3.5 ml-1" strokeWidth={2} />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-[12.5px]">
              <Link to="/signin">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

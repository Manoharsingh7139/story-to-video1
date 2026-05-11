import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Wordmark } from "@/components/Wordmark";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-8">
          <Wordmark size="md" />
        </div>
        <div className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">404</div>
        <h1 className="font-display text-4xl tracking-[-0.02em] mb-3">This page wandered off.</h1>
        <p className="text-sm text-muted-foreground mb-8">
          The path <span className="font-sans text-foreground/70">{location.pathname}</span> doesn't exist.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Back to studio
        </a>
      </div>
    </div>
  );
};

export default NotFound;

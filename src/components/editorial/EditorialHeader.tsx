import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Optional sub-line in serif italic for editorial flavor. */
  lede?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function EditorialHeader({
  eyebrow,
  title,
  lede,
  actions,
  meta,
  className,
}: Props) {
  return (
    <header className={cn("relative", className)}>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3 flex items-center gap-2">
              {eyebrow}
            </div>
          )}
          <h1 className="editorial-display text-4xl md:text-[44px] lg:text-5xl text-ink max-w-3xl">
            {title}
          </h1>
          {lede && (
            <p className="font-serif italic text-base md:text-lg text-muted-foreground mt-3 max-w-xl leading-snug">
              {lede}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0 pt-2">{actions}</div>}
      </div>
      {meta && <div className="mt-7">{meta}</div>}
    </header>
  );
}

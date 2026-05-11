import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  ManuscriptIllustration,
  LogbookIllustration,
  StudioIllustration,
} from "@/assets/illustrations/EditorialIllustrations";

interface EmptyStateProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  illustration?: ReactNode;
  actions?: ReactNode;
  className?: string;
  /** Use serif italic for the title — recommended for editorial moments. */
  serif?: boolean;
}

/* Backwards-compat re-exports under their old names (now editorial scenes). */
export const LeafIllustration = StudioIllustration;
export const StackIllustration = ManuscriptIllustration;
export const ClockIllustration = LogbookIllustration;
export {
  ManuscriptIllustration,
  LogbookIllustration,
  StudioIllustration,
};

export function EmptyState({
  eyebrow,
  title,
  description,
  illustration,
  actions,
  className,
  serif = true,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-6",
        className,
      )}
    >
      {illustration && <div className="w-28 h-28 mb-7 text-primary">{illustration}</div>}
      {eyebrow && (
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          "max-w-md text-ink",
          serif
            ? "editorial-display text-[28px] md:text-[32px]"
            : "font-display text-2xl md:text-3xl tracking-[-0.01em]",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-7 mt-3 leading-relaxed">
          {description}
        </p>
      )}
      {actions && <div className="flex items-center gap-2 mt-2">{actions}</div>}
    </div>
  );
}

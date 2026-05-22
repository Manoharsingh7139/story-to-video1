import { cn } from "@/lib/utils";
import logoSrc from "@/assets/frameflow-logo.png";

interface WordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  /** Ink-on-paper variant for use over the primary color. */
  mono?: boolean;
}

const sizeMap = {
  sm: { mark: 22, gap: "gap-2", first: "text-[13px]", second: "text-[14px]" },
  md: { mark: 26, gap: "gap-2.5", first: "text-[15px]", second: "text-[17px]" },
  lg: { mark: 36, gap: "gap-3", first: "text-[19px]", second: "text-[22px]" },
};

function Mark({ size, mono }: { size: number; mono?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-[6px] shrink-0",
        mono ? "bg-background" : "bg-primary",
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src={logoSrc}
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

export function Wordmark({
  className,
  size = "md",
  iconOnly = false,
  mono = false,
}: WordmarkProps) {
  const s = sizeMap[size];
  if (iconOnly) {
    return (
      <span className={cn("inline-flex", className)} aria-label="FrameFlow">
        <Mark size={s.mark} mono={mono} />
      </span>
    );
  }
  return (
    <span
      className={cn("inline-flex items-center", s.gap, className)}
      aria-label="FrameFlow"
    >
      <Mark size={s.mark} mono={mono} />
      <span className="inline-flex items-baseline gap-[0.08em] leading-none">
        <span
          className={cn(
            "font-display font-medium tracking-[-0.01em]",
            mono ? "text-background/85" : "text-foreground/80",
            s.first,
          )}
        >
          Frame
        </span>
        <span
          className={cn(
            "font-serif tracking-[-0.02em]",
            mono ? "text-background" : "text-ink",
            s.second,
          )}
          style={{ fontWeight: 500, fontStyle: "italic" as const }}
        >
          Flow
        </span>
      </span>
    </span>
  );
}

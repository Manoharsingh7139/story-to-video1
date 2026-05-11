import { cn } from "@/lib/utils";

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

/**
 * A custom serif "C" with a leaf-notch, set in primary.
 * This is the brand mark — drawn, not stamped from a font.
 */
function Mark({ size, mono }: { size: number; mono?: boolean }) {
  const stroke = mono ? "hsl(var(--background))" : "hsl(var(--primary))";
  const leaf = mono ? "hsl(var(--background))" : "hsl(var(--primary))";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Hairline frame */}
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="4"
        fill="none"
        stroke={stroke}
        strokeOpacity="0.18"
        strokeWidth="1"
      />
      {/* Serif C — a clean inkstroke */}
      <path
        d="M 22.5 9.5
           C 20.8 7.6, 18.7 6.6, 16.2 6.6
           C 11.4 6.6, 7.6 10.6, 7.6 16
           C 7.6 21.4, 11.4 25.4, 16.2 25.4
           C 18.9 25.4, 21.1 24.3, 22.7 22.3"
        fill="none"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Tiny leaf notch — the brand's forest signal */}
      <path
        d="M 21.4 14.6
           C 23.2 14.0, 25.2 14.6, 26.0 16.4
           C 24.2 17.0, 22.2 16.4, 21.4 14.6 Z"
        fill={leaf}
      />
    </svg>
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
      <span className={cn("inline-flex", className)} aria-label="Content Studio">
        <Mark size={s.mark} mono={mono} />
      </span>
    );
  }
  return (
    <span
      className={cn("inline-flex items-baseline", s.gap, className)}
      aria-label="Content Studio"
    >
      <Mark size={s.mark} mono={mono} />
      <span className="inline-flex items-baseline gap-[0.28em] leading-none">
        <span
          className={cn(
            "font-display font-medium tracking-[-0.005em]",
            mono ? "text-background/80" : "text-foreground/70",
            s.first,
          )}
        >
          Content
        </span>
        <span
          className={cn(
            "font-serif tracking-[-0.02em]",
            mono ? "text-background" : "text-ink",
            s.second,
          )}
          style={{ fontWeight: 500, fontStyle: "italic" as const }}
        >
          Studio
        </span>
      </span>
    </span>
  );
}

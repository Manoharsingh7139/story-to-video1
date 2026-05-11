import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  /** Ink-on-paper variant for use over the primary color. */
  mono?: boolean;
}

const sizeMap = {
  sm: { text: "text-sm", mark: 22, gap: "gap-2" },
  md: { text: "text-base", mark: 28, gap: "gap-2.5" },
  lg: { text: "text-xl", mark: 38, gap: "gap-3" },
};

function Monogram({ size, mono }: { size: number; mono?: boolean }) {
  const bg = mono ? "hsl(var(--background))" : "hsl(var(--primary))";
  const fg = mono ? "hsl(var(--primary))" : "hsl(var(--primary-foreground))";
  const r = Math.round(size * 0.22);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
      <rect width="64" height="64" rx={r} fill={bg} />
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Plus Jakarta Sans, Inter, system-ui, sans-serif"
        fontWeight={700}
        fontSize={30}
        fill={fg}
      >
        Cs
      </text>
    </svg>
  );
}

export function Wordmark({ className, size = "md", iconOnly = false, mono = false }: WordmarkProps) {
  const s = sizeMap[size];
  if (iconOnly) {
    return (
      <span className={cn("inline-flex", className)}>
        <Monogram size={s.mark} mono={mono} />
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <Monogram size={s.mark} mono={mono} />
      <span
        className={cn(
          "font-display font-semibold tracking-[-0.01em] text-foreground leading-none",
          s.text,
        )}
      >
        Content<span className="text-foreground/55"> </span>Studio
      </span>
    </span>
  );
}

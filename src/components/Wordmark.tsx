import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
}

const sizeMap = {
  sm: { text: "text-sm", dot: "h-1.5 w-1.5", gap: "gap-1.5" },
  md: { text: "text-base", dot: "h-2 w-2", gap: "gap-2" },
  lg: { text: "text-lg", dot: "h-2.5 w-2.5", gap: "gap-2" },
};

export function Wordmark({ className, size = "md", iconOnly = false }: WordmarkProps) {
  const s = sizeMap[size];
  if (iconOnly) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[4px] bg-foreground",
          size === "sm" ? "h-6 w-6" : size === "lg" ? "h-9 w-9" : "h-7 w-7",
          className,
        )}
      >
        <span className={cn("rounded-[1px] bg-brand", s.dot)} />
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-baseline", s.gap, className)}>
      <span className={cn("font-display font-semibold tracking-tight text-foreground", s.text)}>
        Content<span className="text-foreground/60"> </span>Studio
      </span>
      <span className={cn("rounded-[1px] bg-brand inline-block translate-y-[-1px]", s.dot)} />
    </span>
  );
}

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function KBD({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5",
        "font-mono text-[10px] leading-none text-muted-foreground",
        "rounded-[4px] bg-background border hairline",
        "shadow-[inset_0_-1px_0_hsl(var(--hairline))]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

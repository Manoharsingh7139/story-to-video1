import { Fragment, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}

interface Props {
  metrics: Metric[];
  className?: string;
}

export function MetricRow({ metrics, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-stretch border-y hairline",
        className,
      )}
    >
      {metrics.map((m, i) => (
        <Fragment key={m.label}>
          {i > 0 && <div className="w-px self-stretch bg-hairline" />}
          <div className={cn("flex-1 py-5", i === 0 ? "pr-6" : "px-6")}>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {m.label}
            </div>
            <div className="font-serif tnum text-4xl md:text-[40px] leading-none text-ink tracking-[-0.02em]">
              {m.value}
            </div>
            {m.hint && (
              <div className="text-xs text-muted-foreground mt-2">{m.hint}</div>
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

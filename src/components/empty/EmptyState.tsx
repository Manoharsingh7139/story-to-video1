import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description?: string;
  illustration?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function LeafIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("text-primary", className)}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="96" fill="currentColor" opacity="0.04" />
      <circle cx="100" cy="100" r="72" fill="currentColor" opacity="0.06" />
      <circle cx="100" cy="100" r="48" fill="currentColor" opacity="0.08" />
      <path
        d="M100 50 C 130 70, 140 110, 100 150 C 60 110, 70 70, 100 50 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <line x1="100" y1="60" x2="100" y2="148" stroke="hsl(var(--background))" strokeWidth="1.5" />
    </svg>
  );
}

export function StackIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={cn("text-primary", className)} aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="currentColor" opacity="0.04" />
      <rect x="55" y="65" width="90" height="55" rx="8" fill="currentColor" opacity="0.18" />
      <rect x="48" y="80" width="104" height="60" rx="10" fill="currentColor" opacity="0.32" />
      <rect x="40" y="95" width="120" height="65" rx="12" fill="currentColor" opacity="0.85" />
      <line x1="55" y1="120" x2="115" y2="120" stroke="hsl(var(--background))" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="135" x2="95" y2="135" stroke="hsl(var(--background))" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function ClockIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={cn("text-primary", className)} aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="currentColor" opacity="0.04" />
      <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.85" />
      <line x1="100" y1="100" x2="100" y2="60" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="100" y1="100" x2="130" y2="115" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="100" r="5" fill="currentColor" />
    </svg>
  );
}

export function EmptyState({ eyebrow, title, description, illustration, actions, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-20 px-6", className)}>
      {illustration && <div className="w-32 h-32 mb-6">{illustration}</div>}
      {eyebrow && (
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">{eyebrow}</div>
      )}
      <h2 className="font-display text-2xl md:text-3xl tracking-[-0.01em] mb-2 max-w-md">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      )}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

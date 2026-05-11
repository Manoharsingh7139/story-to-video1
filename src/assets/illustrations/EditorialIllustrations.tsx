import { cn } from "@/lib/utils";

const baseProps = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * Library empty: a small stack of three sheets, one slightly askew,
 * with a folded corner — the manuscript pile.
 */
export function ManuscriptIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={cn("text-primary", className)}
      aria-hidden="true"
    >
      {/* Back sheet */}
      <g transform="rotate(-6 80 88)" opacity="0.45">
        <rect x="38" y="40" width="84" height="100" rx="2" {...baseProps} />
        <line x1="50" y1="58" x2="98" y2="58" {...baseProps} />
        <line x1="50" y1="70" x2="110" y2="70" {...baseProps} />
        <line x1="50" y1="82" x2="86" y2="82" {...baseProps} />
      </g>
      {/* Middle sheet */}
      <g transform="rotate(3 80 92)" opacity="0.7">
        <rect x="36" y="44" width="88" height="104" rx="2" {...baseProps} />
        <line x1="48" y1="64" x2="112" y2="64" {...baseProps} />
        <line x1="48" y1="76" x2="104" y2="76" {...baseProps} />
        <line x1="48" y1="88" x2="92" y2="88" {...baseProps} />
      </g>
      {/* Front sheet, folded corner */}
      <g>
        <path
          d="M 34 36 L 118 36 L 134 52 L 134 144 L 34 144 Z"
          {...baseProps}
          fill="hsl(var(--background))"
        />
        <path d="M 118 36 L 118 52 L 134 52" {...baseProps} />
        <line x1="48" y1="68" x2="120" y2="68" {...baseProps} />
        <line x1="48" y1="82" x2="118" y2="82" {...baseProps} />
        <line x1="48" y1="96" x2="100" y2="96" {...baseProps} />
        <line x1="48" y1="110" x2="112" y2="110" {...baseProps} />
        <line x1="48" y1="124" x2="86" y2="124" {...baseProps} />
      </g>
    </svg>
  );
}

/** History empty: a logbook timeline. */
export function LogbookIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={cn("text-primary", className)} aria-hidden="true">
      <line x1="80" y1="20" x2="80" y2="140" {...baseProps} />
      {/* Stamps */}
      <circle cx="80" cy="40" r="6" {...baseProps} fill="currentColor" />
      <line x1="92" y1="40" x2="132" y2="40" {...baseProps} opacity="0.5" />
      <line x1="92" y1="46" x2="120" y2="46" {...baseProps} opacity="0.35" />

      <circle cx="80" cy="80" r="6" {...baseProps} />
      <line x1="92" y1="80" x2="138" y2="80" {...baseProps} opacity="0.5" />
      {/* Pen-mark crossing through one entry */}
      <line x1="90" y1="84" x2="128" y2="76" stroke="currentColor" strokeWidth="1.25" opacity="0.7" />

      <circle cx="80" cy="120" r="6" {...baseProps} fill="currentColor" />
      <line x1="92" y1="120" x2="124" y2="120" {...baseProps} opacity="0.5" />

      {/* Left margin captions */}
      <line x1="48" y1="40" x2="68" y2="40" {...baseProps} opacity="0.35" />
      <line x1="40" y1="80" x2="68" y2="80" {...baseProps} opacity="0.35" />
      <line x1="46" y1="120" x2="68" y2="120" {...baseProps} opacity="0.35" />
    </svg>
  );
}

/** Dashboard first-run: writing transforms into a slide frame. */
export function StudioIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={cn("text-primary", className)} aria-hidden="true">
      {/* Sheet of paper */}
      <rect x="20" y="22" width="84" height="100" rx="2" {...baseProps} />
      <line x1="32" y1="42" x2="92" y2="42" {...baseProps} />
      <line x1="32" y1="54" x2="86" y2="54" {...baseProps} opacity="0.7" />
      <line x1="32" y1="66" x2="92" y2="66" {...baseProps} opacity="0.7" />
      <line x1="32" y1="78" x2="74" y2="78" {...baseProps} opacity="0.5" />
      <line x1="32" y1="90" x2="88" y2="90" {...baseProps} opacity="0.5" />
      {/* Arrow → slide frame */}
      <path d="M 110 80 L 124 80" {...baseProps} />
      <path d="M 120 76 L 124 80 L 120 84" {...baseProps} />
      {/* Slide 16:9 */}
      <rect x="92" y="100" width="56" height="32" rx="2" {...baseProps} fill="hsl(var(--background))" />
      <line x1="100" y1="112" x2="128" y2="112" {...baseProps} />
      <line x1="100" y1="120" x2="118" y2="120" {...baseProps} opacity="0.6" />
      {/* Play */}
      <polygon points="138,114 138,124 144,119" {...baseProps} fill="currentColor" />
    </svg>
  );
}

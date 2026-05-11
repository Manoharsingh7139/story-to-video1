import { Link } from "react-router-dom";
import { ReactNode } from "react";
import type { Project } from "@/lib/data/types";
import { THEMES } from "@/lib/prototype/themes";
import { SlideThumbnail } from "@/components/preview/SlideThumbnail";
import { formatDistanceToNow } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  project: Project;
  to?: string;
  menu?: ReactNode;
  size?: "default" | "lg";
  className?: string;
}

/**
 * Editorial project card. Hairline border, real slide thumbnail,
 * underline-grow on title, no card-translate. The menu is revealed on hover.
 */
export function HoverPreviewCard({ project, to, menu, size = "default", className }: Props) {
  const theme = THEMES[project.themeId] ?? THEMES.studio;
  const inner = (
    <div
      className={cn(
        "relative bg-card overflow-hidden transition-shadow duration-300",
        "shadow-paper hover:shadow-paper-hover",
        className,
      )}
    >
      <SlideThumbnail project={project} />
      <div className={cn("flex items-start justify-between gap-3", size === "lg" ? "p-4" : "p-3.5")}>
        <div className="min-w-0">
          <div
            className={cn(
              "font-medium text-foreground truncate underline-grow",
              size === "lg" ? "text-[15px]" : "text-sm",
            )}
          >
            {project.title}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground tnum flex items-center gap-2">
            <span>{project.slides.length} slides</span>
            <span className="opacity-40">·</span>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: theme.accent }}
              aria-label={theme.name}
            />
            <span>{theme.name}</span>
            <span className="opacity-40">·</span>
            <span>{formatDistanceToNow(project.updatedAt)}</span>
          </div>
        </div>
        {menu && (
          <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity -mr-1.5 -mt-1">
            {menu}
          </div>
        )}
      </div>
    </div>
  );

  if (!to) return <div className="group">{inner}</div>;
  return (
    <Link to={to} className="group block">
      {inner}
    </Link>
  );
}

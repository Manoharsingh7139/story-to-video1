import { memo } from "react";
import { SlideView } from "@/components/prototype/SlideView";
import { THEMES } from "@/lib/prototype/themes";
import type { Project } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface Props {
  project: Project;
  className?: string;
  /** Optional: render a specific slide index instead of the first. */
  slideIndex?: number;
}

/**
 * Renders a real, scaled-down preview of a project's first slide.
 * Pointer-events disabled so it acts as a static thumbnail.
 * Always 16:9.
 */
export const SlideThumbnail = memo(function SlideThumbnail({
  project,
  className,
  slideIndex = 0,
}: Props) {
  const theme = THEMES[project.themeId] ?? THEMES.studio;
  const slide = project.slides[slideIndex];

  return (
    <div
      className={cn(
        "relative w-full aspect-video overflow-hidden",
        "bg-surface",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 pointer-events-none select-none">
        {slide ? (
          <SlideView slide={slide} theme={theme} scale="auto" />
        ) : (
          <FallbackSlide title={project.title} themeId={project.themeId} />
        )}
      </div>
      {/* Inner hairline for crisp framing on the warm bg */}
      <div className="absolute inset-0 ring-1 ring-inset ring-foreground/[0.06] pointer-events-none" />
    </div>
  );
});

function FallbackSlide({ title, themeId }: { title: string; themeId: keyof typeof THEMES }) {
  const theme = THEMES[themeId] ?? THEMES.studio;
  return (
    <div
      className="w-full h-full flex flex-col justify-center px-[8%]"
      style={{ background: theme.bg, color: theme.text }}
    >
      <div
        className="text-[8px] uppercase mb-2 opacity-60"
        style={{ letterSpacing: "0.2em", fontFamily: theme.fontBody }}
      >
        Untitled draft
      </div>
      <div
        className="font-serif leading-[1.05]"
        style={{
          fontFamily: theme.fontHead,
          fontSize: "clamp(14px, 4.2cqw, 28px)",
          letterSpacing: "-0.02em",
          color: theme.text,
        }}
      >
        {title}
      </div>
      <div
        className="mt-3 h-[2px] w-8"
        style={{ background: theme.accent }}
      />
    </div>
  );
}

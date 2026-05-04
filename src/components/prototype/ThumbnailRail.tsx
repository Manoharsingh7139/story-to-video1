import { usePrototypeStore, estimateDuration } from "@/lib/prototype/store";
import { THEMES } from "@/lib/prototype/themes";
import { SlideView } from "./SlideView";
import { Plus, Copy, Trash2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export const ThumbnailRail = () => {
  const slides = usePrototypeStore((s) => s.slides);
  const selectedSlideId = usePrototypeStore((s) => s.selectedSlideId);
  const themeId = usePrototypeStore((s) => s.themeId);
  const selectSlide = usePrototypeStore((s) => s.selectSlide);
  const addSlide = usePrototypeStore((s) => s.addSlide);
  const duplicateSlide = usePrototypeStore((s) => s.duplicateSlide);
  const deleteSlide = usePrototypeStore((s) => s.deleteSlide);
  const reorderSlides = usePrototypeStore((s) => s.reorderSlides);
  const regenerateSlide = usePrototypeStore((s) => s.regenerateSlide);
  const theme = THEMES[themeId];

  const [dragId, setDragId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-muted/30 border-r border-border">
      <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {slides.length} slides
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {slides.map((slide, i) => {
          const active = slide.id === selectedSlideId;
          return (
            <ContextMenu key={slide.id}>
              <ContextMenuTrigger>
                <div
                  draggable
                  onDragStart={() => setDragId(slide.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragId) reorderSlides(dragId, slide.id);
                    setDragId(null);
                  }}
                  onClick={() => selectSlide(slide.id)}
                  className={`group flex gap-2 items-center cursor-pointer rounded-md p-1 transition-colors ${
                    active ? "bg-background ring-2 ring-foreground" : "hover:bg-background/60"
                  }`}
                >
                  <span className="text-xs text-muted-foreground w-5 text-right tabular-nums flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 aspect-video rounded overflow-hidden border border-border bg-white">
                    <SlideView slide={slide} theme={theme} />
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => duplicateSlide(slide.id)}>
                  <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                </ContextMenuItem>
                <ContextMenuItem onClick={() => { regenerateSlide(slide.id, { keepLayout: true }); toast.success("Slide regenerated"); }}>
                  <RefreshCw className="h-3.5 w-3.5 mr-2" /> Regenerate (keep layout)
                </ContextMenuItem>
                <ContextMenuItem onClick={() => { regenerateSlide(slide.id); toast.success("Slide regenerated"); }}>
                  <RefreshCw className="h-3.5 w-3.5 mr-2" /> Regenerate (new layout)
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => deleteSlide(slide.id)}
                  disabled={slides.length <= 1}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
        <button
          onClick={addSlide}
          className="w-full flex items-center justify-center gap-1.5 py-3 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add slide
        </button>
      </div>
      <div className="px-3 py-2 border-t border-border text-xs text-muted-foreground tabular-nums">
        Total: ~{slides.reduce((sum, s) => sum + estimateDuration(s.script), 0)}s
      </div>
    </div>
  );
};

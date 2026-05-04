import { useState } from "react";
import { Link } from "react-router-dom";
import { usePrototypeStore } from "@/lib/prototype/store";
import { THEMES, THEME_LIST } from "@/lib/prototype/themes";
import { SlideView } from "@/components/prototype/SlideView";
import { ThumbnailRail } from "@/components/prototype/ThumbnailRail";
import { VoiceoverPanel } from "@/components/prototype/VoiceoverPanel";
import { ChatPanel } from "@/components/prototype/ChatPanel";
import { ExportDialog } from "@/components/prototype/ExportDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Download, ArrowLeft, Layout as LayoutIcon, Palette } from "lucide-react";
import type { LayoutId } from "@/lib/prototype/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LAYOUTS: { id: LayoutId; name: string }[] = [
  { id: "title", name: "Title" },
  { id: "title-body", name: "Title + body" },
  { id: "two-column", name: "Two column" },
  { id: "bullets", name: "Bullets" },
  { id: "stat", name: "Big stat" },
  { id: "divider", name: "Section divider" },
];

export default function EditorScreen() {
  const navigate = useNavigate();
  const slides = usePrototypeStore((s) => s.slides);
  const selectedSlideId = usePrototypeStore((s) => s.selectedSlideId);
  const themeId = usePrototypeStore((s) => s.themeId);
  const setThemeId = usePrototypeStore((s) => s.setThemeId);
  const setSlideLayout = usePrototypeStore((s) => s.setSlideLayout);
  const setSlideContent = usePrototypeStore((s) => s.setSlideContent);
  const setSlideBullet = usePrototypeStore((s) => s.setSlideBullet);
  const projectTitle = usePrototypeStore((s) => s.projectTitle);
  const setProjectTitle = usePrototypeStore((s) => s.setProjectTitle);

  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    if (slides.length === 0) navigate("/");
  }, [slides.length, navigate]);

  const slide = slides.find((s) => s.id === selectedSlideId);
  const theme = THEMES[themeId];

  if (!slide) return null;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <header className="h-12 border-b border-border flex items-center justify-between px-3 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Link to="/" className="p-1.5 rounded hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-6 w-6 rounded bg-foreground flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-background" />
          </div>
          <Input
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="h-7 text-sm font-medium border-transparent bg-transparent hover:bg-muted focus:bg-background w-64"
          />
        </div>
        <Button size="sm" onClick={() => setExportOpen(true)}>
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Export video
        </Button>
      </header>

      {/* Main 3-column layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left: thumbnail rail */}
        <div className="w-56 flex-shrink-0">
          <ThumbnailRail />
        </div>

        {/* Center column: canvas + chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Canvas toolbar */}
          <div className="h-11 border-b border-border flex items-center gap-2 px-4 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <LayoutIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={slide.layout} onValueChange={(v) => setSlideLayout(slide.id, v as LayoutId)}>
                <SelectTrigger className="h-8 w-[160px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LAYOUTS.map((l) => (
                    <SelectItem key={l.id} value={l.id} className="text-xs">
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-px h-5 bg-border mx-1" />
            <div className="flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={themeId} onValueChange={(v) => setThemeId(v as any)}>
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {THEME_LIST.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="text-xs">
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto text-xs text-muted-foreground">
              Slide {slides.findIndex((s) => s.id === slide.id) + 1} of {slides.length}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-muted/40 flex items-center justify-center p-8 min-h-0">
            <div
              className="w-full h-full max-w-[1100px] aspect-video rounded-md shadow-xl overflow-hidden border border-border"
              style={{ background: theme.bg }}
            >
              <SlideView
                slide={slide}
                theme={theme}
                editable
                onEdit={(k, v) => setSlideContent(slide.id, k, v)}
                onEditBullet={(i, v) => setSlideBullet(slide.id, i, v)}
              />
            </div>
          </div>

          {/* Bottom chat */}
          <div className="h-72 flex-shrink-0">
            <ChatPanel />
          </div>
        </div>

        {/* Right: voiceover */}
        <div className="w-80 flex-shrink-0">
          <VoiceoverPanel />
        </div>
      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
}

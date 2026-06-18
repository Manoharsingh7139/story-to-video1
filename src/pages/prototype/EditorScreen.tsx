import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePrototypeStore } from "@/lib/prototype/store";
import { useProjects } from "@/lib/data/useProjects";
import { THEMES, THEME_LIST } from "@/lib/prototype/themes";
import { SlideView } from "@/components/prototype/SlideView";
import { ThumbnailRail } from "@/components/prototype/ThumbnailRail";
import { VoiceoverPanel } from "@/components/prototype/VoiceoverPanel";
import { ChatPanel } from "@/components/prototype/ChatPanel";
import { ExportDialog } from "@/components/prototype/ExportDialog";
import { RegenerateButton } from "@/components/prototype/RegenerateButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Download, ArrowLeft, Layout as LayoutIcon, Palette } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";
import type { LayoutId } from "@/lib/prototype/types";

const TEXT_LAYOUTS: { id: LayoutId; name: string }[] = [
  { id: "title", name: "Title" },
  { id: "title-body", name: "Title + body" },
  { id: "two-column", name: "Two column" },
  { id: "bullets", name: "Bullets" },
  { id: "stat", name: "Big stat" },
  { id: "divider", name: "Section divider" },
];
const IMAGE_LAYOUTS: { id: LayoutId; name: string }[] = [
  { id: "image-left", name: "Image left" },
  { id: "image-right", name: "Image right" },
  { id: "image-full", name: "Full-bleed image" },
  { id: "image-grid", name: "Image grid (2×2)" },
  { id: "image-bg-overlay", name: "Image background" },
  { id: "image-text-overlay", name: "Image + text card" },
  { id: "image-bullets", name: "Image + bullets" },
  { id: "stat-image", name: "Stat + image" },
  { id: "section-image-bg", name: "Section (image bg)" },
];
const FRAMEWORK_LAYOUTS: { id: LayoutId; name: string }[] = [
  { id: "quadrant", name: "Quadrant (2×2)" },
  { id: "comparison", name: "Comparison" },
];
const EDUCATION_LAYOUTS: { id: LayoutId; name: string }[] = [
  { id: "definition-card", name: "Definition card" },
  { id: "formula", name: "Formula" },
  { id: "worked-example", name: "Worked example" },
  { id: "learning-objectives", name: "Learning objectives" },
  { id: "key-terms", name: "Key terms (glossary)" },
  { id: "process-flow", name: "Process flow" },
  { id: "timeline", name: "Timeline" },
  { id: "pyramid", name: "Pyramid" },
  { id: "cycle", name: "Cycle (PDCA)" },
  { id: "case-study", name: "Case study" },
  { id: "question-prompt", name: "Question prompt" },
  { id: "qa-recap", name: "Q&A recap" },
  { id: "pros-cons", name: "Pros & cons" },
  { id: "chart-explainer", name: "Chart explainer" },
  { id: "citation-quote", name: "Citation / quote" },
];

export default function EditorScreen() {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const project = useProjects((s) => (projectId ? s.projects.find((p) => p.id === projectId) : undefined));
  const saveSlides = useProjects((s) => s.saveSlides);
  const renameProject = useProjects((s) => s.renameProject);

  const slides = usePrototypeStore((s) => s.slides);
  const selectedSlideId = usePrototypeStore((s) => s.selectedSlideId);
  const themeId = usePrototypeStore((s) => s.themeId);
  const setThemeId = usePrototypeStore((s) => s.setThemeId);
  const setSlideLayout = usePrototypeStore((s) => s.setSlideLayout);
  const setSlideContent = usePrototypeStore((s) => s.setSlideContent);
  const setSlideBullet = usePrototypeStore((s) => s.setSlideBullet);
  const projectTitle = usePrototypeStore((s) => s.projectTitle);
  const setProjectTitle = usePrototypeStore((s) => s.setProjectTitle);
  const selectedElementKey = usePrototypeStore((s) => s.selectedElementKey);
  const selectElement = usePrototypeStore((s) => s.selectElement);

  const [exportOpen, setExportOpen] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(() => window.innerHeight < 800);
  const [savedAt, setSavedAt] = useState<number>(Date.now());
  const hydratedRef = useRef<string | null>(null);

  // Hydrate prototype store from project once.
  useEffect(() => {
    if (!projectId) { navigate("/app/library", { replace: true }); return; }
    if (!project) return;
    if (hydratedRef.current === projectId) return;
    hydratedRef.current = projectId;
    usePrototypeStore.setState({
      slides: project.slides.map((s) => ({ ...s, content: { ...s.content } })),
      selectedSlideId: project.slides[0]?.id ?? "",
      selectedElementKey: null,
      projectTitle: project.title,
      themeId: project.themeId,
      voice: project.voice,
      voiceMode: project.voiceMode,
      chatBySlide: Object.fromEntries(project.slides.map((s) => [s.id, [
        { id: `welcome-${s.id}`, role: "assistant" as const, text: "Hi! I can edit this slide for you." },
      ]])),
    });
  }, [projectId, project, navigate]);

  // Autosave (debounced) when slides/theme change.
  useEffect(() => {
    if (!projectId || !project) return;
    if (hydratedRef.current !== projectId) return;
    const t = setTimeout(() => {
      saveSlides(projectId, slides, themeId);
      setSavedAt(Date.now());
    }, 600);
    return () => clearTimeout(t);
  }, [slides, themeId, projectId, project, saveSlides]);

  // Persist title changes.
  useEffect(() => {
    if (!projectId || !project) return;
    if (hydratedRef.current !== projectId) return;
    if (projectTitle && projectTitle !== project.title) {
      const t = setTimeout(() => renameProject(projectId, projectTitle), 600);
      return () => clearTimeout(t);
    }
  }, [projectTitle, projectId, project, renameProject]);

  if (!projectId) return null;
  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
        Project not found. <Link to="/app/library" className="ml-1 text-primary hover:underline">Back to library</Link>
      </div>
    );
  }

  const slide = slides.find((s) => s.id === selectedSlideId);
  const theme = THEMES[themeId];
  if (!slide) return null;

  const savedAgo = Math.max(1, Math.round((Date.now() - savedAt) / 1000));

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="h-12 border-b border-border flex items-center justify-between px-3 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Link to="/app/library" className="p-1.5 rounded hover:bg-muted" title="Back to library">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Wordmark size="sm" iconOnly />
          <span className="text-xs text-muted-foreground hidden md:inline">Library /</span>
          <Input
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="h-7 text-sm font-medium border-transparent bg-transparent hover:bg-muted focus:bg-background w-64"
          />
          <span className="text-[11px] text-muted-foreground hidden md:inline">Saved · {savedAgo}s ago</span>
        </div>
        <Button variant="default" size="sm" onClick={() => setExportOpen(true)}>
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Export video
        </Button>
      </header>

      <div className="flex-1 flex min-h-0">
        <div className="w-56 flex-shrink-0">
          <ThumbnailRail />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-11 border-b border-border flex items-center gap-2 px-4 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <LayoutIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={slide.layout} onValueChange={(v) => setSlideLayout(slide.id, v as LayoutId)}>
                <SelectTrigger className="h-8 w-[170px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] uppercase tracking-wider">Text</SelectLabel>
                    {TEXT_LAYOUTS.map((l) => (
                      <SelectItem key={l.id} value={l.id} className="text-xs">{l.name}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] uppercase tracking-wider">With images</SelectLabel>
                    {IMAGE_LAYOUTS.map((l) => (
                      <SelectItem key={l.id} value={l.id} className="text-xs">{l.name}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] uppercase tracking-wider">Frameworks</SelectLabel>
                    {FRAMEWORK_LAYOUTS.map((l) => (
                      <SelectItem key={l.id} value={l.id} className="text-xs">{l.name}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] uppercase tracking-wider">Education</SelectLabel>
                    {EDUCATION_LAYOUTS.map((l) => (
                      <SelectItem key={l.id} value={l.id} className="text-xs">{l.name}</SelectItem>
                    ))}
                  </SelectGroup>
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
                    <SelectItem key={t.id} value={t.id} className="text-xs">{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-px h-5 bg-border mx-1" />
            <RegenerateButton slideId={slide.id} />
            {slide.layout === "bullets" && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs ml-1"
                onClick={() => selectElement("bullets")}
              >
                Style list
              </Button>
            )}
            <div className="ml-auto text-xs text-muted-foreground">
              Slide {slides.findIndex((s) => s.id === slide.id) + 1} of {slides.length}
              {selectedElementKey && (
                <span className="ml-3 px-1.5 py-0.5 rounded bg-primary/10 text-foreground border border-primary/30 text-[10px] font-medium">
                  {selectedElementKey} selected
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 bg-muted/40 flex items-center justify-center p-8 min-h-0">
            <div
              className="relative w-full h-full max-w-[1100px] aspect-video rounded-xl shadow-premium-xl overflow-hidden border border-border"
              style={{ background: theme.bg }}
            >
              {slide.content.style?.bgImageUrl && (
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${slide.content.style.bgImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: slide.content.style.bgImageOpacity ?? 0.3,
                  }}
                />
              )}
              <SlideView
                slide={slide}
                theme={theme}
                editable
                selectedKey={selectedElementKey}
                onSelectElement={selectElement}
                onEdit={(k, v) => setSlideContent(slide.id, k, v)}
                onEditBullet={(i, v) => setSlideBullet(slide.id, i, v)}
              />
            </div>
          </div>

          <div className={`${chatCollapsed ? "h-10" : "h-44"} flex-shrink-0 transition-[height]`}>
            <ChatPanel collapsed={chatCollapsed} onToggleCollapsed={() => setChatCollapsed((c) => !c)} />
          </div>
        </div>

        <div className="w-80 flex-shrink-0">
          <VoiceoverPanel />
        </div>
      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
}

import { useState, useRef } from "react";
import { usePrototypeStore, estimateDuration } from "@/lib/prototype/store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { VOICES } from "@/lib/prototype/sampleDeck";
import {
  Play, Pause, RefreshCw, Mic, Clock, ImageIcon, Trash2, Sparkles, Plus, GripVertical,
  MoreHorizontal, Copy, X, ChevronRight, Upload, Search,
} from "lucide-react";
import { toast } from "sonner";
import { ImageReplaceDialog } from "./ImageReplaceDialog";
import {
  TextStyleControls, ImageStyleControls, StatStyleControls,
  QuadrantStyleControls, BulletMarkerControls,
} from "./StyleControls";
import { cn } from "@/lib/utils";

const ELEMENT_LABELS: Record<string, string> = {
  title: "Title",
  subtitle: "Subtitle",
  body: "Body",
  bullets: "Bullets",
  stat: "Stat",
  statLabel: "Stat label",
  leftTitle: "Left title",
  leftBody: "Left body",
  rightTitle: "Right title",
  rightBody: "Right body",
  caption: "Caption",
  image: "Image",
  q1Title: "Strengths title", q1Body: "Strengths body",
  q2Title: "Weaknesses title", q2Body: "Weaknesses body",
  q3Title: "Opportunities title", q3Body: "Opportunities body",
  q4Title: "Threats title", q4Body: "Threats body",
};

const labelFor = (k: string) => {
  if (k.startsWith("bullet:")) return `Bullet ${Number(k.split(":")[1]) + 1}`;
  if (k.startsWith("image:")) return `Image ${k.split(":")[1]}`;
  if (k.startsWith("caption:")) return `Caption ${k.split(":")[1]}`;
  return ELEMENT_LABELS[k] ?? k;
};

// Local accordion section
const PanelSection = ({
  id, title, defaultOpen = false, children,
}: { id: string; title: string; defaultOpen?: boolean; children: React.ReactNode }) => {
  const open = usePrototypeStore((s) => s.panelSections[id] ?? defaultOpen);
  const setPanelSection = usePrototypeStore((s) => s.setPanelSection);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setPanelSection(id, !open)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition"
      >
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          {title}
        </span>
        <ChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-90")} />
      </button>
      {open && <div className="px-3 pb-4 pt-1">{children}</div>}
    </div>
  );
};

export const VoiceoverPanel = () => {
  const selectedSlideId = usePrototypeStore((s) => s.selectedSlideId);
  const slides = usePrototypeStore((s) => s.slides);
  const setSlideScript = usePrototypeStore((s) => s.setSlideScript);
  const setSlideContent = usePrototypeStore((s) => s.setSlideContent);
  const setSlideBullet = usePrototypeStore((s) => s.setSlideBullet);
  const setSlideStyle = usePrototypeStore((s) => s.setSlideStyle);
  const addBullet = usePrototypeStore((s) => s.addBullet);
  const removeBullet = usePrototypeStore((s) => s.removeBullet);
  const duplicateBullet = usePrototypeStore((s) => s.duplicateBullet);
  const voice = usePrototypeStore((s) => s.voice);
  const setVoice = usePrototypeStore((s) => s.setVoice);
  const selectedElementKey = usePrototypeStore((s) => s.selectedElementKey);
  const selectElement = usePrototypeStore((s) => s.selectElement);

  const slide = slides.find((s) => s.id === selectedSlideId);
  const [regenerating, setRegenerating] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [imgDialogOpen, setImgDialogOpen] = useState(false);
  const [bgDialogOpen, setBgDialogOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tab, setTab] = useState<"voice" | "element">("voice");

  if (selectedElementKey && tab === "voice") setTab("element");

  if (!slide) return null;

  const style = slide.content.style ?? {};
  const duration = estimateDuration(slide.script);
  const wordCount = slide.script.trim().split(/\s+/).filter(Boolean).length;

  const handlePreview = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/preview.mp3");
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.currentTime = 0; audioRef.current.play(); setPlaying(true); }
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setRegenerating(false);
      toast.success("Audio regenerated", { description: `${duration}s · ${voice.split(" — ")[0]}` });
    }, 1500);
  };

  // ---------- SLIDE BACKGROUND (always available) ----------
  const SlideBackgroundSection = () => (
    <PanelSection id="background" title="Slide background" defaultOpen={!selectedElementKey}>
      <div className="space-y-3">
        <div className="aspect-video rounded-md overflow-hidden border border-border bg-muted relative">
          {style.bgImageUrl ? (
            <>
              <img src={style.bgImageUrl} alt="" className="w-full h-full object-cover" style={{ opacity: style.bgImageOpacity ?? 0.3 }} />
              <div className="absolute inset-0 flex items-center justify-center text-[11px] text-muted-foreground/80 bg-background/40">
                {Math.round((style.bgImageOpacity ?? 0.3) * 100)}% opacity
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[11px] text-muted-foreground gap-1">
              <ImageIcon className="h-5 w-5 opacity-50" />
              No background
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setBgDialogOpen(true)}>
            <Search className="h-3 w-3 mr-1" /> Search
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setBgDialogOpen(true)}>
            <Upload className="h-3 w-3 mr-1" /> Upload
          </Button>
        </div>
        {style.bgImageUrl && (
          <>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-muted-foreground">Opacity</span>
                <span className="text-[11px] tabular-nums text-foreground">
                  {Math.round((style.bgImageOpacity ?? 0.3) * 100)}%
                </span>
              </div>
              <Slider
                min={0} max={100} step={1}
                value={[Math.round((style.bgImageOpacity ?? 0.3) * 100)]}
                onValueChange={([v]) => setSlideStyle(slide.id, { bgImageOpacity: v / 100 })}
              />
            </div>
            <Button
              variant="ghost" size="sm"
              className="w-full h-7 text-xs text-muted-foreground hover:text-destructive"
              onClick={() => setSlideStyle(slide.id, { bgImageUrl: undefined })}
            >
              <Trash2 className="h-3 w-3 mr-1" /> Remove background
            </Button>
          </>
        )}
      </div>
      <ImageReplaceDialog
        open={bgDialogOpen}
        onOpenChange={setBgDialogOpen}
        currentUrl={style.bgImageUrl}
        onPick={(u) => setSlideStyle(slide.id, { bgImageUrl: u, bgImageOpacity: style.bgImageOpacity ?? 0.3 })}
      />
    </PanelSection>
  );

  // ---------- ELEMENT-SPECIFIC SECTIONS ----------
  const renderElementSections = () => {
    if (!selectedElementKey) {
      return (
        <div className="px-4 py-8 text-center text-xs text-muted-foreground border-b border-border">
          Click any element on the slide to edit it.
        </div>
      );
    }

    const k = selectedElementKey;

    // BULLETS
    if (k === "bullets" || k.startsWith("bullet:")) {
      const bullets = slide.content.bullets ?? [];
      return (
        <>
          <PanelSection id="content" title="Content" defaultOpen>
            <div className="space-y-1.5">
              {bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-1 group">
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0 cursor-grab" />
                  <Input
                    value={b}
                    onChange={(e) => setSlideBullet(slide.id, i, e.target.value)}
                    onFocus={() => selectElement(`bullet:${i}`)}
                    className="h-8 text-xs"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 opacity-40 hover:opacity-100">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => duplicateBullet(slide.id, i)}>
                        <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => removeBullet(slide.id, i)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              <Button
                size="sm" variant="outline"
                className="w-full h-7 text-xs border-dashed mt-1"
                onClick={() => addBullet(slide.id)}
              >
                <Plus className="h-3 w-3 mr-1" /> Add bullet
              </Button>
            </div>
          </PanelSection>
          <PanelSection id="typography" title="Typography" defaultOpen>
            <TextStyleControls slideId={slide.id} field="body" />
          </PanelSection>
          <PanelSection id="marker" title="Bullet marker">
            <BulletMarkerControls slideId={slide.id} />
          </PanelSection>
          <SlideBackgroundSection />
        </>
      );
    }

    // IMAGE
    if (k === "image" || k.startsWith("image:")) {
      const fieldKey = k === "image" ? "imageUrl" : `imageUrl${k.split(":")[1]}`;
      const capKey = k === "image" ? "caption" : `caption${k.split(":")[1]}`;
      const url = (slide.content as any)[fieldKey] as string | undefined;
      const cap = (slide.content as any)[capKey] as string | undefined;
      const isGrid = slide.layout === "image-grid";
      return (
        <>
          <PanelSection id="content" title="Content" defaultOpen>
            <div className="space-y-2">
              <div className="aspect-video rounded overflow-hidden border border-border bg-muted">
                {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setImgDialogOpen(true)}>
                  <ImageIcon className="h-3 w-3 mr-1" /> Replace
                </Button>
                <Button
                  variant="outline" size="sm" className="text-xs h-8"
                  onClick={() => { setSlideContent(slide.id, fieldKey, ""); toast.success("Image removed"); }}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Remove
                </Button>
              </div>
              {isGrid && (
                <Input
                  value={cap ?? ""}
                  onChange={(e) => setSlideContent(slide.id, capKey, e.target.value)}
                  placeholder="Caption"
                  className="h-8 text-xs"
                />
              )}
            </div>
          </PanelSection>
          <PanelSection id="image" title="Image style" defaultOpen>
            <ImageStyleControls slideId={slide.id} isGrid={isGrid} layout={slide.layout} />
          </PanelSection>
          <SlideBackgroundSection />
          <ImageReplaceDialog
            open={imgDialogOpen}
            onOpenChange={setImgDialogOpen}
            currentUrl={url}
            onPick={(u) => setSlideContent(slide.id, fieldKey, u)}
          />
        </>
      );
    }

    // STAT
    if (k === "stat" || k === "statLabel") {
      const value = (slide.content as any)[k] as string | undefined;
      return (
        <>
          <PanelSection id="content" title="Content" defaultOpen>
            <Input
              value={value ?? ""}
              onChange={(e) => setSlideContent(slide.id, k, e.target.value)}
              className="h-9 text-sm"
            />
          </PanelSection>
          {k === "stat" && (
            <PanelSection id="typography" title="Stat style" defaultOpen>
              <StatStyleControls slideId={slide.id} />
            </PanelSection>
          )}
          <SlideBackgroundSection />
        </>
      );
    }

    // CAPTION
    if (k.startsWith("caption:")) {
      const n = k.split(":")[1];
      const fieldKey = n === "1" ? "caption" : `caption${n}`;
      const value = (slide.content as any)[fieldKey] as string | undefined;
      return (
        <>
          <PanelSection id="content" title="Content" defaultOpen>
            <Input
              value={value ?? ""}
              onChange={(e) => setSlideContent(slide.id, fieldKey, e.target.value)}
              className="h-9 text-sm"
            />
          </PanelSection>
          <SlideBackgroundSection />
        </>
      );
    }

    // GENERIC TEXT
    const value = (slide.content as any)[k] as string | undefined;
    const isLong = k === "body" || k === "leftBody" || k === "rightBody" || /Body$/.test(k);
    const styleField: "title" | "subtitle" | "body" | null =
      k === "title" ? "title" :
      k === "subtitle" ? "subtitle" :
      (k === "body" || k === "leftBody" || k === "rightBody" || /Body$/.test(k)) ? "body" :
      (k === "leftTitle" || k === "rightTitle" || /Title$/.test(k)) ? "title" : null;
    return (
      <>
        <PanelSection id="content" title="Content" defaultOpen>
          {isLong ? (
            <Textarea
              value={value ?? ""}
              onChange={(e) => setSlideContent(slide.id, k, e.target.value)}
              className="min-h-[120px] text-sm"
            />
          ) : (
            <Input
              value={value ?? ""}
              onChange={(e) => setSlideContent(slide.id, k, e.target.value)}
              className="h-9 text-sm"
            />
          )}
          <Button
            variant="ghost" size="sm"
            className="w-full mt-1.5 h-7 text-xs text-muted-foreground hover:text-destructive"
            onClick={() => setSlideContent(slide.id, k, "")}
          >
            <Trash2 className="h-3 w-3 mr-1" /> Clear text
          </Button>
        </PanelSection>
        {styleField && (
          <PanelSection id="typography" title="Typography" defaultOpen>
            <TextStyleControls slideId={slide.id} field={styleField} />
          </PanelSection>
        )}
        {slide.layout === "quadrant" && /^q[1-4](Title|Body)$/.test(k) && (
          <PanelSection id="marker" title="Quadrant palette" defaultOpen>
            <QuadrantStyleControls slideId={slide.id} />
          </PanelSection>
        )}
        <SlideBackgroundSection />
      </>
    );
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="flex flex-col h-full">
        <div className="px-3 py-2 border-b border-border">
          <TabsList className="grid grid-cols-2 h-8 w-full">
            <TabsTrigger value="voice" className="text-xs gap-1.5"><Mic className="h-3 w-3" />Voiceover</TabsTrigger>
            <TabsTrigger value="element" className="text-xs gap-1.5">
              <Sparkles className="h-3 w-3" />Element
              {selectedElementKey && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="voice" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">
              Script
            </label>
            <Textarea
              value={slide.script}
              onChange={(e) => setSlideScript(slide.id, e.target.value)}
              className="min-h-[180px] resize-none text-sm leading-relaxed"
              placeholder="What should the narrator say?"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{wordCount} words</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> ~{duration}s
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePreview} className="flex-1">
              {playing ? <Pause className="h-3.5 w-3.5 mr-1.5" /> : <Play className="h-3.5 w-3.5 mr-1.5" />}
              {playing ? "Pause" : "Preview"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={regenerating} className="flex-1">
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${regenerating ? "animate-spin" : ""}`} />
              {regenerating ? "…" : "Regen audio"}
            </Button>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">
              Voice
            </label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {VOICES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-medium">
              Estimated duration
            </div>
            <div className="text-2xl font-semibold tabular-nums">{duration}s</div>
          </div>
        </TabsContent>

        <TabsContent value="element" className="flex-1 overflow-y-auto mt-0 p-0">
          {/* Sticky context bar */}
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border px-3 py-2 flex items-center justify-between">
            <div className="min-w-0 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Editing</span>
              <span className="text-xs font-medium text-foreground truncate">
                {selectedElementKey ? labelFor(selectedElementKey) : "Nothing selected"}
              </span>
            </div>
            {selectedElementKey && (
              <Button
                size="sm" variant="ghost"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => selectElement(null)}
                title="Deselect"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {renderElementSections()}
          {!selectedElementKey && <SlideBackgroundSection />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

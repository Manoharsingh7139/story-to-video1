import { useState, useRef } from "react";
import { usePrototypeStore, estimateDuration } from "@/lib/prototype/store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VOICES } from "@/lib/prototype/sampleDeck";
import { Play, Pause, RefreshCw, Mic, Clock, ImageIcon, Type, Trash2, Sparkles, Plus, GripVertical, List } from "lucide-react";
import { toast } from "sonner";
import { ImageReplaceDialog } from "./ImageReplaceDialog";
import { TextStyleControls, BulletSmartArtPicker, ImageStyleControls, StatStyleControls } from "./StyleControls";

const ELEMENT_LABELS: Record<string, string> = {
  title: "Title",
  subtitle: "Subtitle",
  body: "Body",
  stat: "Stat",
  statLabel: "Stat label",
  leftTitle: "Left title",
  leftBody: "Left body",
  rightTitle: "Right title",
  rightBody: "Right body",
  caption: "Caption",
  caption2: "Caption 2",
  caption3: "Caption 3",
  caption4: "Caption 4",
  imageUrl: "Image",
  imageUrl2: "Image 2",
  imageUrl3: "Image 3",
  imageUrl4: "Image 4",
};

export const VoiceoverPanel = () => {
  const selectedSlideId = usePrototypeStore((s) => s.selectedSlideId);
  const slides = usePrototypeStore((s) => s.slides);
  const setSlideScript = usePrototypeStore((s) => s.setSlideScript);
  const setSlideContent = usePrototypeStore((s) => s.setSlideContent);
  const setSlideBullet = usePrototypeStore((s) => s.setSlideBullet);
  const addBullet = usePrototypeStore((s) => s.addBullet);
  const removeBullet = usePrototypeStore((s) => s.removeBullet);
  const voice = usePrototypeStore((s) => s.voice);
  const setVoice = usePrototypeStore((s) => s.setVoice);
  const selectedElementKey = usePrototypeStore((s) => s.selectedElementKey);
  const selectElement = usePrototypeStore((s) => s.selectElement);

  const slide = slides.find((s) => s.id === selectedSlideId);
  const [regenerating, setRegenerating] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [imgDialogOpen, setImgDialogOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tab, setTab] = useState<"voice" | "element">("voice");

  // auto-switch to element tab when something gets selected
  if (selectedElementKey && tab === "voice") setTab("element");

  if (!slide) return null;

  const duration = estimateDuration(slide.script);
  const wordCount = slide.script.trim().split(/\s+/).filter(Boolean).length;

  const handlePreview = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/preview.mp3");
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setRegenerating(false);
      toast.success("Audio regenerated", { description: `${duration}s · ${voice.split(" — ")[0]}` });
    }, 1500);
  };

  const SectionHeader = ({ label }: { label: string }) => (
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 pt-1">{label}</div>
  );

  const renderElementEditor = () => {
    if (!selectedElementKey) {
      return (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Click any element on the slide to edit it here.
        </div>
      );
    }

    const k = selectedElementKey;

    // Bullet group OR single bullet — both show the same content + smartart picker
    if (k === "bullets" || k.startsWith("bullet:")) {
      const bullets = slide.content.bullets ?? [];
      return (
        <div className="space-y-4">
          <div>
            <SectionHeader label="Content — Bullets" />
            <div className="space-y-1.5">
              {bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 group">
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
                  <Input
                    value={b}
                    onChange={(e) => setSlideBullet(slide.id, i, e.target.value)}
                    onFocus={() => selectElement(`bullet:${i}`)}
                    className="h-8 text-xs"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                    onClick={() => removeBullet(slide.id, i)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="w-full h-7 text-xs"
                onClick={() => addBullet(slide.id)}
              >
                <Plus className="h-3 w-3 mr-1" /> Add bullet
              </Button>
            </div>
          </div>
          <div className="border-t border-border pt-3">
            <SectionHeader label="Style" />
            <BulletSmartArtPicker slideId={slide.id} />
          </div>
        </div>
      );
    }

    // Image element
    if (k === "image" || k.startsWith("image:")) {
      const fieldKey = k === "image" ? "imageUrl" : `imageUrl${k.split(":")[1]}`;
      const capKey = k === "image" ? "caption" : `caption${k.split(":")[1]}`;
      const url = (slide.content as any)[fieldKey] as string | undefined;
      const cap = (slide.content as any)[capKey] as string | undefined;
      const isGrid = slide.layout === "image-grid";
      return (
        <div className="space-y-4">
          <div>
            <SectionHeader label="Content — Image" />
            <div className="space-y-2">
              <div className="aspect-video rounded overflow-hidden border border-border bg-muted">
                {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setImgDialogOpen(true)}>
                  <ImageIcon className="h-3 w-3 mr-1" /> Replace
                </Button>
                <Button
                  variant="outline" size="sm" className="text-xs"
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
          </div>
          <div className="border-t border-border pt-3">
            <SectionHeader label="Style" />
            <ImageStyleControls slideId={slide.id} isGrid={isGrid} />
          </div>
          <ImageReplaceDialog
            open={imgDialogOpen}
            onOpenChange={setImgDialogOpen}
            currentUrl={url}
            onPick={(u) => setSlideContent(slide.id, fieldKey, u)}
          />
        </div>
      );
    }

    // Caption (text)
    if (k.startsWith("caption:")) {
      const n = k.split(":")[1];
      const fieldKey = n === "1" ? "caption" : `caption${n}`;
      const value = (slide.content as any)[fieldKey] as string | undefined;
      return (
        <div className="space-y-3">
          <SectionHeader label={`Content — Caption ${n}`} />
          <Input
            value={value ?? ""}
            onChange={(e) => setSlideContent(slide.id, fieldKey, e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      );
    }

    // Stat
    if (k === "stat" || k === "statLabel") {
      const value = (slide.content as any)[k] as string | undefined;
      return (
        <div className="space-y-4">
          <div>
            <SectionHeader label={`Content — ${ELEMENT_LABELS[k]}`} />
            <Input
              value={value ?? ""}
              onChange={(e) => setSlideContent(slide.id, k, e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          {k === "stat" && (
            <div className="border-t border-border pt-3">
              <SectionHeader label="Style" />
              <StatStyleControls slideId={slide.id} />
            </div>
          )}
        </div>
      );
    }

    // Generic text field — title, subtitle, body, leftTitle, etc.
    const value = (slide.content as any)[k] as string | undefined;
    const isLong = k === "body" || k === "leftBody" || k === "rightBody";
    const styleField: "title" | "subtitle" | "body" | null =
      k === "title" ? "title" :
      k === "subtitle" ? "subtitle" :
      (k === "body" || k === "leftBody" || k === "rightBody") ? "body" :
      (k === "leftTitle" || k === "rightTitle") ? "title" : null;
    return (
      <div className="space-y-4">
        <div>
          <SectionHeader label={`Content — ${ELEMENT_LABELS[k] ?? k}`} />
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
        </div>
        {styleField && (
          <div className="border-t border-border pt-3">
            <SectionHeader label="Style" />
            <TextStyleControls slideId={slide.id} field={styleField} />
          </div>
        )}
      </div>
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
              {selectedElementKey && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
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
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VOICES.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
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

        <TabsContent value="element" className="flex-1 overflow-y-auto p-4 mt-0">
          {renderElementEditor()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

import { useState, useRef } from "react";
import { usePrototypeStore, estimateDuration } from "@/lib/prototype/store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VOICES } from "@/lib/prototype/sampleDeck";
import { Play, Pause, RefreshCw, Mic, Clock, ImageIcon, Type, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ImageReplaceDialog } from "./ImageReplaceDialog";

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

  const renderElementEditor = () => {
    if (!selectedElementKey) {
      return (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Click any element on the slide to edit it here.
        </div>
      );
    }

    const k = selectedElementKey;

    // Bullet
    if (k.startsWith("bullet:")) {
      const idx = parseInt(k.split(":")[1], 10);
      const value = slide.content.bullets?.[idx] ?? "";
      return (
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
            <Type className="h-3 w-3" /> Bullet {idx + 1}
          </div>
          <Textarea
            value={value}
            onChange={(e) => setSlideBullet(slide.id, idx, e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => {
              const bullets = (slide.content.bullets ?? []).filter((_, i) => i !== idx);
              setSlideContent(slide.id, "bullets" as any, bullets as any);
              selectElement(null);
            }}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete bullet
          </Button>
        </div>
      );
    }

    // Image element
    if (k === "image" || k.startsWith("image:")) {
      const fieldKey = k === "image" ? "imageUrl" : `imageUrl${k.split(":")[1]}`;
      const capKey = k === "image" ? "caption" : `caption${k.split(":")[1]}`;
      const url = (slide.content as any)[fieldKey] as string | undefined;
      const cap = (slide.content as any)[capKey] as string | undefined;
      const showCaption = slide.layout === "image-grid";
      return (
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
            <ImageIcon className="h-3 w-3" /> {ELEMENT_LABELS[fieldKey] ?? "Image"}
          </div>
          <div className="aspect-video rounded overflow-hidden border border-border bg-muted">
            {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
            )}
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => setImgDialogOpen(true)}>
            <ImageIcon className="h-3.5 w-3.5 mr-1.5" /> Replace image
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              setSlideContent(slide.id, fieldKey, "");
              toast.success("Image removed");
            }}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Remove
          </Button>
          {showCaption && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">
                Caption
              </label>
              <Input
                value={cap ?? ""}
                onChange={(e) => setSlideContent(slide.id, capKey, e.target.value)}
                placeholder="Optional caption"
                className="h-8 text-sm"
              />
            </div>
          )}
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
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
            <Type className="h-3 w-3" /> Caption {n}
          </div>
          <Input
            value={value ?? ""}
            onChange={(e) => setSlideContent(slide.id, fieldKey, e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      );
    }

    // Generic text field
    const value = (slide.content as any)[k] as string | undefined;
    const isLong = k === "body" || k === "leftBody" || k === "rightBody";
    return (
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
          <Type className="h-3 w-3" /> {ELEMENT_LABELS[k] ?? k}
        </div>
        {isLong ? (
          <Textarea
            value={value ?? ""}
            onChange={(e) => setSlideContent(slide.id, k, e.target.value)}
            className="min-h-[160px] text-sm"
          />
        ) : (
          <Input
            value={value ?? ""}
            onChange={(e) => setSlideContent(slide.id, k, e.target.value)}
            className="h-9 text-sm"
          />
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full text-destructive hover:text-destructive"
          onClick={() => {
            setSlideContent(slide.id, k, "");
          }}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear
        </Button>
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

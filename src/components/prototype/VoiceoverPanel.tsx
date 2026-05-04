import { useState, useRef } from "react";
import { usePrototypeStore, estimateDuration } from "@/lib/prototype/store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VOICES } from "@/lib/prototype/sampleDeck";
import { Play, Pause, RefreshCw, Mic, Clock } from "lucide-react";
import { toast } from "sonner";

export const VoiceoverPanel = () => {
  const selectedSlideId = usePrototypeStore((s) => s.selectedSlideId);
  const slides = usePrototypeStore((s) => s.slides);
  const setSlideScript = usePrototypeStore((s) => s.setSlideScript);
  const voice = usePrototypeStore((s) => s.voice);
  const setVoice = usePrototypeStore((s) => s.setVoice);

  const slide = slides.find((s) => s.id === selectedSlideId);
  const [regenerating, setRegenerating] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Mic className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Voiceover</span>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">
            Script
          </label>
          <Textarea
            value={slide.script}
            onChange={(e) => setSlideScript(slide.id, e.target.value)}
            className="min-h-[200px] resize-none text-sm leading-relaxed"
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
            {regenerating ? "Generating…" : "Regenerate"}
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
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1.5">Applied to all slides</p>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-medium">
            Estimated slide duration
          </div>
          <div className="text-2xl font-semibold tabular-nums">{duration}s</div>
        </div>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Download, Film } from "lucide-react";
import { usePrototypeStore, estimateDuration } from "@/lib/prototype/store";

const STEPS = ["Composing slides…", "Mixing audio…", "Adding transitions…", "Encoding MP4…"];

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportDialog = ({ open, onOpenChange }: ExportDialogProps) => {
  const slides = usePrototypeStore((s) => s.slides);
  const projectTitle = usePrototypeStore((s) => s.projectTitle);
  const totalSeconds = slides.reduce((sum, s) => sum + estimateDuration(s.script), 0);

  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      setStepIdx(0);
      setDone(false);
      return;
    }
    const total = 5000;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / total) * 100);
      setProgress(pct);
      setStepIdx(Math.min(STEPS.length - 1, Math.floor((pct / 100) * STEPS.length)));
      if (elapsed >= total) {
        clearInterval(interval);
        setDone(true);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" /> {done ? "Your video is ready" : "Exporting video"}
          </DialogTitle>
          <DialogDescription>
            {projectTitle} · {slides.length} slides · ~{totalSeconds}s
          </DialogDescription>
        </DialogHeader>

        {!done ? (
          <div className="space-y-4 py-2">
            <Progress value={progress} className="h-2" />
            <div className="space-y-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2.5 text-sm">
                  <div
                    className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      i < stepIdx ? "bg-foreground text-background" : i === stepIdx ? "bg-muted" : "bg-muted/40"
                    }`}
                  >
                    {i < stepIdx ? (
                      <Check className="h-2.5 w-2.5" />
                    ) : i === stepIdx ? (
                      <span className="h-1.5 w-1.5 bg-foreground rounded-full animate-pulse" />
                    ) : null}
                  </div>
                  <span className={i <= stepIdx ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="aspect-video rounded-md bg-foreground flex items-center justify-center relative overflow-hidden">
              <Film className="h-12 w-12 text-background opacity-60" />
              <div className="absolute bottom-3 left-3 text-xs text-background/80 font-medium">
                {projectTitle}.mp4
              </div>
            </div>
            <Button asChild className="w-full" size="lg">
              <a href="/sample-video.mp4" download={`${projectTitle}.mp4`}>
                <Download className="h-4 w-4 mr-2" /> Download MP4
              </a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STOCK_IMAGES, pickRandomImage } from "@/lib/prototype/stockImages";
import { Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currentUrl?: string;
  onPick: (url: string) => void;
}

export const ImageReplaceDialog = ({ open, onOpenChange, currentUrl, onPick }: Props) => {
  const [url, setUrl] = useState("");
  const [generating, setGenerating] = useState(false);

  const handlePick = (u: string) => {
    onPick(u);
    onOpenChange(false);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      handlePick(pickRandomImage(currentUrl));
    }, 1100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Replace image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">
              Stock library
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-[260px] overflow-y-auto">
              {STOCK_IMAGES.map((img) => (
                <button
                  key={img.url}
                  onClick={() => handlePick(img.url)}
                  className={`aspect-video rounded overflow-hidden border-2 transition-colors ${
                    img.url === currentUrl ? "border-foreground" : "border-transparent hover:border-border"
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">
                Or paste a URL
              </label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
            </div>
            <Button onClick={() => url && handlePick(url)} disabled={!url} variant="outline">
              Use URL
            </Button>
          </div>

          <Button onClick={handleGenerate} disabled={generating} className="w-full" variant="secondary">
            <Sparkles className={`h-4 w-4 mr-2 ${generating ? "animate-pulse" : ""}`} />
            {generating ? "Generating…" : "Generate with AI"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

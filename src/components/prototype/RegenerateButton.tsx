import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Sparkles, Shuffle, Type } from "lucide-react";
import { usePrototypeStore } from "@/lib/prototype/store";
import { toast } from "sonner";

interface Props {
  slideId: string;
}

export const RegenerateButton = ({ slideId }: Props) => {
  const regenerateSlide = usePrototypeStore((s) => s.regenerateSlide);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [prompt, setPrompt] = useState("");

  const run = (opts: { keepLayout?: boolean; prompt?: string }) => {
    setOpen(false);
    setBusy(true);
    setTimeout(() => {
      regenerateSlide(slideId, opts);
      setBusy(false);
      toast.success("Slide regenerated");
      setPrompt("");
    }, 1100);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" disabled={busy}>
          <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`} />
          {busy ? "Regenerating…" : "Regenerate slide"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <button
          onClick={() => run({ keepLayout: true })}
          className="w-full flex items-start gap-2 text-left p-2 rounded hover:bg-muted"
        >
          <Type className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">Keep this layout</div>
            <div className="text-xs text-muted-foreground">New copy, same structure</div>
          </div>
        </button>
        <button
          onClick={() => run({ keepLayout: false })}
          className="w-full flex items-start gap-2 text-left p-2 rounded hover:bg-muted"
        >
          <Shuffle className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">Try a different layout</div>
            <div className="text-xs text-muted-foreground">Pick a fresh format</div>
          </div>
        </button>
        <div className="border-t border-border my-1.5" />
        <div className="p-2 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Custom prompt
          </div>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. make it punchier"
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === "Enter" && prompt.trim() && run({ prompt: prompt.trim() })}
          />
          <Button
            size="sm"
            className="w-full h-8 text-xs"
            onClick={() => prompt.trim() && run({ prompt: prompt.trim() })}
            disabled={!prompt.trim()}
          >
            Regenerate from prompt
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

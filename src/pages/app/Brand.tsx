import { useState } from "react";
import { Topbar } from "@/components/app-shell/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrandKit } from "@/lib/data/useBrandKit";
import { THEME_LIST } from "@/lib/prototype/themes";
import { VOICES } from "@/lib/prototype/sampleDeck";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Upload, X } from "lucide-react";

const PACES = ["Slow", "Normal", "Fast"] as const;
const TONES = ["Neutral", "Warm", "Energetic"] as const;

export default function BrandPage() {
  const { kit, update, reset } = useBrandKit();
  const [showCallout, setShowCallout] = useState(() => localStorage.getItem("cs.brandCallout") !== "0");

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => update({ logoDataUrl: reader.result as string });
    reader.readAsDataURL(f);
  };

  const dismissCallout = () => {
    localStorage.setItem("cs.brandCallout", "0");
    setShowCallout(false);
  };

  return (
    <>
      <Topbar
        eyebrow="Brand kit"
        title="Make it yours"
        actions={<Button variant="outline" onClick={() => { reset(); toast({ title: "Brand kit reset" }); }}>Reset</Button>}
      />
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          {showCallout && (
            <Card className="p-5 border-primary/20 bg-primary/5 relative">
              <button onClick={dismissCallout} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <div className="text-[10px] uppercase tracking-[0.18em] text-primary">Personalize</div>
              </div>
              <h2 className="font-display text-lg mb-1">Make every video feel unmistakably yours.</h2>
              <p className="text-sm text-muted-foreground">Set your logo, voice, and palette once — they'll apply to every new project.</p>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="font-display text-lg mb-4">Logo</h3>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg border border-border bg-muted/40 flex items-center justify-center overflow-hidden">
                {kit.logoDataUrl ? (
                  <img src={kit.logoDataUrl} alt="Logo" className="object-contain w-full h-full" />
                ) : (
                  <span className="text-xs text-muted-foreground">No logo</span>
                )}
              </div>
              <div>
                <label className="inline-flex">
                  <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
                  <Button variant="outline" asChild><span><Upload className="h-4 w-4" /> Upload logo</span></Button>
                </label>
                {kit.logoDataUrl && (
                  <Button variant="ghost" className="ml-2" onClick={() => update({ logoDataUrl: undefined })}>Remove</Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-lg mb-4">Color accent</h3>
            <div className="space-y-3">
              <Label className="text-xs">Brand accent (HSL: h s% l%)</Label>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md border border-border" style={{ background: `hsl(${kit.accentHsl ?? "160 35% 25%"})` }} />
                <Input
                  value={kit.accentHsl ?? ""}
                  onChange={(e) => update({ accentHsl: e.target.value })}
                  placeholder="160 35% 25%"
                  className="max-w-xs"
                />
                {kit.accentHsl && (
                  <Button variant="ghost" size="sm" onClick={() => update({ accentHsl: undefined })}>Clear</Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Used as your highlight color in new projects.</p>
            </div>
          </Card>

          <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label className="text-xs">Default theme</Label>
              <Select value={kit.defaultTheme} onValueChange={(v) => update({ defaultTheme: v as any })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {THEME_LIST.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Default voice</Label>
              <Select value={kit.defaultVoice} onValueChange={(v) => update({ defaultVoice: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VOICES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Default pace</Label>
              <Select value={kit.defaultPace} onValueChange={(v) => update({ defaultPace: v as any })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{PACES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Default tone</Label>
              <Select value={kit.defaultTone} onValueChange={(v) => update({ defaultTone: v as any })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{TONES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

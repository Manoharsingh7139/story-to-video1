import { useState } from "react";
import { Topbar } from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrandKit } from "@/lib/data/useBrandKit";
import { THEME_LIST } from "@/lib/prototype/themes";
import { VOICES } from "@/lib/prototype/sampleDeck";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PACES = ["Slow", "Normal", "Fast"] as const;
const TONES = ["Neutral", "Warm", "Energetic"] as const;

const PALETTE: { name: string; hsl: string }[] = [
  { name: "Forest", hsl: "160 35% 25%" },
  { name: "Pine", hsl: "150 30% 30%" },
  { name: "Moss", hsl: "100 25% 32%" },
  { name: "Ink", hsl: "215 25% 18%" },
  { name: "Plum", hsl: "300 28% 32%" },
  { name: "Rust", hsl: "15 55% 42%" },
  { name: "Slate", hsl: "210 12% 35%" },
  { name: "Amber", hsl: "35 70% 42%" },
];

export default function BrandPage() {
  const { kit, update, reset } = useBrandKit();
  const accent = kit.accentHsl ?? "160 35% 25%";

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => update({ logoDataUrl: reader.result as string });
    reader.readAsDataURL(f);
  };

  return (
    <>
      <Topbar
        crumbs={[{ label: "Brand kit" }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              reset();
              toast({ title: "Brand kit reset" });
            }}
          >
            Reset
          </Button>
        }
      />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 lg:px-12 py-12 lg:py-16">
          <EditorialHeader
            eyebrow={
              <>
                <span className="h-px w-6 bg-foreground/30 inline-block" />
                <span>Brand kit</span>
              </>
            }
            title="Make it unmistakably yours."
            lede="Set your logo, voice over, and palette once — every new script starts here."
          />

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form */}
            <div className="lg:col-span-7 space-y-12">
              {/* Logo */}
              <Section title="Logo" caption="Shown in your scene corner-card and exports.">
                <div className="flex items-center gap-5">
                  <div className="h-20 w-20 border hairline bg-surface flex items-center justify-center overflow-hidden">
                    {kit.logoDataUrl ? (
                      <img
                        src={kit.logoDataUrl}
                        alt="Logo"
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <span className="text-[10px] text-muted-foreground">No logo</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onLogo}
                      />
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="h-3.5 w-3.5" /> Upload logo
                        </span>
                      </Button>
                    </label>
                    {kit.logoDataUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => update({ logoDataUrl: undefined })}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </Section>

              {/* Color */}
              <Section title="Accent color" caption="Used for highlights, charts, and CTAs.">
                <div className="grid grid-cols-4 gap-2">
                  {PALETTE.map((p) => {
                    const isActive = (kit.accentHsl ?? "160 35% 25%") === p.hsl;
                    return (
                      <button
                        key={p.hsl}
                        onClick={() => update({ accentHsl: p.hsl })}
                        className={cn(
                          "group relative aspect-square border hairline flex items-end p-2 transition-all",
                          isActive ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : "hover:border-foreground/40",
                        )}
                        style={{ background: `hsl(${p.hsl})` }}
                      >
                        <span className="text-[10px] uppercase tracking-[0.16em] text-white/85">
                          {p.name}
                        </span>
                        {isActive && (
                          <Check className="h-3 w-3 absolute top-2 right-2 text-white" strokeWidth={2.5} />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Custom HSL
                  </Label>
                  <Input
                    value={kit.accentHsl ?? ""}
                    onChange={(e) => update({ accentHsl: e.target.value })}
                    placeholder="160 35% 25%"
                    className="max-w-[200px] font-mono text-[12px]"
                  />
                  {kit.accentHsl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => update({ accentHsl: undefined })}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </Section>

              {/* Defaults */}
              <Section title="Defaults" caption="Applied to every new project.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FieldRow label="Theme">
                    <Select
                      value={kit.defaultTheme}
                      onValueChange={(v) => update({ defaultTheme: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {THEME_LIST.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldRow>
                  <FieldRow label="Voice over">
                    <Select
                      value={kit.defaultVoice}
                      onValueChange={(v) => update({ defaultVoice: v })}
                    >
                      <SelectTrigger>
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
                  </FieldRow>
                  <FieldRow label="Pace">
                    <Select
                      value={kit.defaultPace}
                      onValueChange={(v) => update({ defaultPace: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PACES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldRow>
                  <FieldRow label="Tone">
                    <Select
                      value={kit.defaultTone}
                      onValueChange={(v) => update({ defaultTone: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldRow>
                </div>
              </Section>
            </div>

            {/* Live preview */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-20">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
                  Live preview
                </div>
                <div
                  className="aspect-video border hairline shadow-paper p-8 flex flex-col justify-between bg-surface"
                  style={{ background: "hsl(45 25% 97%)" }}
                >
                  <div className="flex items-center gap-2">
                    {kit.logoDataUrl ? (
                      <img src={kit.logoDataUrl} alt="" className="h-5 w-auto object-contain" />
                    ) : (
                      <div
                        className="h-5 w-5 rounded-sm"
                        style={{ background: `hsl(${accent})` }}
                      />
                    )}
                    <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/60">
                      Your brand
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-serif text-[28px] leading-[1.05] tracking-[-0.02em] text-ink"
                    >
                      A title in your voice.
                    </div>
                    <div
                      className="mt-3 h-[3px] w-10"
                      style={{ background: `hsl(${accent})` }}
                    />
                    <div className="mt-3 text-[12px] text-foreground/60">
                      {kit.defaultVoice} · {kit.defaultPace} · {kit.defaultTone}
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-muted-foreground mt-3 font-serif italic">
                  Changes here update every new draft you start.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-1 pb-3 border-b hairline">
        <h2 className="font-serif text-xl text-ink">{title}</h2>
        {caption && <p className="text-[12px] text-muted-foreground">{caption}</p>}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

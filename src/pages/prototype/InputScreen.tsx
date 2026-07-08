import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Topbar } from "@/components/app-shell/AppShell";
import { TEMPLATES } from "@/lib/data/seedTemplates";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePrototypeStore } from "@/lib/prototype/store";
import { SAMPLE_TEXT } from "@/lib/prototype/sampleDeck";
import { THEME_LIST } from "@/lib/prototype/themes";
import {
  Sparkles,
  FileText,
  Check,
  Upload,
  FileUp,
  X,
  ArrowRight,
  AudioLines,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjects } from "@/lib/data/useProjects";

type SourceTab = "paste" | "upload" | "audio";

const MOTION_OPTIONS = [
  { id: "subtle", name: "Subtle", desc: "Gentle fade-in" },
  { id: "dynamic", name: "Dynamic", desc: "Bullets rise, boxes pop" },
  { id: "dramatic", name: "Dramatic", desc: "Bigger, slower entrance" },
  { id: "cinematic", name: "Cinematic", desc: "Scale + wipe overshoot" },
] as const;
type MotionId = typeof MOTION_OPTIONS[number]["id"];

export default function InputScreen() {
  const navigate = useNavigate();
  const {
    sourceText,
    projectTitle,
    themeId,
    voice,
    voiceMode,
    setSourceText,
    setProjectTitle,
    setThemeId,
  } = usePrototypeStore();

  const docInputRef = useRef<HTMLInputElement>(null);
  const audioScriptInputRef = useRef<HTMLInputElement>(null);

  const [sourceTab, setSourceTab] = useState<SourceTab>("audio");
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);
  const [uploadedAudioScript, setUploadedAudioScript] = useState<string | null>(null);
  const [motion, setMotion] = useState<MotionId>("dynamic");
  const [styleOpen, setStyleOpen] = useState(false);
  const [motionOpen, setMotionOpen] = useState(false);

  const [search] = useSearchParams();
  useEffect(() => {
    const tplId = search.get("template");
    const tpl = tplId ? TEMPLATES.find((t) => t.id === tplId) : null;
    if (tpl) {
      setProjectTitle(tpl.name);
      setSourceText(tpl.source);
      setThemeId(tpl.themeId);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const wordCount = sourceText.trim().split(/\s+/).filter(Boolean).length;
  const canGenerate = sourceText.trim().length > 20 || !!uploadedDoc || !!uploadedAudioScript;

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setUploadedDoc(file.name); setSourceText(SAMPLE_TEXT); }
  };
  const handleAudioScriptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setUploadedAudioScript(file.name); setSourceText(SAMPLE_TEXT); }
  };

  const createProject = useProjects((s) => s.createProject);
  const onGenerate = () => {
    if (!canGenerate) return;
    const project = createProject({
      title: projectTitle || "Untitled video",
      themeId, voice, voiceMode, source: sourceText, slides: [],
    });
    navigate(`/app/generating?id=${project.id}`);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onGenerate();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGenerate, sourceText, projectTitle, themeId, voice, voiceMode]);

  const activeTheme = THEME_LIST.find((t) => t.id === themeId) ?? THEME_LIST[0];
  const activeMotion = MOTION_OPTIONS.find((m) => m.id === motion) ?? MOTION_OPTIONS[1];

  return (
    <>
      <Topbar crumbs={[{ label: "Library", to: "/app" }, { label: "New video" }]} />

      <div className="flex-1 flex flex-col min-h-0 bg-background overflow-hidden">
        <div className="flex-1 min-h-0 max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-stretch">
          {/* LEFT — Script paper */}
          <section className="flex flex-col min-h-0 rounded-2xl bg-card border hairline shadow-paper overflow-hidden">
            {/* Title */}
            <div className="px-8 pt-8 pb-2">
              <input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Name your video…"
                className={cn(
                  "w-full bg-transparent border-none outline-none",
                  "font-serif italic text-ink text-[38px] md:text-[44px] leading-tight",
                  "placeholder:text-muted-foreground/35",
                )}
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 px-8 pt-4 pb-0 border-b hairline">
              {([
                { id: "paste", label: "Paste", icon: FileText },
                { id: "upload", label: "Document", icon: FileUp },
                { id: "audio", label: "Audio", icon: AudioLines },
              ] as const).map((t) => {
                const active = sourceTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSourceTab(t.id as SourceTab)}
                    className={cn(
                      "relative pb-3 text-[15px] transition-colors",
                      active
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t.label}
                    {active && (
                      <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 p-6 relative flex flex-col">
              {sourceTab === "paste" && (
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Paste your script here…"
                  className={cn(
                    "flex-1 min-h-0 w-full bg-transparent resize-none focus:outline-none",
                    "text-[15px] leading-[1.7] text-foreground",
                    "placeholder:text-muted-foreground/50 px-2",
                  )}
                />
              )}

              {sourceTab === "upload" && (
                <button
                  type="button"
                  onClick={() => docInputRef.current?.click()}
                  className={cn(
                    "flex-1 min-h-0 rounded-xl border-2 border-dashed border-border/70 hover:border-primary/40",
                    "flex flex-col items-center justify-center gap-3 text-center px-6",
                    "hover:bg-muted/20 transition-all group",
                  )}
                >
                  {uploadedDoc ? (
                    <>
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-sm font-medium">{uploadedDoc}</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setUploadedDoc(null); }}
                        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-[15px] font-medium">Drop a document</div>
                      <div className="text-[12px] text-muted-foreground">.pdf, .docx, .txt — up to 20 MB</div>
                    </>
                  )}
                  <input
                    ref={docInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={handleDocUpload}
                  />
                </button>
              )}

              {sourceTab === "audio" && (
                <button
                  type="button"
                  onClick={() => audioScriptInputRef.current?.click()}
                  className={cn(
                    "flex-1 min-h-0 rounded-xl border-2 border-dashed border-border/70 hover:border-primary/40",
                    "flex flex-col items-center justify-center gap-3 text-center px-6",
                    "hover:bg-muted/20 transition-all group",
                  )}
                >
                  {uploadedAudioScript ? (
                    <>
                      <svg viewBox="0 0 200 28" className="w-full max-w-[220px] h-6" aria-hidden>
                        {Array.from({ length: 40 }).map((_, i) => {
                          const h = 4 + Math.abs(Math.sin(i * 0.7)) * 18 + (i % 3) * 2;
                          return (
                            <rect key={i} x={i * 5} y={(28 - h) / 2} width={2.5} height={h} rx={1} className="fill-primary/70" />
                          );
                        })}
                      </svg>
                      <div className="text-sm font-medium">{uploadedAudioScript}</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setUploadedAudioScript(null); }}
                        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center group-hover:scale-105 transition-transform">
                        <AudioLines className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="text-[15px] font-medium mt-1">Upload an audio recording</div>
                      <div className="text-[12px] text-muted-foreground">
                        .mp3 or .m4a — we'll sync scenes to your audio.
                      </div>
                    </>
                  )}
                  <input
                    ref={audioScriptInputRef}
                    type="file"
                    accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,.mp3,.wav,.m4a"
                    className="hidden"
                    onChange={handleAudioScriptUpload}
                  />
                </button>
              )}
            </div>

            {/* Footer meta */}
            <div className="flex items-center justify-between px-8 py-3 border-t hairline text-[12px] text-muted-foreground">
              <span>{wordCount.toLocaleString()} words</span>
              <button
                onClick={() => { setSourceText(SAMPLE_TEXT); setSourceTab("paste"); }}
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Sparkles className="h-3 w-3" /> Use sample
              </button>
            </div>
          </section>

          {/* RIGHT — Rail */}
          <aside className="flex flex-col gap-5 min-h-0">
            {/* STYLE */}
            <div className="rounded-2xl bg-card border hairline shadow-paper p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Style
                </span>
                <button
                  onClick={() => setStyleOpen(true)}
                  className="text-[12px] text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
                >
                  Choose <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <StylePreview theme={activeTheme} title={projectTitle || "Name your video…"} />

              <div className="mt-3 font-serif text-[18px] text-foreground">{activeTheme.name}</div>
            </div>

            {/* MOTION */}
            <div className="rounded-2xl bg-card border hairline shadow-paper p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Motion
                </span>
                <button
                  onClick={() => setMotionOpen(true)}
                  className="text-[12px] text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
                >
                  Choose <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <MotionPreview id={motion} />

              <div className="mt-3 font-serif text-[18px] text-foreground">{activeMotion.name}</div>
            </div>

            {/* Generate */}
            <div className="mt-auto pt-2">
              <p className="font-serif italic text-[13px] text-muted-foreground mb-3">
                {canGenerate ? "Ready when you are." : "Add content to get started"}
              </p>
              <Button
                disabled={!canGenerate}
                onClick={onGenerate}
                size="lg"
                className="w-full h-12 gap-2 group"
              >
                <span className="font-medium">Generate Video</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* Style picker */}
      <Dialog open={styleOpen} onOpenChange={setStyleOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-2xl">Choose a visual style</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {THEME_LIST.slice(0, 6).map((t) => {
              const active = themeId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { setThemeId(t.id); setStyleOpen(false); }}
                  className={cn(
                    "group relative aspect-[4/5] rounded-xl overflow-hidden border transition-all text-left",
                    active
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/40 hover:-translate-y-0.5",
                  )}
                >
                  <StylePreview theme={t} title={projectTitle || "Name your video…"} compact />
                  <div className="absolute inset-x-0 bottom-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-[11px] font-semibold text-white tracking-wide">
                      {t.name}
                    </span>
                  </div>
                  {active && (
                    <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Motion picker */}
      <Dialog open={motionOpen} onOpenChange={setMotionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-2xl">Choose a motion feel</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            {MOTION_OPTIONS.map((m) => {
              const active = motion === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => { setMotion(m.id); setMotionOpen(false); }}
                  className={cn(
                    "rounded-xl border overflow-hidden text-left transition-all bg-card",
                    active
                      ? "border-primary ring-2 ring-primary/15"
                      : "border-border hover:border-primary/40 hover:-translate-y-0.5",
                  )}
                >
                  <MotionPreview id={m.id} />
                  <div className="px-4 py-3 border-t hairline">
                    <div className={cn("text-sm font-semibold", active && "text-primary")}>
                      {m.name}
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">{m.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* --- Preview components --- */

function StylePreview({
  theme,
  title,
  compact = false,
}: {
  theme: typeof THEME_LIST[number];
  title: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn("rounded-xl overflow-hidden relative", compact ? "h-full" : "aspect-[16/10]")}
      style={{ background: theme.bg, color: theme.text }}
    >
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div>
          <div
            style={{
              fontFamily: theme.fontHead,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
            className="text-[15px] line-clamp-2"
          >
            {title}
          </div>
          <div
            style={{ color: theme.muted, fontFamily: theme.fontBody }}
            className="text-[10px] mt-1.5"
          >
            visual essay · 8 scenes
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div
            style={{ background: theme.accent, height: 3, width: 40, borderRadius: 2 }}
          />
          <span
            style={{ background: theme.accent, opacity: 0.35 }}
            className="h-4 w-4 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

function MotionPreview({ id }: { id: MotionId }) {
  const cfg: Record<MotionId, { dur: string; translate: string; scale: string; ease: string; stagger: number }> = {
    subtle:    { dur: "2.4s", translate: "4px",  scale: "1",    ease: "ease-out",                 stagger: 160 },
    dynamic:   { dur: "2.0s", translate: "10px", scale: "1",    ease: "cubic-bezier(.2,.8,.2,1)", stagger: 180 },
    dramatic:  { dur: "2.4s", translate: "16px", scale: "0.94", ease: "cubic-bezier(.2,.8,.2,1)", stagger: 240 },
    cinematic: { dur: "2.6s", translate: "0px",  scale: "0.88", ease: "cubic-bezier(.16,1,.3,1)", stagger: 260 },
  };
  const c = cfg[id];
  const keyframes = `@keyframes mp-${id} {
    0%   { opacity: 0; transform: translateY(${c.translate}) scale(${c.scale}); }
    45%  { opacity: 1; transform: translateY(0) scale(1); }
    85%  { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(0) scale(1); }
  }`;
  const anim = (i: number) => ({
    animation: `mp-${id} ${c.dur} ${c.ease} ${i * c.stagger}ms infinite`,
  });
  return (
    <div
      className="aspect-[16/10] rounded-xl relative overflow-hidden"
      style={{ background: "hsl(220 40% 94%)" }}
    >
      <style>{keyframes}</style>
      <div className="absolute inset-0 p-5 flex flex-col justify-center gap-2">
        <div className="h-2 w-2/3 rounded bg-foreground/25" style={anim(0)} />
        <div className="h-1.5 w-full rounded bg-foreground/15" style={anim(1)} />
        <div className="h-1.5 w-5/6 rounded bg-foreground/15" style={anim(2)} />
      </div>
    </div>
  );
}

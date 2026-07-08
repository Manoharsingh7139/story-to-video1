import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Topbar } from "@/components/app-shell/AppShell";
import { TEMPLATES } from "@/lib/data/seedTemplates";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePrototypeStore } from "@/lib/prototype/store";
import { SAMPLE_TEXT, VOICES } from "@/lib/prototype/sampleDeck";
import { THEME_LIST } from "@/lib/prototype/themes";
import {
  Sparkles,
  FileText,
  Check,
  Upload,
  Mic,
  FileUp,
  X,
  ArrowRight,
  Play,
  Pause,
  AudioLines,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjects } from "@/lib/data/useProjects";

type SourceTab = "paste" | "upload" | "audio";

const PACE_OPTIONS = ["Slow", "Normal", "Fast"] as const;
const TONE_OPTIONS = ["Neutral", "Warm", "Energetic"] as const;

const MOTION_OPTIONS = [
  { id: "subtle", name: "Subtle", desc: "Gentle fade-in" },
  { id: "dynamic", name: "Dynamic", desc: "Bullets rise, boxes pop" },
  { id: "dramatic", name: "Dramatic", desc: "Bigger, slower entrance" },
  { id: "cinematic", name: "Cinematic", desc: "Scale + wipe overshoot" },
] as const;
type MotionId = typeof MOTION_OPTIONS[number]["id"];

// Deterministic warm gradient per voice name — uses primary hue
const voiceGradient = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 40;
  const base = 140 + h;
  const warm = 30 + (h % 20);
  return `linear-gradient(135deg, hsl(${base} 35% 55%), hsl(${warm} 45% 75%))`;
};

const Eyebrow = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3
    className={cn(
      "text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80",
      className,
    )}
  >
    {children}
  </h3>
);

// Numbered editorial section header — italic serif numeral + label
const SectionLabel = ({
  step,
  label,
  hint,
  action,
}: {
  step: string;
  label: string;
  hint?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-end justify-between mb-3 gap-3">
    <div className="flex items-baseline gap-2.5 min-w-0">
      <span className="editorial-display italic text-primary/70 text-[22px] leading-none tabular-nums translate-y-[1px]">
        {step}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/80">
        {label}
      </span>
      {hint && (
        <span className="text-[10px] text-muted-foreground/70 font-medium truncate">
          — {hint}
        </span>
      )}
    </div>
    {action}
  </div>
);

// Tiny animated preview per motion preset
const MotionPreview = ({ id, active }: { id: MotionId; active: boolean }) => {
  const cfg: Record<MotionId, { dur: string; translate: string; scale: string; ease: string; stagger: number }> = {
    subtle:    { dur: "1.8s", translate: "4px",  scale: "1",    ease: "ease-out",                 stagger: 120 },
    dynamic:   { dur: "1.5s", translate: "10px", scale: "1",    ease: "cubic-bezier(.2,.8,.2,1)", stagger: 140 },
    dramatic:  { dur: "2.0s", translate: "16px", scale: "0.94", ease: "cubic-bezier(.2,.8,.2,1)", stagger: 200 },
    cinematic: { dur: "2.2s", translate: "0px",  scale: "0.88", ease: "cubic-bezier(.16,1,.3,1)", stagger: 220 },
  };
  const c = cfg[id];
  const keyframes = `@keyframes mp-${id} {
    0%   { opacity: 0; transform: translateY(${c.translate}) scale(${c.scale}); }
    55%  { opacity: 1; transform: translateY(0) scale(1); }
    85%  { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(0) scale(1); }
  }`;
  const anim = (i: number) => ({
    animation: `mp-${id} ${c.dur} ${c.ease} ${i * c.stagger}ms infinite`,
  });
  return (
    <div className="absolute inset-0 p-2 flex flex-col gap-1 justify-center">
      <style>{keyframes}</style>
      <div className={cn("h-1.5 w-2/3 rounded-sm", active ? "bg-primary" : "bg-foreground/60")} style={anim(0)} />
      <div className={cn("h-1 w-full rounded-sm", active ? "bg-primary/40" : "bg-foreground/25")} style={anim(1)} />
      <div className={cn("h-1 w-5/6 rounded-sm", active ? "bg-primary/40" : "bg-foreground/25")} style={anim(2)} />
      <div className={cn("h-1 w-3/5 rounded-sm bg-foreground/25")} style={anim(3)} />
    </div>
  );
};

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
    setVoice,
    setVoiceMode,
  } = usePrototypeStore();

  const docInputRef = useRef<HTMLInputElement>(null);
  const audioScriptInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [sourceTab, setSourceTab] = useState<SourceTab>("paste");
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);
  const [uploadedAudioScript, setUploadedAudioScript] = useState<string | null>(null);
  const [uploadedVoice, setUploadedVoice] = useState<string | null>(null);
  const [pace, setPace] = useState<typeof PACE_OPTIONS[number]>("Normal");
  const [tone, setTone] = useState<typeof TONE_OPTIONS[number]>("Warm");
  const [motion, setMotion] = useState<MotionId>("dynamic");
  const [previewing, setPreviewing] = useState<string | null>(null);

  const [search] = useSearchParams();
  useEffect(() => {
    const tplId = search.get("template");
    const tpl = tplId ? TEMPLATES.find((t) => t.id === tplId) : null;
    if (tpl) {
      setProjectTitle(tpl.name);
      setSourceText(tpl.source);
      setThemeId(tpl.themeId);
      setVoice(tpl.voice);
      setVoiceMode("ai");
      return;
    }
    if (!sourceText) setSourceText(SAMPLE_TEXT);
    if (!projectTitle || projectTitle === "Untitled video") setProjectTitle("The Async Advantage");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const wordCount = sourceText.trim().split(/\s+/).filter(Boolean).length;
  const slideEstimate = Math.max(1, Math.round(wordCount / 80));
  const minutes = Math.max(1, Math.round((wordCount / 150) * 1.1));
  const canGenerate = sourceText.trim().length > 20 || !!uploadedDoc || !!uploadedAudioScript;

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setUploadedDoc(file.name); setSourceText(SAMPLE_TEXT); }
  };
  const handleAudioScriptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setUploadedAudioScript(file.name); setSourceText(SAMPLE_TEXT); }
  };
  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedVoice(file.name);
  };

  const playPreview = (voiceName: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/preview.mp3");
      audioRef.current.addEventListener("ended", () => setPreviewing(null));
    }
    if (previewing === voiceName) {
      audioRef.current.pause();
      setPreviewing(null);
      return;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    setPreviewing(voiceName);
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
  const onSkip = () => {
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

  const selectedVoiceName = (voice || VOICES[0]).split(" — ")[0];
  const charCount = sourceText.length;
  const CHAR_MAX = 5000;

  const activeTheme = useMemo(
    () => THEME_LIST.find((t) => t.id === themeId) ?? THEME_LIST[0],
    [themeId],
  );

  const isEmpty = sourceText.trim().length === 0 && !uploadedDoc && !uploadedAudioScript;

  return (
    <TooltipProvider delayDuration={200}>
      <Topbar
        crumbs={[{ label: "New video" }]}
        actions={
          <button
            onClick={onSkip}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            Skip with sample <ArrowRight className="h-3 w-3" />
          </button>
        }
      />

      {/* Page canvas — uses existing bg-paper */}
      <div className="flex-1 flex flex-col min-h-0 bg-paper overflow-hidden">
        {/* Hero header */}
        <header className="max-w-[1400px] w-full mx-auto px-8 lg:px-12 pt-10 pb-6 shrink-0">
          <nav className="flex items-center gap-3 mb-4">
            <span className="editorial-display italic text-primary/80 text-[15px] leading-none">
              New composition
            </span>
            <span className="h-px flex-1 max-w-[80px] bg-hairline" aria-hidden />
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-[0.22em] font-semibold">
              <span>Library</span>
              <ChevronRight className="h-3 w-3 opacity-50" />
              <span className="text-foreground/80">Draft</span>
              <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/8 border border-primary/15">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="text-[9px] tracking-[0.18em] text-primary/90">Live</span>
              </span>
            </div>
          </nav>
          <input
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Untitled composition"
            className={cn(
              "w-full bg-transparent border-none outline-none",
              "editorial-display text-ink text-[44px] md:text-[58px]",
              "placeholder:text-muted-foreground/25 placeholder:italic",
              "focus:ring-0 border-b border-transparent focus:border-primary/40 transition-colors pb-1",
            )}
          />
          <p className="mt-2 text-[12px] text-muted-foreground/80 font-serif italic">
            A short piece composed from your words. Set the script, choose a voice, let motion do the rest.
          </p>
        </header>


        {/* Main split canvas */}
        <main className="flex-1 min-h-0 max-w-[1400px] w-full mx-auto px-8 lg:px-12 pb-24 grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 items-stretch">
          {/* LEFT — Script paper */}
          <section className="flex flex-col min-h-0">
            <div className="flex-1 min-h-0 rounded-2xl bg-card border hairline shadow-paper flex flex-col overflow-hidden">
              {/* Tabs */}
              <div className="flex items-center gap-6 px-7 pt-5 pb-0 border-b hairline">
                {([
                  { id: "paste", label: "Paste script", icon: FileText },
                  { id: "upload", label: "Document", icon: FileUp },
                  { id: "audio", label: "Audio", icon: AudioLines },
                ] as const).map((t) => {
                  const active = sourceTab === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSourceTab(t.id as SourceTab)}
                      className={cn(
                        "relative pb-3 text-[13px] font-medium inline-flex items-center gap-2 transition-colors",
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {t.label}
                      <span
                        className={cn(
                          "absolute -bottom-px left-0 h-[2px] bg-primary origin-left transition-transform duration-300",
                          active ? "w-full scale-x-100" : "w-full scale-x-0",
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Body */}
              <div className="flex-1 min-h-0 px-7 py-6 relative flex flex-col">
                {sourceTab === "paste" && (
                  <>
                    <textarea
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      placeholder="Paste your script — an article, brief, lecture transcript, or chapter notes…"
                      className={cn(
                        "flex-1 min-h-0 w-full bg-transparent resize-none focus:outline-none",
                        "text-[15px] leading-[1.7] text-foreground",
                        "placeholder:text-muted-foreground/50",
                      )}
                    />
                    {isEmpty && (
                      <button
                        onClick={() => setSourceText(SAMPLE_TEXT)}
                        className="absolute bottom-6 left-7 group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border hairline shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all"
                      >
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span className="text-[11px] font-medium text-foreground">
                          Try a sample script
                        </span>
                      </button>
                    )}
                  </>
                )}

                {sourceTab === "upload" && (
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    className={cn(
                      "flex-1 min-h-0 rounded-xl border-2 border-dashed border-border hover:border-primary/40",
                      "flex flex-col items-center justify-center gap-3 text-center px-6",
                      "bg-muted/20 hover:bg-muted/30 transition-all group",
                    )}
                  >
                    {uploadedDoc ? (
                      <>
                        <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
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
                        <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                          <Upload className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-sm font-medium">Drop a file or click to browse</div>
                        <div className="text-[11px] text-muted-foreground">.pdf, .docx, .txt — up to 20 MB</div>
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
                      "flex-1 min-h-0 rounded-xl border-2 border-dashed border-border hover:border-primary/40",
                      "flex flex-col items-center justify-center gap-3 text-center px-6",
                      "bg-muted/20 hover:bg-muted/30 transition-all group",
                    )}
                  >
                    <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <AudioLines className="h-5 w-5 text-primary" />
                    </div>
                    {uploadedAudioScript ? (
                      <>
                        <svg viewBox="0 0 200 28" className="w-full max-w-[260px] h-6" aria-hidden>
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
                        <div className="text-sm font-medium">Upload an audio recording</div>
                        <div className="text-[11px] text-muted-foreground max-w-sm">
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

                {sourceTab === "paste" && (
                  <div className="flex justify-end pt-3 shrink-0">
                    <span className="text-[10px] font-mono text-muted-foreground/60 tabular-nums uppercase tracking-tight">
                      {charCount.toLocaleString()} / {CHAR_MAX.toLocaleString()} chars
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT — Studio rail */}
          <aside className="flex flex-col gap-7 min-h-0 overflow-y-auto pr-1 -mr-1 studio-rail">
            {/* Visual Style */}
            <div>
              <SectionLabel step="01" label="Visual style" hint={activeTheme.name} />

              <div className="grid grid-cols-3 gap-3">
                {THEME_LIST.slice(0, 3).map((t) => {
                  const active = themeId === t.id;
                  return (
                    <Tooltip key={t.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setThemeId(t.id)}
                          className={cn(
                            "group relative aspect-[4/5] rounded-xl overflow-hidden border transition-all",
                            active
                              ? "border-primary ring-2 ring-primary/20 shadow-premium"
                              : "border-border hover:border-primary/40 hover:-translate-y-0.5",
                          )}
                          aria-label={t.name}
                        >
                          <div
                            className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]"
                            style={{ background: t.bg, color: t.text }}
                          >
                            <div className="absolute inset-0 p-3 flex flex-col justify-between">
                              <div style={{ fontFamily: t.fontHead, fontWeight: 700, fontSize: 13, lineHeight: 1.1 }}>
                                Aa
                              </div>
                              <div className="flex items-center gap-1">
                                <span style={{ width: 16, height: 2, background: t.accent, borderRadius: 1 }} />
                                <span style={{ width: 3, height: 3, borderRadius: 999, background: t.muted, opacity: 0.7 }} />
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/45 to-transparent">
                            <span className="text-[10px] font-semibold text-white tracking-wider uppercase">
                              {t.name}
                            </span>
                          </div>
                          {active && (
                            <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                              <Check className="h-2.5 w-2.5" strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-[11px]">{t.name}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Motion Presets */}
            <div>
              <Eyebrow className="mb-3">Motion</Eyebrow>
              <div className="grid grid-cols-2 gap-2.5">
                {MOTION_OPTIONS.map((m) => {
                  const active = motion === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMotion(m.id)}
                      className={cn(
                        "group relative flex flex-col rounded-xl border overflow-hidden text-left transition-all bg-card",
                        active
                          ? "border-primary ring-2 ring-primary/15 shadow-premium"
                          : "border-border hover:border-primary/40 hover:-translate-y-0.5",
                      )}
                    >
                      <div className="relative aspect-[16/9] bg-muted/50 overflow-hidden">
                        <MotionPreview id={m.id} active={active} />
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 border-t hairline">
                        <div className="min-w-0">
                          <div className={cn("text-xs font-semibold truncate", active ? "text-primary" : "text-foreground")}>
                            {m.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight truncate">
                            {m.desc}
                          </div>
                        </div>
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full shrink-0 transition-colors",
                            active ? "bg-primary" : "border border-border group-hover:bg-primary/60 group-hover:border-primary/60",
                          )}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Voice */}
            <div className="rounded-2xl bg-card border hairline shadow-paper p-5 space-y-5">
              <div className="flex items-center justify-between">
                <Eyebrow>Voice</Eyebrow>
                <div className="inline-flex p-0.5 bg-muted rounded-md">
                  {([
                    { id: "ai", label: "AI voice over", icon: Sparkles },
                    { id: "upload", label: "My recording", icon: Mic },
                  ] as const).map((m) => {
                    const active = voiceMode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setVoiceMode(m.id)}
                        className={cn(
                          "px-2.5 h-7 rounded-[5px] text-[11px] font-medium transition-all inline-flex items-center gap-1.5",
                          active
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <m.icon className="h-3 w-3" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {voiceMode === "ai" ? (
                <>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center text-[12px] font-semibold text-white shadow-sm shrink-0"
                      style={{ background: voiceGradient(selectedVoiceName) }}
                    >
                      {selectedVoiceName[0]}
                    </div>
                    <Select value={voice} onValueChange={setVoice}>
                      <SelectTrigger className="h-9 flex-1 min-w-0 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VOICES.map((v) => (
                          <SelectItem key={v} value={v} className="text-xs">
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      onClick={() => playPreview(voice)}
                      className="h-9 w-9 rounded-full bg-background border hairline flex items-center justify-center hover:bg-muted hover:border-primary/40 text-foreground shrink-0 transition-all"
                      aria-label={`Preview ${selectedVoiceName}`}
                    >
                      {previewing === voice ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Pace</div>
                      <div className="inline-flex p-0.5 bg-muted rounded-md w-full">
                        {PACE_OPTIONS.map((p) => (
                          <button
                            key={p}
                            onClick={() => setPace(p)}
                            className={cn(
                              "flex-1 px-2 h-6 text-[11px] font-medium rounded-[5px] transition-all",
                              pace === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Tone</div>
                      <div className="inline-flex p-0.5 bg-muted rounded-md w-full">
                        {TONE_OPTIONS.map((p) => (
                          <button
                            key={p}
                            onClick={() => setTone(p)}
                            className={cn(
                              "flex-1 px-2 h-6 text-[11px] font-medium rounded-[5px] transition-all",
                              tone === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => voiceInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/40 px-4 py-4 flex items-center gap-3 cursor-pointer bg-muted/20 text-left transition-all"
                >
                  <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center shadow-sm shrink-0">
                    {uploadedVoice ? <AudioLines className="h-4 w-4 text-primary" /> : <Mic className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">
                      {uploadedVoice ?? "Upload your voice over"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {uploadedVoice ? "Synced to your scenes" : "Drop a lecture, podcast, or take."}
                    </div>
                  </div>
                  {uploadedVoice && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setUploadedVoice(null); }}
                      className="text-muted-foreground hover:text-foreground p-1"
                      aria-label="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <input
                    ref={voiceInputRef}
                    type="file"
                    accept="audio/mpeg,audio/wav,.mp3,.wav"
                    className="hidden"
                    onChange={handleVoiceUpload}
                  />
                </button>
              )}
            </div>
          </aside>
        </main>

        {/* Sticky action bar */}
        <footer className="fixed bottom-0 left-0 right-0 z-30 bg-background/85 backdrop-blur-md border-t hairline">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <Metric label="Words" value={wordCount.toLocaleString()} />
              <span className="w-px h-7 bg-hairline" />
              <Metric label="Scenes" value={`~${slideEstimate}`} />
              <span className="w-px h-7 bg-hairline hidden sm:block" />
              <Metric label="Runtime" value={`~${minutes} min`} className="hidden sm:flex" />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground hidden md:inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border hairline bg-muted text-[10px] font-mono">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded border hairline bg-muted text-[10px] font-mono">↵</kbd>
                to generate
              </span>
              <Button
                disabled={!canGenerate}
                onClick={onGenerate}
                size="lg"
                className="group gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Generate video
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}

function Metric({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("flex flex-col leading-tight", className)}>
      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground tabular-nums">{value}</span>
    </div>
  );
}

import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Topbar } from "@/components/app-shell/AppShell";
import { TEMPLATES } from "@/lib/data/seedTemplates";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
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
  LayoutTemplate,
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

// Forest-warm deterministic gradient per voice name
const voiceGradient = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 40;
  const base = 140 + h;
  const warm = 30 + (h % 20);
  return `linear-gradient(135deg, hsl(${base} 35% 60%), hsl(${warm} 50% 78%))`;
};

const RowLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground/90 w-14 shrink-0 pt-1">
    {children}
  </div>
);

// Tiny animated preview that visually communicates each motion preset.
// Pure CSS animations driven by Tailwind arbitrary values.
const MotionPreview = ({ id }: { id: MotionId }) => {
  // Shared mini-slide chrome (title bar + 3 bullet lines), animated per preset.
  const cfg: Record<MotionId, { dur: string; translate: string; scale: string; ease: string; stagger: number }> = {
    subtle:    { dur: "1.6s", translate: "4px",  scale: "1",     ease: "ease-out",                 stagger: 120 },
    dynamic:   { dur: "1.4s", translate: "10px", scale: "1",     ease: "cubic-bezier(.2,.8,.2,1)", stagger: 140 },
    dramatic:  { dur: "2.0s", translate: "16px", scale: "0.94",  ease: "cubic-bezier(.2,.8,.2,1)", stagger: 200 },
    cinematic: { dur: "2.2s", translate: "0px",  scale: "0.88",  ease: "cubic-bezier(.16,1,.3,1)", stagger: 220 },
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
      <div className="h-1.5 w-2/3 rounded-sm bg-foreground/70" style={anim(0)} />
      <div className="h-1 w-full rounded-sm bg-foreground/35" style={anim(1)} />
      <div className="h-1 w-5/6 rounded-sm bg-foreground/35" style={anim(2)} />
      <div className="h-1 w-3/5 rounded-sm bg-foreground/35" style={anim(3)} />
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
  const templateInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [sourceTab, setSourceTab] = useState<SourceTab>("paste");
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);
  const [uploadedAudioScript, setUploadedAudioScript] = useState<string | null>(null);
  const [uploadedVoice, setUploadedVoice] = useState<string | null>(null);
  const [customTemplate, setCustomTemplate] = useState<string | null>(null);
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
  }, [search]);

  const wordCount = sourceText.trim().split(/\s+/).filter(Boolean).length;
  const slideEstimate = Math.max(1, Math.round(wordCount / 80));
  const minutes = Math.max(1, Math.round((wordCount / 150) * 1.1));
  const canGenerate = sourceText.trim().length > 20 || !!uploadedDoc || !!uploadedAudioScript;

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDoc(file.name);
      setSourceText(SAMPLE_TEXT);
    }
  };
  const handleAudioScriptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedAudioScript(file.name);
      setSourceText(SAMPLE_TEXT);
    }
  };
  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedVoice(file.name);
  };
  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCustomTemplate(file.name);
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
      themeId,
      voice,
      voiceMode,
      source: sourceText,
      slides: [],
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
  }, [canGenerate]);

  const selectedVoiceName = (voice || VOICES[0]).split(" — ")[0];

  return (
    <TooltipProvider delayDuration={200}>
      <Topbar
        crumbs={[{ label: "New video" }]}
        actions={
          <button
            onClick={onSkip}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
          >
            Skip with sample <ArrowRight className="h-3 w-3" />
          </button>
        }
      />

      {/* Page column — fills the remaining shell height, no scroll */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Compact hero */}
        <section className="max-w-7xl w-full mx-auto px-6 lg:px-10 pt-5 pb-3 shrink-0 flex items-center gap-4">
          <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80 shrink-0">
            New video
          </span>
          <span className="h-px w-6 bg-foreground/15 shrink-0" aria-hidden />
          <input
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="flex-1 min-w-0 bg-transparent border-none outline-none editorial-display text-[22px] md:text-[26px] leading-tight text-ink placeholder:text-muted-foreground/40 focus:ring-0"
            placeholder="Untitled video"
          />
        </section>

        {/* Two-column body */}
        <main className="max-w-7xl w-full mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 min-h-0 pb-3 items-stretch">
          {/* LEFT — Script */}
          <Card className="overflow-hidden border-border/70 shadow-sm flex flex-col min-h-0">
            <div className="px-4 pt-3.5 pb-2 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground/90">
                  Script
                </div>
                <div className="inline-flex p-0.5 rounded-md bg-muted text-xs">
                  {([
                    { id: "paste", label: "Paste", icon: FileText },
                    { id: "upload", label: "Document", icon: FileUp },
                    { id: "audio", label: "Audio", icon: AudioLines },
                  ] as const).map((t) => {
                    const Icon = t.icon;
                    const active = sourceTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSourceTab(t.id as SourceTab)}
                        className={cn(
                          "px-2.5 h-7 rounded-[5px] inline-flex items-center gap-1.5 transition-colors",
                          active
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">
                {wordCount} words · ~{slideEstimate} scenes · ~{minutes} min
              </div>
            </div>

            <div className="px-4 pb-3 flex-1 min-h-0 flex flex-col">
              {sourceTab === "paste" && (
                <Textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Paste your script — an article, brief, lecture transcript, or chapter notes…"
                  className="flex-1 min-h-0 resize-none border-border/60 text-[14px] leading-relaxed focus-visible:ring-1"
                />
              )}

              {sourceTab === "upload" && (
                <button
                  type="button"
                  onClick={() => docInputRef.current?.click()}
                  className="flex-1 min-h-0 rounded-md border-2 border-dashed border-border hover:border-foreground/40 transition-colors flex flex-col items-center justify-center gap-2.5 cursor-pointer bg-muted/20 px-6 text-center"
                >
                  {uploadedDoc ? (
                    <>
                      <div className="h-11 w-11 rounded-full bg-background flex items-center justify-center shadow-sm">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-medium">{uploadedDoc}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedDoc(null);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="h-11 w-11 rounded-full bg-background flex items-center justify-center shadow-sm">
                        <Upload className="h-5 w-5" />
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
                  className="flex-1 min-h-0 rounded-md border-2 border-dashed border-border hover:border-foreground/40 transition-colors flex flex-col items-center justify-center gap-2.5 cursor-pointer bg-muted/20 px-6 text-center"
                >
                  {uploadedAudioScript ? (
                    <>
                      <div className="h-11 w-11 rounded-full bg-background flex items-center justify-center shadow-sm">
                        <AudioLines className="h-5 w-5" />
                      </div>
                      <svg viewBox="0 0 200 28" className="w-full max-w-[260px] h-6" aria-hidden>
                        {Array.from({ length: 40 }).map((_, i) => {
                          const h = 4 + Math.abs(Math.sin(i * 0.7)) * 18 + (i % 3) * 2;
                          return (
                            <rect
                              key={i}
                              x={i * 5}
                              y={(28 - h) / 2}
                              width={2.5}
                              height={h}
                              rx={1}
                              className="fill-foreground/70"
                            />
                          );
                        })}
                      </svg>
                      <div className="text-sm font-medium">{uploadedAudioScript}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedAudioScript(null);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="h-11 w-11 rounded-full bg-background flex items-center justify-center shadow-sm">
                        <AudioLines className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-medium">Upload an audio recording</div>
                      <div className="text-[11px] text-muted-foreground max-w-sm">
                        Drop a lecture, podcast, or take. We'll transcribe it and use the script to cut your scenes.
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

            <div className="px-4 py-2 border-t border-border/60 flex items-center justify-between text-xs shrink-0">
              <button
                onClick={() => {
                  setSourceTab("paste");
                  setSourceText(SAMPLE_TEXT);
                  setUploadedDoc(null);
                }}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Sparkles className="h-3 w-3 text-primary" /> Use sample (SWOT)
              </button>
              <span className="text-muted-foreground tabular-nums">
                {sourceText.length.toLocaleString()} chars
              </span>
            </div>
          </Card>

          {/* RIGHT — grouped Style / Motion / Voice */}
          <Card className="overflow-hidden border-border/70 shadow-sm flex flex-col min-h-0 divide-y divide-border/60">
            {/* STYLE — large live preview + picker strip */}
            <div className="px-4 py-3 flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between">
                <RowLabel>Style</RowLabel>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => templateInputRef.current?.click()}
                      className={cn(
                        "shrink-0 h-7 px-2.5 rounded-md border inline-flex items-center gap-1.5 text-[11px] transition-colors",
                        customTemplate
                          ? "border-foreground bg-muted/40 text-foreground"
                          : "border-dashed border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {customTemplate ? (
                        <>
                          <LayoutTemplate className="h-3.5 w-3.5" />
                          <span className="max-w-[90px] truncate">{customTemplate}</span>
                          <X
                            className="h-3 w-3 hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomTemplate(null);
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" /> Upload template
                        </>
                      )}
                      <input
                        ref={templateInputRef}
                        type="file"
                        accept=".pptx,.key,.pdf,image/*"
                        className="hidden"
                        onChange={handleTemplateUpload}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-[11px]">
                    Upload your own template (.pptx, .key, .pdf)
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-stretch gap-3">
                {/* Big live preview of the selected theme */}
                {(() => {
                  const t = THEME_LIST.find((x) => x.id === themeId) ?? THEME_LIST[0];
                  return (
                    <div
                      className="relative rounded-md overflow-hidden border border-border shrink-0 aspect-[16/9] w-[200px]"
                      style={{ background: t.bg, color: t.text }}
                    >
                      <div className="absolute inset-0 p-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div
                            style={{ fontFamily: t.fontHead, fontWeight: 700, fontSize: 14, lineHeight: 1.1 }}
                          >
                            The Async Advantage
                          </div>
                          <div
                            style={{ fontFamily: t.fontBody, fontSize: 8, lineHeight: 1.3, opacity: 0.75 }}
                          >
                            A short visual essay on focus
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span style={{ width: 24, height: 2, background: t.accent, borderRadius: 1 }} />
                          <span style={{ width: 4, height: 4, borderRadius: 999, background: t.muted, opacity: 0.7 }} />
                          <span style={{ fontFamily: t.fontBody, fontSize: 7, opacity: 0.55, marginLeft: "auto" }}>
                            {t.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Picker grid */}
                <div className="flex-1 min-w-0 grid grid-cols-4 gap-1.5 content-start">
                  {THEME_LIST.map((t) => {
                    const active = themeId === t.id && !customTemplate;
                    return (
                      <Tooltip key={t.id}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              setThemeId(t.id);
                              setCustomTemplate(null);
                            }}
                            className={cn(
                              "relative rounded-md overflow-hidden border transition-all aspect-[16/9]",
                              active
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-border hover:border-foreground/30",
                            )}
                            aria-label={t.name}
                          >
                            <div
                              className="absolute inset-0 p-1 flex flex-col justify-between"
                              style={{ background: t.bg, color: t.text }}
                            >
                              <div
                                style={{ fontFamily: t.fontHead, fontWeight: 700, fontSize: 7, lineHeight: 1 }}
                              >
                                Aa
                              </div>
                              <div className="flex items-center gap-0.5">
                                <span style={{ width: 10, height: 1.5, background: t.accent, borderRadius: 1 }} />
                                <span style={{ width: 2, height: 2, borderRadius: 999, background: t.muted, opacity: 0.6 }} />
                              </div>
                            </div>
                            {active && (
                              <span className="absolute top-0.5 right-0.5 h-3 w-3 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <Check className="h-2 w-2" strokeWidth={3} />
                              </span>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-[11px]">
                          {t.name}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* MOTION — 4 visual preview tiles */}
            <div className="px-4 py-3 flex flex-col gap-2 shrink-0">
              <RowLabel>Motion</RowLabel>
              <div className="grid grid-cols-4 gap-2">
                {MOTION_OPTIONS.map((m) => {
                  const active = motion === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMotion(m.id)}
                      className={cn(
                        "group relative rounded-md border overflow-hidden text-left transition-all",
                        active
                          ? "border-foreground ring-1 ring-foreground/20"
                          : "border-border hover:border-foreground/30",
                      )}
                    >
                      <div className="aspect-[16/9] bg-muted/40 relative overflow-hidden">
                        <MotionPreview id={m.id} />
                        {active && (
                          <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-foreground text-background flex items-center justify-center">
                            <Check className="h-2 w-2" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <div className="px-2 py-1.5 border-t border-border/60">
                        <div className="text-[12px] font-medium leading-none">{m.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight truncate">
                          {m.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* VOICE */}
            <div className="px-4 py-3 flex flex-col gap-2.5 flex-1 min-h-0">
              <div className="flex items-center gap-3">
                <RowLabel>Voice</RowLabel>
                <div className="inline-flex p-0.5 rounded-md bg-muted text-xs">
                  {([
                    { id: "ai", label: "AI voice over", icon: Sparkles },
                    { id: "upload", label: "My recording", icon: Mic },
                  ] as const).map((m) => {
                    const Icon = m.icon;
                    const active = voiceMode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setVoiceMode(m.id)}
                        className={cn(
                          "px-2.5 h-7 rounded-[5px] inline-flex items-center gap-1.5 transition-colors text-xs",
                          active
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {voiceMode === "ai" ? (
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Voice picker */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-semibold text-foreground shrink-0"
                      style={{ background: voiceGradient(selectedVoiceName) }}
                    >
                      {selectedVoiceName[0]}
                    </div>
                    <Select value={voice} onValueChange={setVoice}>
                      <SelectTrigger className="h-8 min-w-[180px] text-xs">
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
                      className="h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted shrink-0"
                      aria-label={`Preview ${selectedVoiceName}`}
                    >
                      {previewing === voice ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
                    </button>
                  </div>

                  {/* Pace + tone */}
                  <div className="flex items-center gap-2 ml-auto">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex p-0.5 rounded-md bg-muted text-[11px]">
                          {PACE_OPTIONS.map((p) => (
                            <button
                              key={p}
                              onClick={() => setPace(p)}
                              className={cn(
                                "px-2 h-7 rounded-[5px] transition-colors",
                                pace === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-[11px]">Pace</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex p-0.5 rounded-md bg-muted text-[11px]">
                          {TONE_OPTIONS.map((p) => (
                            <button
                              key={p}
                              onClick={() => setTone(p)}
                              className={cn(
                                "px-2 h-7 rounded-[5px] transition-colors",
                                tone === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-[11px]">Tone</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => voiceInputRef.current?.click()}
                  className="rounded-md border-2 border-dashed border-border hover:border-foreground/40 transition-colors px-4 py-3 flex items-center gap-3 cursor-pointer bg-muted/20 text-left"
                >
                  <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center shadow-sm shrink-0">
                    {uploadedVoice ? <AudioLines className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">
                      {uploadedVoice ?? "Upload your voice over"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {uploadedVoice ? "Synced to your scenes" : ".mp3 or .wav — we'll sync scenes to your audio"}
                    </div>
                  </div>
                  {uploadedVoice && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedVoice(null);
                      }}
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
          </Card>
        </main>

        {/* Sticky bottom action bar */}
        <div className="border-t hairline bg-background/85 backdrop-blur shrink-0">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-2.5 flex items-center justify-between gap-4">
            <div className="text-[11px] text-muted-foreground tabular-nums hidden sm:block">
              {canGenerate ? (
                <>
                  <span className="font-medium text-foreground">{wordCount}</span> words ·{" "}
                  <span className="font-medium text-foreground">~{slideEstimate}</span> scenes ·{" "}
                  <span className="font-medium text-foreground">~{minutes} min</span> runtime
                </>
              ) : (
                <span>Add your script or upload a document to continue</span>
              )}
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-[11px] text-muted-foreground hidden md:inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono">↵</kbd>
                to generate
              </span>
              <Button variant="default" size="default" disabled={!canGenerate} onClick={onGenerate}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate video
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

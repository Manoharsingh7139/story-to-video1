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

// Warm deterministic gradient per voice name
const voiceGradient = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 40;
  return `linear-gradient(135deg, hsl(${163 - h * 0.4} 55% 40%), hsl(${42 + h * 0.3} 55% 68%))`;
};

const Eyebrow = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3
    className={cn(
      "font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-emerald/50",
      className,
    )}
  >
    {children}
  </h3>
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
      <div
        className={cn("h-1.5 w-2/3 rounded-sm", active ? "bg-emerald" : "bg-ink-warm/60")}
        style={anim(0)}
      />
      <div className={cn("h-1 w-full rounded-sm", active ? "bg-emerald/40" : "bg-ink-warm/25")} style={anim(1)} />
      <div className={cn("h-1 w-5/6 rounded-sm", active ? "bg-emerald/40" : "bg-ink-warm/25")} style={anim(2)} />
      <div className={cn("h-1 w-3/5 rounded-sm", active ? "bg-gold", "bg-ink-warm/25")} style={anim(3)} />
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
            className="text-xs text-ink-muted hover:text-emerald inline-flex items-center gap-1.5 transition-colors"
          >
            Skip with sample <ArrowRight className="h-3 w-3" />
          </button>
        }
      />

      {/* Page canvas — cream background */}
      <div className="flex-1 flex flex-col min-h-0 bg-canvas font-sans text-ink-warm overflow-hidden">
        {/* Hero header */}
        <header className="max-w-[1400px] w-full mx-auto px-8 lg:px-12 pt-8 pb-6 shrink-0">
          <nav className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold tracking-[0.22em] text-gold uppercase">
              New video
            </span>
            <span className="h-px w-8 bg-gold/40" aria-hidden />
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald/70 uppercase tracking-[0.14em]">
              <span>Library</span>
              <ChevronRight className="h-3 w-3 opacity-50" />
              <span className="text-emerald">Draft</span>
            </div>
          </nav>
          <input
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Untitled video"
            className={cn(
              "w-full bg-transparent border-none outline-none",
              "font-display italic text-emerald text-[44px] md:text-[56px] leading-[1.02] tracking-tight",
              "placeholder:text-emerald/25",
              "focus:ring-0",
              "border-b border-transparent focus:border-gold/60 transition-colors pb-1",
            )}
          />
        </header>

        {/* Main split canvas */}
        <main className="flex-1 min-h-0 max-w-[1400px] w-full mx-auto px-8 lg:px-12 pb-24 grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 items-stretch">
          {/* LEFT — Script paper */}
          <section className="flex flex-col min-h-0">
            <div className="flex-1 min-h-0 rounded-[20px] bg-panel/50 border border-emerald/[0.08] shadow-[0_2px_20px_-8px_hsl(163_40%_20%_/_0.08)] flex flex-col overflow-hidden">
              {/* Tabs */}
              <div className="flex items-center gap-8 px-8 pt-6 pb-3 border-b border-emerald/[0.08]">
                {([
                  { id: "paste", label: "Paste Script", icon: FileText },
                  { id: "upload", label: "Document", icon: FileUp },
                  { id: "audio", label: "Audio Link", icon: AudioLines },
                ] as const).map((t) => {
                  const active = sourceTab === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSourceTab(t.id as SourceTab)}
                      className={cn(
                        "relative pb-3 text-sm font-medium inline-flex items-center gap-2 transition-colors",
                        active ? "text-emerald" : "text-ink-muted/70 hover:text-emerald",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {t.label}
                      <span
                        className={cn(
                          "absolute -bottom-px left-0 h-[2px] bg-emerald origin-left transition-transform duration-300",
                          active ? "w-full scale-x-100" : "w-full scale-x-0",
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Body */}
              <div className="flex-1 min-h-0 px-8 py-6 relative flex flex-col">
                {sourceTab === "paste" && (
                  <>
                    <textarea
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      placeholder="In the future of work, alignment doesn't happen in real-time…"
                      className={cn(
                        "flex-1 min-h-0 w-full bg-transparent resize-none focus:outline-none",
                        "font-sans text-[16px] leading-[1.75] text-ink-warm/90",
                        "placeholder:text-emerald/25 placeholder:italic placeholder:font-display placeholder:text-[20px]",
                      )}
                    />
                    {/* Sample chip — floats bottom-left when empty */}
                    {isEmpty && (
                      <button
                        onClick={() => setSourceText(SAMPLE_TEXT)}
                        className="absolute bottom-6 left-8 group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-paper-white border border-gold/25 shadow-sm hover:border-gold hover:-translate-y-0.5 transition-all"
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-60" />
                          <span className="relative rounded-full h-1.5 w-1.5 bg-gold" />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
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
                      "flex-1 min-h-0 rounded-2xl border-2 border-dashed border-emerald/15 hover:border-gold/60",
                      "flex flex-col items-center justify-center gap-3 text-center px-6",
                      "bg-paper-white/40 hover:bg-paper-white/70 transition-all group",
                    )}
                  >
                    {uploadedDoc ? (
                      <>
                        <div className="h-12 w-12 rounded-full bg-paper-white flex items-center justify-center shadow-sm">
                          <FileText className="h-5 w-5 text-emerald" />
                        </div>
                        <div className="text-sm font-medium text-ink-warm">{uploadedDoc}</div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setUploadedDoc(null); }}
                          className="text-xs text-ink-muted hover:text-emerald inline-flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="h-12 w-12 rounded-full bg-paper-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                          <Upload className="h-5 w-5 text-emerald" />
                        </div>
                        <div className="text-sm font-medium text-ink-warm">Drop a file or click to browse</div>
                        <div className="text-[11px] text-ink-muted">.pdf, .docx, .txt — up to 20 MB</div>
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
                      "flex-1 min-h-0 rounded-2xl border-2 border-dashed border-emerald/15 hover:border-gold/60",
                      "flex flex-col items-center justify-center gap-3 text-center px-6",
                      "bg-paper-white/40 hover:bg-paper-white/70 transition-all group",
                    )}
                  >
                    <div className="h-12 w-12 rounded-full bg-paper-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <AudioLines className="h-5 w-5 text-emerald" />
                    </div>
                    {uploadedAudioScript ? (
                      <>
                        <svg viewBox="0 0 200 28" className="w-full max-w-[260px] h-6" aria-hidden>
                          {Array.from({ length: 40 }).map((_, i) => {
                            const h = 4 + Math.abs(Math.sin(i * 0.7)) * 18 + (i % 3) * 2;
                            return (
                              <rect key={i} x={i * 5} y={(28 - h) / 2} width={2.5} height={h} rx={1} className="fill-emerald/70" />
                            );
                          })}
                        </svg>
                        <div className="text-sm font-medium text-ink-warm">{uploadedAudioScript}</div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setUploadedAudioScript(null); }}
                          className="text-xs text-ink-muted hover:text-emerald inline-flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-ink-warm">Upload an audio recording</div>
                        <div className="text-[11px] text-ink-muted max-w-sm">
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

                {/* char counter */}
                {sourceTab === "paste" && (
                  <div className="flex justify-end pt-3 shrink-0">
                    <span className="text-[10px] font-mono font-medium tracking-tight text-ink-muted/60 uppercase tabular-nums">
                      {charCount.toLocaleString()} / {CHAR_MAX.toLocaleString()} characters
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT — Studio rail */}
          <aside className="flex flex-col gap-8 min-h-0 overflow-y-auto pr-1 -mr-1 studio-rail">
            {/* Visual Style */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Eyebrow>Visual Style</Eyebrow>
                <span className="text-[10px] text-ink-muted/60 font-medium">{activeTheme.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {THEME_LIST.slice(0, 3).map((t) => {
                  const active = themeId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      className={cn(
                        "group relative aspect-[4/5] rounded-xl overflow-hidden border transition-all",
                        active
                          ? "border-emerald ring-2 ring-emerald/20 shadow-[0_8px_24px_-12px_hsl(163_80%_20%_/_0.4)]"
                          : "border-emerald/[0.08] hover:border-gold hover:-translate-y-0.5",
                      )}
                      aria-label={t.name}
                    >
                      <div
                        className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
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
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                        <span className="text-[10px] font-bold text-white tracking-widest uppercase">
                          {t.name}
                        </span>
                      </div>
                      {active && (
                        <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-emerald text-white flex items-center justify-center shadow-md">
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Motion Presets */}
            <div>
              <Eyebrow className="mb-3">Motion Presets</Eyebrow>
              <div className="grid grid-cols-2 gap-2.5">
                {MOTION_OPTIONS.map((m) => {
                  const active = motion === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMotion(m.id)}
                      className={cn(
                        "group relative flex flex-col rounded-xl border overflow-hidden text-left transition-all",
                        active
                          ? "border-emerald border-2 bg-paper-white shadow-[0_6px_20px_-10px_hsl(163_80%_20%_/_0.3)]"
                          : "border-emerald/[0.08] bg-paper-white hover:border-gold hover:-translate-y-0.5",
                      )}
                    >
                      <div className="relative aspect-[16/9] bg-panel/60 overflow-hidden">
                        <MotionPreview id={m.id} active={active} />
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <div>
                          <div className={cn("text-xs font-semibold", active ? "text-emerald" : "text-ink-warm")}>
                            {m.name}
                          </div>
                          <div className="text-[10px] text-ink-muted/70 mt-0.5 leading-tight truncate">
                            {m.desc}
                          </div>
                        </div>
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full shrink-0 transition-colors",
                            active ? "bg-emerald" : "border border-ink-muted/30 group-hover:bg-gold group-hover:border-gold",
                          )}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Voice */}
            <div className="p-5 bg-panel/40 border border-emerald/[0.08] rounded-2xl space-y-5">
              <div className="flex items-center justify-between">
                <Eyebrow>Voice Synthesis</Eyebrow>
                <div className="inline-flex p-0.5 bg-paper-white/70 rounded-lg border border-emerald/[0.06]">
                  {([
                    { id: "ai", label: "AI VOICE", icon: Sparkles },
                    { id: "upload", label: "MY RECORDING", icon: Mic },
                  ] as const).map((m) => {
                    const active = voiceMode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setVoiceMode(m.id)}
                        className={cn(
                          "px-2.5 py-1 text-[9px] font-bold rounded-md transition-all inline-flex items-center gap-1",
                          active
                            ? "bg-paper-white shadow-sm text-emerald"
                            : "text-ink-muted/70 hover:text-emerald",
                        )}
                      >
                        <m.icon className="h-2.5 w-2.5" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {voiceMode === "ai" ? (
                <>
                  {/* Voice picker */}
                  <div className="flex items-center gap-2">
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center text-[12px] font-semibold text-white shadow-sm shrink-0"
                      style={{ background: voiceGradient(selectedVoiceName) }}
                    >
                      {selectedVoiceName[0]}
                    </div>
                    <Select value={voice} onValueChange={setVoice}>
                      <SelectTrigger className="h-9 flex-1 min-w-0 text-xs bg-paper-white border-emerald/[0.08] focus:ring-1 focus:ring-gold">
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
                      className="h-9 w-9 rounded-full bg-paper-white border border-emerald/[0.1] flex items-center justify-center hover:bg-gold-soft hover:border-gold text-emerald shrink-0 transition-all"
                      aria-label={`Preview ${selectedVoiceName}`}
                    >
                      {previewing === voice ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
                    </button>
                  </div>

                  {/* Pace + Tone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[9px] font-bold text-ink-muted/60 uppercase tracking-widest mb-2">Pace</div>
                      <div className="inline-flex p-0.5 bg-paper-white/70 rounded-lg border border-emerald/[0.06] w-full">
                        {PACE_OPTIONS.map((p) => (
                          <button
                            key={p}
                            onClick={() => setPace(p)}
                            className={cn(
                              "flex-1 px-2 py-1 text-[10px] font-semibold rounded-md transition-all",
                              pace === p ? "bg-paper-white shadow-sm text-emerald" : "text-ink-muted/70 hover:text-emerald",
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-ink-muted/60 uppercase tracking-widest mb-2">Tone</div>
                      <div className="inline-flex p-0.5 bg-paper-white/70 rounded-lg border border-emerald/[0.06] w-full">
                        {TONE_OPTIONS.map((p) => (
                          <button
                            key={p}
                            onClick={() => setTone(p)}
                            className={cn(
                              "flex-1 px-2 py-1 text-[10px] font-semibold rounded-md transition-all",
                              tone === p ? "bg-paper-white shadow-sm text-gold" : "text-ink-muted/70 hover:text-gold",
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
                  className="w-full rounded-xl border-2 border-dashed border-emerald/15 hover:border-gold px-4 py-4 flex items-center gap-3 cursor-pointer bg-paper-white/40 text-left transition-all"
                >
                  <div className="h-9 w-9 rounded-full bg-paper-white flex items-center justify-center shadow-sm shrink-0">
                    {uploadedVoice ? <AudioLines className="h-4 w-4 text-emerald" /> : <Mic className="h-4 w-4 text-emerald" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate text-ink-warm">
                      {uploadedVoice ?? "Upload your voice over"}
                    </div>
                    <div className="text-[11px] text-ink-muted/80">
                      {uploadedVoice ? "Synced to your scenes" : "Drop a lecture, podcast, or take."}
                    </div>
                  </div>
                  {uploadedVoice && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setUploadedVoice(null); }}
                      className="text-ink-muted hover:text-emerald p-1"
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
        <footer className="fixed bottom-0 left-0 right-0 z-30 bg-canvas/85 backdrop-blur-xl border-t border-emerald/[0.08]">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Metric label="Words" value={wordCount.toLocaleString()} />
              <span className="w-px h-8 bg-emerald/10" />
              <Metric label="Scenes" value={`~${slideEstimate}`} />
              <span className="w-px h-8 bg-emerald/10 hidden sm:block" />
              <Metric label="Runtime" value={`~${minutes} min`} className="hidden sm:flex" />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-ink-muted/70 hidden md:inline-flex items-center gap-1 font-medium">
                <kbd className="px-1.5 py-0.5 rounded border border-emerald/15 bg-paper-white text-[10px] font-mono">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-emerald/15 bg-paper-white text-[10px] font-mono">↵</kbd>
                to generate
              </span>
              <Button
                disabled={!canGenerate}
                onClick={onGenerate}
                className={cn(
                  "group relative overflow-hidden rounded-full px-8 py-6 h-auto",
                  "bg-emerald hover:bg-emerald-deep text-white",
                  "shadow-[0_10px_30px_-10px_hsl(163_80%_20%_/_0.5)] hover:shadow-[0_14px_40px_-12px_hsl(163_80%_20%_/_0.6)]",
                  "transition-all active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-emerald disabled:cursor-not-allowed",
                )}
              >
                <span className="relative z-10 text-sm font-semibold tracking-wide inline-flex items-center gap-3">
                  Generate Video
                  <span className="h-6 w-6 rounded-full bg-gold flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="h-3 w-3 text-emerald-deep" strokeWidth={3} />
                  </span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-emerald via-emerald-deep to-emerald translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
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
    <div className={cn("flex flex-col", className)}>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-muted/60">
        {label}
      </span>
      <span className="text-sm font-semibold text-emerald tabular-nums font-display">{value}</span>
    </div>
  );
}

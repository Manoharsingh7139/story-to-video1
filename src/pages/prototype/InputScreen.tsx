import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
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
  Plus,
  X,
  ArrowRight,
  Play,
  Pause,
  Link as LinkIcon,
  AudioLines,
} from "lucide-react";

type SourceTab = "paste" | "upload" | "audio";

const PACE_OPTIONS = ["Slow", "Normal", "Fast"] as const;
const TONE_OPTIONS = ["Neutral", "Warm", "Energetic"] as const;

// Deterministic pastel gradient per voice name
const voiceGradient = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `linear-gradient(135deg, hsl(${h} 70% 78%), hsl(${(h + 40) % 360} 75% 62%))`;
};

const Eyebrow = ({ children, hint }: { children: React.ReactNode; hint?: string }) => (
  <div className="flex items-end justify-between mb-3">
    <div>
      <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">{children}</div>
    </div>
    {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
  </div>
);

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
  const [previewing, setPreviewing] = useState<string | null>(null);

  useEffect(() => {
    if (!sourceText) setSourceText(SAMPLE_TEXT);
    if (!projectTitle || projectTitle === "Untitled video") setProjectTitle("The Async Advantage");
  }, []);

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
      // Prototype: pretend we transcribed the audio into the source text.
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

  const onGenerate = () => canGenerate && navigate("/generating");

  // ⌘/Ctrl+Enter to generate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onGenerate();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canGenerate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-32">
      {/* Header */}
      <header className="border-b border-border/60 backdrop-blur bg-background/70 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-background" />
            </div>
            <span className="font-semibold tracking-tight">Reel</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-xs text-muted-foreground">Step 1 of 2 — Setup</span>
          </div>
          <button
            onClick={() => navigate("/generating")}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
          >
            Skip with sample <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </header>

      {/* Hero / inline title */}
      <section className="max-w-6xl mx-auto px-8 pt-12 pb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-2">
          New presentation
        </div>
        <input
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-4xl md:text-5xl font-semibold tracking-tight placeholder:text-muted-foreground/40 focus:ring-0"
          placeholder="Untitled video"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Give your video a name. You can change it anytime.
        </p>
      </section>

      {/* Two-column body */}
      <main className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6">
        {/* LEFT — SOURCE */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: "60ms" }}>
          <Card className="overflow-hidden border-border/70 shadow-sm">
            <div className="px-5 pt-5">
              <Eyebrow hint={`${wordCount} words · ~${slideEstimate} slides · ~${minutes} min video`}>Source</Eyebrow>

              {/* Tabs */}
              <div className="inline-flex p-0.5 rounded-md bg-muted text-xs">
                {([
                  { id: "paste", label: "Paste text", icon: FileText },
                  { id: "upload", label: "Upload document", icon: FileUp },
                  { id: "url", label: "From URL", icon: LinkIcon, soon: true },
                ] as const).map((t) => {
                  const Icon = t.icon;
                  const active = sourceTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSourceTab(t.id as SourceTab)}
                      className={`px-3 h-8 rounded-[5px] inline-flex items-center gap-1.5 transition-colors ${
                        active ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {t.label}
                      {"soon" in t && t.soon && (
                        <span className="ml-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted-foreground/10 text-muted-foreground">
                          soon
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-5">
              {sourceTab === "paste" && (
                <Textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Paste an article, brief, lecture transcript, or chapter notes…"
                  className="min-h-[280px] resize-none border-border/60 text-[15px] leading-relaxed focus-visible:ring-1"
                />
              )}

              {sourceTab === "upload" && (
                <div
                  onClick={() => docInputRef.current?.click()}
                  className="min-h-[280px] rounded-md border-2 border-dashed border-border hover:border-foreground/40 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer bg-muted/20"
                >
                  {uploadedDoc ? (
                    <>
                      <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
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
                      <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-medium">Drop a file or click to browse</div>
                      <div className="text-xs text-muted-foreground">.pdf, .docx, .txt — up to 20 MB</div>
                    </>
                  )}
                  <input
                    ref={docInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={handleDocUpload}
                  />
                </div>
              )}

              {sourceTab === "url" && (
                <div className="min-h-[280px] rounded-md border border-dashed border-border flex flex-col items-center justify-center gap-2 bg-muted/20 text-center px-8">
                  <LinkIcon className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm font-medium">Import from a web page</div>
                  <div className="text-xs text-muted-foreground max-w-sm">
                    Paste any article, blog post, or documentation URL and we'll pull in the text. Coming soon.
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => {
                    setSourceTab("paste");
                    setSourceText(SAMPLE_TEXT);
                    setUploadedDoc(null);
                  }}
                  className="text-xs inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-muted hover:bg-muted/70 text-foreground"
                >
                  <Sparkles className="h-3 w-3" /> Use sample (SWOT)
                </button>
                <div className="text-xs text-muted-foreground tabular-nums">
                  {wordCount} words · ~{slideEstimate} slides
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT — LOOK + VOICE */}
        <div
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
          style={{ animationDelay: "120ms" }}
        >
          {/* LOOK */}
          <Card className="border-border/70 shadow-sm">
            <div className="p-5">
              <Eyebrow hint="Fonts, colors, and slide style">Look</Eyebrow>

              <div className="grid grid-cols-2 gap-3">
                {THEME_LIST.map((t) => {
                  const active = themeId === t.id && !customTemplate;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setThemeId(t.id);
                        setCustomTemplate(null);
                      }}
                      className={`relative text-left rounded-lg overflow-hidden border transition-all ${
                        active
                          ? "border-foreground ring-2 ring-foreground/10"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      {/* Mini slide preview using the theme tokens */}
                      <div
                        className="aspect-[4/3] p-4 flex flex-col justify-between"
                        style={{ background: t.bg, color: t.text }}
                      >
                        <div
                          style={{
                            fontFamily: t.fontHead,
                            fontWeight: 700,
                            fontSize: 15,
                            lineHeight: 1.15,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          A bigger idea,
                          <br />
                          told well.
                        </div>
                        <div className="space-y-1.5">
                          <div style={{ width: 28, height: 3, background: t.accent, borderRadius: 2 }} />
                          <div className="flex items-center gap-1.5" style={{ fontFamily: t.fontBody, fontSize: 9 }}>
                            <span style={{ width: 4, height: 4, borderRadius: 999, background: t.accent }} />
                            <span style={{ color: t.muted }}>Clear, structured slides</span>
                          </div>
                          <div className="flex items-center gap-1.5" style={{ fontFamily: t.fontBody, fontSize: 9 }}>
                            <span style={{ width: 4, height: 4, borderRadius: 999, background: t.accent }} />
                            <span style={{ color: t.muted }}>Designed for teaching</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-2 flex items-center justify-between bg-card border-t border-border/60">
                        <span className="text-xs font-medium">{t.name}</span>
                        {active && (
                          <span className="h-4 w-4 rounded-full bg-foreground text-background flex items-center justify-center">
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom template */}
              <button
                onClick={() => templateInputRef.current?.click()}
                className={`mt-3 w-full rounded-lg border border-dashed px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  customTemplate ? "border-foreground bg-muted/40" : "border-border hover:border-foreground/40"
                }`}
              >
                <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                  {customTemplate ? <Check className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {customTemplate ?? "Upload your own template"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {customTemplate
                      ? "We'll match its fonts, colors, and layout."
                      : ".pptx, .key, .pdf, or an image"}
                  </div>
                </div>
                {customTemplate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setCustomTemplate(null);
                    }}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <input
                  ref={templateInputRef}
                  type="file"
                  accept=".pptx,.key,.pdf,image/*"
                  className="hidden"
                  onChange={handleTemplateUpload}
                />
              </button>
            </div>
          </Card>

          {/* VOICE */}
          <Card className="border-border/70 shadow-sm">
            <div className="p-5">
              <Eyebrow hint="Choose how it sounds">Voice</Eyebrow>

              {/* Mode segmented */}
              <div className="inline-flex p-0.5 rounded-md bg-muted text-xs mb-4">
                {([
                  { id: "ai", label: "AI voice", icon: Sparkles },
                  { id: "upload", label: "My recording", icon: Mic },
                ] as const).map((m) => {
                  const Icon = m.icon;
                  const active = voiceMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setVoiceMode(m.id)}
                      className={`px-3 h-8 rounded-[5px] inline-flex items-center gap-1.5 transition-colors ${
                        active ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {voiceMode === "ai" ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {VOICES.slice(0, 6).map((v) => {
                      const [name, desc] = v.split(" — ");
                      const active = voice === v;
                      const isPlaying = previewing === v;
                      return (
                        <button
                          key={v}
                          onClick={() => setVoice(v)}
                          className={`group relative rounded-lg border p-2.5 flex items-center gap-2.5 text-left transition-all ${
                            active
                              ? "border-foreground bg-muted/40 ring-2 ring-foreground/10"
                              : "border-border hover:border-foreground/30"
                          }`}
                        >
                          <div
                            className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                            style={{ background: voiceGradient(name) }}
                          >
                            {name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{name}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{desc}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playPreview(v);
                            }}
                            className="h-7 w-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted shrink-0"
                            aria-label={`Preview ${name}`}
                          >
                            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
                          </button>
                          {active && (
                            <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded-full bg-foreground text-background flex items-center justify-center">
                              <Check className="h-2 w-2" strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Pace + tone */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                        Pace
                      </div>
                      <div className="inline-flex w-full p-0.5 rounded-md bg-muted text-xs">
                        {PACE_OPTIONS.map((p) => (
                          <button
                            key={p}
                            onClick={() => setPace(p)}
                            className={`flex-1 h-7 rounded-[5px] transition-colors ${
                              pace === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                        Tone
                      </div>
                      <div className="inline-flex w-full p-0.5 rounded-md bg-muted text-xs">
                        {TONE_OPTIONS.map((p) => (
                          <button
                            key={p}
                            onClick={() => setTone(p)}
                            className={`flex-1 h-7 rounded-[5px] transition-colors ${
                              tone === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-muted-foreground">
                    Language: English (US) · 9 more available in editor
                  </div>
                </>
              ) : (
                <div>
                  <div
                    onClick={() => voiceInputRef.current?.click()}
                    className="rounded-lg border-2 border-dashed border-border hover:border-foreground/40 transition-colors p-5 flex flex-col items-center justify-center gap-3 cursor-pointer bg-muted/20 min-h-[180px]"
                  >
                    {uploadedVoice ? (
                      <>
                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                          <AudioLines className="h-5 w-5" />
                        </div>
                        {/* Waveform placeholder */}
                        <svg viewBox="0 0 200 28" className="w-full max-w-[260px] h-7" aria-hidden>
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
                        <div className="text-sm font-medium">{uploadedVoice}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedVoice(null);
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                          <Mic className="h-5 w-5" />
                        </div>
                        <div className="text-sm font-medium">Upload your voiceover</div>
                        <div className="text-xs text-muted-foreground">
                          .mp3 or .wav — we'll sync slides to your audio
                        </div>
                      </>
                    )}
                    <input
                      ref={voiceInputRef}
                      type="file"
                      accept="audio/mpeg,audio/wav,.mp3,.wav"
                      className="hidden"
                      onChange={handleVoiceUpload}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur">
        <div className="max-w-6xl mx-auto px-8 py-3 flex items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground tabular-nums hidden sm:block">
            <span className="font-medium text-foreground">{wordCount}</span> words ·{" "}
            <span className="font-medium text-foreground">~{slideEstimate}</span> slides ·{" "}
            <span className="font-medium text-foreground">~{minutes} min</span> video
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-[11px] text-muted-foreground hidden md:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono">↵</kbd>
              to generate
            </span>
            <Button size="lg" disabled={!canGenerate} onClick={onGenerate} className="h-11 px-5">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate presentation
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        {!canGenerate && (
          <div className="max-w-6xl mx-auto px-8 pb-2 -mt-1 text-[11px] text-muted-foreground text-right">
            Add some text or upload a document to continue
          </div>
        )}
      </div>
    </div>
  );
}

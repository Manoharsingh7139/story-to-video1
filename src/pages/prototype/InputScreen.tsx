import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { usePrototypeStore } from "@/lib/prototype/store";
import { SAMPLE_TEXT } from "@/lib/prototype/sampleDeck";
import { THEME_LIST } from "@/lib/prototype/themes";
import { Sparkles, FileText, Check, Upload, Mic, FileUp, Plus, X } from "lucide-react";

export default function InputScreen() {
  const navigate = useNavigate();
  const { sourceText, projectTitle, themeId, setSourceText, setProjectTitle, setThemeId } = usePrototypeStore();

  const docInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);

  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);
  const [uploadedVoice, setUploadedVoice] = useState<string | null>(null);
  const [customTemplate, setCustomTemplate] = useState<string | null>(null);

  useEffect(() => {
    if (!sourceText) setSourceText(SAMPLE_TEXT);
    if (!projectTitle || projectTitle === "Untitled video") setProjectTitle("The Async Advantage");
  }, []);

  const canGenerate = sourceText.trim().length > 20 || !!uploadedDoc;

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDoc(file.name);
      // Prototype: pretend we extracted the text
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-background" />
            </div>
            <span className="font-semibold tracking-tight">Reel</span>
          </div>
          <span className="text-xs text-muted-foreground">Prototype</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="space-y-8">
          <div>
            <label className="text-sm font-medium mb-2 block">Project title</label>
            <Input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="My video"
              className="h-11"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Your text</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSourceText(SAMPLE_TEXT)}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <FileText className="h-3 w-3" /> Use sample
                </button>
                <button
                  onClick={() => docInputRef.current?.click()}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <FileUp className="h-3 w-3" /> Upload Word / PDF
                </button>
                <input
                  ref={docInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={handleDocUpload}
                />
              </div>
            </div>
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste an article, brief, or transcript… or upload a Word / PDF document above."
              className="min-h-[200px] resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {sourceText.trim().split(/\s+/).filter(Boolean).length} words · ~
                {Math.max(1, Math.round(sourceText.trim().split(/\s+/).filter(Boolean).length / 80))} slides
              </p>
              {uploadedDoc && (
                <span className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted">
                  <FileText className="h-3 w-3" /> {uploadedDoc}
                  <button onClick={() => setUploadedDoc(null)} className="ml-1 hover:text-foreground text-muted-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Voiceover (optional)</label>
            <Card
              onClick={() => voiceInputRef.current?.click()}
              className="cursor-pointer border-dashed hover:border-foreground/40 transition-colors p-4 flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                <Mic className="h-4 w-4" />
              </div>
              <div className="flex-1">
                {uploadedVoice ? (
                  <>
                    <div className="text-sm font-medium">{uploadedVoice}</div>
                    <div className="text-xs text-muted-foreground">Click to replace · we'll sync slides to your audio</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-medium">Upload your own voiceover (MP3)</div>
                    <div className="text-xs text-muted-foreground">Skip the AI voice and use your recording instead</div>
                  </>
                )}
              </div>
              {uploadedVoice && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedVoice(null);
                  }}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <input
                ref={voiceInputRef}
                type="file"
                accept="audio/mpeg,audio/mp3,.mp3"
                className="hidden"
                onChange={handleVoiceUpload}
              />
            </Card>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {THEME_LIST.map((t) => {
                const active = themeId === t.id && !customTemplate;
                return (
                  <Card
                    key={t.id}
                    onClick={() => {
                      setThemeId(t.id);
                      setCustomTemplate(null);
                    }}
                    className={`relative cursor-pointer overflow-hidden transition-all ${
                      active ? "ring-2 ring-foreground" : "hover:ring-1 hover:ring-border"
                    }`}
                  >
                    <div className="aspect-[16/10] flex flex-col justify-between p-4" style={{ background: t.bg }}>
                      <div
                        style={{ fontFamily: t.fontHead, color: t.text, fontWeight: 700, fontSize: 16, lineHeight: 1.1 }}
                      >
                        Big idea
                      </div>
                      <div className="flex items-end justify-between">
                        <div style={{ width: 24, height: 4, background: t.accent }} />
                        <div className="flex gap-1">
                          <div style={{ width: 8, height: 8, borderRadius: 999, background: t.accent }} />
                          <div style={{ width: 8, height: 8, borderRadius: 999, background: t.muted }} />
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between bg-card">
                      <span className="text-sm font-medium">{t.name}</span>
                      {active && <Check className="h-4 w-4" />}
                    </div>
                  </Card>
                );
              })}

              {/* Custom template upload tile */}
              <Card
                onClick={() => templateInputRef.current?.click()}
                className={`relative cursor-pointer overflow-hidden transition-all border-dashed ${
                  customTemplate ? "ring-2 ring-foreground" : "hover:ring-1 hover:ring-border"
                }`}
              >
                <div className="aspect-[16/10] flex flex-col items-center justify-center p-4 bg-muted/40 gap-2">
                  {customTemplate ? (
                    <>
                      <Check className="h-5 w-5" />
                      <div className="text-xs text-center px-2 truncate max-w-full font-medium">{customTemplate}</div>
                    </>
                  ) : (
                    <>
                      <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center">
                        <Plus className="h-4 w-4" />
                      </div>
                      <div className="text-xs text-muted-foreground text-center px-2">Upload your own template</div>
                    </>
                  )}
                </div>
                <div className="px-3 py-2 flex items-center justify-between bg-card">
                  <span className="text-sm font-medium inline-flex items-center gap-1">
                    <Upload className="h-3 w-3" /> Custom
                  </span>
                  {customTemplate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomTemplate(null);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <input
                  ref={templateInputRef}
                  type="file"
                  accept=".pptx,.key,.pdf,image/*"
                  className="hidden"
                  onChange={handleTemplateUpload}
                />
              </Card>
            </div>
            {customTemplate && (
              <p className="text-xs text-muted-foreground mt-2">
                We'll match your template's fonts, colors, and layout style.
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button
              size="lg"
              className="w-full h-12 text-base"
              disabled={!canGenerate}
              onClick={() => navigate("/generating")}
            >
              <Sparkles className="h-4 w-4 mr-2" /> Generate presentation
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

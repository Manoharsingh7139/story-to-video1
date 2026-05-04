import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { usePrototypeStore } from "@/lib/prototype/store";
import { SAMPLE_TEXT } from "@/lib/prototype/sampleDeck";
import { THEME_LIST } from "@/lib/prototype/themes";
import { Sparkles, FileText, Check } from "lucide-react";

export default function InputScreen() {
  const navigate = useNavigate();
  const { sourceText, projectTitle, themeId, setSourceText, setProjectTitle, setThemeId } = usePrototypeStore();

  useEffect(() => {
    if (!sourceText) setSourceText(SAMPLE_TEXT);
    if (!projectTitle || projectTitle === "Untitled video") setProjectTitle("The Async Advantage");
  }, []);

  const canGenerate = sourceText.trim().length > 20;

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

      <main className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-semibold tracking-tight mb-3">Turn any text into a narrated video.</h1>
        <p className="text-muted-foreground mb-12 text-lg">
          Paste your text, pick a theme, and we'll generate a presentation with voiceover — ready to edit and export.
        </p>

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
              <button
                onClick={() => setSourceText(SAMPLE_TEXT)}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <FileText className="h-3 w-3" /> Use sample
              </button>
            </div>
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste an article, brief, or transcript…"
              className="min-h-[220px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {sourceText.trim().split(/\s+/).filter(Boolean).length} words · ~
              {Math.max(1, Math.round(sourceText.trim().split(/\s+/).filter(Boolean).length / 80))} slides
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {THEME_LIST.map((t) => {
                const active = themeId === t.id;
                return (
                  <Card
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
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
            </div>
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

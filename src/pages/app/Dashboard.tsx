import { Link, useNavigate } from "react-router-dom";
import { Topbar } from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/useAuth";
import { useProjects } from "@/lib/data/useProjects";
import { useHistoryStore } from "@/lib/data/useHistory";
import { useBrandKit } from "@/lib/data/useBrandKit";
import { TEMPLATES } from "@/lib/data/seedTemplates";
import { EmptyState, LeafIllustration } from "@/components/empty/EmptyState";
import {
  ArrowRight,
  FileText,
  LayoutTemplate,
  Plus,
  Sparkles,
  Check,
  Palette,
  Mic,
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/format";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const greet = (name: string) => {
  const h = new Date().getHours();
  const part = h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return `${part}, ${name.split(" ")[0]}`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const projects = useProjects((s) => s.projects);
  const entries = useHistoryStore((s) => s.entries);
  const { kit } = useBrandKit();
  const [dismissed, setDismissed] = useState<boolean>(() =>
    localStorage.getItem("cs.welcomeDismissed") === "1",
  );

  useEffect(() => {
    if (dismissed) localStorage.setItem("cs.welcomeDismissed", "1");
  }, [dismissed]);

  const recent = projects.slice(0, 4);
  const totalSlides = projects.reduce((n, p) => n + p.slides.length, 0);
  const minutes = Math.max(0, Math.round(totalSlides * 0.4));

  const checklist = [
    { label: "Create your first video", done: projects.length > 0, to: "/app/new" },
    { label: "Set your brand colors", done: !!kit.accentHsl || !!kit.logoDataUrl, to: "/app/brand" },
    { label: "Pick a default voice", done: kit.defaultVoice !== "Aurora", to: "/app/brand" },
  ];
  const showChecklist = !dismissed && checklist.some((c) => !c.done);

  return (
    <>
      <Topbar
        eyebrow="Dashboard"
        title={greet(user?.name ?? "there")}
        actions={
          <Button onClick={() => navigate("/app/new")}>
            <Plus className="h-4 w-4" />
            New video
          </Button>
        }
      />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
          {/* Stats */}
          <section className="grid grid-cols-3 gap-4">
            {[
              { label: "Videos", value: projects.length },
              { label: "Slides", value: totalSlides },
              { label: "Minutes generated", value: minutes },
            ].map((s) => (
              <Card key={s.label} className="p-5 shadow-sm">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">{s.label}</div>
                <div className="font-display text-3xl tracking-[-0.02em]">{s.value}</div>
              </Card>
            ))}
          </section>

          {showChecklist && (
            <section>
              <Card className="p-6 border-primary/20 bg-primary/5 relative overflow-hidden">
                <button
                  onClick={() => setDismissed(true)}
                  className="absolute top-3 right-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  Dismiss
                </button>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <div className="text-[10px] uppercase tracking-[0.18em] text-primary">Get started</div>
                </div>
                <h2 className="font-display text-xl mb-4">Three small steps to your first great video</h2>
                <ul className="space-y-2">
                  {checklist.map((c, i) => {
                    const isNext = !c.done && checklist.slice(0, i).every((x) => x.done);
                    return (
                      <li key={c.label}>
                        <Link
                          to={c.to}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                            c.done ? "border-border bg-background/50 text-muted-foreground" : "border-border bg-background hover:border-primary/40",
                            isNext && "border-primary/50 shadow-sm",
                          )}
                        >
                          <div className={cn(
                            "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                            c.done ? "bg-primary text-primary-foreground" : "border-2 border-primary/40",
                            isNext && !c.done && "animate-pulse-glow",
                          )}>
                            {c.done && <Check className="h-3 w-3" strokeWidth={3} />}
                          </div>
                          <span className={cn("text-sm flex-1", c.done && "line-through")}>{c.label}</span>
                          {!c.done && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </section>
          )}

          {/* Quick start */}
          <section>
            <h2 className="font-display text-xl mb-4">Quick start</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickCard icon={FileText} title="From your text" desc="Paste an article or notes." onClick={() => navigate("/app/new")} />
              <QuickCard icon={LayoutTemplate} title="From a template" desc="Start with a tested structure." onClick={() => navigate("/app/templates")} />
              <QuickCard icon={Mic} title="From a voice idea" desc="Record or upload script." onClick={() => navigate("/app/new")} />
            </div>
          </section>

          {/* Recent */}
          <section>
            <div className="flex items-end justify-between mb-4">
              <h2 className="font-display text-xl">Continue editing</h2>
              {recent.length > 0 && (
                <Link to="/app/library" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                  All projects <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
            {recent.length === 0 ? (
              <Card className="p-0">
                <EmptyState
                  illustration={<LeafIllustration />}
                  eyebrow="Your studio is quiet"
                  title="Let's make your first video."
                  description="Paste any writing — an essay, a doc, a transcript — and we'll turn it into slides with voiceover."
                  actions={
                    <>
                      <Button onClick={() => navigate("/app/new")}><Plus className="h-4 w-4" /> Start from text</Button>
                      <Button variant="outline" onClick={() => navigate("/app/templates")}>Browse templates</Button>
                    </>
                  }
                />
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recent.map((p) => (
                  <Link key={p.id} to={`/app/editor/${p.id}`} className="group">
                    <Card className="overflow-hidden hover:shadow-premium transition-all hover:-translate-y-0.5">
                      <div className="aspect-video bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                        <div className="font-display text-xl px-4 text-center text-primary/80 line-clamp-3">{p.slides[0]?.content?.title ?? p.title}</div>
                      </div>
                      <div className="p-3">
                        <div className="text-sm font-medium truncate">{p.title}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {p.slides.length} slides · {formatDistanceToNow(p.updatedAt)} ago
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recent activity */}
          {entries.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-4">
                <h2 className="font-display text-xl">Recent activity</h2>
                <Link to="/app/history" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                  Full history <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <Card className="divide-y divide-border">
                {entries.slice(0, 5).map((e) => (
                  <div key={e.id} className="px-4 py-3 flex items-center justify-between text-sm">
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span className="truncate">{e.label}</span>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0 ml-3">{formatDistanceToNow(e.at)} ago</div>
                  </div>
                ))}
              </Card>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function QuickCard({ icon: Icon, title, desc, onClick }: { icon: any; title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left">
      <Card className="p-5 h-full hover:border-primary/50 hover:shadow-premium transition-all hover:-translate-y-0.5 group">
        <Icon className="h-5 w-5 text-primary mb-3" />
        <div className="font-medium mb-1">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
        <div className="mt-3 text-xs text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Start <ArrowRight className="h-3 w-3" />
        </div>
      </Card>
    </button>
  );
}

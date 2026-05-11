import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Topbar } from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import { useProjects } from "@/lib/data/useProjects";
import { useHistoryStore } from "@/lib/data/useHistory";
import { useBrandKit } from "@/lib/data/useBrandKit";
import { EmptyState, StudioIllustration } from "@/components/empty/EmptyState";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { MetricRow } from "@/components/editorial/MetricRow";
import { HoverPreviewCard } from "@/components/editorial/HoverPreviewCard";
import {
  ArrowRight,
  Plus,
  Check,
  FileText,
  LayoutTemplate,
  Mic,
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/format";
import { cn } from "@/lib/utils";

const greet = (name: string) => {
  const h = new Date().getHours();
  const part = h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return `${part}, ${name.split(" ")[0]}`;
};

const lede = (count: number) => {
  if (count === 0) return "A blank page is its own kind of opening.";
  if (count === 1) return "One draft underway. Where to next?";
  return `${count} drafts underway. Pick up where you left off.`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const projects = useProjects((s) => s.projects);
  const entries = useHistoryStore((s) => s.entries);
  const { kit } = useBrandKit();
  const [dismissed, setDismissed] = useState<boolean>(
    () => localStorage.getItem("cs.welcomeDismissed") === "1",
  );

  useEffect(() => {
    if (dismissed) localStorage.setItem("cs.welcomeDismissed", "1");
  }, [dismissed]);

  const recent = projects.slice(0, 6);
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
        crumbs={[{ label: "Dashboard" }]}
        actions={
          <Button onClick={() => navigate("/app/new")} size="sm">
            <Plus className="h-4 w-4" />
            New video
          </Button>
        }
      />

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 lg:px-12 py-12 lg:py-16 space-y-16">
          {/* Editorial hero */}
          <EditorialHeader
            eyebrow={
              <>
                <span className="h-px w-6 bg-foreground/30 inline-block" />
                <span>Studio · {new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "short" }).format(new Date())}</span>
              </>
            }
            title={greet(user?.name ?? "there")}
            lede={lede(projects.length)}
            meta={
              <MetricRow
                metrics={[
                  { label: "Videos", value: projects.length },
                  { label: "Slides", value: totalSlides },
                  { label: "Minutes generated", value: minutes },
                ]}
              />
            }
          />

          {/* Get started — horizontal numbered card with hairlines */}
          {showChecklist && (
            <section className="relative">
              <div className="flex items-end justify-between mb-5">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Get started
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dismiss
                </button>
              </div>
              <div className="bg-card border hairline shadow-paper grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-hairline">
                {checklist.map((c, i) => {
                  const isNext = !c.done && checklist.slice(0, i).every((x) => x.done);
                  return (
                    <Link
                      key={c.label}
                      to={c.to}
                      className={cn(
                        "group relative px-6 py-5 flex items-start gap-4 transition-colors",
                        c.done ? "text-muted-foreground" : "hover:bg-foreground/[0.02]",
                      )}
                    >
                      <div
                        className={cn(
                          "font-serif tnum text-2xl leading-none shrink-0 mt-0.5",
                          c.done ? "text-muted-foreground/60 line-through" : "text-ink",
                        )}
                      >
                        0{i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={cn("text-sm font-medium", c.done && "line-through")}>
                          {c.label}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {c.done ? "Done" : isNext ? "Up next" : "Later"}
                        </div>
                      </div>
                      {c.done ? (
                        <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
                      ) : (
                        <ArrowRight
                          className={cn(
                            "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
                            "group-hover:translate-x-1 group-hover:text-foreground",
                          )}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Quick start — asymmetric: 1 hero + 2 supporting */}
          <section>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-5">
              Begin a draft
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <button
                onClick={() => navigate("/app/new")}
                className="md:col-span-8 text-left bg-card border hairline shadow-paper hover:shadow-paper-hover transition-shadow group p-7 lg:p-9 relative overflow-hidden"
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-3">
                  From your text
                </div>
                <div className="editorial-display text-2xl md:text-[28px] text-ink mb-2">
                  Paste your writing.
                </div>
                <div className="font-serif italic text-muted-foreground text-base mb-6">
                  An essay, a doc, a transcript — turned into slides with voice.
                </div>
                {/* faux text field with caret */}
                <div className="bg-background border hairline rounded-md px-3 py-2 text-sm text-muted-foreground/80 max-w-md flex items-center gap-1">
                  <span>Start typing or paste here</span>
                  <span className="inline-block w-px h-4 bg-foreground animate-pulse" />
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary font-medium">
                  Open editor
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              <div className="md:col-span-4 grid grid-cols-1 gap-4">
                <SmallStartCard
                  icon={LayoutTemplate}
                  title="From a template"
                  desc="Pitches, courses, recaps."
                  onClick={() => navigate("/app/templates")}
                />
                <SmallStartCard
                  icon={Mic}
                  title="From a voice idea"
                  desc="Describe it, we draft it."
                  onClick={() => navigate("/app/new")}
                />
              </div>
            </div>
          </section>

          {/* Continue editing */}
          <section>
            <div className="flex items-end justify-between mb-5">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Continue editing
              </div>
              {recent.length > 0 && (
                <Link
                  to="/app/library"
                  className="text-[12px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                >
                  All projects <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
            {recent.length === 0 ? (
              <div className="bg-card border hairline shadow-paper">
                <EmptyState
                  illustration={<StudioIllustration />}
                  eyebrow="Your studio is quiet"
                  title={<>Let's make your <em className="not-italic font-serif italic">first</em> video.</>}
                  description="Paste any writing — an essay, a doc, a transcript — and we'll turn it into slides with voiceover."
                  actions={
                    <>
                      <Button onClick={() => navigate("/app/new")}>
                        <Plus className="h-4 w-4" /> Start from text
                      </Button>
                      <Button variant="outline" onClick={() => navigate("/app/templates")}>
                        Browse templates
                      </Button>
                    </>
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Hero card (most recent) */}
                <div className="md:col-span-7">
                  <HoverPreviewCard
                    project={recent[0]}
                    to={`/app/editor/${recent[0].id}`}
                    size="lg"
                  />
                </div>
                <div className="md:col-span-5 grid grid-cols-2 gap-4">
                  {recent.slice(1, 5).map((p) => (
                    <HoverPreviewCard key={p.id} project={p} to={`/app/editor/${p.id}`} />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Recent activity — quiet hairline list, no card */}
          {entries.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-5">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Recent activity
                </div>
                <Link
                  to="/app/history"
                  className="text-[12px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                >
                  Full history <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <ul className="border-y hairline divide-y divide-hairline">
                {entries.slice(0, 6).map((e) => (
                  <li key={e.id} className="flex items-center gap-4 py-3 text-sm">
                    <span className="h-1 w-1 rounded-full bg-foreground/30 shrink-0" />
                    <span className="truncate flex-1">{e.label}</span>
                    <span className="text-[11px] text-muted-foreground tnum shrink-0">
                      {formatDistanceToNow(e.at)} ago
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function SmallStartCard({
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  icon: any;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-card border hairline shadow-paper hover:shadow-paper-hover transition-shadow group p-5 flex items-start gap-3"
    >
      <Icon className="h-4 w-4 text-primary shrink-0 mt-1" strokeWidth={1.75} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium underline-grow inline">{title}</div>
        <div className="text-[12px] text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-1 mt-1" />
    </button>
  );
}

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
import { HoverPreviewCard } from "@/components/editorial/HoverPreviewCard";
import { KBD } from "@/components/ui/kbd";
import { ArrowRight, Plus } from "lucide-react";
import { formatDistanceToNow } from "@/lib/format";
import { cn } from "@/lib/utils";

const greet = (name: string) => {
  const h = new Date().getHours();
  const part = h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return `${part}, ${name.split(" ")[0]}`;
};

const lede = (count: number) => {
  if (count === 0) return "A blank script is its own kind of opening.";
  if (count === 1) return "One script in production. Where to next?";
  return `${count} scripts in production. Pick up where you left off.`;
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

  const recent = projects.slice(0, 4);
  const totalSlides = projects.reduce((n, p) => n + p.slides.length, 0);

  // One-line "next step" ribbon — only the very next undone item
  const nextStep = (() => {
    if (dismissed) return null;
    if (projects.length === 0) return { label: "Create your first video", to: "/app/new" };
    if (!kit.accentHsl && !kit.logoDataUrl) return { label: "Set your brand colors", to: "/app/brand" };
    if (kit.defaultVoice === "Aurora") return { label: "Pick a default voice", to: "/app/brand" };
    return null;
  })();

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
        <div className="max-w-5xl mx-auto px-8 lg:px-12 py-12 lg:py-14 space-y-12">
          {/* Editorial hero — tighter */}
          <EditorialHeader
            eyebrow={
              <>
                <span className="h-px w-6 bg-foreground/30 inline-block" />
                <span>
                  Studio ·{" "}
                  {new Intl.DateTimeFormat(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  }).format(new Date())}
                </span>
              </>
            }
            title={greet(user?.name ?? "there")}
            lede={lede(projects.length)}
          />

          {/* Next-step ribbon — single line, easy to dismiss */}
          {nextStep && (
            <div className="-mt-6 flex items-center gap-3 text-[12px]">
              <span className="text-muted-foreground uppercase tracking-[0.18em] text-[10px]">
                Next
              </span>
              <Link
                to={nextStep.to}
                className="text-foreground underline-grow inline-flex items-center gap-1 group"
              >
                {nextStep.label}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <span className="h-px flex-1 bg-hairline" />
              <button
                onClick={() => setDismissed(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Primary action row */}
          <section>
            <button
              onClick={() => navigate("/app/new")}
              className={cn(
                "w-full text-left bg-card border hairline shadow-paper hover:shadow-paper-hover",
                "transition-shadow group flex items-center gap-4 px-6 py-5",
              )}
            >
              <span className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Plus className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] font-medium text-ink">New video</span>
                <span className="block font-serif italic text-[13px] text-muted-foreground mt-0.5">
                  Paste your writing — we'll turn it into slides with voice.
                </span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-muted-foreground">
                <KBD>⌘</KBD>
                <KBD>N</KBD>
              </span>
              <Link
                to="/app/templates"
                onClick={(e) => e.stopPropagation()}
                className="hidden md:inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground border-l hairline pl-4 ml-2"
              >
                Use a template
                <ArrowRight className="h-3 w-3" />
              </Link>
            </button>
          </section>

          {/* Continue */}
          <section>
            <div className="flex items-end justify-between mb-5">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Continue
              </div>
              {recent.length > 0 && (
                <Link
                  to="/app/library"
                  className="text-[12px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                >
                  All <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
            {recent.length === 0 ? (
              <div className="bg-card border hairline shadow-paper">
                <EmptyState
                  illustration={<StudioIllustration />}
                  eyebrow="Your studio is quiet"
                  title={
                    <>
                      Let's make your <em className="not-italic font-serif italic">first</em> video.
                    </>
                  }
                  description="Paste any writing — an essay, a doc, a transcript — and we'll turn it into slides with voiceover."
                  actions={
                    <Button onClick={() => navigate("/app/new")}>
                      <Plus className="h-4 w-4" /> Start your first video
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {recent.map((p) => (
                  <HoverPreviewCard key={p.id} project={p} to={`/app/editor/${p.id}`} />
                ))}
              </div>
            )}
          </section>

          {/* Recently — quiet hairline list */}
          {entries.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-5">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Recently
                </div>
                <Link
                  to="/app/history"
                  className="text-[12px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                >
                  Log <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <ul className="border-y hairline divide-y divide-hairline">
                {entries.slice(0, 4).map((e) => (
                  <li key={e.id} className="flex items-center gap-4 py-3 text-sm">
                    <span className="h-1 w-1 rounded-full bg-foreground/30 shrink-0" />
                    <span className="truncate flex-1">{e.label}</span>
                    <span className="text-[11px] text-muted-foreground tnum shrink-0">
                      {formatDistanceToNow(e.at)} ago
                    </span>
                  </li>
                ))}
              </ul>
              {projects.length > 0 && (
                <div className="mt-3 text-[11px] text-muted-foreground tnum">
                  {projects.length} {projects.length === 1 ? "video" : "videos"} · {totalSlides} slides
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}

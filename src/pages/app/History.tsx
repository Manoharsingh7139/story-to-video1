import { Link } from "react-router-dom";
import { Topbar } from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/lib/data/useHistory";
import { EmptyState, LogbookIllustration } from "@/components/empty/EmptyState";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { formatDistanceToNow, groupByDay } from "@/lib/format";
import {
  FilePlus,
  Pencil,
  Sparkles,
  Trash2,
  Copy,
  Palette,
  Download,
  Tag,
} from "lucide-react";
import type { HistoryType } from "@/lib/data/types";

const ICONS: Record<HistoryType, any> = {
  "project.created": FilePlus,
  "project.exported": Download,
  "project.deleted": Trash2,
  "project.duplicated": Copy,
  "project.renamed": Tag,
  "slide.regenerated": Sparkles,
  "slide.edited": Pencil,
  "theme.changed": Palette,
};

const VERBS: Record<HistoryType, string> = {
  "project.created": "created",
  "project.exported": "exported",
  "project.deleted": "deleted",
  "project.duplicated": "duplicated",
  "project.renamed": "renamed",
  "slide.regenerated": "regenerated",
  "slide.edited": "edited",
  "theme.changed": "rethemed",
};

const fmtTime = (ts: number) =>
  new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", hour12: false }).format(ts);

const fmtDate = (label: string, items: { at: number }[]) => {
  if (label === "Today" || label === "Yesterday") {
    return `${label} · ${new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(items[0].at)}`;
  }
  return label;
};

export default function HistoryPage() {
  const entries = useHistoryStore((s) => s.entries);
  const clear = useHistoryStore((s) => s.clear);
  const groups = groupByDay(entries);

  return (
    <>
      <Topbar
        crumbs={[{ label: "History" }]}
        actions={
          entries.length > 0 ? (
            <Button variant="outline" size="sm" onClick={clear}>
              Clear history
            </Button>
          ) : undefined
        }
      />
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-8 lg:px-12 py-12 lg:py-16">
          <EditorialHeader
            eyebrow={
              <>
                <span className="h-px w-6 bg-foreground/30 inline-block" />
                <span>The logbook</span>
              </>
            }
            title="Activity"
            lede="Every regeneration, every edit — recorded so the work shows its hand."
          />

          {entries.length === 0 ? (
            <div className="mt-12 bg-card border hairline shadow-paper">
              <EmptyState
                illustration={<LogbookIllustration />}
                eyebrow="History"
                title={<>Nothing's happened <em className="font-serif italic">yet.</em></>}
                description="Create a video and your activity will appear here — every regeneration, every edit."
              />
            </div>
          ) : (
            <div className="mt-12 space-y-12">
              {groups.map((g) => (
                <section key={g.label}>
                  <div className="flex items-baseline gap-4 mb-5">
                    <h2 className="editorial-display text-2xl text-ink shrink-0">
                      {fmtDate(g.label, g.items)}
                    </h2>
                    <div className="h-px flex-1 bg-hairline" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground tnum">
                      {g.items.length} entries
                    </span>
                  </div>
                  <ul className="border-y hairline divide-y divide-hairline">
                    {g.items.map((e) => {
                      const Icon = ICONS[e.type];
                      return (
                        <li key={e.id} className="flex items-start gap-5 py-4">
                          <span className="text-[11px] text-muted-foreground tnum w-14 shrink-0 pt-0.5">
                            {fmtTime(e.at)}
                          </span>
                          <span className="h-6 w-6 rounded-full border hairline flex items-center justify-center shrink-0 text-foreground/60">
                            <Icon className="h-3 w-3" strokeWidth={1.75} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground/85">
                              <em className="font-serif italic text-ink mr-1">
                                {VERBS[e.type]}
                              </em>
                              {e.label.replace(/^(Created|Renamed to|Deleted|Duplicated|Exported)\s*/i, "")}
                            </p>
                            {e.projectId && e.projectTitle && (
                              <Link
                                to={`/app/editor/${e.projectId}`}
                                className="text-[12px] text-muted-foreground hover:text-primary underline-grow inline mt-0.5"
                              >
                                {e.projectTitle}
                              </Link>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground tnum shrink-0 pt-0.5">
                            {formatDistanceToNow(e.at)} ago
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

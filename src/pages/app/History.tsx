import { Link } from "react-router-dom";
import { Topbar } from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/lib/data/useHistory";
import { useProjects } from "@/lib/data/useProjects";
import { useAuth } from "@/lib/auth/useAuth";
import { EmptyState, LogbookIllustration } from "@/components/empty/EmptyState";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { groupByDay } from "@/lib/format";
import { Layers, User as UserIcon, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HistoryEntry, HistoryType } from "@/lib/data/types";

type StatusKey = "awaiting" | "done" | "processing" | "error";

const STATUS_FOR_TYPE: Record<HistoryType, StatusKey> = {
  "project.created": "awaiting",
  "project.exported": "done",
  "project.deleted": "error",
  "project.duplicated": "done",
  "project.renamed": "processing",
  "slide.regenerated": "processing",
  "slide.edited": "processing",
  "theme.changed": "done",
};

const STATUS_META: Record<
  StatusKey,
  { label: string; icon: any; classes: string }
> = {
  awaiting: {
    label: "Awaiting review",
    icon: Loader2,
    classes: "bg-primary/5 text-primary border-primary/20",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    classes: "bg-primary/5 text-primary border-primary/20",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    classes:
      "bg-emerald-500/5 text-emerald-700 border-emerald-600/20 dark:text-emerald-400",
  },
  error: {
    label: "Error",
    icon: XCircle,
    classes:
      "bg-red-500/5 text-red-700 border-red-600/20 dark:text-red-400",
  },
};

const fmtDateTime = (ts: number) => {
  const d = new Date(ts);
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .toLowerCase();
  return `${date}, ${time}`;
};

const titleFor = (e: HistoryEntry) =>
  e.projectTitle ||
  e.label.replace(/^(Created|Renamed to|Deleted|Duplicated|Exported)\s*/i, "").replace(/[“”"]/g, "").trim() ||
  "Untitled";

interface RowProps {
  entry: HistoryEntry;
  email: string;
  slideCount?: number;
  errorDetail?: string;
}

function HistoryRow({ entry, email, slideCount, errorDetail }: RowProps) {
  const status = STATUS_FOR_TYPE[entry.type];
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  const title = titleFor(entry);

  const Wrap: any = entry.projectId ? Link : "div";
  const wrapProps = entry.projectId
    ? { to: `/app/editor/${entry.projectId}` }
    : {};

  return (
    <Wrap
      {...wrapProps}
      className={cn(
        "group block rounded-xl border hairline bg-card px-5 py-4",
        "transition-all hover:border-foreground/20 hover:shadow-paper",
      )}
    >
      <div className="flex items-center gap-5">
        {/* Status pill */}
        <div
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
            "text-[11px] font-medium tracking-tight",
            meta.classes,
          )}
        >
          <Icon
            className={cn(
              "h-3 w-3",
              (status === "awaiting" || status === "processing") && "animate-spin",
            )}
            strokeWidth={2}
          />
          <span>{meta.label}</span>
        </div>

        {/* Title + meta */}
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] leading-tight text-ink truncate font-medium">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <UserIcon className="h-3 w-3" strokeWidth={1.75} />
            <span className="truncate">{email}</span>
          </div>
          {status === "error" && errorDetail && (
            <p className="mt-1.5 text-[12px] text-red-600/90 dark:text-red-400/90 truncate">
              {errorDetail}
            </p>
          )}
        </div>

        {/* Right meta */}
        <div className="shrink-0 flex items-center gap-5">
          {typeof slideCount === "number" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground tnum">
              <Layers className="h-3 w-3" strokeWidth={1.75} />
              {slideCount}
            </span>
          )}
          <span className="text-[12px] text-muted-foreground tnum whitespace-nowrap">
            {fmtDateTime(entry.at)}
          </span>
        </div>
      </div>
    </Wrap>
  );
}

export default function HistoryPage() {
  const entries = useHistoryStore((s) => s.entries);
  const clear = useHistoryStore((s) => s.clear);
  const projects = useProjects((s) => s.projects);
  const { user } = useAuth();
  const groups = groupByDay(entries);

  const projectsById = new Map(projects.map((p) => [p.id, p]));
  const userEmail = user?.email || "you@studio.app";

  return (
    <>
      <Topbar
        crumbs={[{ label: "History" }]}
      />
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 lg:px-12 py-12 lg:py-16">
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
            <div className="mt-12 bg-card border hairline shadow-paper rounded-xl">
              <EmptyState
                illustration={<LogbookIllustration />}
                eyebrow="History"
                title={<>Nothing's happened <em className="font-serif italic">yet.</em></>}
                description="Create a video and your activity will appear here — every regeneration, every edit."
              />
            </div>
          ) : (
            <div className="mt-12 space-y-10">
              {groups.map((g) => (
                <section key={g.label}>
                  <div className="flex items-baseline gap-4 mb-4">
                    <h2 className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {g.label}
                    </h2>
                    <div className="h-px flex-1 bg-hairline" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground tnum">
                      {g.items.length} {g.items.length === 1 ? "entry" : "entries"}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {g.items.map((e) => {
                      const proj = e.projectId ? projectsById.get(e.projectId) : undefined;
                      return (
                        <HistoryRow
                          key={e.id}
                          entry={e}
                          email={userEmail}
                          slideCount={proj?.slides.length}
                        />
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

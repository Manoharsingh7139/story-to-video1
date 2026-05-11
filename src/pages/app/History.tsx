import { Link } from "react-router-dom";
import { Topbar } from "@/components/app-shell/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/lib/data/useHistory";
import { EmptyState, ClockIllustration } from "@/components/empty/EmptyState";
import { formatDistanceToNow, groupByDay } from "@/lib/format";
import {
  FilePlus, Pencil, Sparkles, Trash2, Copy, Palette, Download, Tag,
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

export default function HistoryPage() {
  const entries = useHistoryStore((s) => s.entries);
  const clear = useHistoryStore((s) => s.clear);
  const groups = groupByDay(entries);

  return (
    <>
      <Topbar
        eyebrow="History"
        title="Activity timeline"
        actions={entries.length > 0 ? (
          <Button variant="outline" size="sm" onClick={clear}>Clear history</Button>
        ) : undefined}
      />
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {entries.length === 0 ? (
            <Card className="p-0">
              <EmptyState
                illustration={<ClockIllustration />}
                eyebrow="History"
                title="Nothing's happened yet."
                description="Create a video and your activity will appear here — every regeneration, every edit."
              />
            </Card>
          ) : (
            <div className="space-y-10">
              {groups.map((g) => (
                <section key={g.label}>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">{g.label}</div>
                  <Card className="divide-y divide-border">
                    {g.items.map((e) => {
                      const Icon = ICONS[e.type];
                      return (
                        <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm">{e.label}</div>
                            {e.projectId && e.projectTitle && (
                              <Link to={`/app/editor/${e.projectId}`} className="text-xs text-primary hover:underline">
                                {e.projectTitle}
                              </Link>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground shrink-0">{formatDistanceToNow(e.at)} ago</div>
                        </div>
                      );
                    })}
                  </Card>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Topbar } from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjects } from "@/lib/data/useProjects";
import { EmptyState, ManuscriptIllustration } from "@/components/empty/EmptyState";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { HoverPreviewCard } from "@/components/editorial/HoverPreviewCard";
import { formatDistanceToNow } from "@/lib/format";
import { THEMES } from "@/lib/prototype/themes";
import {
  Plus,
  Search,
  MoreHorizontal,
  Copy,
  Trash2,
  Pencil,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type SortKey = "recent" | "name" | "slides";
type View = "grid" | "list";

export default function LibraryPage() {
  const navigate = useNavigate();
  const projects = useProjects((s) => s.projects);
  const duplicate = useProjects((s) => s.duplicateProject);
  const remove = useProjects((s) => s.deleteProject);
  const rename = useProjects((s) => s.renameProject);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [view, setView] = useState<View>("grid");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const filtered = useMemo(() => {
    let list = projects.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
    if (sort === "recent") list = [...list].sort((a, b) => b.updatedAt - a.updatedAt);
    if (sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "slides") list = [...list].sort((a, b) => b.slides.length - a.slides.length);
    return list;
  }, [projects, q, sort]);

  const projectMenu = (id: string, title: string) => (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.preventDefault()}
        className="p-1.5 rounded hover:bg-foreground/[0.06] text-muted-foreground hover:text-foreground transition-colors"
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44" onClick={(e) => e.preventDefault()}>
        <DropdownMenuItem onClick={() => navigate(`/app/editor/${id}`)}>Open</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setRenameId(id);
            setRenameValue(title);
          }}
        >
          <Pencil className="h-4 w-4 mr-2" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => duplicate(id)}>
          <Copy className="h-4 w-4 mr-2" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => setConfirmId(id)}>
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <Topbar
        crumbs={[{ label: "Library" }]}
        actions={
          <Button onClick={() => navigate("/app/new")} size="sm">
            <Plus className="h-4 w-4" /> New video
          </Button>
        }
      />

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 lg:px-12 py-12 lg:py-16">
          <EditorialHeader
            eyebrow={
              <>
                <span className="h-px w-6 bg-foreground/30 inline-block" />
                <span>Library · {projects.length} {projects.length === 1 ? "video" : "videos"}</span>
              </>
            }
            title="Your productions"
            lede="Every script, presentation , and finished cut — all in one shelf."
          />

          {projects.length === 0 ? (
            <div className="mt-12 bg-card border hairline shadow-paper">
              <EmptyState
                illustration={<ManuscriptIllustration />}
                eyebrow="Library"
                title={<>Your library is <em className="font-serif italic">quiet.</em></>}
                description="All your generated videos get listed here."
                actions={
                  <Button onClick={() => navigate("/app/new")}>
                    <Plus className="h-4 w-4" /> New video
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="mt-10 flex items-center gap-4 border-b hairline pb-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="h-3.5 w-3.5 absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search videos…"
                    className={cn(
                      "w-full pl-6 pr-2 py-1.5 bg-transparent text-sm outline-none",
                      "border-b border-transparent focus:border-foreground transition-colors",
                      "placeholder:text-muted-foreground/60",
                    )}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <SortChip active={sort === "recent"} onClick={() => setSort("recent")}>Recent</SortChip>
                  <SortChip active={sort === "name"} onClick={() => setSort("name")}>Name</SortChip>
                  <SortChip active={sort === "slides"} onClick={() => setSort("slides")}>Scenes</SortChip>
                </div>
                <div className="flex items-center border hairline rounded-md overflow-hidden ml-2">
                  <button
                    onClick={() => setView("grid")}
                    className={cn(
                      "h-7 w-7 flex items-center justify-center transition-colors",
                      view === "grid" ? "bg-foreground/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={cn(
                      "h-7 w-7 flex items-center justify-center transition-colors border-l hairline",
                      view === "list" ? "bg-foreground/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                    aria-label="List view"
                  >
                    <ListIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-16">
                  No videos match <span className="font-serif italic">"{q}"</span>.
                </p>
              ) : view === "grid" ? (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((p) => (
                    <HoverPreviewCard
                      key={p.id}
                      project={p}
                      to={`/app/editor/${p.id}`}
                      menu={projectMenu(p.id, p.title)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-6 border-y hairline">
                  <div className="grid grid-cols-12 gap-4 px-2 py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground border-b hairline">
                    <div className="col-span-6">Title</div>
                    <div className="col-span-2 tnum">Scenes</div>
                    <div className="col-span-2">Style</div>
                    <div className="col-span-2 text-right">Updated</div>
                  </div>
                  {filtered.map((p) => {
                    const theme = THEMES[p.themeId] ?? THEMES.studio;
                    return (
                      <Link
                        key={p.id}
                        to={`/app/editor/${p.id}`}
                        className="grid grid-cols-12 gap-4 px-2 py-3 text-sm items-center border-b hairline last:border-b-0 hover:bg-foreground/[0.02] transition-colors group"
                      >
                        <div className="col-span-6 flex items-center gap-3 min-w-0">
                          <span className="font-medium truncate underline-grow">{p.title}</span>
                        </div>
                        <div className="col-span-2 tnum text-muted-foreground">{p.slides.length}</div>
                        <div className="col-span-2 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.accent }} />
                          <span className="text-muted-foreground">{theme.name}</span>
                        </div>
                        <div className="col-span-2 text-right text-muted-foreground tnum text-[12px]">
                          {formatDistanceToNow(p.updatedAt)} ago
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Delete this video?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmId) remove(confirmId);
                setConfirmId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!renameId} onOpenChange={(o) => !o && setRenameId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Rename video</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameId(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (renameId) rename(renameId, renameValue.trim() || "Untitled video");
                setRenameId(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SortChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-[12px] px-2.5 py-1 rounded-full transition-colors",
        active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

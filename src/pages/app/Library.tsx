import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Topbar } from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProjects } from "@/lib/data/useProjects";
import { EmptyState, StackIllustration } from "@/components/empty/EmptyState";
import { formatDistanceToNow } from "@/lib/format";
import { Plus, Search, MoreVertical, Copy, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function LibraryPage() {
  const navigate = useNavigate();
  const projects = useProjects((s) => s.projects);
  const duplicate = useProjects((s) => s.duplicateProject);
  const remove = useProjects((s) => s.deleteProject);
  const rename = useProjects((s) => s.renameProject);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"recent" | "name" | "slides">("recent");
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

  return (
    <>
      <Topbar
        eyebrow="Library"
        title="Your videos"
        actions={
          <Button onClick={() => navigate("/app/new")}>
            <Plus className="h-4 w-4" /> New video
          </Button>
        }
      />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {projects.length === 0 ? (
            <Card className="p-0">
              <EmptyState
                illustration={<StackIllustration />}
                eyebrow="Library"
                title="Your library is quiet."
                description="Every video you create lands here, ready to revisit, duplicate, or share."
                actions={<Button onClick={() => navigate("/app/new")}><Plus className="h-4 w-4" /> Create video</Button>}
              />
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search videos…" className="pl-9" />
                </div>
                <Select value={sort} onValueChange={(v) => setSort(v as any)}>
                  <SelectTrigger className="w-40 h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most recent</SelectItem>
                    <SelectItem value="name">By name</SelectItem>
                    <SelectItem value="slides">Most slides</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((p) => (
                  <Card key={p.id} className="overflow-hidden group relative hover:shadow-premium transition-all hover:-translate-y-0.5">
                    <Link to={`/app/editor/${p.id}`}>
                      <div className="aspect-video bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center p-4">
                        <div className="font-display text-lg text-center text-primary/80 line-clamp-3">{p.slides[0]?.content?.title ?? p.title}</div>
                      </div>
                    </Link>
                    <div className="p-3 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{p.title}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {p.slides.length} slides · {formatDistanceToNow(p.updatedAt)} ago
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="opacity-60 hover:opacity-100 p-1">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/app/editor/${p.id}`)}>Open</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setRenameId(p.id); setRenameValue(p.title); }}>
                            <Pencil className="h-4 w-4 mr-2" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicate(p.id)}>
                            <Copy className="h-4 w-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setConfirmId(p.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-12">No videos match “{q}”.</p>
              )}
            </>
          )}
        </div>
      </div>

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this video?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (confirmId) remove(confirmId); setConfirmId(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!renameId} onOpenChange={(o) => !o && setRenameId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename video</DialogTitle></DialogHeader>
          <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameId(null)}>Cancel</Button>
            <Button onClick={() => { if (renameId) rename(renameId, renameValue.trim() || "Untitled video"); setRenameId(null); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

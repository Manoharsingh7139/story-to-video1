import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useProjects } from "@/lib/data/useProjects";
import {
  LayoutDashboard,
  Library as LibraryIcon,
  History as HistoryIcon,
  LayoutTemplate,
  Palette,
  Settings as SettingsIcon,
  Plus,
  FileText,
} from "lucide-react";

interface CommandState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCommandPalette = create<CommandState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));

export function CommandPalette() {
  const { isOpen, close, toggle } = useCommandPalette();
  const navigate = useNavigate();
  const projects = useProjects((s) => s.projects);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        close();
        navigate("/app/new");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, close, navigate]);

  const go = (to: string) => {
    close();
    navigate(to);
  };

  const recent = useMemo(() => projects.slice(0, 8), [projects]);

  return (
    <CommandDialog open={isOpen} onOpenChange={(o) => (o ? useCommandPalette.getState().open() : close())}>
      <CommandInput placeholder="Search videos, jump to a page…" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => go("/app/new")}>
            <Plus className="h-4 w-4 mr-2" /> New video
            <span className="ml-auto text-[10px] text-muted-foreground">⌘N</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/app/templates")}>
            <LayoutTemplate className="h-4 w-4 mr-2" /> Browse templates
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Go to">
          <CommandItem onSelect={() => go("/app")}>
            <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/app/library")}>
            <LibraryIcon className="h-4 w-4 mr-2" /> Templates
          </CommandItem>
          <CommandItem onSelect={() => go("/app/history")}>
            <HistoryIcon className="h-4 w-4 mr-2" /> History
          </CommandItem>
          <CommandItem onSelect={() => go("/app/brand")}>
            <Palette className="h-4 w-4 mr-2" /> Brand kit
          </CommandItem>
          <CommandItem onSelect={() => go("/app/settings")}>
            <SettingsIcon className="h-4 w-4 mr-2" /> Settings
          </CommandItem>
        </CommandGroup>
        {recent.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent videos">
              {recent.map((p) => (
                <CommandItem key={p.id} onSelect={() => go(`/app/editor/${p.id}`)}>
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="truncate">{p.title}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground tnum">
                    {p.slides.length} scenes
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

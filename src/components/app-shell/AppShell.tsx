import { ReactNode, useEffect, useRef, useState } from "react";
import { Outlet, NavLink as RouterNavLink, useLocation, useNavigate, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Wordmark } from "@/components/Wordmark";
import {
  LayoutDashboard,
  Library,
  History,
  LayoutTemplate,
  Palette,
  Settings,
  Plus,
  LogOut,
  ChevronRight,
  Search,
  User as UserIcon,
  Keyboard,
} from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { useProjects } from "@/lib/data/useProjects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { KBD } from "@/components/ui/kbd";
import { THEMES } from "@/lib/prototype/themes";
import { CommandPalette, useCommandPalette } from "@/components/CommandPalette";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/library", label: "Library", icon: Library },
  { to: "/app/history", label: "History", icon: History },
  { to: "/app/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/app/brand", label: "Brand kit", icon: Palette },
];

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

function NavRow({
  to,
  label,
  icon: Icon,
  end,
  collapsed,
  trailing,
}: {
  to: string;
  label: string;
  icon: any;
  end?: boolean;
  collapsed: boolean;
  trailing?: ReactNode;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={label} className="h-9 px-2.5 hover:bg-foreground/[0.04]">
        <RouterNavLink to={to} end={end} className="relative flex items-center gap-2.5">
          {({ isActive }) => (
            <>
              {/* 2px left accent on active */}
              <span
                className={cn(
                  "absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-sm transition-opacity",
                  isActive ? "bg-primary opacity-100" : "opacity-0",
                )}
                aria-hidden
              />
              <Icon
                className={cn(
                  "h-[15px] w-[15px] shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-foreground/60",
                )}
                strokeWidth={1.75}
              />
              {!collapsed && (
                <>
                  <span
                    className={cn(
                      "text-[13px] font-medium",
                      isActive ? "text-foreground" : "text-foreground/75",
                    )}
                  >
                    {label}
                  </span>
                  {trailing && <span className="ml-auto">{trailing}</span>}
                </>
              )}
            </>
          )}
        </RouterNavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function AppSidebar({ onOpenCommand: _onOpenCommand, onOpenShortcuts }: { onOpenCommand: () => void; onOpenShortcuts: () => void }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const projects = useProjects((s) => s.projects);
  const recent = projects.slice(0, 3);

  return (
    <Sidebar collapsible="icon" className="border-r hairline">
      <SidebarHeader className="px-3 pt-4 pb-3">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "px-1.5")}>
          <Wordmark size="sm" iconOnly={collapsed} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1.5">
        {/* Primary action — sidebar item, not a button */}
        <SidebarMenu className="mb-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New video"
              onClick={() => navigate("/app/new")}
              className={cn(
                "h-9 px-2.5 group/new",
                "bg-primary/[0.06] hover:bg-primary/[0.1] text-primary",
              )}
            >
              <Plus className="h-[15px] w-[15px] shrink-0" strokeWidth={2} />
              {!collapsed && (
                <>
                  <span className="text-[13px] font-medium">New video</span>
                  <span className="ml-auto opacity-60 group-hover/new:opacity-100">
                    <KBD>⌘</KBD>
                    <KBD className="ml-1">N</KBD>
                  </span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!collapsed && (
          <div className="h-px mx-2.5 my-2 bg-hairline/70" aria-hidden />
        )}

        <SidebarGroup className="px-0 py-0">
          <SidebarGroupLabel
            className={cn(
              "px-2.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 font-medium h-7",
              collapsed && "sr-only",
            )}
          >
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <NavRow key={item.to} {...item} collapsed={collapsed} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && recent.length > 0 && (
          <SidebarGroup className="px-0 py-0 mt-2">
            <SidebarGroupLabel className="px-2.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 font-medium h-7">
              Recent
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recent.map((p) => {
                  const theme = THEMES[p.themeId] ?? THEMES.studio;
                  return (
                    <SidebarMenuItem key={p.id}>
                      <SidebarMenuButton
                        asChild
                        className="h-8 px-2.5 hover:bg-foreground/[0.04]"
                      >
                        <Link to={`/app/editor/${p.id}`} className="flex items-center gap-2.5">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ background: theme.accent }}
                          />
                          <span className="text-[12.5px] text-foreground/75 truncate">
                            {p.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center gap-2.5 p-2 rounded-md",
                    "hover:bg-foreground/[0.04] transition-colors",
                    "border hairline",
                  )}
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[11px] font-semibold">
                      {initials(user?.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <>
                      <div className="flex flex-col items-start min-w-0 leading-tight flex-1">
                        <span className="text-[12.5px] font-medium truncate w-full text-left">
                          {user?.name ?? "Account"}
                        </span>
                        <span className="text-[10.5px] text-muted-foreground truncate w-full text-left">
                          {user?.email}
                        </span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-60">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Signed in as
                  <br />
                  <span className="text-foreground font-medium">{user?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app/settings")}>
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onOpenShortcuts}>
                  <Keyboard className="h-4 w-4 mr-2" /> Keyboard shortcuts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                    navigate("/signin");
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

interface Crumb {
  label: ReactNode;
  to?: string;
}

export function Topbar({
  title,
  eyebrow,
  actions,
  crumbs,
}: {
  /** @deprecated — title now belongs in the page's EditorialHeader. Kept for backward compat. */
  title?: ReactNode;
  /** @deprecated — replaced by `crumbs`. */
  eyebrow?: ReactNode;
  actions?: ReactNode;
  crumbs?: Crumb[];
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Build crumbs from legacy eyebrow/title if not provided
  const built: Crumb[] =
    crumbs ??
    (eyebrow
      ? [{ label: eyebrow }]
      : title
        ? [{ label: title }]
        : []);

  const open = useCommandPalette((s) => s.open);

  return (
    <>
      {/* Sentinel for scroll-based hairline */}
      <div ref={sentinelRef} aria-hidden className="h-0" />
      <header
        className={cn(
          "h-12 flex items-center justify-between px-5 sticky top-0 z-20",
          "bg-background/80 backdrop-blur-md transition-shadow",
          scrolled && "shadow-[0_1px_0_0_hsl(var(--hairline))]",
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <SidebarTrigger className="md:hidden -ml-1.5" />
          <nav className="flex items-center gap-1.5 text-[12px] min-w-0">
            <span className="text-muted-foreground/70">Studio</span>
            {built.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                {c.to ? (
                  <Link
                    to={c.to}
                    className="text-muted-foreground hover:text-foreground truncate"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className={cn(i === built.length - 1 ? "text-foreground" : "text-muted-foreground", "truncate")}>
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <button
            onClick={open}
            className={cn(
              "hidden sm:inline-flex items-center gap-2 h-8 px-2.5 rounded-md",
              "border hairline bg-card hover:bg-foreground/[0.03] transition-colors",
              "text-[12px] text-muted-foreground",
            )}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <KBD>⌘K</KBD>
          </button>
        </div>
      </header>
    </>
  );
}

function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const rows: { keys: string[]; label: string }[] = [
    { keys: ["⌘", "K"], label: "Open search" },
    { keys: ["⌘", "N"], label: "New video" },
    { keys: ["⌘", "↵"], label: "Generate (in Setup)" },
    { keys: ["esc"], label: "Close dialogs" },
  ];
  return (
    <ShortcutsDialogPrimitive open={open} onOpenChange={onOpenChange}>
      <ShortcutsDialogContent className="sm:max-w-sm">
        <ShortcutsDialogHeader>
          <ShortcutsDialogTitle className="font-serif text-xl">Keyboard shortcuts</ShortcutsDialogTitle>
        </ShortcutsDialogHeader>
        <ul className="border-y hairline divide-y divide-hairline mt-1">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-foreground/85">{r.label}</span>
              <span className="flex items-center gap-1">
                {r.keys.map((k) => (
                  <KBD key={k}>{k}</KBD>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </ShortcutsDialogContent>
    </ShortcutsDialogPrimitive>
  );
}

export default function AppShell() {
  const location = useLocation();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const fullBleed =
    location.pathname.startsWith("/app/editor") ||
    location.pathname.startsWith("/app/generating");

  if (fullBleed) {
    return <Outlet />;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        <CommandPalette />
        <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
        <AppSidebar
          onOpenCommand={() => useCommandPalette.getState().open()}
          onOpenShortcuts={() => setShortcutsOpen(true)}
        />
        <div className="flex-1 flex flex-col min-w-0 bg-paper">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}


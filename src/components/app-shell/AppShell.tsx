import { ReactNode } from "react";
import { Outlet, NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Library,
  History,
  LayoutTemplate,
  Palette,
  Settings,
  Plus,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
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

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/library", label: "Library", icon: Library },
  { to: "/app/history", label: "History", icon: History },
  { to: "/app/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/app/brand", label: "Brand kit", icon: Palette },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "U";
}

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 pt-3 pb-2">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "px-1")}>
          <Wordmark size="sm" iconOnly={collapsed} />
        </div>
        <Button
          onClick={() => navigate("/app/new")}
          size="sm"
          className={cn("mt-3 h-9", collapsed && "px-0 w-9")}
          aria-label="New video"
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span className="ml-1">New video</span>}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <RouterNavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2",
                          isActive && "bg-primary/10 text-primary font-medium",
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </RouterNavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <RouterNavLink
                to="/app/settings"
                className={({ isActive }) =>
                  cn("flex items-center gap-2", isActive && "bg-primary/10 text-primary font-medium")
                }
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </RouterNavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip={user?.email ?? "Account"} className="gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                      {initials(user?.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex flex-col items-start min-w-0 leading-tight">
                      <span className="text-xs font-medium truncate w-full">{user?.name}</span>
                      <span className="text-[10px] text-muted-foreground truncate w-full">{user?.email}</span>
                    </div>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Signed in as<br /><span className="text-foreground font-medium">{user?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app/settings")}>
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { signOut(); navigate("/signin"); }}>
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

export function Topbar({
  title,
  eyebrow,
  actions,
}: {
  title: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/70 backdrop-blur sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="md:hidden" />
        <div className="min-w-0">
          {eyebrow && (
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</div>
          )}
          <h1 className="font-display text-lg tracking-[-0.01em] truncate">{title}</h1>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export default function AppShell() {
  const location = useLocation();
  // Hide shell on the editor & generating screens for max canvas
  const fullBleed =
    location.pathname.startsWith("/app/editor") || location.pathname.startsWith("/app/generating");

  if (fullBleed) {
    return <Outlet />;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}

import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UserPlus,
  ScanFace,
  ShieldAlert,
  Database,
  BarChart3,
  LogOut,
  ScanEye,
  Wand2,
  ScanSearch,
  Fingerprint,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth, type UserRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
  hint?: string;
  section: string;
}

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
    roles: ["faculty", "admin"],
    section: "Overview",
  },

  {
    label: "Student Registration",
    to: "/register",
    icon: UserPlus,
    roles: ["faculty", "admin"],
    section: "Operations",
  },
  {
    label: "Live Detection",
    to: "/live",
    icon: ScanFace,
    roles: ["faculty", "admin"],
    section: "Operations",
  },
  {
    label: "Proxy Monitor",
    to: "/proxy",
    icon: ShieldAlert,
    roles: ["faculty", "admin"],
    hint: "2",
    section: "Operations",
  },

  {
    label: "Preprocessing",
    to: "/preprocessing",
    icon: Wand2,
    roles: ["faculty", "admin"],
    section: "AI Pipeline",
  },
  {
    label: "Face Detection",
    to: "/detection",
    icon: ScanSearch,
    roles: ["faculty", "admin"],
    section: "AI Pipeline",
  },
  {
    label: "Recognition",
    to: "/recognition",
    icon: Fingerprint,
    roles: ["faculty", "admin"],
    section: "AI Pipeline",
  },
  {
    label: "Liveness Engine",
    to: "/liveness",
    icon: ShieldCheck,
    roles: ["faculty", "admin"],
    section: "AI Pipeline",
  },

  {
    label: "Reports",
    to: "/reports",
    icon: BarChart3,
    roles: ["faculty", "admin"],
    section: "Analytics",
  },
  {
    label: "AI Insights",
    to: "/insights",
    icon: Sparkles,
    roles: ["faculty", "admin"],
    section: "Analytics",
  },

  { label: "Database Admin", to: "/database", icon: Database, roles: ["admin"], section: "Admin" },
];

const SECTION_ORDER = ["Overview", "Operations", "AI Pipeline", "Analytics", "Admin"];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = NAV.filter((n) => (user ? n.roles.includes(user.role) : false));
  const sections = SECTION_ORDER.map((name) => ({
    name,
    items: items.filter((i) => i.section === name),
  })).filter((s) => s.items.length > 0);

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-lg">
          <ScanEye className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold tracking-tight text-white">SentinelFace</p>
          <p className="text-[11px] text-sidebar-foreground/60">Attendance Intelligence</p>
        </div>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-3 py-2">
        {sections.map((section) => (
          <div key={section.name} className="space-y-1">
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {section.name}
            </p>
            {section.items.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.hint && (
                    <span className="rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-semibold text-danger-foreground">
                      {item.hint}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-white">
            {user?.initials}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-[11px] capitalize text-sidebar-foreground/60">
              {user?.title}
            </p>
          </div>
          <button
            aria-label="Sign out"
            onClick={() => {
              logout();
              navigate({ to: "/auth" });
            }}
            className="rounded-md p-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

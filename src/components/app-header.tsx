import { useEffect, useState } from "react";
import { Menu, CalendarClock } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { DEPARTMENTS, SUBJECTS } from "@/lib/mock-data";
import { StatusPill } from "@/components/status-pill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AppHeader({ onMenu }: { onMenu: () => void }) {
  const { user } = useAuth();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
          <CalendarClock className="h-4 w-4 text-primary" />
          <span className="tabular-nums">
            {now
              ? now.toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "—"}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block">
            <Select defaultValue={DEPARTMENTS[0]}>
              <SelectTrigger className="h-9 w-[170px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden sm:block">
            <Select defaultValue={SUBJECTS[0]}>
              <SelectTrigger className="h-9 w-[160px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {user?.initials}
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold text-foreground">{user?.name}</p>
            </div>
            <StatusPill tone="primary" className="capitalize">
              {user?.title}
            </StatusPill>
          </div>
        </div>
      </div>
    </header>
  );
}

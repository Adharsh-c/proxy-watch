import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, Eye, Layers, Box, Move, Ban, MapPin, ScanLine } from "lucide-react";
import { toast } from "sonner";

import { PageHeading } from "@/components/page-heading";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LIVENESS_FACTORS, SPOOF_SAMPLES, PROXY_ALERTS, type ProxyAlert } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/proxy")({
  head: () => ({ meta: [{ title: "Proxy Monitor — SentinelFace" }] }),
  component: ProxyPage,
});

const FACTOR_ICONS: Record<string, typeof Eye> = {
  "Blink Detection": Eye,
  "Texture Analysis": Layers,
  "Depth Estimation": Box,
  "Motion Tracking": Move,
};

function ProxyPage() {
  const [alerts, setAlerts] = useState<ProxyAlert[]>(PROXY_ALERTS);

  const resolve = (a: ProxyAlert) => {
    setAlerts((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: "resolved" } : x)));
    toast.error(`${a.id} · Proxy rejected`, {
      description: `${a.student} flagged for cross-room collision. Attendance reverted & faculty notified.`,
    });
  };

  const flagSpoof = (id: string, type: string) => {
    toast.warning(`Spoof rejected — ${type}`, {
      description: `Sample ${id} blocked. Liveness check failed, alert dispatched.`,
    });
  };

  const activeCount = alerts.filter((a) => a.status === "active").length;

  return (
    <div>
      <PageHeading
        icon={ShieldAlert}
        title="Liveness & Proxy Detection"
        subtitle="Anti-spoof verification and cross-room collision monitoring"
        actions={
          <StatusPill tone="danger" dot>
            {activeCount} active alerts
          </StatusPill>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Liveness metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Liveness Factors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {LIVENESS_FACTORS.map((f) => {
              const Icon = FACTOR_ICONS[f.label] ?? Eye;
              const pct = Math.round(f.score * 100);
              const tone = f.score >= 0.6 ? "success" : "warning";
              return (
                <div key={f.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {f.label}
                    </span>
                    <span className={cn("font-semibold", tone === "success" ? "text-success" : "text-warning-foreground")}>
                      {f.score.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              Living / Spoof factor scores range 0.50–0.70. Scores below 0.60 trigger a
              manual liveness review.
            </div>
          </CardContent>
        </Card>

        {/* Spoof warning frames */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Spoof Detection Frames</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {SPOOF_SAMPLES.map((s) => (
                <div key={s.id} className="overflow-hidden rounded-xl border border-danger/30">
                  <div className="relative aspect-video bg-slate-900">
                    <div
                      className="absolute inset-0 opacity-60"
                      style={{
                        background:
                          "repeating-linear-gradient(45deg, oklch(0.3 0.04 265) 0 8px, oklch(0.22 0.03 265) 8px 16px)",
                      }}
                    />
                    <div className="absolute inset-3 rounded-md border-2 border-danger" />
                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-danger px-2 py-1 text-[11px] font-bold text-danger-foreground">
                      <ScanLine className="h-3 w-3" /> {s.type} ✕
                    </div>
                    <div className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-[11px] text-white">
                      liveness {s.score.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">{s.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.type === "PRINT" ? "Printed photo attack" : "Phone replay attack"}
                      </p>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => flagSpoof(s.id, s.type)}>
                      <Ban className="mr-1.5 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proxy alerts stream */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Active Proxy Alerts</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Cross-room collisions detected by the attendance engine
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={cn(
                "flex flex-wrap items-center gap-4 rounded-xl border p-4",
                a.status === "active" ? "border-danger/30 bg-danger/5" : "border-border bg-muted/30",
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/12 text-danger">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-danger">{a.id}</span>
                  <span className="text-sm font-semibold">{a.student}</span>
                  <StatusPill tone={a.status === "active" ? "danger" : "muted"}>
                    {a.status === "active" ? "Active" : "Resolved"}
                  </StatusPill>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {a.roomA} at {a.timeA}
                  <span className="text-danger">→</span>
                  <MapPin className="h-3 w-3" />
                  {a.roomB} at {a.timeB}
                </p>
              </div>
              {a.status === "active" ? (
                <Button size="sm" variant="destructive" onClick={() => resolve(a)}>
                  <Ban className="mr-1.5 h-4 w-4" /> Reject &amp; Alert
                </Button>
              ) : (
                <StatusPill tone="success">Handled</StatusPill>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

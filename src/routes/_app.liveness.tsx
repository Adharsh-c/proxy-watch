import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck, RefreshCw, Smartphone, Printer, User } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LIVENESS_COMPONENTS } from "@/lib/ml-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/liveness")({
  head: () => ({ meta: [{ title: "Liveness Engine — SentinelFace" }] }),
  component: LivenessPage,
});

type Scenario = "live" | "print" | "phone";

const SCENARIOS: { key: Scenario; label: string; icon: typeof User; profile: Record<string, [number, number]> }[] = [
  { key: "live", label: "Live Person", icon: User, profile: { blink: [0.82, 0.95], texture: [0.8, 0.94], depth: [0.78, 0.9], motion: [0.75, 0.92] } },
  { key: "print", label: "Printed Photo", icon: Printer, profile: { blink: [0.05, 0.2], texture: [0.1, 0.3], depth: [0.15, 0.35], motion: [0.05, 0.18] } },
  { key: "phone", label: "Phone Replay", icon: Smartphone, profile: { blink: [0.4, 0.6], texture: [0.2, 0.4], depth: [0.25, 0.45], motion: [0.45, 0.65] } },
];

const THRESHOLD = 0.7;

function rand([a, b]: [number, number]) {
  return Number((a + Math.random() * (b - a)).toFixed(2));
}

function LivenessPage() {
  const [scenario, setScenario] = useState<Scenario>("live");
  const [seed, setSeed] = useState(0);

  const scores = useMemo(() => {
    const profile = SCENARIOS.find((s) => s.key === scenario)!.profile;
    return LIVENESS_COMPONENTS.map((c) => ({ ...c, score: rand(profile[c.key]) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, seed]);

  const aggregate = useMemo(
    () => Number(scores.reduce((acc, s) => acc + s.score * s.weight, 0).toFixed(2)),
    [scores],
  );
  const isLive = aggregate >= THRESHOLD;

  return (
    <div>
      <PageHeading
        icon={ShieldCheck}
        title="Liveness Detection Engine"
        subtitle="Module 7 · MiniFASNet anti-spoofing — weighted multi-cue fusion"
        actions={
          <Button size="sm" variant="outline" onClick={() => setSeed((s) => s + 1)}>
            <RefreshCw className="mr-1.5 h-4 w-4" /> Re-run Scan
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => setScenario(s.key)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                scenario === s.key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" /> {s.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className={cn("lg:col-span-1", isLive ? "border-success/40" : "border-danger/40")}>
          <CardHeader>
            <CardTitle className="text-base">Verdict</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-xl py-8",
                isLive ? "bg-success/10" : "bg-danger/10",
              )}
            >
              {isLive ? (
                <ShieldCheck className="h-12 w-12 text-success" />
              ) : (
                <ShieldCheck className="h-12 w-12 text-danger" />
              )}
              <p className={cn("mt-3 text-2xl font-bold", isLive ? "text-success" : "text-danger")}>
                {isLive ? "LIVE" : "SPOOF DETECTED"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fusion score {aggregate.toFixed(2)} · threshold {THRESHOLD.toFixed(2)}
              </p>
            </div>
            <div className="mt-4 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              {isLive
                ? "All anti-spoofing cues passed. Attendance marking is permitted."
                : "Spoof signature detected. Recognition rejected and a proxy alert is raised."}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Component Cues & Weights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scores.map((c) => {
              const pass = c.score >= 0.5;
              return (
                <div key={c.key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">{c.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">weight {c.weight.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{c.score.toFixed(2)}</span>
                      <StatusPill tone={pass ? "success" : "danger"}>{pass ? "pass" : "fail"}</StatusPill>
                    </div>
                  </div>
                  <Progress value={c.score * 100} className={cn("h-2", !pass && "[&>div]:bg-danger")} />
                  <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

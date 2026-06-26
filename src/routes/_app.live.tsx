import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ScanFace, Play, Square, Gauge, CheckCircle2, Activity } from "lucide-react";
import { toast } from "sonner";

import { PageHeading } from "@/components/page-heading";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DETECTED_FACES } from "@/lib/mock-data";
import { useDashboardState } from "@/lib/dashboard-state";
import { cn } from "@/lib/utils";
import classroom from "@/assets/classroom-feed.jpg";

export const Route = createFileRoute("/_app/live")({
  head: () => ({ meta: [{ title: "Live Detection — SentinelFace" }] }),
  component: LivePage,
});

interface LogEntry {
  id: string;
  name: string;
  similarity: number;
  status: "present" | "review";
  time: string;
}

const THRESHOLD = 0.6;

function LivePage() {
  const { students, addProxyAlert } = useDashboardState();
  const [running, setRunning] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [fps, setFps] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const detectingRef = useRef(false);
  const revealRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fpsRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    if (!running || detectingRef.current) return;

    detectingRef.current = true;
    setRevealed(0);
    setLog([]);
    idxRef.current = 0;

    fpsRef.current = setInterval(() => setFps(24 + Math.random()), 800);

    revealRef.current = setInterval(() => {
      const i = idxRef.current;
      const face = DETECTED_FACES[i];
      if (!face) {
        if (revealRef.current) clearInterval(revealRef.current);
        setRunning(false);
        detectingRef.current = false;
        toast.message("Detection complete");
        return;
      }
      idxRef.current = i + 1;
      setRevealed(i + 1);

      const matchedStudent = students.find((s) => s.name === face.name);
      const similarity = Math.min(0.75, Math.max(0.6, face.confidence - Math.random() * 0.12));
      const matched = face.live && face.confidence >= THRESHOLD && Boolean(matchedStudent);
      const status = matched ? "present" : "review";

      if (!matched) {
        addProxyAlert({
          student: face.name,
          roomA: "Simulated Classroom Feed",
          timeA: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          roomB: "Proxy Monitor",
          timeB: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }

      setLog((prev) => [
        {
          id: face.faceId,
          name: face.name,
          similarity: Number(similarity.toFixed(2)),
          status,
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        },
        ...prev,
      ]);

      if (matched) {
        toast.success(`${face.name} — Marked Present`, {
          description: matchedStudent
            ? `Matched registered student with similarity ${similarity.toFixed(2)}`
            : `Face detected but student not registered`,
        });
      } else {
        toast.warning(`${face.name} not recognized`, {
          description: `Proxy alert added for review on the monitor.`,
        });
      }

      if (i + 1 >= DETECTED_FACES.length && revealRef.current) {
        clearInterval(revealRef.current);
        setRunning(false);
        detectingRef.current = false;
      }
    }, 700);

    return () => {
      if (revealRef.current) {
        clearInterval(revealRef.current);
      }
      if (fpsRef.current) {
        clearInterval(fpsRef.current);
      }
    };
  }, [running, students, addProxyAlert]);

  const start = () => {
    setRevealed(0);
    setLog([]);
    idxRef.current = 0;
    setRunning(true);
    toast.info("Simulation started", {
      description: "Using preloaded classroom image with simulated face detection.",
    });
  };

  const stop = () => {
    setRunning(false);
    setFps(0);
    if (revealRef.current) clearInterval(revealRef.current);
    if (fpsRef.current) clearInterval(fpsRef.current);
    detectingRef.current = false;
    toast.message("Simulation stopped");
  };

  const visible = DETECTED_FACES.slice(0, revealed);
  const presentCount = log.filter((l) => l.status === "present").length;

  return (
    <div>
      <PageHeading
        icon={ScanFace}
        title="Live Face Detection"
        subtitle="Classroom recognition engine · cosine-similarity matching"
        actions={
          running ? (
            <Button variant="destructive" size="sm" onClick={stop}>
              <Square className="mr-1.5 h-4 w-4" /> Stop Simulation
            </Button>
          ) : (
            <Button size="sm" onClick={start}>
              <Play className="mr-1.5 h-4 w-4" /> Start Simulation
            </Button>
          )
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Feed */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video w-full bg-slate-900">
                <img
                  src={classroom}
                  alt="Simulated classroom feed"
                  width={1280}
                  height={720}
                  loading="lazy"
                  className={cn(
                    "h-full w-full object-cover transition",
                    running ? "opacity-20 grayscale" : "opacity-40 grayscale",
                  )}
                />
                {/* HUD */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                    1280 × 720
                  </span>
                  <span className="flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                    <Gauge className="h-3 w-3 text-success" /> {running ? fps.toFixed(1) : "0.0"} FPS
                  </span>
                  {running && (
                    <span className="flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" /> LIVE
                    </span>
                  )}
                </div>

                {!running && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
                    <ScanFace className="h-10 w-10 opacity-70" />
                    <p className="text-sm opacity-80">Press “Start Simulation” to begin detection</p>
                  </div>
                )}

                {/* Bounding boxes */}
                {visible.map((f) => {
                  const matchedStudent = students.find((s) => s.name === f.name);
                  const faceTone = matchedStudent ? "border-success" : "border-warning";
                  const labelTone = matchedStudent ? "bg-success" : "bg-warning";
                  return (
                    <div key={f.faceId} className={cn("absolute", f.boxClass)}>
                      <div
                        className={cn(
                          "h-full w-full rounded-sm border-2 border-current transition-all detection-face-box-shadow",
                          faceTone,
                        )}
                      />
                      <span
                        className={cn(
                          "absolute -top-5 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold text-white",
                          labelTone,
                        )}
                      >
                        {f.name} · {matchedStudent ? "Registered" : "Unknown"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Attendance processing log */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Live Attendance Processing</CardTitle>
              </div>
              <StatusPill tone="success" dot>
                {presentCount} marked present
              </StatusPill>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-xs text-muted-foreground">
                Matching threshold (cosine similarity): 0.60 – 0.75
              </p>
              <ScrollArea className="h-56">
                <div className="space-y-2 pr-3">
                  {log.length === 0 && (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                      No matches yet. Start the simulation to process attendance.
                    </p>
                  )}
                  {log.map((l) => (
                    <div
                      key={l.id + l.time}
                      className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full",
                            l.status === "present"
                              ? "bg-success/12 text-success"
                              : "bg-warning/15 text-warning-foreground",
                          )}
                        >
                          {l.status === "present" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Activity className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{l.name}</p>
                          <p className="text-xs text-muted-foreground">
                            similarity {l.similarity.toFixed(2)} · {l.time}
                          </p>
                        </div>
                      </div>
                      {l.status === "present" ? (
                        <StatusPill tone="success">Mark Present</StatusPill>
                      ) : (
                        <StatusPill tone="warning">Needs Review</StatusPill>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Detected faces sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detected Faces ({visible.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[34rem]">
              <div className="space-y-2 pr-3">
                {visible.length === 0 && (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No faces detected yet.
                  </p>
                )}
                {visible.map((f) => (
                  <div key={f.faceId} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {f.faceId}
                      </span>
                      <StatusPill tone={f.live ? "success" : "danger"}>
                        {f.live ? "Live" : "Spoof?"}
                      </StatusPill>
                    </div>
                    <p className="mt-1.5 text-sm font-medium">{f.name}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide">Confidence</p>
                        <p className="font-semibold text-foreground">{f.confidence.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide">Coordinates</p>
                        <p className="font-mono text-[11px] text-foreground">{f.coords}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

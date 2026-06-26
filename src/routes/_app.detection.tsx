import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScanSearch, Cpu } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DETECTED_FACES, type DetectedFace } from "@/lib/mock-data";
import { type DetectorModel } from "@/lib/ml-data";
import { cn } from "@/lib/utils";
import classroom from "@/assets/classroom-feed.jpg";

export const Route = createFileRoute("/_app/detection")({
  head: () => ({ meta: [{ title: "Face Detection Console — SentinelFace" }] }),
  component: DetectionPage,
});

const MODELS: DetectorModel[] = ["YOLOv11", "RetinaFace"];

function trackId(face: DetectedFace, model: DetectorModel) {
  const base = parseInt(face.faceId.replace(/\D/g, ""), 10);
  return `${model === "YOLOv11" ? "YT" : "RT"}-${String(base + (model === "YOLOv11" ? 100 : 200)).padStart(4, "0")}`;
}

function DetectionPage() {
  const [threshold, setThreshold] = useState(0.5);
  const [minFace, setMinFace] = useState(30);
  const [model, setModel] = useState<DetectorModel>("YOLOv11");

  // RetinaFace gives a slight confidence bump in this simulation.
  const adj = (c: number) => Math.min(0.99, model === "RetinaFace" ? c + 0.02 : c);
  // Approximate on-screen face pixel height from the box (% of 720px canvas).
  const facePx = (f: DetectedFace) => Math.round((f.box.h / 100) * 720);

  const visible = DETECTED_FACES.filter(
    (f) => adj(f.confidence) >= threshold && facePx(f) >= minFace,
  );
  const filteredOut = DETECTED_FACES.length - visible.length;

  return (
    <div>
      <PageHeading
        icon={ScanSearch}
        title="Face Detection Console"
        subtitle="Module 5 · YOLOv11 / RetinaFace detector with DeepSORT tracking"
        actions={
          <div className="flex rounded-lg border border-border p-0.5">
            {MODELS.map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  model === m
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video w-full bg-slate-900">
                <img
                  src={classroom}
                  alt="Detection canvas"
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                    <Cpu className="h-3 w-3 text-success" /> {model}
                  </span>
                  <span className="rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                    conf ≥ {threshold.toFixed(2)}
                  </span>
                  <span className="rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                    {visible.length} detections
                  </span>
                </div>
                {visible.map((f) => (
                  <div
                    key={f.faceId}
                    className="absolute detection-face-box"
                    style={{
                      left: `${f.box.x}%`,
                      top: `${f.box.y}%`,
                      width: `${f.box.w}%`,
                      height: `${f.box.h}%`,
                    }}
                  >
                    <div className="h-full w-full rounded-sm border-2 border-info detection-face-box-shadow" />
                    <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-info px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {trackId(f, model)} · {adj(f.confidence).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Confidence Threshold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Range 0.50 – 0.70</span>
                  <span className="font-mono text-lg font-bold text-primary">
                    {threshold.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[threshold]}
                  min={0.5}
                  max={0.7}
                  step={0.01}
                  onValueChange={([v]) => setThreshold(v)}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Minimum Face Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Filter small faces</span>
                  <span className="font-mono text-lg font-bold text-primary">
                    {minFace}×{minFace} px
                  </span>
                </div>
                <Slider
                  value={[minFace]}
                  min={30}
                  max={120}
                  step={5}
                  onValueChange={([v]) => setMinFace(v)}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Tracked Faces ({visible.length})</CardTitle>
            {filteredOut > 0 && <StatusPill tone="warning">{filteredOut} filtered</StatusPill>}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[32rem]">
              <div className="space-y-2 pr-3">
                {visible.length === 0 && (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No faces above current thresholds.
                  </p>
                )}
                {visible.map((f) => (
                  <div key={f.faceId} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-info">
                        {trackId(f, model)}
                      </span>
                      <StatusPill tone="primary">{facePx(f)}px</StatusPill>
                    </div>
                    <p className="mt-1.5 text-sm font-medium">{f.name}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Confidence
                        </p>
                        <p className="font-semibold">{adj(f.confidence).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          BBox px
                        </p>
                        <p className="font-mono text-[11px]">{f.coords}</p>
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

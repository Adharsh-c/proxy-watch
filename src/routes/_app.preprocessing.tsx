import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Wand2, ArrowRight, RotateCcw } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PREPROCESSING_STAGES } from "@/lib/ml-data";
import { cn } from "@/lib/utils";
import classroom from "@/assets/classroom-feed.jpg";

export const Route = createFileRoute("/_app/preprocessing")({
  head: () => ({ meta: [{ title: "Preprocessing Engine — SentinelFace" }] }),
  component: PreprocessingPage,
});

const TOGGLEABLE = ["resize", "normalize", "equalize", "denoise"];

function PreprocessingPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    resize: true,
    normalize: true,
    equalize: true,
    denoise: true,
  });

  const filterStyle = useMemo(() => {
    const parts: string[] = [];
    if (enabled.normalize) parts.push("brightness(1.05) saturate(1.05)");
    if (enabled.equalize) parts.push("contrast(1.35)");
    if (enabled.denoise) parts.push("blur(0.4px)");
    return parts.join(" ") || "none";
  }, [enabled]);

  const activeCount = TOGGLEABLE.filter((k) => enabled[k]).length;

  return (
    <div>
      <PageHeading
        icon={Wand2}
        title="Image Preprocessing Engine"
        subtitle="Module 4 · Raw frame → normalized FaceNet input tensor"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEnabled({ resize: true, normalize: true, equalize: true, denoise: true })}
          >
            <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
          </Button>
        }
      />

      {/* Pipeline strip */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Pipeline ({activeCount + 1}/{PREPROCESSING_STAGES.length} stages active)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-stretch gap-2">
            {PREPROCESSING_STAGES.map((stage, i) => {
              const isToggle = TOGGLEABLE.includes(stage.key);
              const on = !isToggle || enabled[stage.key];
              return (
                <div key={stage.key} className="flex items-stretch gap-2">
                  <div
                    className={cn(
                      "w-44 rounded-xl border p-3 transition-colors",
                      on ? "border-primary/40 bg-primary/5" : "border-dashed border-border bg-muted/40 opacity-60",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Stage {i + 1}
                      </span>
                      <StatusPill tone={on ? "success" : "muted"}>{on ? "On" : "Off"}</StatusPill>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold">{stage.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stage.detail}</p>
                    <p className="mt-2 font-mono text-[11px] text-primary">{stage.shape}</p>
                  </div>
                  {i < PREPROCESSING_STAGES.length - 1 && (
                    <ArrowRight className="my-auto h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Before / After Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <figure>
                <div className="overflow-hidden rounded-lg border border-border">
                  <img src={classroom} alt="Raw input frame" className="aspect-square w-full object-cover" />
                </div>
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">Raw input · 1920 × 1080 × 3</figcaption>
              </figure>
              <figure>
                <div className="overflow-hidden rounded-lg border border-primary/40">
                  <img
                    src={classroom}
                    alt="Processed input tensor preview"
                    className={cn("aspect-square w-full object-cover transition-all", enabled.equalize && "saturate-150")}
                    style={{ filter: filterStyle, imageRendering: enabled.resize ? "pixelated" : "auto" }}
                  />
                </div>
                <figcaption className="mt-2 text-center text-xs text-primary">
                  Processed tensor · {enabled.resize ? "160 × 160 × 3" : "1920 × 1080 × 3"}
                </figcaption>
              </figure>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stage Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PREPROCESSING_STAGES.filter((s) => TOGGLEABLE.includes(s.key)).map((stage) => (
              <div key={stage.key} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-medium">{stage.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{stage.detail}</p>
                </div>
                <Switch
                  checked={enabled[stage.key]}
                  onCheckedChange={(v) => setEnabled((p) => ({ ...p, [stage.key]: v }))}
                />
              </div>
            ))}
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              Output feeds <span className="font-medium text-foreground">FaceNet (InceptionResNetV1)</span> for 512-D embedding extraction.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

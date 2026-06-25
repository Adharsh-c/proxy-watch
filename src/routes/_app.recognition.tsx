import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Fingerprint, ArrowRight } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { buildEmbedding, MATCH_CANDIDATES } from "@/lib/ml-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/recognition")({
  head: () => ({ meta: [{ title: "Recognition Console — SentinelFace" }] }),
  component: RecognitionPage,
});

const EMBEDDING = buildEmbedding(42, 512);

function RecognitionPage() {
  const [threshold, setThreshold] = useState(0.6);

  const ranked = useMemo(
    () => [...MATCH_CANDIDATES].sort((a, b) => b.similarity - a.similarity),
    [],
  );
  const best = ranked[0];
  const matched = best.similarity >= threshold;

  return (
    <div>
      <PageHeading
        icon={Fingerprint}
        title="Feature Extraction & Recognition"
        subtitle="Module 6 · FaceNet (InceptionResNetV1) → 512-D embedding · cosine similarity"
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Architecture flow */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Extraction Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { t: "Aligned Face", s: "160 × 160 × 3" },
                { t: "InceptionResNetV1", s: "FaceNet backbone" },
                { t: "L2 Normalize", s: "unit hypersphere" },
                { t: "Embedding", s: "512-D vector" },
              ].map((n, i, arr) => (
                <div key={n.t} className="flex items-center gap-3">
                  <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                    <p className="text-sm font-semibold">{n.t}</p>
                    <p className="font-mono text-[11px] text-primary">{n.s}</p>
                  </div>
                  {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assigned Identity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{best.name}</p>
            <p className="font-mono text-sm text-muted-foreground">{best.registerNo}</p>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Top cosine similarity</span>
              <span className="font-mono text-lg font-bold text-primary">{best.similarity.toFixed(2)}</span>
            </div>
            <div className="mt-3">
              <StatusPill tone={matched ? "success" : "danger"} dot>
                {matched ? "Match Accepted" : "Below Threshold — Rejected"}
              </StatusPill>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 512-D vector */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">512-Dimensional Feature Vector</CardTitle>
            <StatusPill tone="primary">float32 · {EMBEDDING.length} dims</StatusPill>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-1 sm:grid-cols-8 md:grid-cols-12">
              {EMBEDDING.slice(0, 96).map((v, i) => {
                const intensity = Math.min(1, Math.abs(v) / 0.18);
                return (
                  <div
                    key={i}
                    title={`dim ${i}: ${v}`}
                    className="rounded px-1 py-1.5 text-center font-mono text-[9px] leading-none text-foreground"
                    style={{
                      backgroundColor: `color-mix(in oklab, var(--primary) ${Math.round(intensity * 70)}%, transparent)`,
                    }}
                  >
                    {v.toFixed(2)}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Showing first 96 of 512 dimensions. Brighter cells indicate larger activation magnitude.
            </p>
          </CardContent>
        </Card>

        {/* Match threshold + candidates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Match Threshold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Range 0.60 – 0.75</span>
                <span className="font-mono text-lg font-bold text-primary">{threshold.toFixed(2)}</span>
              </div>
              <Slider value={[threshold]} min={0.6} max={0.75} step={0.01} onValueChange={([v]) => setThreshold(v)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gallery Candidates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ranked.map((c) => {
                const ok = c.similarity >= threshold;
                return (
                  <div
                    key={c.registerNo}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-2",
                      ok ? "border-success/30 bg-success/5" : "border-border",
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{c.registerNo}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-mono text-sm font-semibold", ok ? "text-success" : "text-muted-foreground")}>
                        {c.similarity.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{ok ? "match" : "reject"}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

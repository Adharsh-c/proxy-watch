import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, Flame, TrendingDown, Sparkles } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

import { PageHeading } from "@/components/page-heading";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ABSENCE_RISK, ATTENDANCE_FORECAST } from "@/lib/ml-data";
import { cn } from "@/lib/utils";
import classroom from "@/assets/classroom-feed.jpg";

export const Route = createFileRoute("/_app/insights")({
  head: () => ({ meta: [{ title: "AI Insights & XAI — SentinelFace" }] }),
  component: InsightsPage,
});

const riskTone = { high: "danger", medium: "warning", low: "success" } as const;

function InsightsPage() {
  const [heatmap, setHeatmap] = useState(true);

  return (
    <div>
      <PageHeading
        icon={Sparkles}
        title="AI Insights & Explainability"
        subtitle="Hackathon extensions · Grad-CAM XAI + predictive attendance analytics"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* XAI Grad-CAM */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Grad-CAM Explainability</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              Heatmap <Switch checked={heatmap} onCheckedChange={setHeatmap} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-lg border border-border">
              <img
                src={classroom}
                alt="Grad-CAM input"
                className="aspect-square w-full object-cover"
              />
              {heatmap && (
                <>
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 45%, rgba(239,68,68,0.6), rgba(245,158,11,0.4) 25%, rgba(16,185,129,0.15) 45%, transparent 60%), radial-gradient(circle at 68% 48%, rgba(239,68,68,0.55), rgba(245,158,11,0.35) 22%, transparent 55%)",
                      mixBlendMode: "screen",
                    }}
                  />
                  <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                    Activation map · layer block8
                  </span>
                </>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Warm regions show pixels most influential to the recognition decision — concentrated
              on facial landmarks (eyes, nose, mouth).
            </p>
          </CardContent>
        </Card>

        {/* Forecast */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Attendance Trend Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ATTENDANCE_FORECAST}
                  margin={{ top: 8, right: 16, bottom: 0, left: -16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    domain={[60, 100]}
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <ReferenceLine
                    y={75}
                    stroke="var(--color-warning, #f59e0b)"
                    strokeDasharray="4 4"
                    label={{ value: "75% floor", fontSize: 10, fill: "#f59e0b" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="Predicted"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    strokeDasharray="6 4"
                    dot={{ r: 3 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-warning-foreground">
              <TrendingDown className="h-4 w-4" />
              Model projects a <span className="font-semibold">~7% decline</span> over the next 3
              weeks, breaching the 75% floor.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chronic absence risk */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-danger" />
            <CardTitle className="text-base">Chronic Absence Risk Prediction</CardTitle>
          </div>
          <StatusPill tone="danger">
            {ABSENCE_RISK.filter((r) => r.risk === "high").length} high risk
          </StatusPill>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Register No</th>
                  <th className="pb-2 pr-4 font-medium">Student</th>
                  <th className="pb-2 pr-4 font-medium">Current %</th>
                  <th className="pb-2 pr-4 font-medium">Predicted %</th>
                  <th className="pb-2 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody>
                {ABSENCE_RISK.map((r) => (
                  <tr key={r.registerNo} className="border-b border-border/60">
                    <td className="py-2.5 pr-4 font-mono text-xs">{r.registerNo}</td>
                    <td className="py-2.5 pr-4 font-medium">{r.name}</td>
                    <td className="py-2.5 pr-4">{r.current}%</td>
                    <td
                      className={cn(
                        "py-2.5 pr-4 font-semibold",
                        r.predicted < r.current ? "text-danger" : "text-success",
                      )}
                    >
                      {r.predicted}%
                    </td>
                    <td className="py-2.5">
                      <StatusPill tone={riskTone[r.risk]}>{r.risk}</StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

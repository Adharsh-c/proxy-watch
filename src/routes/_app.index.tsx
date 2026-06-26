import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeading } from "@/components/page-heading";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SUBJECT_DISTRIBUTION,
  MONTHLY_TREND,
  DEFAULTER_THRESHOLD,
} from "@/lib/mock-data";
import { useDashboardState } from "@/lib/dashboard-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Dashboard — SentinelFace" }] }),
  component: Dashboard,
});

const toneBg: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  danger: "bg-danger/12 text-danger",
  info: "bg-info/12 text-info",
};

function Dashboard() {
  const { department, subject, students } = useDashboardState();

  const filteredStudents = students.filter(
    (s) => s.department === department && s.subject === subject,
  );
  const presentCount = filteredStudents.filter((s) => s.attendance >= DEFAULTER_THRESHOLD).length;
  const absentCount = filteredStudents.length - presentCount;
  const overallAttendance = filteredStudents.length
    ? (filteredStudents.reduce((sum, s) => sum + s.attendance, 0) / filteredStudents.length).toFixed(1)
    : "0.0";
  const defaulters = filteredStudents
    .filter((s) => s.attendance < DEFAULTER_THRESHOLD)
    .sort((a, b) => a.attendance - b.attendance);

  const KPI_CARDS = [
    {
      label: "Total Students",
      value: filteredStudents.length,
      icon: Users,
      tone: "primary",
      delta: "+4.2%",
      up: true,
    },
    {
      label: "Present",
      value: presentCount,
      icon: UserCheck,
      tone: "success",
      delta: "",
      up: true,
    },
    {
      label: "Absent",
      value: absentCount,
      icon: UserX,
      tone: "danger",
      delta: "",
      up: false,
    },
    {
      label: "Avg Attendance",
      value: `${overallAttendance}%`,
      icon: TrendingUp,
      tone: "info",
      delta: "",
      up: true,
    },
  ] as const;

  return (
    <div>
      <PageHeading
        icon={LayoutDashboard}
        title="Faculty Dashboard"
        subtitle={`Live attendance analytics for ${department} · ${subject}`}
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-1.5 h-4 w-4" /> Export
          </Button>
        }
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CARDS.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      toneBg[k.tone],
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-medium",
                      k.up ? "text-success" : "text-danger",
                    )}
                  >
                    {k.up ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {k.delta}
                  </span>
                </div>
                <p className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">
                  {k.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Subject-wise Attendance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SUBJECT_DISTRIBUTION} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.92 0.012 256)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="subject"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="oklch(0.52 0.03 257)"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="oklch(0.52 0.03 257)"
                  />
                  <Tooltip
                    cursor={{ fill: "oklch(0.965 0.008 264)" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid oklch(0.92 0.012 256)",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="present"
                    name="Present"
                    fill="oklch(0.51 0.21 277)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="absent"
                    name="Absent"
                    fill="oklch(0.85 0.05 18)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Monthly Trend (Jan–May)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_TREND}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.92 0.012 256)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="oklch(0.52 0.03 257)"
                  />
                  <YAxis
                    domain={[60, 100]}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="oklch(0.52 0.03 257)"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid oklch(0.92 0.012 256)",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    name="Attendance %"
                    stroke="oklch(0.66 0.16 156)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "oklch(0.66 0.16 156)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Defaulter list */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Defaulter List</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Students below {DEFAULTER_THRESHOLD}% attendance criteria
            </p>
          </div>
          <StatusPill tone="danger" dot>
            {defaulters.length} at risk
          </StatusPill>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Register No</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Section</th>
                  <th className="px-3 py-2 text-right font-medium">Attendance</th>
                  <th className="px-3 py-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.map((s) => (
                  <tr key={s.id} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-3 font-medium text-foreground">{s.registerNo}</td>
                    <td className="px-3 py-3">{s.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{s.department}</td>
                    <td className="px-3 py-3 text-muted-foreground">{s.section}</td>
                    <td className="px-3 py-3 text-right font-semibold text-danger">
                      {s.attendance}%
                    </td>
                    <td className="px-3 py-3 text-right">
                      <StatusPill tone="danger">Defaulter</StatusPill>
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

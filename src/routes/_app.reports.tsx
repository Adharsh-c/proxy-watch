import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, FileText, FileSpreadsheet, FileDown } from "lucide-react";
import { toast } from "sonner";

import { PageHeading } from "@/components/page-heading";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { STUDENTS, SUBJECTS, SECTIONS, DEFAULTER_THRESHOLD } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — SentinelFace" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const exportAs = (fmt: string) => {
    toast.success(`Exporting ${fmt}`, { description: "Report generated with current filters applied." });
  };

  return (
    <div>
      <PageHeading
        icon={BarChart3}
        title="Reports & Exports"
        subtitle="Filterable attendance extraction by subject, date or section"
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select defaultValue={SUBJECTS[0]}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Section</Label>
              <Select defaultValue={SECTIONS[0]}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>From Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <Label>To Date</Label>
              <Input type="date" />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => exportAs("PDF")}>
              <FileText className="mr-1.5 h-4 w-4" /> Export PDF
            </Button>
            <Button variant="outline" onClick={() => exportAs("Excel")}>
              <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Export Excel
            </Button>
            <Button variant="outline" onClick={() => exportAs("CSV")}>
              <FileDown className="mr-1.5 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Register No</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Year</th>
                  <th className="px-3 py-2 font-medium">Section</th>
                  <th className="px-3 py-2 text-right font-medium">Attendance</th>
                  <th className="px-3 py-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map((s) => {
                  const low = s.attendance < DEFAULTER_THRESHOLD;
                  return (
                    <tr key={s.id} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-3 font-medium text-foreground">{s.registerNo}</td>
                      <td className="px-3 py-3">{s.name}</td>
                      <td className="px-3 py-3 text-muted-foreground">{s.department}</td>
                      <td className="px-3 py-3 text-muted-foreground">{s.year}</td>
                      <td className="px-3 py-3 text-muted-foreground">{s.section}</td>
                      <td className={cn("px-3 py-3 text-right font-semibold", low ? "text-danger" : "text-success")}>
                        {s.attendance}%
                      </td>
                      <td className="px-3 py-3 text-right">
                        <StatusPill tone={low ? "danger" : "success"}>
                          {low ? "Defaulter" : "Eligible"}
                        </StatusPill>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

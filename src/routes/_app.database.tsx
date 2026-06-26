import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Database, HardDrive, DownloadCloud, RefreshCw, Server, Table2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeading } from "@/components/page-heading";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DB_TABLES, DB_TABLE_RECORDS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/database")({
  head: () => ({ meta: [{ title: "Database Admin — SentinelFace" }] }),
  component: DatabasePage,
});

function DatabasePage() {
  const [backing, setBacking] = useState(false);
  const [lastBackup, setLastBackup] = useState("Today, 02:00 AM");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const totalRecords = DB_TABLES.reduce((s, t) => s + t.records, 0);
  const totalSize = DB_TABLES.reduce((s, t) => s + t.sizeMb, 0);
  const selectedDetails = selectedTable ? DB_TABLE_RECORDS[selectedTable] : null;

  const backup = () => {
    setBacking(true);
    toast.info("Backup started", { description: "Snapshotting all tables to encrypted storage…" });
    setTimeout(() => {
      setBacking(false);
      setLastBackup("Just now");
      toast.success("Backup complete", {
        description: `${totalRecords.toLocaleString()} records archived`,
      });
    }, 2200);
  };

  return (
    <div>
      <PageHeading
        icon={Database}
        title="Database Administration"
        subtitle="MySQL / Supabase health overview and maintenance"
        actions={
          <Button size="sm" onClick={backup} disabled={backing}>
            {backing ? (
              <RefreshCw className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <DownloadCloud className="mr-1.5 h-4 w-4" />
            )}
            {backing ? "Backing up…" : "Backup Now"}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Server}
          label="Database Status"
          value="Online"
          tone="text-success"
          sub="99.98% uptime"
        />
        <SummaryCard
          icon={Table2}
          label="Total Records"
          value={totalRecords.toLocaleString()}
          sub="across 6 tables"
        />
        <SummaryCard
          icon={HardDrive}
          label="Storage Used"
          value={`${(totalSize / 1024).toFixed(2)} GB`}
          sub="of 10 GB"
        />
        <SummaryCard
          icon={DownloadCloud}
          label="Last Backup"
          value={lastBackup}
          sub="auto-scheduled daily"
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Table</th>
                  <th className="px-3 py-2 text-right font-medium">Records</th>
                  <th className="px-3 py-2 text-right font-medium">Size</th>
                  <th className="px-3 py-2 text-right font-medium">Last Updated</th>
                  <th className="px-3 py-2 font-medium">Load</th>
                  <th className="px-3 py-2 text-right font-medium">Health</th>
                </tr>
              </thead>
              <tbody>
                {DB_TABLES.map((t) => {
                  const loadPct = Math.min(100, Math.round((t.sizeMb / 1100) * 100));
                  const isSelected = selectedTable === t.name;
                  return (
                    <tr
                      key={t.name}
                      className={`border-b border-border/60 last:border-0 cursor-pointer transition-colors hover:bg-accent/10 ${
                        isSelected ? "bg-accent/20" : ""
                      }`}
                      onClick={() => setSelectedTable(t.name)}
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 font-medium text-foreground">
                          <Table2 className="h-4 w-4 text-primary" /> {t.name}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {t.records.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                        {t.sizeMb} MB
                      </td>
                      <td className="px-3 py-3 text-right text-xs text-muted-foreground">
                        {t.lastUpdated}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={loadPct} className="h-1.5 w-28" />
                          <span className="text-xs text-muted-foreground">{loadPct}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <StatusPill tone={t.health === "healthy" ? "success" : "warning"} dot>
                          {t.health === "healthy" ? "Healthy" : "Monitor"}
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Table Records</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDetails ? (
            <div>
              <div className="mb-4 flex items-center justify-between gap-4 rounded-md border border-border bg-muted px-4 py-3 text-sm text-foreground">
                <div>
                  Viewing <span className="font-semibold">{selectedTable}</span> records
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedTable(null)}>
                  Clear Selection
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      {selectedDetails.headers.map((header) => (
                        <th key={header} className="px-3 py-2 font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDetails.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-border/60 last:border-0">
                        {selectedDetails.headers.map((header) => (
                          <td key={header} className="px-3 py-3 text-muted-foreground">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
              Select a table row above to open the table and view sample records.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: typeof Server;
  label: string;
  value: string;
  sub: string;
  tone?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="h-4 w-4 text-primary" /> {label}
        </div>
        <p
          className={`mt-3 font-display text-2xl font-bold tracking-tight ${tone ?? "text-foreground"}`}
        >
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

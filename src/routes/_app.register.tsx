import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  UserPlus,
  Camera,
  ScanFace,
  CheckCircle2,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeading } from "@/components/page-heading";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS, YEARS, SECTIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/register")({
  head: () => ({ meta: [{ title: "Student Registration — SentinelFace" }] }),
  component: RegisterPage,
});

const TARGET = 10;

const PREPROCESS = [
  { key: "resize", label: "Resize 160×160", desc: "Standardize input dimensions" },
  { key: "normalize", label: "Normalization", desc: "Scale pixel intensity 0–1" },
  { key: "histogram", label: "Histogram Equalization", desc: "Improve contrast & lighting" },
];

function RegisterPage() {
  const [captured, setCaptured] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [pre, setPre] = useState<Record<string, boolean>>({
    resize: true,
    normalize: true,
    histogram: false,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => void (timerRef.current && clearInterval(timerRef.current)), []);

  const startCamera = () => {
    setCameraOn(true);
    toast.info("Camera initialized", { description: "Live feed active — position the face in frame" });
  };

  const autoCapture = () => {
    if (!cameraOn) {
      toast.error("Start the camera first");
      return;
    }
    if (capturing) return;
    setCapturing(true);
    timerRef.current = setInterval(() => {
      setCaptured((c) => {
        if (c >= TARGET) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCapturing(false);
          toast.success("Dataset complete", { description: `${TARGET}/${TARGET} face images captured` });
          return TARGET;
        }
        return c + 1;
      });
    }, 450);
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCapturing(false);
    setCaptured(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captured < TARGET) {
      toast.warning("Capture more images", {
        description: `${captured}/${TARGET} captured. Aim for 10 for best accuracy.`,
      });
      return;
    }
    toast.success("Student registered", { description: "Profile and embeddings saved to dataset" });
  };

  return (
    <div>
      <PageHeading
        icon={UserPlus}
        title="Student Registration"
        subtitle="Capture student details and build the face-recognition dataset"
      />

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Form */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Student Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <Field label="Register Number" placeholder="21CS011" required />
              <Field label="Full Name" placeholder="Ravi Teja" required />

              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Year / Batch</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Section</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Sec" /></SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Field label="Email" type="email" placeholder="ravi.t@uni.edu" required />
              <Field label="Mobile" type="tel" placeholder="+91 98765 43210" required />
              <Field label="Date of Birth" type="date" />

              <div className="flex items-end">
                <StatusPill tone={captured >= TARGET ? "success" : "warning"} dot className="mb-2">
                  Dataset {captured}/{TARGET}
                </StatusPill>
              </div>

              <div className="sm:col-span-2 flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  <Save className="mr-1.5 h-4 w-4" /> Register Student
                </Button>
                <Button type="reset" variant="outline" onClick={reset}>
                  <RotateCcw className="mr-1.5 h-4 w-4" /> Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Capture + preprocessing */}
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Face Image Capture</CardTitle>
              <StatusPill tone={cameraOn ? "success" : "muted"} dot>
                {cameraOn ? "Live" : "Offline"}
              </StatusPill>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera viewport */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-slate-900">
                {cameraOn ? (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 40%, oklch(0.35 0.04 265), oklch(0.18 0.03 265))",
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Camera className="h-8 w-8" />
                    <p className="text-xs">Camera offline</p>
                  </div>
                )}

                {/* Framing overlay */}
                {cameraOn && (
                  <>
                    <div className="absolute left-1/2 top-1/2 h-44 w-36 -translate-x-1/2 -translate-y-1/2">
                      <div
                        className={cn(
                          "h-full w-full rounded-[40%] border-2",
                          capturing ? "border-success animate-pulse" : "border-primary/80",
                        )}
                      />
                      <ScanFace className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white/30" />
                    </div>
                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 text-[11px] text-white">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" /> REC
                    </div>
                    <p className="absolute bottom-3 left-1/2 w-full -translate-x-1/2 px-3 text-center text-[11px] text-white/80">
                      Capture clear face images for better recognition accuracy
                    </p>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {!cameraOn ? (
                  <Button onClick={startCamera} className="flex-1">
                    <Camera className="mr-1.5 h-4 w-4" /> Start Camera
                  </Button>
                ) : (
                  <Button onClick={autoCapture} className="flex-1" disabled={capturing || captured >= TARGET}>
                    <Sparkles className="mr-1.5 h-4 w-4" />
                    {captured >= TARGET ? "Complete" : capturing ? "Capturing…" : "Auto Capture"}
                  </Button>
                )}
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Gallery */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Captured Images</span>
                  <span className="text-muted-foreground">{captured}/{TARGET}</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: TARGET }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "relative flex aspect-square items-center justify-center rounded-md border text-xs",
                        i < captured
                          ? "border-success/40 bg-success/10 text-success"
                          : "border-dashed border-border bg-muted/40 text-muted-foreground",
                      )}
                    >
                      {i < captured ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Image Preprocessing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {PREPROCESS.map((p) => (
                <div key={p.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                  <Switch
                    checked={pre[p.key]}
                    onCheckedChange={(v) => setPre((s) => ({ ...s, [p.key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} placeholder={placeholder} required={required} />
    </div>
  );
}

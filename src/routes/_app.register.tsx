import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { UserPlus, Camera, ScanFace, CheckCircle2, RotateCcw, Save, Sparkles } from "lucide-react";
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
import { useDashboardState } from "@/lib/dashboard-state";
import { DEPARTMENTS, YEARS, SECTIONS, SUBJECTS } from "@/lib/mock-data";
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
  const { addStudent } = useDashboardState();
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [pre, setPre] = useState<Record<string, boolean>>({
    resize: true,
    normalize: true,
    histogram: false,
  });
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [section, setSection] = useState(SECTIONS[0]);
  const [name, setName] = useState("");
  const [registerNo, setRegisterNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => undefined);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCameraOn(true);
      setCameraReady(false);
      toast.success("Camera initialized", {
        description: "Live feed active — position the face in frame.",
      });
    } catch (error) {
      toast.error("Unable to access camera", {
        description: "Please allow camera access or use a supported device.",
      });
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || !stream) {
      toast.error("Camera not ready", {
        description: "Start the camera before capturing images.",
      });
      return;
    }

    if (!video.videoWidth || !video.videoHeight) {
      toast.error("Camera feed not ready", {
        description: "Wait for the live preview before capturing images.",
      });
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedFrames((current) => {
      const next = [...current, dataUrl].slice(0, TARGET);
      if (next.length >= TARGET) {
        setCapturing(false);
        if (timerRef.current) clearInterval(timerRef.current);
        toast.success("Dataset complete", {
          description: `${TARGET}/${TARGET} face images captured`,
        });
      }
      return next;
    });
  };

  const autoCapture = () => {
    if (!cameraOn || !stream || !cameraReady) {
      toast.error("Start the camera first", {
        description: cameraReady
          ? "Camera is still initializing. Wait for the preview to appear."
          : "Please allow camera access and wait for the live preview.",
      });
      return;
    }
    if (capturing || capturedFrames.length >= TARGET) return;
    setCapturing(true);
    timerRef.current = setInterval(() => {
      if (capturedFrames.length >= TARGET) {
        if (timerRef.current) clearInterval(timerRef.current);
        setCapturing(false);
        return;
      }
      captureFrame();
    }, 450);
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCapturing(false);
    setCapturedFrames([]);
    setCameraReady(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerNo.trim() || !name.trim()) {
      toast.warning("Complete student details", {
        description: "Register number and full name are required.",
      });
      return;
    }

    if (capturedFrames.length < TARGET) {
      toast.warning("Capture more images", {
        description: `${capturedFrames.length}/${TARGET} captured. Aim for 10 for best accuracy.`,
      });
      return;
    }

    addStudent({
      registerNo,
      name,
      department,
      section,
      subject,
      attendance: 100,
      status: "Active",
      year,
      email,
      phone,
      dob,
      capturedImages: capturedFrames,
    });

    toast.success("Student registered", {
      description: "Profile and embeddings saved and student roster updated.",
    });

    setRegisterNo("");
    setName("");
    setEmail("");
    setPhone("");
    setDob("");
    setCapturedFrames([]);
    setCameraOn(false);
    setCapturing(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
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
              <Field
                label="Register Number"
                placeholder="21CS011"
                required
                value={registerNo}
                onChange={(event) => setRegisterNo(event.currentTarget.value)}
              />
              <Field
                label="Full Name"
                placeholder="Ravi Teja"
                required
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
              />

              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Year / Batch</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Section</Label>
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Field
                label="Email"
                type="email"
                placeholder="ravi.t@uni.edu"
                required
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
              />
              <Field
                label="Mobile"
                type="tel"
                placeholder="+91 98765 43210"
                required
                value={phone}
                onChange={(event) => setPhone(event.currentTarget.value)}
              />
              <Field
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(event) => setDob(event.currentTarget.value)}
              />

              <div className="flex items-end">
                <StatusPill tone={capturedFrames.length >= TARGET ? "success" : "warning"} dot className="mb-2">
                  Dataset {capturedFrames.length}/{TARGET}
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
                {cameraOn && stream ? (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    muted
                    playsInline
                    autoPlay
                    onCanPlay={() => setCameraReady(true)}
                  />
                ) : cameraOn ? (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <p className="text-xs">Initializing camera...</p>
                  </div>
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
                  <Button
                    onClick={autoCapture}
                    className="flex-1"
                    disabled={capturing || capturedFrames.length >= TARGET}
                  >
                    <Sparkles className="mr-1.5 h-4 w-4" />
                    {capturedFrames.length >= TARGET ? "Complete" : capturing ? "Capturing…" : "Auto Capture"}
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
                  <span className="text-muted-foreground">
                    {capturedFrames.length}/{TARGET}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: TARGET }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "relative flex aspect-square items-center justify-center overflow-hidden rounded-md border text-xs",
                        i < capturedFrames.length
                          ? "border-success/40 bg-success/10 text-success"
                          : "border-dashed border-border bg-muted/40 text-muted-foreground",
                      )}
                    >
                      {i < capturedFrames.length ? (
                        <img
                          src={capturedFrames[i]}
                          alt={`capture-${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{i + 1}</span>
                      )}
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
                <div
                  key={p.key}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
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
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

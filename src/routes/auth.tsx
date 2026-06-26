import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ScanEye, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { useAuth, type UserRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Sign in — SentinelFace" }],
  }),
  component: AuthPage,
});

const FEATURES = [
  "Real-time face recognition with cosine-similarity matching",
  "Liveness & anti-spoof proxy detection across rooms",
  "Faculty & admin analytics with defaulter tracking",
];

function AuthPage() {
  const { user, login, ready } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("faculty");
  const [email, setEmail] = useState("ramesh.kumar@university.edu");
  const [password, setPassword] = useState("demo1234");

  useEffect(() => {
    if (ready && user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = login(role);
    toast.success(`Welcome back, ${u.name}`, { description: `Signed in as ${u.title}` });
    navigate({ to: "/" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 opacity-30 auth-auth-hero-bg" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sidebar-primary shadow-lg">
            <ScanEye className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">SentinelFace</p>
            <p className="text-xs text-white/60">Attendance Intelligence Platform</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight">
            Smart Attendance & Proxy-Detection System
          </h1>
          <p className="mt-4 text-white/70">
            Enterprise-grade facial recognition attendance with liveness verification and cross-room
            proxy intelligence.
          </p>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">
          © 2026 SentinelFace · Secured by AES-256 & on-device embeddings
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <ScanEye className="h-5 w-5" />
              </div>
              <p className="font-display text-lg font-bold">SentinelFace</p>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight">Sign in to continue</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select your access role to enter the console.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {(["faculty", "admin"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setEmail(
                    r === "faculty" ? "ramesh.kumar@university.edu" : "anita.sharma@university.edu",
                  );
                }}
                className={cn(
                  "rounded-lg border px-4 py-3 text-left text-sm font-medium capitalize transition-all",
                  role === r
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40",
                )}
              >
                {r}
                <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
                  {r === "faculty" ? "Class & reports" : "Full system access"}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              New to SentinelFace?{" "}
              <Link
                to="/pricing"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                View pricing plans
              </Link>{" "}
              and start your free trial.
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign in <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo credentials are pre-filled. Just press sign in.
          </p>
        </div>
      </div>
    </div>
  );
}

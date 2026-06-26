import { createFileRoute } from "@tanstack/react-router";
import { Bolt, ShieldCheck, Layers, CheckCircle2 } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/status-pill";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — SentinelFace" }] }),
  component: PricingPage,
});

const PLANS = [
  {
    name: "Starter",
    price: "$49",
    interval: "mo",
    description: "Pilot deployment for small classrooms and labs.",
    features: [
      "50 student profiles",
      "Basic AI attendance tracking",
      "Proxy detection alerts",
      "Email support",
    ],
    recommended: false,
  },
  {
    name: "Growth",
    price: "$129",
    interval: "mo",
    description: "Best for campus-wide attendance, analytics and reporting.",
    features: [
      "250 student profiles",
      "Full liveness checks",
      "Live detection dashboards",
      "Priority support",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    interval: "",
    description: "Custom deployments, integrations, and enterprise security.",
    features: [
      "Unlimited profiles",
      "Advanced AI optimization",
      "Dedicated account manager",
      "SLA & compliance support",
    ],
    recommended: false,
  },
];

function PricingPage() {
  return (
    <div>
      <PageHeading
        icon={Bolt}
        title="SentinelFace SaaS Plans"
        subtitle="Choose the best plan for your campus or enterprise deployment."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.recommended ? "border-primary shadow-[0_0_0_1px_rgba(79,70,229,0.35)]" : ""
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                {plan.recommended ? <StatusPill tone="success">Recommended</StatusPill> : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-4xl font-semibold tracking-tight text-foreground">
                  {plan.price}
                </p>
                <p className="text-sm text-muted-foreground">
                  {plan.interval ? `${plan.interval} billed monthly` : "Custom quote"}
                </p>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full" variant={plan.recommended ? "default" : "outline"}>
                {plan.price === "Custom" ? "Contact sales" : "Start free trial"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-10 rounded-3xl border border-border bg-card p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Need a custom deployment?</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              We support advanced campus integrations, attendance audits, and security compliance
              for large institutions.
            </p>
          </div>
          <Button variant="secondary">Request a consultation</Button>
        </div>
      </section>
    </div>
  );
}

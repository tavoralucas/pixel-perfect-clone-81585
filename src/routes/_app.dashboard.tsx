import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader, Badge, Btn } from "@/components/ui-kit";
import { recentActivity, usageSeries } from "@/lib/mockData";
import {
  Activity, Server, DollarSign, Wallet, ArrowUpRight, Plus, KeyRound, Boxes, CheckCircle2, AlertTriangle, XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — GPU Cloud Console" },
      { name: "description", content: "Resumo geral da sua conta GPU Cloud." },
    ],
  }),
  component: Dashboard,
});

function MetricCard({
  label, value, delta, icon: Icon, tone = "primary",
}: {
  label: string; value: string; delta?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone?: "primary" | "info" | "success" | "warning";
}) {
  const toneBg: Record<string, string> = {
    primary: "bg-primary-light text-primary",
    info: "bg-info-bg text-info",
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className={`h-9 w-9 rounded-md flex items-center justify-center ${toneBg[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        {delta && (
          <span className="inline-flex items-center text-xs font-medium text-success">
            <ArrowUpRight className="h-3 w-3" /> {delta}
          </span>
        )}
      </div>
      <div className="mt-4 text-xs uppercase tracking-wide text-muted-foreground font-medium">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </Card>
  );
}

function Dashboard() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Bom dia, Mateus 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Aqui está um resumo da sua conta.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <MetricCard label="Pods Ativos" value="3" delta="+1 hoje" icon={Server} tone="primary" />
        <MetricCard label="Requests de API (hoje)" value="14.823" delta="+12%" icon={Activity} tone="info" />
        <MetricCard label="Custo do Mês" value="R$ 892,40" delta="vs R$ 743,20" icon={DollarSign} tone="success" />
        <MetricCard label="Créditos Restantes" value="R$ 248,50" icon={Wallet} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Uso combinado</h2>
              <p className="text-xs text-muted-foreground">Requests de API e horas de pod nos últimos {period}</p>
            </div>
            <div className="inline-flex rounded-md border border-border p-0.5 bg-surface-2">
              {(["7d", "30d", "90d"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 text-xs font-medium rounded ${
                    period === p ? "bg-surface shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageSeries}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="requests" name="Requests" stroke="var(--color-primary)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="podHours" name="Horas de pod" stroke="var(--color-chart-3)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold mb-1">Ações rápidas</h2>
          <p className="text-xs text-muted-foreground mb-4">Comece em segundos.</p>
          <div className="space-y-2">
            <Btn className="w-full justify-start"><Plus className="h-4 w-4" /> Novo Pod</Btn>
            <Btn variant="secondary" className="w-full justify-start"><KeyRound className="h-4 w-4" /> Gerar API Key</Btn>
            <Btn variant="secondary" className="w-full justify-start"><Boxes className="h-4 w-4" /> Ver catálogo</Btn>
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Saldo</span>
              <Badge tone="warning">Recarga sugerida</Badge>
            </div>
            <div className="text-2xl font-bold">R$ 248,50</div>
            <div className="text-xs text-muted-foreground mt-1">A taxa atual, dura ~106 horas.</div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold">Atividade recente</h2>
            <p className="text-xs text-muted-foreground">Últimos eventos da sua conta</p>
          </div>
          <Btn variant="ghost" size="sm">Ver tudo</Btn>
        </div>
        <ul className="divide-y divide-border">
          {recentActivity.map((a, i) => {
            const Icon = a.kind === "ok" ? CheckCircle2 : a.kind === "warn" ? AlertTriangle : XCircle;
            const tone = a.kind === "ok" ? "text-success" : a.kind === "warn" ? "text-warning" : "text-danger";
            return (
              <li key={i} className="py-2.5 flex items-center gap-3">
                <Icon className={`h-4 w-4 ${tone}`} />
                <span className="text-sm flex-1">{a.text}</span>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Badge, Btn, Card, PageHeader } from "@/presentation/components/ui/ui-kit";
import { PageMeta } from "@/presentation/components/PageMeta";
import { useApi } from "@/presentation/hooks/useApi";
import { Plus, CreditCard } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const modelRows = [
  { model: "Llama 3 70B", provider: "Meta", tokens: "12,4M", reqs: "18.420", cost: "R$ 52,30" },
  { model: "SDXL Turbo", provider: "Stability AI", tokens: "—", reqs: "5.103 img", cost: "R$ 33,80" },
  { model: "Whisper Large v3", provider: "OpenAI", tokens: "—", reqs: "891 min", cost: "R$ 19,20" },
  { model: "BGE Large PT", provider: "BAAI", tokens: "34,2M", reqs: "58.741", cost: "R$ 22,10" },
];

const podRows = [
  { pod: "pytorch-training-01", gpu: "A40", run: "187h", idle: "23h", cost: "R$ 413,20" },
  { pod: "comfyui-studio", gpu: "RTX 4090", run: "62h", idle: "18h", cost: "R$ 214,50" },
  { pod: "whisper-batch", gpu: "L4", run: "10h", idle: "2h", cost: "R$ 20,60" },
];

export function BillingPage() {
  const api = useApi();
  const { data: billingDaily = [] } = useQuery({ queryKey: ["billing-daily"], queryFn: () => api.getBillingDaily() });

  return (
    <div>
      <PageMeta title="Billing" description="Saldo, créditos e consumo da sua conta." />
      <PageHeader title="Billing" subtitle="Saldo, créditos e consumo da sua conta." />

      <Card className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Saldo atual</div>
            <div className="mt-1 text-4xl font-bold">R$ 248,50</div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              <Badge tone="info">Spend limit: R$ 400,00/h</Badge>
              <Badge tone="primary">Taxa atual: R$ 2,33/h</Badge>
            </div>
          </div>
          <div className="lg:w-[420px]">
            <div className="text-sm font-medium mb-2">Adicionar créditos</div>
            <div className="flex flex-wrap gap-2">
              {["R$ 50", "R$ 100", "R$ 200", "R$ 500"].map((v) => (
                <button key={v} className="px-3 py-1.5 text-sm rounded-md border border-border hover:border-primary hover:bg-primary-light">{v}</button>
              ))}
              <button className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted">Outro</button>
            </div>
            <Btn className="w-full mt-3"><CreditCard className="h-4 w-4" /> Pagar com cartão</Btn>
          </div>
        </div>
      </Card>

      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Consumo diário · Junho 2025</h2>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={billingDaily}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="pods" name="Pods GPU" stackId="a" fill="var(--color-chart-1)" />
              <Bar dataKey="api" name="API Inference" stackId="a" fill="var(--color-chart-2)" />
              <Bar dataKey="storage" name="Storage" stackId="a" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="px-5 py-3 border-b border-border font-semibold">Consumo por Modelo (mês atual)</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-2.5">Modelo</th>
                  <th className="text-left font-medium px-4 py-2.5">Tokens</th>
                  <th className="text-left font-medium px-4 py-2.5">Reqs</th>
                  <th className="text-right font-medium px-4 py-2.5">Custo</th>
                </tr>
              </thead>
              <tbody>
                {modelRows.map((r) => (
                  <tr key={r.model} className="border-t border-border hover:bg-surface-2/60">
                    <td className="px-4 py-2.5">
                      <div className="font-medium">{r.model}</div>
                      <div className="text-xs text-muted-foreground">{r.provider}</div>
                    </td>
                    <td className="px-4 py-2.5 font-mono">{r.tokens}</td>
                    <td className="px-4 py-2.5 font-mono">{r.reqs}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{r.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="px-5 py-3 border-b border-border font-semibold">Consumo por Pod (mês atual)</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-2.5">Pod</th>
                  <th className="text-left font-medium px-4 py-2.5">GPU</th>
                  <th className="text-right font-medium px-4 py-2.5">Run / Idle</th>
                  <th className="text-right font-medium px-4 py-2.5">Custo</th>
                </tr>
              </thead>
              <tbody>
                {podRows.map((r) => (
                  <tr key={r.pod} className="border-t border-border hover:bg-surface-2/60">
                    <td className="px-4 py-2.5 font-medium">{r.pod}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{r.gpu}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{r.run} / {r.idle}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{r.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Formas de pagamento</div>
            <p className="text-xs text-muted-foreground">Nenhuma forma cadastrada.</p>
          </div>
          <Btn variant="secondary"><Plus className="h-4 w-4" /> Adicionar cartão</Btn>
        </div>
      </Card>
    </div>
  );
}

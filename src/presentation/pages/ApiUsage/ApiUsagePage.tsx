import { Card, PageHeader } from "@/presentation/components/ui/ui-kit";
import { PageMeta } from "@/presentation/components/PageMeta";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const data = Array.from({ length: 7 }).map((_, i) => ({
  day: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i],
  "Llama 3 70B": 1800 + Math.round(Math.sin(i) * 600 + 1400),
  "SDXL Turbo": 400 + i * 80,
  "Whisper v3": 80 + i * 12,
  "BGE Large PT": 5200 + Math.round(Math.cos(i) * 1500 + 3000),
}));

const rows = [
  { model: "Llama 3 70B", provider: "Meta", d24: "3.241", d7: "18.420", tokens: "12,4M", cost: "R$ 52,30" },
  { model: "SDXL Turbo", provider: "Stability AI", d24: "847", d7: "5.103", tokens: "—", cost: "R$ 33,80" },
  { model: "Whisper Large v3", provider: "OpenAI", d24: "124", d7: "891", tokens: "—", cost: "R$ 19,20" },
  { model: "BGE Large PT", provider: "BAAI", d24: "9.812", d7: "58.741", tokens: "34,2M", cost: "R$ 22,10" },
];

export function ApiUsagePage() {
  return (
    <div>
      <PageMeta title="Modelos em Uso" description="Consumo da sua API de inferência em tempo real." />
      <PageHeader title="Modelos em Uso" subtitle="Consumo da sua API de inferência em tempo real." />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {[
          { label: "Requests (hoje)", value: "14.823" },
          { label: "Tokens consumidos (mês)", value: "48,2M" },
          { label: "Custo acumulado (mês)", value: "R$ 127,40" },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{s.label}</div>
            <div className="mt-1 text-2xl font-bold">{s.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5 mb-6">
        <h2 className="font-semibold mb-4">Consumo por modelo · últimos 7 dias</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Llama 3 70B" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="SDXL Turbo" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Whisper v3" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="BGE Large PT" stroke="var(--color-chart-5)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Modelo</th>
                <th className="text-left font-medium px-4 py-3">Provider</th>
                <th className="text-right font-medium px-4 py-3">24h</th>
                <th className="text-right font-medium px-4 py-3">7d</th>
                <th className="text-right font-medium px-4 py-3">Tokens</th>
                <th className="text-right font-medium px-4 py-3">Custo (mês)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.model} className="border-t border-border hover:bg-surface-2/60">
                  <td className="px-4 py-3 font-medium">{r.model}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.provider}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.d24}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.d7}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.tokens}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

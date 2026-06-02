import { createFileRoute } from "@tanstack/react-router";
import { Badge, Btn, Card, PageHeader } from "@/components/ui-kit";
import { models, type ModelCard } from "@/lib/mockData";
import { Search, Image as ImageIcon, MessageSquare, Mic, Eye, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_app/api/catalog")({
  head: () => ({ meta: [{ title: "Catálogo de Modelos — GPU Cloud" }] }),
  component: CatalogPage,
});

const categories = ["Todos", "LLM", "Geração de Imagem", "Embeddings", "Áudio", "Visão"] as const;
const statuses = ["Todos", "Disponível", "Beta", "Descontinuado"] as const;

const catIcon: Record<ModelCard["category"], React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "LLM": MessageSquare,
  "Geração de Imagem": ImageIcon,
  "Embeddings": Sparkles,
  "Áudio": Mic,
  "Visão": Eye,
};

const catColor: Record<ModelCard["category"], string> = {
  "LLM": "bg-info-bg text-info",
  "Geração de Imagem": "bg-primary-light text-primary",
  "Embeddings": "bg-warning-bg text-warning",
  "Áudio": "bg-success-bg text-success",
  "Visão": "bg-muted text-foreground/70",
};

function CatalogPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>("Todos");
  const [st, setSt] = useState<(typeof statuses)[number]>("Todos");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      models.filter(
        (m) =>
          (cat === "Todos" || m.category === cat) &&
          (st === "Todos" || m.status === st) &&
          (q === "" || m.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [cat, st, q],
  );

  return (
    <div>
      <PageHeader title="Catálogo de Modelos" subtitle="Modelos prontos para usar via API de inferência." />

      <Card className="p-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                cat === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground/70 hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setSt(s)}
                className={`text-xs px-2.5 py-1 rounded-full border ${
                  st === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar modelo…"
              className="h-9 w-64 rounded-md border border-border bg-surface pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((m) => {
          const Icon = catIcon[m.category];
          return (
            <Card key={m.name} className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-md flex items-center justify-center ${catColor[m.category]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <Badge tone={m.status === "Disponível" ? "success" : m.status === "Beta" ? "warning" : "neutral"}>
                  {m.status}
                </Badge>
              </div>
              <div className="font-semibold leading-tight">{m.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{m.provider} · {m.category}</div>

              <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Latência</span><span className="font-mono">{m.latency}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Preço</span><span className="font-mono">{m.price}</span></div>
              </div>

              <div className="mt-4 flex gap-2">
                <Btn variant="secondary" size="sm" className="flex-1">Ver docs</Btn>
                <Btn size="sm" className="flex-1">Usar via API</Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

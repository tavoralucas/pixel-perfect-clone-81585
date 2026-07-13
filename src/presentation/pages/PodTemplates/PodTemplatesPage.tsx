import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge, Btn, Card, PageHeader } from "@/presentation/components/ui/ui-kit";
import { PageMeta } from "@/presentation/components/PageMeta";
import { useApi } from "@/presentation/hooks/useApi";
import { Box } from "lucide-react";

const filters = ["Todos", "Oficial", "Verificado", "Comunidade"] as const;
const tabs = ["Repos Serverless", "Templates de Pod", "Endpoints Públicos"] as const;

export function PodTemplatesPage() {
  const api = useApi();
  const { data: templates = [] } = useQuery({ queryKey: ["templates"], queryFn: () => api.listTemplates() });
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [tab, setTab] = useState<(typeof tabs)[number]>("Templates de Pod");
  const items = templates.filter((t) => filter === "Todos" || t.type === filter);

  return (
    <div>
      <PageMeta title="Templates" description="Imagens prontas para deploy rápido." />
      <PageHeader title="Hub de Templates" subtitle="Imagens prontas para deploy rápido." />

      <div className="flex items-center gap-1 border-b border-border mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-2.5 py-1.5 rounded-full border ${
              filter === f ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((t) => (
          <Card key={t.name} className="p-5 group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-md bg-primary-light text-primary flex items-center justify-center">
                <Box className="h-5 w-5" />
              </div>
              <Badge tone={t.type === "Oficial" ? "success" : t.type === "Verificado" ? "info" : "neutral"}>
                {t.type === "Comunidade" ? "Comunidade" : `✓ ${t.type}`}
              </Badge>
            </div>
            <div className="font-semibold text-sm leading-tight">{t.name}</div>
            <div className="font-mono text-[11px] text-muted-foreground mt-1 break-all">{t.image}</div>
            <Btn size="sm" className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Usar template</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge, Btn, Card, PageHeader } from "@/presentation/components/ui/ui-kit";
import { PageMeta } from "@/presentation/components/PageMeta";
import { useApi } from "@/presentation/hooks/useApi";
import { Plus, TerminalSquare, Square, Trash2, Cpu, Clock, Banknote } from "lucide-react";

export function PodsPage() {
  const api = useApi();
  const qc = useQueryClient();
  const { data: pods = [] } = useQuery({ queryKey: ["pods"], queryFn: () => api.listPods() });

  const stop = useMutation({
    mutationFn: (name: string) => api.stopPod(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pods"] }),
  });
  const remove = useMutation({
    mutationFn: (name: string) => api.deletePod(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pods"] }),
  });

  return (
    <div>
      <PageMeta title="Meus Pods" description="Instâncias GPU dedicadas, ativas ou em standby." />
      <PageHeader
        title="Meus Pods"
        subtitle="Instâncias GPU dedicadas, ativas ou em standby."
        actions={
          <Link to="/pods/deploy">
            <Btn><Plus className="h-4 w-4" /> Deploy novo Pod</Btn>
          </Link>
        }
      />
      <div className="space-y-3">
        {pods.map((p) => {
          const tone = p.status === "Rodando" ? "success" : p.status === "Iniciando" ? "warning" : "neutral";
          const dotColor =
            p.status === "Rodando" ? "bg-success" : p.status === "Iniciando" ? "bg-warning animate-pulse" : "bg-muted-foreground/40";
          return (
            <Card key={p.name} className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 lg:w-72">
                  <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.template}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm flex-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Cpu className="h-4 w-4" />
                    <span className="text-foreground font-medium">{p.gpu}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-foreground font-medium">{p.uptime ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Banknote className="h-4 w-4" />
                    <span className="text-foreground font-medium">{p.cost}</span>
                  </div>
                  <Badge tone={tone}>{p.status}</Badge>
                </div>

                <div className="flex gap-2">
                  {p.status === "Rodando" ? (
                    <Link to={`/pods/${encodeURIComponent(p.name)}/console`}>
                      <Btn variant="secondary" size="sm">
                        <TerminalSquare className="h-4 w-4" /> Conectar Console
                      </Btn>
                    </Link>
                  ) : (
                    <Btn variant="secondary" size="sm" disabled>
                      <TerminalSquare className="h-4 w-4" /> Conectar Console
                    </Btn>
                  )}
                  <Btn variant="secondary" size="sm" onClick={() => stop.mutate(p.name)}>
                    <Square className="h-4 w-4" /> Parar
                  </Btn>
                  <Btn variant="ghost" size="sm" onClick={() => remove.mutate(p.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Btn>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Btn, Card, PageHeader } from "@/components/ui-kit";
import { pods } from "@/lib/mockData";
import { Plus, TerminalSquare, Square, Trash2, Cpu, Clock, Banknote } from "lucide-react";

export const Route = createFileRoute("/_app/pods/")({
  head: () => ({ meta: [{ title: "Meus Pods — GPU Cloud" }] }),
  component: PodsPage,
});

function PodsPage() {
  return (
    <div>
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
                  <Link
                    to="/pods/$podName/console"
                    params={{ podName: p.name }}
                    {...(p.status !== "Rodando" ? { disabled: true, "aria-disabled": true, tabIndex: -1, onClick: (e: React.MouseEvent) => e.preventDefault() } as never : {})}
                  >
                    <Btn variant="secondary" size="sm" disabled={p.status !== "Rodando"}>
                      <TerminalSquare className="h-4 w-4" /> Conectar Console
                    </Btn>
                  </Link>
                  <Btn variant="secondary" size="sm"><Square className="h-4 w-4" /> Parar</Btn>
                  <Btn variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Btn>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

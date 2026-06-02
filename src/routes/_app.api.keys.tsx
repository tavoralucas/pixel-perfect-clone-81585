import { createFileRoute } from "@tanstack/react-router";
import { Badge, Btn, Card, PageHeader } from "@/components/ui-kit";
import { apiKeys } from "@/lib/mockData";
import { Copy, Plus, Trash2, ShieldOff } from "lucide-react";

export const Route = createFileRoute("/_app/api/keys")({
  head: () => ({ meta: [{ title: "API Keys — GPU Cloud" }] }),
  component: ApiKeysPage,
});

function ApiKeysPage() {
  return (
    <div>
      <PageHeader
        title="API Keys"
        subtitle="Gerencie as chaves de acesso à API de inferência."
        actions={<Btn><Plus className="h-4 w-4" /> Criar nova API Key</Btn>}
      />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Nome</th>
                <th className="text-left font-medium px-4 py-3">Chave</th>
                <th className="text-left font-medium px-4 py-3">Escopos</th>
                <th className="text-left font-medium px-4 py-3">Criada</th>
                <th className="text-left font-medium px-4 py-3">Último uso</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((k) => (
                <tr key={k.name} className="border-t border-border hover:bg-surface-2/60">
                  <td className="px-4 py-3 font-medium">{k.name}</td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2 font-mono text-xs">
                      {k.prefix}
                      <button className="text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => (
                        <Badge key={s} tone="info">{s}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{k.createdAt}</td>
                  <td className="px-4 py-3 text-muted-foreground">{k.lastUsed}</td>
                  <td className="px-4 py-3">
                    <Badge tone={k.status === "Ativa" ? "success" : "danger"}>{k.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Btn variant="ghost" size="sm"><Copy className="h-3.5 w-3.5" /></Btn>
                      <Btn variant="ghost" size="sm"><ShieldOff className="h-3.5 w-3.5" /></Btn>
                      <Btn variant="ghost" size="sm"><Trash2 className="h-3.5 w-3.5" /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

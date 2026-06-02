import { createFileRoute } from "@tanstack/react-router";
import { Btn, Card, PageHeader } from "@/components/ui-kit";
import { sshKeys } from "@/lib/mockData";
import { Plus, Eye, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/pods/ssh-keys")({
  head: () => ({ meta: [{ title: "Chaves SSH — GPU Cloud" }] }),
  component: SshKeysPage,
});

function SshKeysPage() {
  return (
    <div>
      <PageHeader
        title="Chaves SSH"
        subtitle="Adicione chaves públicas para acessar seus pods via terminal."
        actions={<Btn><Plus className="h-4 w-4" /> Adicionar chave SSH</Btn>}
      />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Nome</th>
                <th className="text-left font-medium px-4 py-3">Fingerprint</th>
                <th className="text-left font-medium px-4 py-3">Adicionada em</th>
                <th className="text-left font-medium px-4 py-3">Pods vinculados</th>
                <th className="text-right font-medium px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sshKeys.map((k) => (
                <tr key={k.name} className="border-t border-border hover:bg-surface-2/60">
                  <td className="px-4 py-3 font-medium">{k.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{k.fingerprint}</td>
                  <td className="px-4 py-3 text-muted-foreground">{k.added}</td>
                  <td className="px-4 py-3">{k.pods} pods</td>
                  <td className="px-4 py-3 text-right">
                    <Btn variant="ghost" size="sm"><Eye className="h-3.5 w-3.5" /></Btn>
                    <Btn variant="ghost" size="sm"><Trash2 className="h-3.5 w-3.5" /></Btn>
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

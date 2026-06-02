import { createFileRoute } from "@tanstack/react-router";
import { Badge, Btn, Card, PageHeader } from "@/components/ui-kit";
import { customImages } from "@/lib/mockData";
import { Plus, Container } from "lucide-react";

export const Route = createFileRoute("/_app/pods/images")({
  head: () => ({ meta: [{ title: "Minhas Imagens — GPU Cloud" }] }),
  component: ImagesPage,
});

function ImagesPage() {
  const empty = customImages.length === 0;
  return (
    <div>
      <PageHeader
        title="Minhas Imagens"
        subtitle="Imagens Docker customizadas para seus pods."
        actions={<Btn><Plus className="h-4 w-4" /> Adicionar imagem</Btn>}
      />
      {empty ? (
        <Card className="p-12 text-center">
          <Container className="h-12 w-12 text-muted-foreground mx-auto" />
          <div className="mt-3 font-semibold">Nenhuma imagem customizada adicionada</div>
          <p className="text-sm text-muted-foreground mt-1">Adicione uma imagem Docker para começar.</p>
          <Btn className="mt-4">Adicionar sua primeira imagem</Btn>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Nome</th>
                  <th className="text-left font-medium px-4 py-3">Registry</th>
                  <th className="text-left font-medium px-4 py-3">Adicionada</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-left font-medium px-4 py-3">Pods</th>
                  <th className="text-right font-medium px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {customImages.map((i) => {
                  const tone = i.status === "Verificada" ? "success" : i.status === "Pendente" ? "warning" : "danger";
                  return (
                    <tr key={i.name} className="border-t border-border hover:bg-surface-2/60">
                      <td className="px-4 py-3 font-medium">{i.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{i.registry}</td>
                      <td className="px-4 py-3 text-muted-foreground">{i.added}</td>
                      <td className="px-4 py-3"><Badge tone={tone}>{i.status}</Badge></td>
                      <td className="px-4 py-3">{i.pods}</td>
                      <td className="px-4 py-3 text-right">
                        <Btn variant="ghost" size="sm">Editar</Btn>
                        <Btn variant="ghost" size="sm">Deploy</Btn>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

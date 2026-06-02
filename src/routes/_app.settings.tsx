import { createFileRoute } from "@tanstack/react-router";
import { Btn, Card, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Configurações — GPU Cloud" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div>
      <PageHeader title="Configurações" subtitle="Preferências da conta e organização." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 space-y-4">
          <h2 className="font-semibold">Perfil</h2>
          <div>
            <label className="text-sm font-medium">Nome</label>
            <input defaultValue="Mateus Assad" className="mt-1 w-full h-9 rounded-md border border-border bg-surface px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input defaultValue="mateus@empresa.com" className="mt-1 w-full h-9 rounded-md border border-border bg-surface px-3 text-sm" />
          </div>
          <Btn>Salvar alterações</Btn>
        </Card>

        <Card className="p-5 space-y-4">
          <h2 className="font-semibold">Notificações</h2>
          {[
            "Alertas de saldo baixo",
            "Eventos de pods (start, stop, erro)",
            "Resumo semanal de consumo",
          ].map((n) => (
            <label key={n} className="flex items-center justify-between text-sm">
              <span>{n}</span>
              <input type="checkbox" defaultChecked className="accent-primary h-4 w-4" />
            </label>
          ))}
        </Card>

        <Card className="p-5 space-y-4 lg:col-span-2">
          <h2 className="font-semibold">Zona de perigo</h2>
          <p className="text-sm text-muted-foreground">Encerrar todos os pods ou excluir conta.</p>
          <div className="flex gap-2">
            <Btn variant="secondary">Encerrar todos os pods</Btn>
            <Btn variant="danger">Excluir conta</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { useRouteError, Link } from "react-router-dom";
import { PageMeta } from "@/presentation/components/PageMeta";

export function ErrorBoundaryPage() {
  const error = useRouteError() as Error | undefined;
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <PageMeta title="Erro" />
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error?.message ?? "Erro inesperado."}</p>
        <Link
          to="/dashboard"
          className="inline-flex mt-6 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

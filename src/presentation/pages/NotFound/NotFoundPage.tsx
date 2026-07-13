import { Link } from "react-router-dom";
import { PageMeta } from "@/presentation/components/PageMeta";

export function NotFoundPage() {
  return (
    <div className="p-10 text-center">
      <PageMeta title="Página não encontrada" />
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">A página que você procura não existe.</p>
      <Link to="/dashboard" className="inline-block mt-4 text-primary underline text-sm">
        Voltar ao Dashboard
      </Link>
    </div>
  );
}

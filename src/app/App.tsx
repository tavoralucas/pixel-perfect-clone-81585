import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useMemo } from "react";
import { buildRoutes } from "./router";

/**
 * Application root. Consumed by `bootstrap.tsx` (standalone) and, via
 * `remote-entry.ts`, by any Native Federation host.
 */
export function App({ basename }: { basename?: string }) {
  const router = useMemo(
    () => createBrowserRouter(buildRoutes(), { basename }),
    [basename],
  );
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

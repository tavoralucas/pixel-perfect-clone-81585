import { Navigate, type RouteObject } from "react-router-dom";
import { AppShell } from "@/presentation/components/layout/AppShell";
import { DashboardPage } from "@/presentation/pages/Dashboard/DashboardPage";
import { PodsPage } from "@/presentation/pages/Pods/PodsPage";
import { PodDeployPage } from "@/presentation/pages/PodDeploy/PodDeployPage";
import { PodConsolePage } from "@/presentation/pages/PodConsole/PodConsolePage";
import { PodTemplatesPage } from "@/presentation/pages/PodTemplates/PodTemplatesPage";
import { PodImagesPage } from "@/presentation/pages/PodImages/PodImagesPage";
import { SshKeysPage } from "@/presentation/pages/SshKeys/SshKeysPage";
import { ApiCatalogPage } from "@/presentation/pages/ApiCatalog/ApiCatalogPage";
import { ApiKeysPage } from "@/presentation/pages/ApiKeys/ApiKeysPage";
import { ApiUsagePage } from "@/presentation/pages/ApiUsage/ApiUsagePage";
import { BillingPage } from "@/presentation/pages/Billing/BillingPage";
import { SettingsPage } from "@/presentation/pages/Settings/SettingsPage";
import { NotFoundPage } from "@/presentation/pages/NotFound/NotFoundPage";
import { ErrorBoundaryPage } from "@/presentation/pages/Error/ErrorBoundaryPage";

/**
 * Declarative route tree consumed by `createBrowserRouter`.
 *
 * Kept as a builder function so tests can produce a fresh tree per case.
 */
export function buildRoutes(): RouteObject[] {
  return [
    {
      path: "/",
      element: <AppShell />,
      errorElement: <ErrorBoundaryPage />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: "dashboard", element: <DashboardPage /> },

        { path: "pods", element: <PodsPage /> },
        { path: "pods/deploy", element: <PodDeployPage /> },
        { path: "pods/:podName/console", element: <PodConsolePage /> },
        { path: "pods/templates", element: <PodTemplatesPage /> },
        { path: "pods/images", element: <PodImagesPage /> },
        { path: "pods/ssh-keys", element: <SshKeysPage /> },

        { path: "api/catalog", element: <ApiCatalogPage /> },
        { path: "api/keys", element: <ApiKeysPage /> },
        { path: "api/usage", element: <ApiUsagePage /> },

        { path: "billing", element: <BillingPage /> },
        { path: "settings", element: <SettingsPage /> },

        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ];
}

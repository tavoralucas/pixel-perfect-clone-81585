import type { ApiGateway } from "@/application/ports/api-gateway";
import { HttpApiGateway } from "./http/http-gateway";
import { HttpClient } from "./http/http-client";
import { MockApiGateway } from "./mock/mock-gateway";

/**
 * Composition Root.
 *
 * The single place where interfaces are bound to implementations. Presentation
 * code MUST NOT import concrete adapters directly — it consumes the ApiGateway
 * exposed here (typically via the `useApi` hook).
 *
 * Runtime selection:
 *   VITE_API_MODE=http   → real backend at VITE_API_BASE_URL
 *   otherwise            → in-memory MockApiGateway (default in preview)
 */

const TOKEN_STORAGE_KEY = "gpuaas.apiKey";

function buildGateway(): ApiGateway {
  const mode = import.meta.env.VITE_API_MODE;
  if (mode === "http") {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";
    const http = new HttpClient({
      baseUrl,
      getAuthToken: () =>
        typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_STORAGE_KEY),
      timeoutMs: 30_000,
    });
    return new HttpApiGateway(http);
  }
  return new MockApiGateway();
}

let instance: ApiGateway | undefined;

export function getApiGateway(): ApiGateway {
  if (!instance) instance = buildGateway();
  return instance;
}

/** Test-only: replace the gateway (e.g. with an in-memory fake). */
export function __setApiGatewayForTests(g: ApiGateway) {
  instance = g;
}

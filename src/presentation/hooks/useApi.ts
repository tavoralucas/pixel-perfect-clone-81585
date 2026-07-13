import { useMemo } from "react";
import type { ApiGateway } from "@/application/ports/api-gateway";
import { getApiGateway } from "@/infrastructure/composition-root";

/**
 * Presentation-side accessor for the API gateway.
 *
 * Pages call `const api = useApi()` and consume `ApiGateway` methods. The
 * concrete implementation (mock or HTTP) is chosen by the composition root.
 */
export function useApi(): ApiGateway {
  return useMemo(() => getApiGateway(), []);
}

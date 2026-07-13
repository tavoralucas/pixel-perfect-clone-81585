/**
 * Minimal typed HTTP client built on `fetch`.
 *
 * Responsibilities:
 * - Prepend a configurable base URL (`VITE_API_BASE_URL`).
 * - Inject `Authorization: Bearer <token>` when a token resolver is provided.
 * - Serialize JSON bodies and parse JSON responses.
 * - Normalize errors to a single `ApiError` shape.
 *
 * This is intentionally framework-free so it can be reused by any
 * infrastructure adapter without pulling React or the router in.
 */

export interface HttpClientOptions {
  baseUrl: string;
  getAuthToken?: () => string | null | undefined;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export class HttpClient {
  constructor(private readonly opts: HttpClientOptions) {}

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>("GET", path, undefined, init);
  }
  post<T>(path: string, body?: unknown, init?: RequestInit) {
    return this.request<T>("POST", path, body, init);
  }
  patch<T>(path: string, body?: unknown, init?: RequestInit) {
    return this.request<T>("PATCH", path, body, init);
  }
  put<T>(path: string, body?: unknown, init?: RequestInit) {
    return this.request<T>("PUT", path, body, init);
  }
  delete<T>(path: string, init?: RequestInit) {
    return this.request<T>("DELETE", path, undefined, init);
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    init?: RequestInit,
  ): Promise<T> {
    const url = `${this.opts.baseUrl.replace(/\/$/, "")}${path}`;
    const token = this.opts.getAuthToken?.();
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(this.opts.defaultHeaders ?? {}),
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((init?.headers as Record<string, string>) ?? {}),
    };

    const controller = new AbortController();
    const timer = this.opts.timeoutMs
      ? setTimeout(() => controller.abort(), this.opts.timeoutMs)
      : null;

    let res: Response;
    try {
      res = await fetch(url, {
        ...init,
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      if (timer) clearTimeout(timer);
      throw new ApiError(0, "network_error", (err as Error).message);
    }
    if (timer) clearTimeout(timer);

    const text = await res.text();
    const payload = text ? safeJson(text) : undefined;

    if (!res.ok) {
      const message =
        (payload as { message?: string } | undefined)?.message ??
        `HTTP ${res.status} ${res.statusText}`;
      const code =
        (payload as { code?: string } | undefined)?.code ?? `http_${res.status}`;
      throw new ApiError(res.status, code, message, payload);
    }
    return payload as T;
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

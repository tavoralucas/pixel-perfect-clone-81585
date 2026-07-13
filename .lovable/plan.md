
## Objetivo

Transformar o projeto atual (TanStack Start com SSR) em um **SPA React puro**, empacotado com **Vite + @softarc/native-federation**, exposto como **um único Micro Frontend chamado `gpuaas`** consumível por um host futuro. Aplicar Clean Architecture, padrões de componentização e documentar a camada de API em Markdown.

---

## 1. Nova stack

| Camada | Antes | Depois |
|---|---|---|
| Framework | TanStack Start (SSR) | React 19 SPA (vanilla, sem SSR) |
| Bundler | Vite + plugin TanStack Start / Nitro | Vite + `@softarc/native-federation` |
| Router | TanStack Router (file-based) | **React Router v6 data router** (`createBrowserRouter`) |
| Server fns | `createServerFn` / server routes | Removido (SPA); fetch client manual |
| Estado servidor | (n/a) | TanStack Query (mantido) |
| Estilos | Tailwind v4 | Tailwind v4 (mantido) |
| UI kit | shadcn + `ui-kit.tsx` | mantido |

Removidos: `@tanstack/react-start`, `@tanstack/react-router`, nitro, `src/server.ts`, `src/start.ts`, `src/routeTree.gen.ts`, `src/lib/error-capture.ts`, `src/lib/error-page.ts`, `src/lib/config.server.ts`, `src/lib/api/example.functions.ts`.

Adicionados: `@softarc/native-federation`, `react-router-dom`.

---

## 2. Estrutura de pastas (Clean Architecture)

```text
src/
  main.tsx                 # bootstrap SPA (import federation init)
  bootstrap.tsx            # createRoot + RouterProvider (lazy, exigido pelo NF)
  remote-entry.ts          # entry exposto para o host
  federation.config.js     # config do @softarc/native-federation
  app/
    router.tsx             # createBrowserRouter (data router)
    providers.tsx          # QueryClientProvider + Theme + ErrorBoundary
    routes.tsx             # árvore de rotas declarativa
  domain/                  # entidades + regras de negócio puras
    pods/                  # Pod, PodStatus, políticas
    gpus/
    models/
    api-keys/
    billing/
  application/             # casos de uso (orquestram domain + ports)
    pods/list-pods.usecase.ts
    pods/deploy-pod.usecase.ts
    ...
    ports/                 # interfaces (PodRepository, ApiKeyRepository, ...)
  infrastructure/          # adapters concretos
    http/
      http-client.ts       # fetch wrapper (baseURL, auth, erros tipados)
      endpoints.ts         # mapa de endpoints (fonte única)
    repositories/          # implementam ports/ usando http-client
      pod.http.repository.ts
      api-key.http.repository.ts
      ...
    mocks/                 # implementam ports/ com mockData (default enquanto sem back)
  presentation/            # UI (React) — só depende de application/
    pages/                 # 1 pasta por página (Dashboard, Pods, PodDeploy, ...)
      Dashboard/
        DashboardPage.tsx
        useDashboard.ts    # hook que chama use cases via React Query
        components/        # componentes específicos da página
    components/            # componentes compartilhados de UI (ex ui-kit)
      layout/              # Sidebar, Topbar, AppShell
      ui/                  # shadcn primitives
    hooks/
  shared/
    lib/utils.ts
    types/
docs/
  api/
    README.md              # visão geral, autenticação, erros
    pods.md
    gpus.md
    models.md
    api-keys.md
    billing.md
    usage.md
```

Regras de dependência (Clean):
- `domain` não importa nada.
- `application` importa só `domain` + `ports`.
- `infrastructure` importa `application/ports` + `domain`.
- `presentation` importa `application` (via hooks) — **nunca** `infrastructure` direto.
- Injeção de dependência via um `composition-root.ts` que decide mock vs http a partir de `import.meta.env.VITE_API_MODE`.

---

## 3. Native Federation — MFE `gpuaas`

`federation.config.js` na raiz:

```js
import { federationBuilder } from "@softarc/native-federation/build";

export default {
  name: "gpuaas",
  exposes: {
    "./Module": "./src/remote-entry.ts",
  },
  shared: {
    react: { singleton: true, strictVersion: true, requiredVersion: "19.x" },
    "react-dom": { singleton: true, strictVersion: true, requiredVersion: "19.x" },
    "react-router-dom": { singleton: true, requiredVersion: "6.x" },
    "@tanstack/react-query": { singleton: true, requiredVersion: "5.x" },
  },
};
```

`src/remote-entry.ts` exporta um **mount()** style para o host (padrão MFE):

```ts
export async function mount(el: HTMLElement, options?: { basename?: string }) { ... }
export function unmount(el: HTMLElement) { ... }
```

`src/main.tsx` roda em **standalone** (dev/preview) chamando `mount(document.getElementById("root")!)`. O host futuro chamará o mesmo `mount`.

Scripts no `package.json`:
- `dev` → `vite` (standalone SPA + federation dev)
- `build` → `native-federation build` + `vite build`
- `preview` → `vite preview`

---

## 4. Rotas (React Router v6 data router)

`app/router.tsx` com `createBrowserRouter([...])`, layout raiz `AppShell` (Sidebar + Topbar), rotas:

```text
/                 -> redirect /dashboard
/dashboard
/pods             (index)
/pods/deploy
/pods/:podName/console
/pods/templates
/pods/images
/pods/ssh-keys
/api/catalog
/api/keys
/api/usage
/billing
/settings
```

Cada rota:
- `element`: página em `presentation/pages/<Nome>`
- `loader` (opcional): dispara `queryClient.ensureQueryData(...)` do use case
- `errorElement`: boundary padrão

`RouterProvider` embrulhado por `QueryClientProvider` em `app/providers.tsx`.

---

## 5. Camada HTTP + documentação de API

`infrastructure/http/http-client.ts`:
- wrapper de `fetch` com `baseURL = import.meta.env.VITE_API_BASE_URL`
- headers `Authorization: Bearer <apiKey>` (lida do storage do app)
- tratamento uniforme de erro (`ApiError` tipado)
- serialização JSON, timeout, retry simples

`infrastructure/http/endpoints.ts` — fonte única dos endpoints (usada também pela doc).

`docs/api/*.md` — um arquivo por recurso, cada um contendo:
- Endpoint, método, headers, path/query params
- Request body (schema)
- Response body (schema + exemplo)
- Códigos de erro
- Exemplo `curl`

Cobertura inicial (baseada no que a UI já usa hoje via mockData):
- **Pods**: `GET /pods`, `POST /pods`, `GET /pods/:name`, `POST /pods/:name/start|stop`, `DELETE /pods/:name`, `GET /pods/:name/console` (WS)
- **GPUs**: `GET /gpus`
- **Models**: `GET /models`
- **Templates**: `GET /templates`
- **SSH keys**: `GET/POST/DELETE /ssh-keys`
- **Custom images**: `GET/POST/DELETE /images`
- **API keys**: `GET/POST/DELETE /api-keys`, `POST /api-keys/:id/revoke`
- **Usage**: `GET /usage?range=`
- **Billing**: `GET /billing/summary`, `GET /billing/daily`, `POST /billing/recharge`
- **Auth (placeholder)**: `POST /auth/login`, `POST /auth/logout`

Enquanto o backend não existe: `VITE_API_MODE=mock` faz o composition root injetar repositories baseados em `mockData`, mantendo o mesmo contrato dos MDs.

---

## 6. Padrões de componentização (presentation)

- **Page component**: só compõe seções, não busca dados diretamente.
- **`useXxx` hook por página**: chama `useQuery`/`useMutation` apontando para use cases; retorna estado normalizado.
- **Componentes de seção** (ex.: `PodsTable`, `GpuCatalogGrid`) recebem dados por props — puros, sem fetch.
- **UI primitives** (`Btn`, `Card`, `Badge`, `PageHeader`) permanecem em `presentation/components/ui`.
- **Layout** (`AppShell`, `Sidebar`, `Topbar`) em `presentation/components/layout`.
- Nomes de arquivos: `PascalCase` para componentes, `camelCase` para hooks/use cases, `kebab-case` para arquivos infra.

---

## 7. Passos de execução (ordem)

1. Remover dependências e arquivos do TanStack Start; instalar `react-router-dom` e `@softarc/native-federation`.
2. Criar `federation.config.js`, `src/main.tsx`, `src/bootstrap.tsx`, `src/remote-entry.ts`.
3. Reescrever `vite.config.ts` (sem `@lovable.dev/vite-tanstack-config`; usa `federationBuilder`).
4. Criar estrutura `domain / application / infrastructure / presentation / shared`.
5. Migrar cada rota atual `_app.*.tsx` para `presentation/pages/<Nome>/<Nome>Page.tsx`, trocando `Link`/hooks do TanStack por `react-router-dom`.
6. Extrair mocks para `infrastructure/mocks/*.repository.ts` implementando ports.
7. Implementar `http-client` + repositories HTTP (mesmos ports).
8. Escrever `docs/api/*.md`.
9. Ajustar `head`/SEO via `react-helmet-async` (ou tag manual no `index.html`) — SPA sem SSR, então metadata dinâmica é client-side.
10. Verificar build + smoke test navegando rotas.

---

## 8. O que não muda

- Design system, tokens, Tailwind config, ícones Lucide, mockData (vira fonte do mock repository), UI kit visual, textos em PT-BR.

---

## 9. Riscos / notas

- Perde SSR/SEO — aceito pelo requisito.
- Metadata por rota passa a ser client-side (`document.title` via effect ou helmet).
- `@softarc/native-federation` exige o padrão de **dynamic import bootstrap** (`import("./bootstrap")` em `main.tsx`) — respeitado.
- Testar standalone antes de plugar em host — o host é fora do escopo desta refatoração.

Confirma que sigo por esse caminho?

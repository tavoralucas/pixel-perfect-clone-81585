# GPUaaS — API Reference

Documentação dos contratos HTTP consumidos pelo MFE `gpuaas`. O código no
front-end depende dessas rotas através de `src/infrastructure/http/endpoints.ts`
— qualquer mudança aqui deve ser refletida naquele arquivo, e vice-versa.

## Base URL

- **Preview / Mock:** `VITE_API_MODE` diferente de `http` faz o front rodar
  com `MockApiGateway` (dados em memória vindos de `src/lib/mockData.ts`).
- **Produção:** `${VITE_API_BASE_URL}` — exemplo: `https://api.gpuaas.example.com/v1`.

## Autenticação

Todas as chamadas (exceto as documentadas como públicas) exigem:

```
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

A `API_KEY` é uma das chaves listadas em [`api-keys.md`](./api-keys.md).

## Formato de erro padrão

Toda resposta com `status >= 400` retorna:

```json
{
  "code": "resource_not_found",
  "message": "Pod 'foo' não existe.",
  "details": {}
}
```

O client (`src/infrastructure/http/http-client.ts`) converte esta forma em
`ApiError { status, code, message, details }`.

## Recursos

| Recurso        | Documento                             |
| -------------- | ------------------------------------- |
| Pods           | [`pods.md`](./pods.md)                |
| GPUs           | [`gpus.md`](./gpus.md)                |
| Templates      | [`templates.md`](./templates.md)      |
| Modelos        | [`models.md`](./models.md)            |
| API Keys       | [`api-keys.md`](./api-keys.md)        |
| SSH Keys       | [`ssh-keys.md`](./ssh-keys.md)        |
| Imagens Docker | [`images.md`](./images.md)            |
| Usage          | [`usage.md`](./usage.md)              |
| Billing        | [`billing.md`](./billing.md)          |

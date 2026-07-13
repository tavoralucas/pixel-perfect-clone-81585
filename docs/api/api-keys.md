# API Keys

Chaves de acesso à API de inferência.

## `GET /api-keys`

**Response 200**
```json
[
  {
    "name": "prod-key-principal",
    "prefix": "gpucloud-sk-••••••••7a2f",
    "scopes": ["inference", "read"],
    "createdAt": "10/03/2025",
    "lastUsed": "há 2h",
    "status": "Ativa"
  }
]
```

- `status`: `"Ativa" | "Revogada"`.
- O segredo completo **nunca** é retornado após a criação.

## `POST /api-keys`

**Request body**
```json
{ "name": "prod-key-principal", "scopes": ["inference", "read"] }
```

**Response 201** — o único momento em que o segredo é revelado:
```json
{
  "apiKey": { "name": "...", "prefix": "...", "scopes": [...], "status": "Ativa", "createdAt": "...", "lastUsed": "nunca" },
  "secret": "gpucloud-sk-live-abcdef1234"
}
```

## `POST /api-keys/:name/revoke`

Marca a chave como `"Revogada"`. **204 No Content**.

## `DELETE /api-keys/:name`

Remove permanentemente. **204 No Content**.

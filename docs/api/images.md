# Imagens Docker

Imagens customizadas do usuário.

## `GET /images`

**Response 200**
```json
[
  {
    "name": "meu-modelo-prod",
    "registry": "docker.io/empresa/ml-model:v2.1",
    "added": "02/05/2025",
    "status": "Verificada",
    "pods": 1
  }
]
```

- `status`: `"Verificada" | "Pendente" | "Falhou"`.

## `POST /images`

**Request body**
```json
{
  "name": "meu-modelo-prod",
  "registry": "docker.io/empresa/ml-model:v2.1",
  "credentials": { "username": "user", "token": "***" }
}
```

O campo `credentials` é opcional (obrigatório apenas para registries privados).
Credenciais são criptografadas em repouso e usadas somente para o `docker pull`.

**Response 201** — objeto `CustomImage` com `status: "Pendente"` (o backend
executa a verificação de forma assíncrona).

## `DELETE /images/:name`

Falha com 409 se `pods > 0`. **204 No Content** em caso de sucesso.

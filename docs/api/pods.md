# Pods

Instâncias GPU dedicadas.

## `GET /pods`

Lista todos os pods do usuário autenticado.

**Response 200**
```json
[
  {
    "name": "pytorch-training-01",
    "template": "PyTorch 2.8.0",
    "gpu": "A40 · 48GB VRAM",
    "status": "Rodando",
    "uptime": "3h 42min",
    "cost": "R$ 2,10/h",
    "ip": "198.51.100.42"
  }
]
```

- `status`: `"Rodando" | "Parado" | "Iniciando"`.

## `GET /pods/:name`

Detalhes de um pod. Retorna 404 quando o nome não existe.

## `POST /pods`

Cria (deploy) um novo pod.

**Request body**
```json
{
  "name": "imaginative-red-falcon",
  "template": "Runpod PyTorch 2.8.0",
  "gpu": "A40",
  "qty": 1,
  "billing": "ondemand"
}
```

- `billing`: `"ondemand" | "reserved"`.

**Response 201** — objeto `Pod` recém-criado com `status: "Iniciando"`.

## `POST /pods/:name/stop`

Para o pod (mantém volumes). **204 No Content**.

## `DELETE /pods/:name`

Remove o pod e volumes associados. **204 No Content**.

## Exemplo

```bash
curl -X POST "$API/pods" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"train-01","template":"Runpod PyTorch 2.8.0","gpu":"A40","qty":1,"billing":"ondemand"}'
```

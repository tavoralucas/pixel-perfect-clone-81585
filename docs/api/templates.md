# Templates

Imagens base oficiais/verificadas/comunidade para deploy de pods.

## `GET /templates`

**Response 200**
```json
[
  {
    "name": "Runpod PyTorch 2.8.0",
    "image": "runpod/pytorch:1.0.2-cu1281-torch280",
    "type": "Oficial",
    "popular": true
  }
]
```

- `type`: `"Oficial" | "Verificado" | "Comunidade"`.

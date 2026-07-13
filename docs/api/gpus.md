# GPUs

Catálogo de GPUs disponíveis para deploy.

## `GET /gpus`

**Response 200**
```json
[
  {
    "name": "H100 PCIe",
    "pricePerHour": 14.45,
    "vram": "80GB",
    "ram": "125GB",
    "vcpu": 8,
    "availability": "Média",
    "badge": "Melhor Performance"
  }
]
```

- `availability`: `"Alta" | "Média" | "Baixa"`.
- `badge` (opcional): destaque comercial.

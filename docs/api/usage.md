# Usage

Séries temporais de uso agregado.

## `GET /usage/series`

Consumo combinado (requests + horas de pod) por dia.

**Response 200**
```json
[
  { "day": "Seg", "requests": 8400, "podHours": 18 },
  { "day": "Ter", "requests": 11200, "podHours": 22 }
]
```

## `GET /usage/activity`

Últimos eventos da conta (activity feed do dashboard).

**Response 200**
```json
[
  { "kind": "ok", "text": "Pod pytorch-training-01 iniciado", "time": "há 23 min" },
  { "kind": "warn", "text": "Saldo abaixo de R$ 300,00", "time": "há 1 h" }
]
```

- `kind`: `"ok" | "warn" | "danger"`.

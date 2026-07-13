# Billing

Consumo financeiro.

## `GET /billing/daily`

Consumo diário do ciclo atual, empilhado por tipo de serviço.

**Response 200**
```json
[
  { "day": "1", "pods": 42, "api": 5, "storage": 3 },
  { "day": "2", "pods": 38, "api": 6, "storage": 4 }
]
```

Valores em BRL. O front-end renderiza como barras empilhadas.

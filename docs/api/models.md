# Modelos

Catálogo de modelos servidos pela API de inferência.

## `GET /models`

**Response 200**
```json
[
  {
    "name": "Llama 3 70B",
    "provider": "Meta",
    "category": "LLM",
    "status": "Disponível",
    "latency": "~420ms",
    "price": "R$ 0,0018 / 1k tokens"
  }
]
```

- `category`: `"LLM" | "Geração de Imagem" | "Embeddings" | "Áudio" | "Visão"`.
- `status`: `"Disponível" | "Beta" | "Descontinuado"`.

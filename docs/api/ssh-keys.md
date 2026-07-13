# SSH Keys

Chaves públicas SSH para acesso a pods.

## `GET /ssh-keys`

**Response 200**
```json
[
  {
    "name": "MacBook Pro pessoal",
    "fingerprint": "SHA256:xK9mL2pQ7nR8sT3uV6wX9yZ1aB4cD5eF8gH0iJ",
    "added": "15/03/2025",
    "pods": 2
  }
]
```

## `POST /ssh-keys` *(planejado)*

```json
{ "name": "Servidor CI/CD", "publicKey": "ssh-ed25519 AAAA..." }
```

## `DELETE /ssh-keys/:name` *(planejado)*

Remove a chave e desconecta pods associados. **204 No Content**.

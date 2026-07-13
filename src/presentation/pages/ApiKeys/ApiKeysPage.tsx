import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge, Btn, Card, PageHeader } from "@/presentation/components/ui/ui-kit";
import { PageMeta } from "@/presentation/components/PageMeta";
import { useApi } from "@/presentation/hooks/useApi";
import { Copy, Plus, Trash2, ShieldOff, X, Check, Eye, EyeOff, KeyRound } from "lucide-react";

export function ApiKeysPage() {
  const api = useApi();
  const qc = useQueryClient();
  const { data: keys = [] } = useQuery({ queryKey: ["api-keys"], queryFn: () => api.listApiKeys() });
  const [showCreate, setShowCreate] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<{ name: string; scopes: string[]; secret: string } | null>(null);
  const [showKey, setShowKey] = useState(false);

  const create = useMutation({
    mutationFn: ({ name, scopes }: { name: string; scopes: string[] }) => api.createApiKey({ name, scopes }),
    onSuccess: (data, vars) => {
      setCreatedSecret({ name: vars.name, scopes: vars.scopes, secret: data.secret });
      qc.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
  const revoke = useMutation({
    mutationFn: (name: string) => api.revokeApiKey(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-keys"] }),
  });
  const remove = useMutation({
    mutationFn: (name: string) => api.deleteApiKey(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-keys"] }),
  });

  return (
    <div>
      <PageMeta title="API Keys" description="Gerencie chaves de acesso à API de inferência." />
      <PageHeader
        title="API Keys"
        subtitle="Gerencie as chaves de acesso à API de inferência."
        actions={<Btn onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> Criar nova API Key</Btn>}
      />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Nome</th>
                <th className="text-left font-medium px-4 py-3">Chave</th>
                <th className="text-left font-medium px-4 py-3">Escopos</th>
                <th className="text-left font-medium px-4 py-3">Criada</th>
                <th className="text-left font-medium px-4 py-3">Último uso</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.name} className="border-t border-border hover:bg-surface-2/60">
                  <td className="px-4 py-3 font-medium">{k.name}</td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2 font-mono text-xs">
                      {k.prefix}
                      <button className="text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => <Badge key={s} tone="info">{s}</Badge>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{k.createdAt}</td>
                  <td className="px-4 py-3 text-muted-foreground">{k.lastUsed}</td>
                  <td className="px-4 py-3">
                    <Badge tone={k.status === "Ativa" ? "success" : "danger"}>{k.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Btn variant="ghost" size="sm"><Copy className="h-3.5 w-3.5" /></Btn>
                      {k.status === "Ativa" && (
                        <Btn variant="ghost" size="sm" onClick={() => revoke.mutate(k.name)}>
                          <ShieldOff className="h-3.5 w-3.5" />
                        </Btn>
                      )}
                      <Btn variant="ghost" size="sm" onClick={() => remove.mutate(k.name)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showCreate && (
        <CreateKeyModal
          onClose={() => { setShowCreate(false); setCreatedSecret(null); setShowKey(false); }}
          onCreate={(name, scopes) => create.mutate({ name, scopes })}
          created={createdSecret}
          showKey={showKey}
          setShowKey={setShowKey}
        />
      )}
    </div>
  );
}

function CreateKeyModal({
  onClose, onCreate, created, showKey, setShowKey,
}: {
  onClose: () => void;
  onCreate: (name: string, scopes: string[]) => void;
  created: { name: string; scopes: string[]; secret: string } | null;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<string[]>(["inference", "read"]);
  const [copied, setCopied] = useState(false);

  const toggleScope = (scope: string) =>
    setScopes((prev) => (prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]));

  const handleCopy = async () => {
    if (created) {
      await navigator.clipboard.writeText(created.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canCreate = name.trim().length > 0 && scopes.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-surface shadow-xl p-6 mx-4">
        <button onClick={onClose} className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
          <X className="h-4 w-4" />
        </button>

        {!created ? (
          <>
            <div className="flex items-center gap-3 mb-1">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                <KeyRound className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Criar nova API Key</h2>
                <p className="text-sm text-muted-foreground">Configure o nome e os escopos.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: prod-key-principal"
                  className="w-full h-10 rounded-md border border-border bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Escopos</label>
                <div className="space-y-2">
                  {["inference", "read"].map((scope) => (
                    <label
                      key={scope}
                      className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5 cursor-pointer hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={scopes.includes(scope)}
                        onChange={() => toggleScope(scope)}
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                      <div>
                        <div className="text-sm font-medium capitalize">{scope}</div>
                        <div className="text-xs text-muted-foreground">
                          {scope === "inference" ? "Permite executar inferências." : "Permite leitura de dados."}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
              <Btn disabled={!canCreate} onClick={() => onCreate(name.trim(), scopes)}>Criar chave</Btn>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-1">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-success-bg">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">API Key criada</h2>
                <p className="text-sm text-muted-foreground">Copie agora. Você não poderá vê-la novamente.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Chave</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={showKey ? "text" : "password"}
                      value={created.secret}
                      readOnly
                      className="w-full h-10 rounded-md border border-border bg-muted px-3 pr-10 text-sm font-mono"
                    />
                    <button onClick={() => setShowKey(!showKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Btn variant="secondary" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? " Copiado" : " Copiar"}
                  </Btn>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Btn variant="primary" onClick={onClose}>Concluir</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge, Btn, Card, PageHeader } from "@/components/ui-kit";
import { customImages as seed } from "@/lib/mockData";
import { Plus, Container, X, Loader2, Trash2, Eye, EyeOff, Lock } from "lucide-react";

export const Route = createFileRoute("/_app/pods/images")({
  head: () => ({ meta: [{ title: "Minhas Imagens — GPU Cloud" }] }),
  component: ImagesPage,
});

type CustomImage = {
  name: string;
  registry: string;
  added: string;
  status: "Verificada" | "Pendente" | "Falhou";
  pods: number;
};

const REGISTRIES = [
  { id: "dockerhub", label: "Docker Hub", placeholder: "empresa/imagem:tag" },
  { id: "ghcr", label: "GitHub Container Registry", placeholder: "ghcr.io/org/imagem:tag" },
  { id: "ecr", label: "Amazon ECR", placeholder: "123456.dkr.ecr.us-east-1.amazonaws.com/imagem:tag" },
  { id: "gcr", label: "Google Artifact Registry", placeholder: "us-docker.pkg.dev/proj/repo/imagem:tag" },
  { id: "custom", label: "Outro / Registry privado", placeholder: "registry.exemplo.com/imagem:tag" },
] as const;

function ImagesPage() {
  const [images, setImages] = useState<CustomImage[]>(seed as CustomImage[]);
  const [open, setOpen] = useState(false);
  const empty = images.length === 0;

  function addImage(img: CustomImage) {
    setImages((prev) => [img, ...prev]);
  }

  function removeImage(name: string) {
    setImages((prev) => prev.filter((i) => i.name !== name));
  }

  return (
    <div>
      <PageHeader
        title="Minhas Imagens"
        subtitle="Imagens Docker customizadas para seus pods."
        actions={
          <Btn onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Adicionar imagem
          </Btn>
        }
      />
      {empty ? (
        <Card className="p-12 text-center">
          <Container className="h-12 w-12 text-muted-foreground mx-auto" />
          <div className="mt-3 font-semibold">Nenhuma imagem customizada adicionada</div>
          <p className="text-sm text-muted-foreground mt-1">Adicione uma imagem Docker para começar.</p>
          <Btn className="mt-4" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Adicionar sua primeira imagem
          </Btn>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Nome</th>
                  <th className="text-left font-medium px-4 py-3">Registry</th>
                  <th className="text-left font-medium px-4 py-3">Adicionada</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-left font-medium px-4 py-3">Pods</th>
                  <th className="text-right font-medium px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {images.map((i) => {
                  const tone = i.status === "Verificada" ? "success" : i.status === "Pendente" ? "warning" : "danger";
                  return (
                    <tr key={i.name} className="border-t border-border hover:bg-surface-2/60">
                      <td className="px-4 py-3 font-medium">{i.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{i.registry}</td>
                      <td className="px-4 py-3 text-muted-foreground">{i.added}</td>
                      <td className="px-4 py-3"><Badge tone={tone}>{i.status}</Badge></td>
                      <td className="px-4 py-3">{i.pods}</td>
                      <td className="px-4 py-3 text-right">
                        <Btn variant="ghost" size="sm">Editar</Btn>
                        <Btn variant="ghost" size="sm">Deploy</Btn>
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(i.name)}
                          disabled={i.pods > 0}
                          title={i.pods > 0 ? "Imagem em uso por pods" : "Remover"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Btn>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {open && (
        <AddImageModal
          onClose={() => setOpen(false)}
          onCreate={(img) => {
            addImage(img);
            setOpen(false);
          }}
          existingNames={images.map((i) => i.name)}
        />
      )}
    </div>
  );
}

type Step = "form" | "verifying" | "success";

function AddImageModal({
  onClose,
  onCreate,
  existingNames,
}: {
  onClose: () => void;
  onCreate: (img: CustomImage) => void;
  existingNames: string[];
}) {
  const [registryType, setRegistryType] = useState<(typeof REGISTRIES)[number]["id"]>("dockerhub");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState<string | null>(null);

  const registry = REGISTRIES.find((r) => r.id === registryType)!;
  const nameError =
    name.length > 0 && !/^[a-z0-9][a-z0-9-_]{1,40}$/.test(name)
      ? "Use 2–40 caracteres minúsculos, números, '-' ou '_'."
      : existingNames.includes(name)
      ? "Já existe uma imagem com esse nome."
      : null;
  const imageError =
    image.length > 0 && !/^[\w./:-]+:[\w.-]+$/.test(image)
      ? "Formato esperado: registry/repositorio:tag"
      : null;
  const canSubmit =
    name.length > 1 &&
    image.length > 3 &&
    !nameError &&
    !imageError &&
    (!isPrivate || (username.length > 0 && token.length > 0));

  useEffect(() => {
    if (step !== "verifying") return;
    const t = setTimeout(() => {
      // 85% sucesso mockado
      if (Math.random() < 0.85) setStep("success");
      else {
        setError("Não foi possível autenticar no registry. Verifique as credenciais.");
        setStep("form");
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [step]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setStep("verifying");
  }

  function handleFinish() {
    const today = new Date().toLocaleDateString("pt-BR");
    onCreate({
      name,
      registry: image,
      added: today,
      status: "Verificada",
      pods: 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl bg-surface shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Container className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Adicionar imagem Docker</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === "success" ? (
          <div className="p-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-success-bg flex items-center justify-center">
                <Container className="h-6 w-6 text-success" />
              </div>
              <div className="mt-3 font-semibold">Imagem verificada com sucesso</div>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-mono">{image}</span> está pronta para ser usada em novos pods.
              </p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Btn variant="secondary" onClick={onClose}>Fechar</Btn>
              <Btn onClick={handleFinish}>Adicionar à lista</Btn>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <Field label="Nome amigável" hint="Identificador interno para usar nos seus pods.">
              <input
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase())}
                placeholder="meu-modelo-prod"
                className="input"
                autoFocus
                disabled={step === "verifying"}
              />
              {nameError && <p className="text-xs text-danger mt-1">{nameError}</p>}
            </Field>

            <Field label="Registry">
              <div className="grid grid-cols-2 gap-2">
                {REGISTRIES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    disabled={step === "verifying"}
                    onClick={() => setRegistryType(r.id)}
                    className={[
                      "text-left rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                      registryType === r.id
                        ? "border-primary bg-primary-light text-primary"
                        : "border-border hover:bg-muted",
                    ].join(" ")}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Imagem" hint={`Ex.: ${registry.placeholder}`}>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder={registry.placeholder}
                className="input font-mono text-xs"
                disabled={step === "verifying"}
              />
              {imageError && <p className="text-xs text-danger mt-1">{imageError}</p>}
            </Field>

            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                disabled={step === "verifying"}
                className="h-4 w-4 rounded border-border-strong"
              />
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              Registry privado (requer autenticação)
            </label>

            {isPrivate && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-md border border-border bg-muted/30 p-3">
                <Field label="Usuário">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="usuário ou e-mail"
                    className="input"
                    disabled={step === "verifying"}
                  />
                </Field>
                <Field label="Token / Senha">
                  <div className="relative">
                    <input
                      type={showToken ? "text" : "password"}
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="••••••••"
                      className="input pr-9"
                      disabled={step === "verifying"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
                <p className="text-[11px] text-muted-foreground sm:col-span-2">
                  As credenciais são criptografadas e usadas apenas para puxar a imagem.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-xs text-danger">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Btn variant="secondary" type="button" onClick={onClose} disabled={step === "verifying"}>
                Cancelar
              </Btn>
              <Btn type="submit" disabled={!canSubmit || step === "verifying"}>
                {step === "verifying" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Verificando...
                  </>
                ) : (
                  <>Verificar e adicionar</>
                )}
              </Btn>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .input {
          width: 100%;
          height: 36px;
          padding: 0 10px;
          border-radius: 6px;
          border: 1px solid var(--border-strong, var(--border));
          background: var(--surface);
          color: var(--foreground);
          font-size: 13px;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent);
        }
        .input:disabled { opacity: .6; }
      `}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

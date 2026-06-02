import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Btn, Card, PageHeader } from "@/components/ui-kit";
import { gpus, templates } from "@/lib/mockData";
import { Cpu, TerminalSquare, ChevronLeft, ChevronRight, Box } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_app/pods/deploy")({
  head: () => ({ meta: [{ title: "Deploy de Pod — GPU Cloud" }] }),
  component: DeployPage,
});

type Step = 1 | 2 | 3 | 4;

function StepDot({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
          active ? "bg-primary text-primary-foreground" : done ? "bg-success-bg text-success" : "bg-muted text-muted-foreground"
        }`}
      >
        {n}
      </div>
      <span className={`text-sm ${active ? "font-semibold" : "text-muted-foreground"}`}>{label}</span>
    </div>
  );
}

function DeployPage() {
  const [step, setStep] = useState<Step>(1);
  const [offering, setOffering] = useState<"pod" | "serverless">("pod");
  const [template, setTemplate] = useState(templates[0].name);
  const [gpu, setGpu] = useState(gpus.find((g) => g.name === "A40")!.name);
  const [qty, setQty] = useState(1);
  const [billing, setBilling] = useState<"ondemand" | "reserved">("ondemand");

  const selectedGpu = useMemo(() => gpus.find((g) => g.name === gpu)!, [gpu]);
  const selectedTemplate = useMemo(() => templates.find((t) => t.name === template)!, [template]);

  const totals = useMemo(() => {
    const gpuCost = selectedGpu.pricePerHour * qty;
    const disk = 0.02;
    const vol = 0.035;
    const idle = 0.07;
    return { gpuCost, disk, vol, idle, total: gpuCost + disk + vol };
  }, [selectedGpu, qty]);

  return (
    <div>
      <PageHeader title="Deploy de Pod" subtitle="Configure e inicie uma nova instância GPU em segundos." />

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <StepDot n={1} label="Oferta" active={step === 1} done={step > 1} />
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <StepDot n={2} label="Template" active={step === 2} done={step > 2} />
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <StepDot n={3} label="GPU" active={step === 3} done={step > 3} />
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <StepDot n={4} label="Revisar" active={step === 4} done={false} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {([
                { id: "pod", title: "GPU Pod", desc: "Escolha um template ou sua própria imagem.", badge: "Popular", icon: Cpu, tags: ["Jupyter", "PyTorch", "ComfyUI", "Ubuntu", "100+ mais"] },
                { id: "serverless", title: "Serverless / API", desc: "Endpoint auto-scaling para inferência.", badge: "Avançado", icon: TerminalSquare, tags: ["vLLM", "ComfyUI", "Whisper", "SDXL", "50+ mais"] },
              ] as const).map((o) => {
                const Icon = o.icon;
                const active = offering === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setOffering(o.id)}
                    className={`text-left rounded-lg p-5 border-2 transition-all ${
                      active ? "border-primary bg-primary-light" : "border-border bg-surface hover:border-border-strong"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`h-10 w-10 rounded-md flex items-center justify-center ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge tone={o.id === "pod" ? "primary" : "info"}>{o.badge}</Badge>
                    </div>
                    <div className="font-semibold text-lg">{o.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">{o.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {o.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-border bg-surface">{t}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {templates.slice(0, 9).map((t) => {
                const active = template === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => setTemplate(t.name)}
                    className={`text-left rounded-lg p-4 border-2 transition-all bg-surface ${
                      active ? "border-primary bg-primary-light" : "border-border hover:border-border-strong"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                        <Box className="h-4 w-4" />
                      </div>
                      {t.popular && <Badge tone="primary">Mais popular</Badge>}
                    </div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="font-mono text-[11px] text-muted-foreground mt-1 break-all">{t.image}</div>
                    <Badge tone="success" className="mt-2">{t.type}</Badge>
                  </button>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="grid gap-3 sm:grid-cols-3 mb-5">
                {gpus.filter((g) => g.badge).map((g) => {
                  const active = gpu === g.name;
                  return (
                    <button
                      key={g.name}
                      onClick={() => setGpu(g.name)}
                      className={`text-left rounded-lg p-4 border-2 ${active ? "border-primary bg-primary-light" : "border-border bg-surface hover:border-border-strong"}`}
                    >
                      <Badge tone="primary">{g.badge}</Badge>
                      <div className="mt-2 font-semibold">NVIDIA {g.name}</div>
                      <div className="text-xs text-muted-foreground">{g.vram} VRAM</div>
                      <div className="mt-2 font-mono text-sm">R$ {g.pricePerHour.toFixed(2)}/h</div>
                    </button>
                  );
                })}
              </div>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-2 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="text-left font-medium px-4 py-2.5">GPU</th>
                        <th className="text-right font-medium px-4 py-2.5">Preço/h</th>
                        <th className="text-right font-medium px-4 py-2.5">VRAM</th>
                        <th className="text-right font-medium px-4 py-2.5">RAM</th>
                        <th className="text-right font-medium px-4 py-2.5">vCPU</th>
                        <th className="text-center font-medium px-4 py-2.5">Disp.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gpus.map((g) => {
                        const active = gpu === g.name;
                        const aTone = g.availability === "Alta" ? "success" : g.availability === "Média" ? "warning" : "danger";
                        return (
                          <tr
                            key={g.name}
                            onClick={() => setGpu(g.name)}
                            className={`cursor-pointer border-t border-border ${active ? "bg-primary-light" : "hover:bg-surface-2/60"}`}
                          >
                            <td className="px-4 py-2.5 font-medium">{g.name}</td>
                            <td className="px-4 py-2.5 text-right font-mono">R$ {g.pricePerHour.toFixed(2)}</td>
                            <td className="px-4 py-2.5 text-right font-mono">{g.vram}</td>
                            <td className="px-4 py-2.5 text-right font-mono">{g.ram}</td>
                            <td className="px-4 py-2.5 text-right font-mono">{g.vcpu}</td>
                            <td className="px-4 py-2.5 text-center"><Badge tone={aTone}>{g.availability}</Badge></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="mt-6">
                <div className="text-sm font-medium mb-2">Quantidade de GPUs</div>
                <div className="inline-flex rounded-md border border-border p-0.5 bg-surface-2">
                  {[1, 2, 4, 6, 8, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setQty(n)}
                      className={`min-w-9 px-3 py-1.5 text-sm rounded ${qty === n ? "bg-surface shadow-sm font-semibold" : "text-muted-foreground"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 mt-6">
                {([
                  { id: "ondemand", t: "On-Demand", d: "Pague conforme o uso.", extra: `R$ ${selectedGpu.pricePerHour.toFixed(2)}/h` },
                  { id: "reserved", t: "Reservada", d: "3, 6, 12+ meses.", extra: "Falar com vendas →" },
                ] as const).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setBilling(o.id)}
                    className={`text-left rounded-lg p-4 border-2 ${billing === o.id ? "border-primary bg-primary-light" : "border-border bg-surface hover:border-border-strong"}`}
                  >
                    <div className="font-semibold">{o.t}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{o.d}</div>
                    <div className="mt-2 text-sm font-mono">{o.extra}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <Card className="p-5 space-y-5">
              <div>
                <label className="text-sm font-medium">Nome do Pod</label>
                <input
                  defaultValue="imaginative-red-falcon"
                  className="mt-1 w-full h-9 rounded-md border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="accent-primary" /> Iniciar JupyterLab
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="accent-primary" /> Acesso SSH pelo terminal
                </label>
              </div>
              <div>
                <label className="text-sm font-medium">Chave pública SSH</label>
                <textarea
                  placeholder="ssh-ed25519 AAAA…"
                  className="mt-1 w-full h-24 rounded-md border border-border bg-surface px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <div className="text-xs text-muted-foreground mt-1">0/65500 chars</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Região</label>
                  <select className="mt-1 w-full h-9 rounded-md border border-border bg-surface px-3 text-sm">
                    <option>Qualquer região</option><option>Brasil</option><option>EUA</option><option>Europa</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Disco do container</label>
                  <input type="range" min={10} max={200} defaultValue={20} className="w-full mt-3 accent-primary" />
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-between mt-6">
            <Btn variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1) as Step)} disabled={step === 1}>
              <ChevronLeft className="h-4 w-4" /> Voltar
            </Btn>
            {step < 4 ? (
              <Btn onClick={() => setStep((s) => Math.min(4, s + 1) as Step)}>
                Continuar <ChevronRight className="h-4 w-4" />
              </Btn>
            ) : (
              <Link to="/pods"><Btn>Deploy Pod</Btn></Link>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 h-fit">
          <Card className="p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Resumo do Deploy</div>
            <div className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Oferta</span><span className="font-medium">{offering === "pod" ? "GPU Pod" : "Serverless"}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Template</span><span className="font-medium text-right">{selectedTemplate.name}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">GPU</span><span className="font-medium">{selectedGpu.name} × {qty}</span></div>
            </div>

            <div className="mt-5 pt-4 border-t border-border space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Custo GPU</span><span className="font-mono">R$ {totals.gpuCost.toFixed(2)}/h</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Disco container</span><span className="font-mono">R$ {totals.disk.toFixed(2)}/h</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Disco volume</span><span className="font-mono">R$ {totals.vol.toFixed(3)}/h</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Custo parado</span><span className="font-mono">R$ {totals.idle.toFixed(2)}/h</span></div>
            </div>

            <div className="mt-3 pt-3 border-t border-border flex items-baseline justify-between">
              <span className="text-sm font-medium">Total / hora</span>
              <span className="text-xl font-bold font-mono">R$ {totals.total.toFixed(2)}</span>
            </div>

            <Btn className="w-full mt-4">Deploy Pod</Btn>
          </Card>
        </aside>
      </div>
    </div>
  );
}

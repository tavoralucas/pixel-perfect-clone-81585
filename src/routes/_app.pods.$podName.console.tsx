import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Badge, Btn, Card, PageHeader } from "@/components/ui-kit";
import { pods } from "@/lib/mockData";
import {
  ArrowLeft, Circle, Copy, Cpu, Download, RefreshCcw, Square, TerminalSquare, Trash2,
} from "lucide-react";

export const Route = createFileRoute("/_app/pods/$podName/console")({
  head: ({ params }) => ({
    meta: [{ title: `Console · ${params.podName} — GPU Cloud` }],
  }),
  loader: ({ params }) => {
    const pod = pods.find((p) => p.name === params.podName);
    if (!pod) throw notFound();
    return { pod };
  },
  notFoundComponent: () => (
    <div className="p-8">
      <p className="text-sm text-muted-foreground">Pod não encontrado.</p>
      <Link to="/pods" className="text-primary text-sm">← Voltar para Meus Pods</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-danger">{(error as Error).message}</div>
  ),
  component: ConsolePage,
});

type Line = { kind: "in" | "out" | "err" | "sys"; text: string };

function ConsolePage() {
  const { pod } = Route.useLoaderData();
  const prompt = `root@${pod.name}:~#`;

  const initial: Line[] = useMemo(
    () => [
      { kind: "sys", text: `Conectando a ${pod.name} (${pod.ip ?? "—"}) via SSH...` },
      { kind: "sys", text: `Autenticado com chave: MacBook Pro pessoal` },
      { kind: "out", text: `Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 6.2.0 x86_64)` },
      { kind: "out", text: `  GPU: ${pod.gpu}   ·   Template: ${pod.template}` },
      { kind: "out", text: `  Last login: Tue Jun  2 09:14:22 2026 from 200.10.42.18` },
      { kind: "out", text: `` },
      { kind: "out", text: `Digite 'help' para ver comandos disponíveis.` },
    ],
    [pod],
  );

  const [lines, setLines] = useState<Line[]>(initial);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const connected = pod.status === "Rodando";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function run(cmd: string) {
    const trimmed = cmd.trim();
    const next: Line[] = [...lines, { kind: "in", text: `${prompt} ${cmd}` }];
    if (!trimmed) {
      setLines(next);
      return;
    }
    setHistory((h) => [...h, trimmed]);
    setHistIdx(null);

    const [bin, ...args] = trimmed.split(/\s+/);
    const out: Line[] = [];
    const push = (text: string, kind: Line["kind"] = "out") => out.push({ kind, text });

    switch (bin) {
      case "help":
        push("Comandos suportados:");
        push("  nvidia-smi      Status da GPU");
        push("  ls              Listar arquivos");
        push("  pwd             Diretório atual");
        push("  whoami          Usuário");
        push("  uptime          Tempo ligado");
        push("  python --version   Versão do Python");
        push("  nvcc --version     Versão do CUDA");
        push("  clear           Limpar tela");
        push("  exit            Encerrar sessão");
        break;
      case "clear":
        setLines([]);
        return;
      case "exit":
        push(`Encerrando sessão SSH com ${pod.name}...`, "sys");
        push(`Conexão fechada.`, "sys");
        break;
      case "pwd":
        push("/root");
        break;
      case "whoami":
        push("root");
        break;
      case "uptime":
        push(` 09:42:11 up ${pod.uptime ?? "0 min"},  1 user,  load average: 0.42, 0.31, 0.28`);
        break;
      case "ls":
        push("workspace/  datasets/  models/  train.py  requirements.txt  README.md");
        break;
      case "python":
        if (args[0] === "--version") push("Python 3.11.9");
        else push(`bash: python: requer argumento (tente 'python --version')`, "err");
        break;
      case "nvcc":
        if (args[0] === "--version") {
          push("nvcc: NVIDIA (R) Cuda compiler driver");
          push("Copyright (c) 2005-2025 NVIDIA Corporation");
          push("Cuda compilation tools, release 12.8, V12.8.61");
        } else push(`bash: nvcc: argumento inválido`, "err");
        break;
      case "nvidia-smi":
        push("+-----------------------------------------------------------------------------+");
        push("| NVIDIA-SMI 555.42.06    Driver Version: 555.42.06    CUDA Version: 12.8     |");
        push("|-------------------------------+----------------------+----------------------+");
        push(`| GPU  Name                     | Memory-Usage         | GPU-Util  Temp  Pwr  |`);
        push("|===============================+======================+======================|");
        push(`|   0  ${pod.gpu.padEnd(25)}|  18432MiB / 49140MiB |   72%     64C  240W  |`);
        push("+-------------------------------+----------------------+----------------------+");
        break;
      default:
        push(`bash: ${bin}: command not found`, "err");
    }

    setLines([...next, ...out]);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === null) return;
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(null);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
    }
  }

  function copyAll() {
    const text = lines.map((l) => l.text).join("\n");
    navigator.clipboard?.writeText(text);
  }

  function download() {
    const text = lines.map((l) => l.text).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pod.name}-console.log`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title={`Console · ${pod.name}`}
        subtitle={`Sessão interativa SSH no pod ${pod.template}.`}
        actions={
          <>
            <Link to="/pods">
              <Btn variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Voltar</Btn>
            </Link>
            <Btn variant="secondary" size="sm" onClick={() => setLines(initial)}>
              <RefreshCcw className="h-4 w-4" /> Reconectar
            </Btn>
            <Btn variant="danger" size="sm"><Square className="h-4 w-4" /> Encerrar</Btn>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-danger/70" />
                <span className="h-3 w-3 rounded-full bg-warning/70" />
                <span className="h-3 w-3 rounded-full bg-success/70" />
              </div>
              <div className="ml-3 flex items-center gap-2 text-xs text-muted-foreground">
                <TerminalSquare className="h-3.5 w-3.5" />
                <span className="font-mono">{pod.name} — ssh</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={copyAll}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                title="Copiar log"
              >
                <Copy className="h-3.5 w-3.5" /> Copiar
              </button>
              <button
                onClick={download}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                title="Baixar log"
              >
                <Download className="h-3.5 w-3.5" /> Baixar
              </button>
              <button
                onClick={() => setLines([])}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                title="Limpar"
              >
                <Trash2 className="h-3.5 w-3.5" /> Limpar
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            onClick={() => inputRef.current?.focus()}
            className="bg-[#0b1020] text-[#d6e2ff] font-mono text-[13px] leading-relaxed h-[60vh] overflow-y-auto p-4"
          >
            {lines.map((l, i) => (
              <pre
                key={i}
                className={
                  l.kind === "err"
                    ? "text-[#ff8389] whitespace-pre-wrap"
                    : l.kind === "sys"
                    ? "text-[#7aa2ff] whitespace-pre-wrap"
                    : l.kind === "in"
                    ? "text-[#d6e2ff] whitespace-pre-wrap"
                    : "text-[#a5b4cf] whitespace-pre-wrap"
                }
              >
                {l.text}
              </pre>
            ))}

            <div className="flex items-center gap-2">
              <span className="text-[#7ee0a2]">{prompt}</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={!connected}
                placeholder={connected ? "" : "Pod não está rodando"}
                className="flex-1 bg-transparent outline-none border-0 text-[#d6e2ff] placeholder:text-[#5a6890] font-mono text-[13px]"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <Circle className={`h-2 w-2 ${connected ? "fill-success text-success" : "fill-muted-foreground text-muted-foreground"}`} />
                {connected ? "Conectado" : "Desconectado"}
              </span>
              <span>UTF-8</span>
              <span>bash 5.1</span>
            </div>
            <div className="font-mono">{history.length} comando(s)</div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-label mb-3">Detalhes do Pod</div>
            <dl className="space-y-2 text-sm">
              <Row label="Status">
                <Badge tone={connected ? "success" : pod.status === "Iniciando" ? "warning" : "neutral"}>
                  {pod.status}
                </Badge>
              </Row>
              <Row label="GPU"><span className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5 text-muted-foreground" />{pod.gpu}</span></Row>
              <Row label="Template">{pod.template}</Row>
              <Row label="Uptime">{pod.uptime ?? "—"}</Row>
              <Row label="Custo">{pod.cost}</Row>
              <Row label="IP">
                <span className="font-mono text-xs">{pod.ip ?? "indisponível"}</span>
              </Row>
            </dl>
          </Card>

          <Card className="p-4">
            <div className="text-label mb-3">Atalhos</div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><kbd className="kbd">↑</kbd> / <kbd className="kbd">↓</kbd> Navegar histórico</li>
              <li><kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">L</kbd> Limpar tela</li>
              <li><kbd className="kbd">Enter</kbd> Executar comando</li>
              <li>Digite <span className="font-mono text-foreground">help</span> para ver comandos</li>
            </ul>
          </Card>

          <Card className="p-4">
            <div className="text-label mb-3">SSH externo</div>
            <p className="text-xs text-muted-foreground mb-2">
              Conecte do seu terminal local:
            </p>
            <pre className="bg-muted/60 rounded px-2.5 py-2 text-[11px] font-mono overflow-x-auto">
ssh root@{pod.ip ?? "—"} -p 22
            </pre>
          </Card>
        </div>
      </div>

      <style>{`
        .kbd {
          display: inline-block;
          padding: 1px 5px;
          border-radius: 4px;
          border: 1px solid var(--border);
          background: var(--surface);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
          color: var(--foreground);
        }
      `}</style>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

// Centralized mock data for the GPU Cloud Console.

export type GpuModel = {
  name: string;
  pricePerHour: number;
  vram: string;
  ram: string;
  vcpu: number;
  availability: "Alta" | "Média" | "Baixa";
  badge?: "Mais Barato" | "Melhor Custo-Benefício" | "Melhor Performance";
};

export const gpus: GpuModel[] = [
  { name: "B200", pricePerHour: 29.45, vram: "180GB", ram: "188GB", vcpu: 24, availability: "Baixa" },
  { name: "H200 SXM", pricePerHour: 21.95, vram: "141GB", ram: "188GB", vcpu: 12, availability: "Alta" },
  { name: "H100 PCIe", pricePerHour: 14.45, vram: "80GB", ram: "125GB", vcpu: 8, availability: "Média", badge: "Melhor Performance" },
  { name: "A100 SXM", pricePerHour: 7.45, vram: "80GB", ram: "117GB", vcpu: 16, availability: "Baixa" },
  { name: "RTX 4090", pricePerHour: 3.45, vram: "24GB", ram: "41GB", vcpu: 16, availability: "Baixa", badge: "Melhor Custo-Benefício" },
  { name: "L40S", pricePerHour: 4.3, vram: "48GB", ram: "188GB", vcpu: 16, availability: "Baixa" },
  { name: "RTX 5090", pricePerHour: 4.95, vram: "32GB", ram: "60GB", vcpu: 15, availability: "Baixa" },
  { name: "A40", pricePerHour: 2.2, vram: "48GB", ram: "50GB", vcpu: 9, availability: "Baixa", badge: "Mais Barato" },
  { name: "L4", pricePerHour: 1.95, vram: "24GB", ram: "50GB", vcpu: 6, availability: "Baixa" },
  { name: "RTX A5000", pricePerHour: 1.35, vram: "24GB", ram: "50GB", vcpu: 9, availability: "Baixa" },
];

export type ModelCard = {
  name: string;
  provider: string;
  category: "LLM" | "Geração de Imagem" | "Embeddings" | "Áudio" | "Visão";
  status: "Disponível" | "Beta" | "Descontinuado";
  latency: string;
  price: string;
};

export const models: ModelCard[] = [
  { name: "Llama 3 70B", provider: "Meta", category: "LLM", status: "Disponível", latency: "~420ms", price: "R$ 0,0018 / 1k tokens" },
  { name: "Llama 3 8B", provider: "Meta", category: "LLM", status: "Disponível", latency: "~95ms", price: "R$ 0,0006 / 1k tokens" },
  { name: "Mistral 7B", provider: "Mistral AI", category: "LLM", status: "Disponível", latency: "~88ms", price: "R$ 0,0005 / 1k tokens" },
  { name: "Mixtral 8x7B", provider: "Mistral AI", category: "LLM", status: "Beta", latency: "~310ms", price: "R$ 0,0014 / 1k tokens" },
  { name: "Gemma 2 9B", provider: "Google", category: "LLM", status: "Disponível", latency: "~120ms", price: "R$ 0,0007 / 1k tokens" },
  { name: "SDXL Turbo", provider: "Stability AI", category: "Geração de Imagem", status: "Disponível", latency: "~1.2s", price: "R$ 0,018 / imagem" },
  { name: "FLUX.1 Schnell", provider: "Black Forest", category: "Geração de Imagem", status: "Disponível", latency: "~0.8s", price: "R$ 0,024 / imagem" },
  { name: "Wan I2V 720p", provider: "Wan AI", category: "Geração de Imagem", status: "Beta", latency: "~18s", price: "R$ 0,12 / vídeo" },
  { name: "BGE Large PT", provider: "BAAI", category: "Embeddings", status: "Disponível", latency: "~22ms", price: "R$ 0,00008 / 1k tokens" },
  { name: "E5 Multilingual", provider: "Microsoft", category: "Embeddings", status: "Disponível", latency: "~18ms", price: "R$ 0,00006 / 1k tokens" },
  { name: "Whisper Large v3", provider: "OpenAI", category: "Áudio", status: "Disponível", latency: "~2.1s", price: "R$ 0,006 / min" },
  { name: "LLaVA 1.6", provider: "LLaVA", category: "Visão", status: "Disponível", latency: "~540ms", price: "R$ 0,0022 / req" },
];

export type Pod = {
  name: string;
  template: string;
  gpu: string;
  status: "Rodando" | "Parado" | "Iniciando";
  uptime?: string;
  cost: string;
  ip?: string;
};

export const pods: Pod[] = [
  { name: "pytorch-training-01", template: "PyTorch 2.8.0", gpu: "A40 · 48GB VRAM", status: "Rodando", uptime: "3h 42min", cost: "R$ 2,10/h", ip: "198.51.100.42" },
  { name: "comfyui-studio", template: "ComfyUI", gpu: "RTX 4090 · 24GB VRAM", status: "Parado", cost: "R$ 0,014/h (parado)" },
  { name: "whisper-batch", template: "Ubuntu 22.04", gpu: "L4 · 24GB VRAM", status: "Iniciando", cost: "R$ 0,68/h" },
];

export type ApiKey = {
  name: string;
  prefix: string;
  scopes: string[];
  createdAt: string;
  lastUsed: string;
  status: "Ativa" | "Revogada";
};

export const apiKeys: ApiKey[] = [
  { name: "prod-key-principal", prefix: "gpucloud-sk-••••••••7a2f", scopes: ["inference", "read"], createdAt: "10/03/2025", lastUsed: "há 2h", status: "Ativa" },
  { name: "dev-testing", prefix: "gpucloud-sk-••••••••c91b", scopes: ["inference"], createdAt: "22/04/2025", lastUsed: "há 3 dias", status: "Ativa" },
  { name: "legacy-key", prefix: "gpucloud-sk-••••••••04d3", scopes: ["read"], createdAt: "05/01/2025", lastUsed: "há 2 meses", status: "Revogada" },
];

export type Template = {
  name: string;
  image: string;
  type: "Oficial" | "Verificado" | "Comunidade";
  popular?: boolean;
};

export const templates: Template[] = [
  { name: "Runpod PyTorch 2.8.0", image: "runpod/pytorch:1.0.2-cu1281-torch280", type: "Oficial", popular: true },
  { name: "Runpod PyTorch 2.4.0", image: "runpod/pytorch:2.4.0-py3.11-cuda12.4.1", type: "Oficial" },
  { name: "Runpod PyTorch 2.2.0", image: "runpod/pytorch:2.2.0-py3.10-cuda12.1.1", type: "Oficial" },
  { name: "Runpod PyTorch 2.1", image: "runpod/pytorch:2.1.0-py3.10-cuda11.8.0", type: "Oficial" },
  { name: "ComfyUI", image: "runpod/comfyui:latest", type: "Oficial" },
  { name: "ComfyUI CUDA 13", image: "runpod/comfyui:cuda13.0", type: "Oficial" },
  { name: "Stable Diffusion WebUI", image: "runpod/stable-diffusion:latest", type: "Verificado" },
  { name: "JupyterLab", image: "runpod/jupyter:latest", type: "Oficial" },
  { name: "Runpod Ubuntu 24.04", image: "runpod/base:1.0.2-ubuntu2404", type: "Oficial" },
  { name: "Runpod Ubuntu 22.04", image: "runpod/base:1.0.2-ubuntu2204", type: "Oficial" },
  { name: "Runpod Ubuntu 20.04", image: "runpod/base:0.7.0-ubuntu2004", type: "Oficial" },
  { name: "a2go", image: "runpod/a2go:latest", type: "Oficial" },
];

export const sshKeys = [
  { name: "MacBook Pro pessoal", fingerprint: "SHA256:xK9mL2pQ7nR8sT3uV6wX9yZ1aB4cD5eF8gH0iJ", added: "15/03/2025", pods: 2 },
  { name: "Servidor CI/CD", fingerprint: "SHA256:pQ7nR8sT3uV6wX9yZ1aB4cD5eF8gH0iJ2kL4m", added: "28/04/2025", pods: 1 },
];

export const customImages = [
  { name: "meu-modelo-prod", registry: "docker.io/empresa/ml-model:v2.1", added: "02/05/2025", status: "Verificada", pods: 1 },
  { name: "finetuned-llama", registry: "ghcr.io/org/llama-ft:latest", added: "28/04/2025", status: "Pendente", pods: 0 },
  { name: "legacy-image", registry: "docker.io/empresa/old:1.0", added: "10/01/2025", status: "Falhou", pods: 0 },
];

export const usageSeries = [
  { day: "Seg", requests: 8400, podHours: 18 },
  { day: "Ter", requests: 11200, podHours: 22 },
  { day: "Qua", requests: 9800, podHours: 20 },
  { day: "Qui", requests: 13100, podHours: 24 },
  { day: "Sex", requests: 14823, podHours: 26 },
  { day: "Sáb", requests: 7200, podHours: 12 },
  { day: "Dom", requests: 6400, podHours: 10 },
];

export const billingDaily = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1}`,
  pods: 18 + Math.round(Math.sin(i) * 8 + 22),
  api: 4 + Math.round(Math.cos(i / 2) * 3 + 5),
  storage: 3 + (i % 3),
}));

export const recentActivity = [
  { kind: "ok" as const, text: "Pod pytorch-training-01 iniciado", time: "há 23 min" },
  { kind: "warn" as const, text: "Saldo abaixo de R$ 300,00", time: "há 1 h" },
  { kind: "ok" as const, text: "API Key dev-testing criada", time: "há 3 h" },
  { kind: "danger" as const, text: "Pod legacy-runner deletado", time: "há 5 h" },
  { kind: "ok" as const, text: "Deploy de comfyui-studio concluído", time: "ontem" },
  { kind: "ok" as const, text: "Chave SSH MacBook Pro pessoal vinculada", time: "ontem" },
  { kind: "warn" as const, text: "GPU H100 PCIe com disponibilidade média", time: "há 2 dias" },
  { kind: "ok" as const, text: "Recarga de R$ 500,00 aplicada", time: "há 3 dias" },
];

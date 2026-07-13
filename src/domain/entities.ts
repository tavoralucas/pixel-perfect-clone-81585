/**
 * Domain entities & value objects.
 *
 * Pure TypeScript types describing the business concepts of the GPUaaS
 * platform. This layer has ZERO framework dependencies. Every other layer
 * (application, infrastructure, presentation) may import from here, but
 * this file must never import from any of them.
 */

export type PodStatus = "Rodando" | "Parado" | "Iniciando";

export interface Pod {
  name: string;
  template: string;
  gpu: string;
  status: PodStatus;
  uptime?: string;
  cost: string;
  ip?: string;
}

export interface Gpu {
  name: string;
  pricePerHour: number;
  vram: string;
  ram: string;
  vcpu: number;
  availability: "Alta" | "Média" | "Baixa";
  badge?: "Mais Barato" | "Melhor Custo-Benefício" | "Melhor Performance";
}

export type ModelCategory = "LLM" | "Geração de Imagem" | "Embeddings" | "Áudio" | "Visão";
export type ModelStatus = "Disponível" | "Beta" | "Descontinuado";

export interface Model {
  name: string;
  provider: string;
  category: ModelCategory;
  status: ModelStatus;
  latency: string;
  price: string;
}

export interface ApiKey {
  name: string;
  prefix: string;
  scopes: string[];
  createdAt: string;
  lastUsed: string;
  status: "Ativa" | "Revogada";
}

export interface Template {
  name: string;
  image: string;
  type: "Oficial" | "Verificado" | "Comunidade";
  popular?: boolean;
}

export interface SshKey {
  name: string;
  fingerprint: string;
  added: string;
  pods: number;
}

export interface CustomImage {
  name: string;
  registry: string;
  added: string;
  status: "Verificada" | "Pendente" | "Falhou";
  pods: number;
}

export interface UsagePoint {
  day: string;
  requests: number;
  podHours: number;
}

export interface BillingDailyPoint {
  day: string;
  pods: number;
  api: number;
  storage: number;
}

export type ActivityKind = "ok" | "warn" | "danger";

export interface ActivityEvent {
  kind: ActivityKind;
  text: string;
  time: string;
}

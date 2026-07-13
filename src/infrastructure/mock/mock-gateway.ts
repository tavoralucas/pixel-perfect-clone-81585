import type {
  AddCustomImageInput,
  ApiGateway,
  CreateApiKeyInput,
  DeployPodInput,
} from "@/application/ports/api-gateway";
import type {
  ActivityEvent,
  ApiKey,
  BillingDailyPoint,
  CustomImage,
  Gpu,
  Model,
  Pod,
  SshKey,
  Template,
  UsagePoint,
} from "@/domain/entities";
import {
  apiKeys as seedApiKeys,
  billingDaily,
  customImages,
  gpus,
  models,
  pods as seedPods,
  recentActivity,
  sshKeys,
  templates,
  usageSeries,
} from "@/lib/mockData";

/**
 * Mock implementation of `ApiGateway`.
 *
 * Backed by the static fixtures in `src/lib/mockData.ts`. Enabled when
 * `VITE_API_MODE !== "http"`. Mutations are kept in memory for the current
 * session so the UI feels alive.
 */
export class MockApiGateway implements ApiGateway {
  private pods: Pod[] = [...(seedPods as Pod[])];
  private apiKeys: ApiKey[] = [...(seedApiKeys as ApiKey[])];
  private images: CustomImage[] = [...(customImages as CustomImage[])];

  private delay<T>(value: T, ms = 120): Promise<T> {
    return new Promise((r) => setTimeout(() => r(value), ms));
  }

  listPods() {
    return this.delay(this.pods);
  }
  getPod(name: string) {
    return this.delay(this.pods.find((p) => p.name === name));
  }
  deployPod(input: DeployPodInput) {
    const pod: Pod = {
      name: input.name,
      template: input.template,
      gpu: `${input.gpu} · ${input.qty}x`,
      status: "Iniciando",
      cost: "R$ 0,00/h",
    };
    this.pods = [pod, ...this.pods];
    return this.delay(pod);
  }
  stopPod(name: string) {
    this.pods = this.pods.map((p) => (p.name === name ? { ...p, status: "Parado" as const } : p));
    return this.delay(undefined as void);
  }
  deletePod(name: string) {
    this.pods = this.pods.filter((p) => p.name !== name);
    return this.delay(undefined as void);
  }

  listGpus(): Promise<Gpu[]> {
    return this.delay(gpus as Gpu[]);
  }
  listTemplates(): Promise<Template[]> {
    return this.delay(templates as Template[]);
  }
  listModels(): Promise<Model[]> {
    return this.delay(models as Model[]);
  }

  listApiKeys() {
    return this.delay(this.apiKeys);
  }
  createApiKey(input: CreateApiKeyInput) {
    const secret = "gpucloud-sk-live-" + Math.random().toString(36).slice(2, 14);
    const now = new Date();
    const createdAt = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
    const apiKey: ApiKey = {
      name: input.name,
      prefix: "gpucloud-sk-••••••••" + secret.slice(-4),
      scopes: input.scopes,
      createdAt,
      lastUsed: "nunca",
      status: "Ativa",
    };
    this.apiKeys = [apiKey, ...this.apiKeys];
    return this.delay({ apiKey, secret });
  }
  revokeApiKey(name: string) {
    this.apiKeys = this.apiKeys.map((k) => (k.name === name ? { ...k, status: "Revogada" as const } : k));
    return this.delay(undefined as void);
  }
  deleteApiKey(name: string) {
    this.apiKeys = this.apiKeys.filter((k) => k.name !== name);
    return this.delay(undefined as void);
  }

  listSshKeys(): Promise<SshKey[]> {
    return this.delay(sshKeys as SshKey[]);
  }

  listCustomImages() {
    return this.delay(this.images);
  }
  addCustomImage(input: AddCustomImageInput) {
    const img: CustomImage = {
      name: input.name,
      registry: input.registry,
      added: new Date().toLocaleDateString("pt-BR"),
      status: "Verificada",
      pods: 0,
    };
    this.images = [img, ...this.images];
    return this.delay(img);
  }
  deleteCustomImage(name: string) {
    this.images = this.images.filter((i) => i.name !== name);
    return this.delay(undefined as void);
  }

  getUsageSeries(): Promise<UsagePoint[]> {
    return this.delay(usageSeries as UsagePoint[]);
  }
  getBillingDaily(): Promise<BillingDailyPoint[]> {
    return this.delay(billingDaily as BillingDailyPoint[]);
  }
  getRecentActivity(): Promise<ActivityEvent[]> {
    return this.delay(recentActivity as ActivityEvent[]);
  }
}

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

/**
 * Application-layer port.
 *
 * The presentation layer talks to a single `ApiGateway` interface; concrete
 * implementations (HTTP, mock) live under `src/infrastructure/*` and are
 * wired by the composition root (`src/infrastructure/composition-root.ts`).
 *
 * Adding a new resource: extend this interface, add a method on every
 * implementation, then document the endpoint under `docs/api/`.
 */
export interface ApiGateway {
  // Pods
  listPods(): Promise<Pod[]>;
  getPod(name: string): Promise<Pod | undefined>;
  deployPod(input: DeployPodInput): Promise<Pod>;
  stopPod(name: string): Promise<void>;
  deletePod(name: string): Promise<void>;

  // GPUs & Templates
  listGpus(): Promise<Gpu[]>;
  listTemplates(): Promise<Template[]>;

  // Inference / Models
  listModels(): Promise<Model[]>;

  // API keys
  listApiKeys(): Promise<ApiKey[]>;
  createApiKey(input: CreateApiKeyInput): Promise<{ apiKey: ApiKey; secret: string }>;
  revokeApiKey(name: string): Promise<void>;
  deleteApiKey(name: string): Promise<void>;

  // SSH & Custom images
  listSshKeys(): Promise<SshKey[]>;
  listCustomImages(): Promise<CustomImage[]>;
  addCustomImage(input: AddCustomImageInput): Promise<CustomImage>;
  deleteCustomImage(name: string): Promise<void>;

  // Usage & Billing
  getUsageSeries(): Promise<UsagePoint[]>;
  getBillingDaily(): Promise<BillingDailyPoint[]>;
  getRecentActivity(): Promise<ActivityEvent[]>;
}

export interface DeployPodInput {
  name: string;
  template: string;
  gpu: string;
  qty: number;
  billing: "ondemand" | "reserved";
}

export interface CreateApiKeyInput {
  name: string;
  scopes: string[];
}

export interface AddCustomImageInput {
  name: string;
  registry: string;
  credentials?: { username: string; token: string };
}

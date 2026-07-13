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
import { HttpClient } from "./http-client";
import { ENDPOINTS } from "./endpoints";

/**
 * HTTP implementation of `ApiGateway`.
 *
 * All methods translate directly to endpoints documented under
 * `docs/api/`. Enabled by setting `VITE_API_MODE=http` and pointing
 * `VITE_API_BASE_URL` at your backend.
 */
export class HttpApiGateway implements ApiGateway {
  constructor(private readonly http: HttpClient) {}

  listPods = () => this.http.get<Pod[]>(ENDPOINTS.pods.list());
  getPod = (name: string) => this.http.get<Pod>(ENDPOINTS.pods.detail(name));
  deployPod = (input: DeployPodInput) => this.http.post<Pod>(ENDPOINTS.pods.create(), input);
  stopPod = async (name: string) => {
    await this.http.post<void>(ENDPOINTS.pods.stop(name));
  };
  deletePod = async (name: string) => {
    await this.http.delete<void>(ENDPOINTS.pods.remove(name));
  };

  listGpus = () => this.http.get<Gpu[]>(ENDPOINTS.gpus.list());
  listTemplates = () => this.http.get<Template[]>(ENDPOINTS.templates.list());
  listModels = () => this.http.get<Model[]>(ENDPOINTS.models.list());

  listApiKeys = () => this.http.get<ApiKey[]>(ENDPOINTS.apiKeys.list());
  createApiKey = (input: CreateApiKeyInput) =>
    this.http.post<{ apiKey: ApiKey; secret: string }>(ENDPOINTS.apiKeys.create(), input);
  revokeApiKey = async (name: string) => {
    await this.http.post<void>(ENDPOINTS.apiKeys.revoke(name));
  };
  deleteApiKey = async (name: string) => {
    await this.http.delete<void>(ENDPOINTS.apiKeys.remove(name));
  };

  listSshKeys = () => this.http.get<SshKey[]>(ENDPOINTS.sshKeys.list());
  listCustomImages = () => this.http.get<CustomImage[]>(ENDPOINTS.customImages.list());
  addCustomImage = (input: AddCustomImageInput) =>
    this.http.post<CustomImage>(ENDPOINTS.customImages.create(), input);
  deleteCustomImage = async (name: string) => {
    await this.http.delete<void>(ENDPOINTS.customImages.remove(name));
  };

  getUsageSeries = () => this.http.get<UsagePoint[]>(ENDPOINTS.usage.series());
  getBillingDaily = () => this.http.get<BillingDailyPoint[]>(ENDPOINTS.billing.daily());
  getRecentActivity = () => this.http.get<ActivityEvent[]>(ENDPOINTS.usage.activity());
}

/**
 * Endpoint map — SINGLE SOURCE OF TRUTH for HTTP paths.
 *
 * Keep this file synchronized with `docs/api/*.md`. Every endpoint declared
 * here MUST have a corresponding entry in the Markdown docs, and vice versa.
 */
export const ENDPOINTS = {
  pods: {
    list: () => `/pods`,
    detail: (name: string) => `/pods/${encodeURIComponent(name)}`,
    create: () => `/pods`,
    stop: (name: string) => `/pods/${encodeURIComponent(name)}/stop`,
    remove: (name: string) => `/pods/${encodeURIComponent(name)}`,
  },
  gpus: {
    list: () => `/gpus`,
  },
  templates: {
    list: () => `/templates`,
  },
  models: {
    list: () => `/models`,
  },
  apiKeys: {
    list: () => `/api-keys`,
    create: () => `/api-keys`,
    revoke: (name: string) => `/api-keys/${encodeURIComponent(name)}/revoke`,
    remove: (name: string) => `/api-keys/${encodeURIComponent(name)}`,
  },
  sshKeys: {
    list: () => `/ssh-keys`,
  },
  customImages: {
    list: () => `/images`,
    create: () => `/images`,
    remove: (name: string) => `/images/${encodeURIComponent(name)}`,
  },
  usage: {
    series: () => `/usage/series`,
    activity: () => `/usage/activity`,
  },
  billing: {
    daily: () => `/billing/daily`,
  },
} as const;

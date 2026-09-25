import { Client, analyzerApiClient, discoveryApiClient } from '../../../api';
import { Endpoints, HTTP_HEADERS, HTTP_STATUS } from '../../../constants';
import { CLUSTER_INSIGHTS } from '../constants/insights';
import type { ResourceDetailsResponse } from '../../../interfaces/http';
import type {
  AnalyzeResponse,
  AnalyzerRuntime,
  AppInsights,
  ClusterInsightsPage,
  ClusterInsightsQuery,
  Insight,
  TriageAction,
  ValidateModelResponse,
} from '../models';

// Windowed read: the caller passes only the apps it is showing, keyed
// `namespace/name`. results holds the stored documents; pending are apps whose
// document could not be read yet.
export interface ApplicationInsightsRead {
  results: Record<string, AppInsights>;
  pending: string[];
}

export const insightsAppKey = (namespace: string, name: string): string => `${namespace}/${name}`;

export const fetchApplicationInsights = async (
  appKeys: string[],
): Promise<ApplicationInsightsRead> => {
  const { path, method } = Endpoints.INSIGHTS.GET_APPLICATIONS;
  const res = await Client<ResourceDetailsResponse<ApplicationInsightsRead>>(
    discoveryApiClient,
    path,
    { method, params: { apps: appKeys.join(',') } },
  );
  return res.data;
};

export const analyzeApplication = async (
  namespace: string,
  name: string,
): Promise<AnalyzeResponse> => {
  const { path, method } = Endpoints.INSIGHTS.ANALYZE(namespace, name);
  const res = await Client<ResourceDetailsResponse<AnalyzeResponse>>(analyzerApiClient, path, {
    method,
  });
  return res.data;
};

export const fetchAnalyzerRuntime = async (): Promise<AnalyzerRuntime> => {
  const { path, method } = Endpoints.INSIGHTS.RUNTIME;
  const res = await Client<ResourceDetailsResponse<AnalyzerRuntime>>(analyzerApiClient, path, {
    method,
  });
  return res.data;
};

export const validateAnalyzerModel = async (model: string): Promise<ValidateModelResponse> => {
  const { path, method } = Endpoints.INSIGHTS.RUNTIME_VALIDATE;
  const res = await Client<ResourceDetailsResponse<ValidateModelResponse>>(
    analyzerApiClient,
    path,
    { method, data: { model } },
  );
  return res.data;
};

export const pullAnalyzerModel = async (model: string): Promise<AnalyzerRuntime> => {
  const { path, method } = Endpoints.INSIGHTS.RUNTIME_PULL;
  const res = await Client<ResourceDetailsResponse<AnalyzerRuntime>>(analyzerApiClient, path, {
    method,
    data: { model },
  });
  return res.data;
};

// Read-your-writes: the discovery list lags a write by up to its refresh interval, so for
// FRESH_READ_MS after this tab's own triage, list reads ask it to catch up first. Without that, a
// view opened or reloaded meanwhile (table, counts) would show the state from before the triage.
const readWroteAt = (): number => {
  try {
    return Number(globalThis.sessionStorage.getItem(CLUSTER_INSIGHTS.WROTE_AT_STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
};

let wroteAt = readWroteAt();

const noteWrite = (): void => {
  wroteAt = Date.now();
  try {
    globalThis.sessionStorage.setItem(CLUSTER_INSIGHTS.WROTE_AT_STORAGE_KEY, String(wroteAt));
  } catch {
    // The in-memory mark still covers this page's reads; only a reload would read stale.
  }
};

const freshRead = (): boolean => Date.now() - wroteAt < CLUSTER_INSIGHTS.FRESH_READ_MS;

export const triageInsight = async (
  namespace: string,
  name: string,
  id: string,
  action: TriageAction,
): Promise<Insight> => {
  const { path, method } = Endpoints.INSIGHTS.TRIAGE(namespace, name, id);
  const res = await Client<ResourceDetailsResponse<Insight>>(analyzerApiClient, path, {
    method,
    data: { action },
  });
  noteWrite();
  return res.data;
};

export type ClusterInsightsRead =
  | { kind: 'page'; page: ClusterInsightsPage; etag: string }
  | { kind: 'not-modified' }
  | { kind: 'not-ready' };

const ACCEPTED_LIST_STATUSES: ReadonlySet<number> = new Set([
  HTTP_STATUS.SUCCESS,
  HTTP_STATUS.NOT_MODIFIED,
  HTTP_STATUS.SERVICE_UNAVAILABLE,
]);

const listParams = (
  query: ClusterInsightsQuery,
  page: number,
  pageSize: number,
): Record<string, string | number> => {
  const params: Record<string, string | number> = { page, pageSize };
  // Page 1 starts every read; later pages come after its catch-up and need none of their own.
  if (page === 1 && freshRead()) params.fresh = 'true';
  const optional: Record<string, string | string[] | undefined> = {
    category: query.category,
    kind: query.kind,
    severity: query.severity,
    state: query.state,
    triage: query.triage,
    namespace: query.namespace,
    environment: query.environment,
    q: query.q,
    id: query.id,
    app: query.app,
  };
  Object.entries(optional).forEach(([key, value]) => {
    const joined = Array.isArray(value) ? value.join(',') : value;
    if (joined) params[key] = joined;
  });
  return params;
};

// If-None-Match with the last ETag: a 304 keeps the page already shown. A 503
// means the discovery index is still loading, not that the service is down.
const readPage = async (
  query: ClusterInsightsQuery,
  page: number,
  pageSize: number,
  etag: string,
): Promise<ClusterInsightsRead> => {
  const { path, method } = Endpoints.INSIGHTS.LIST;
  const res = await discoveryApiClient.request<ResourceDetailsResponse<ClusterInsightsPage>>({
    url: path,
    method,
    params: listParams(query, page, pageSize),
    headers: etag ? { [HTTP_HEADERS.STANDARD.IF_NONE_MATCH]: etag } : undefined,
    validateStatus: (status) => ACCEPTED_LIST_STATUSES.has(status),
  });
  if (res.status === HTTP_STATUS.NOT_MODIFIED) return { kind: 'not-modified' };
  if (res.status === HTTP_STATUS.SERVICE_UNAVAILABLE) return { kind: 'not-ready' };
  return {
    kind: 'page',
    page: res.data.data,
    etag: String(res.headers[HTTP_HEADERS.STANDARD.ETAG] ?? ''),
  };
};

// Without `page`, reads the whole filtered set so the table sorts and pages it locally. Only
// page 1 sends the ETag: the tag hashes the index version, so a 304 there means no page changed.
export const fetchClusterInsights = async (
  query: ClusterInsightsQuery,
  etag: string,
): Promise<ClusterInsightsRead> => {
  if (query.page !== undefined) {
    return readPage(query, query.page, query.pageSize ?? CLUSTER_INSIGHTS.PAGE_SIZE, etag);
  }
  const size = CLUSTER_INSIGHTS.MAX_LIST_PAGE_SIZE;
  const first = await readPage(query, 1, size, etag);
  if (first.kind !== 'page') return first;
  // Every read scans the replica's whole filtered set: a few at a time, and never past the cap
  // (rows come most severe first, so the cap keeps the most severe).
  const pages = Math.min(Math.ceil(first.page.total / size), CLUSTER_INSIGHTS.MAX_LIST_PAGES);
  const items = [...first.page.items];
  for (let start = 2; start <= pages; start += CLUSTER_INSIGHTS.LIST_READ_CONCURRENCY) {
    const batch = Array.from(
      { length: Math.min(CLUSTER_INSIGHTS.LIST_READ_CONCURRENCY, pages - start + 1) },
      (_, i) => readPage(query, start + i, size, ''),
    );
    for (const read of await Promise.all(batch)) {
      if (read.kind !== 'page') return { kind: 'not-ready' };
      items.push(...read.page.items);
    }
  }
  // `total` stays the server's count of the filtered set: above the cap it exceeds the items.
  return {
    kind: 'page',
    page: { ...first.page, items, page: 1, pageSize: items.length },
    etag: first.etag,
  };
};

export const fetchInsightNamespaces = async (): Promise<string[]> => {
  const { path, method } = Endpoints.NAMESPACES.GET;
  const res = await Client<ResourceDetailsResponse<string[]>>(discoveryApiClient, path, { method });
  return (res?.data ?? []).filter(Boolean);
};

import { describe, expect, it } from 'vitest';
import { Endpoints, HTTP_HEADERS } from '../../../constants';
import { describeClients, mockEndpoint } from '../../../test';
import { buildClusterPage, buildInsightRow, buildRuntime } from '../../../test/factories/insights';
import { CLUSTER_INSIGHTS } from '../constants/insights';
import {
  analyzeApplication,
  fetchAnalyzerRuntime,
  fetchApplicationInsights,
  fetchClusterInsights,
  fetchInsightNamespaces,
  pullAnalyzerModel,
  triageInsight,
  validateAnalyzerModel,
} from '.';

const NAMESPACE = 'payments';
const APP = 'checkout';
const runtime = buildRuntime();

describeClients('insights', [
  {
    name: 'fetchApplicationInsights',
    service: 'discovery',
    endpoint: Endpoints.INSIGHTS.GET_APPLICATIONS,
    call: () => fetchApplicationInsights([`${NAMESPACE}/${APP}`]),
    response: { data: { results: {}, pending: [] } },
    expected: { results: {}, pending: [] },
  },
  {
    name: 'analyzeApplication',
    service: 'analyzer',
    endpoint: Endpoints.INSIGHTS.ANALYZE(NAMESPACE, APP),
    call: () => analyzeApplication(NAMESPACE, APP),
    response: { data: { runId: 'run', status: 'queued' } },
    expected: { runId: 'run', status: 'queued' },
  },
  {
    name: 'fetchAnalyzerRuntime',
    service: 'analyzer',
    endpoint: Endpoints.INSIGHTS.RUNTIME,
    call: () => fetchAnalyzerRuntime(),
    response: { data: runtime as never },
    expected: runtime,
  },
  {
    name: 'validateAnalyzerModel',
    service: 'analyzer',
    endpoint: Endpoints.INSIGHTS.RUNTIME_VALIDATE,
    call: () => validateAnalyzerModel('qwen3:4b'),
    response: { data: { ok: true, model: 'qwen3:4b', license: 'Apache-2.0', capabilities: [] } },
    expected: { ok: true, model: 'qwen3:4b', license: 'Apache-2.0', capabilities: [] },
    body: { model: 'qwen3:4b' },
  },
  {
    name: 'pullAnalyzerModel',
    service: 'analyzer',
    endpoint: Endpoints.INSIGHTS.RUNTIME_PULL,
    call: () => pullAnalyzerModel('qwen3:4b'),
    response: { data: runtime as never },
    expected: runtime,
    body: { model: 'qwen3:4b' },
  },
  {
    name: 'triageInsight',
    service: 'analyzer',
    endpoint: Endpoints.INSIGHTS.TRIAGE(NAMESPACE, APP, 'insight-1'),
    call: () => triageInsight(NAMESPACE, APP, 'insight-1', 'dismiss'),
    response: { data: { id: 'insight-1' } },
    expected: { id: 'insight-1' },
    body: { action: 'dismiss' },
  },
]);

describe('namespaces', () => {
  it('drops blank names', async () => {
    mockEndpoint('discovery', Endpoints.NAMESPACES.GET, { data: ['payments', ''] });

    await expect(fetchInsightNamespaces()).resolves.toEqual(['payments']);
  });
});

describe('fetchClusterInsights', () => {
  const page = buildClusterPage([buildInsightRow()]);
  const mockList = (status: number, etag?: string) =>
    mockEndpoint(
      'discovery',
      Endpoints.INSIGHTS.LIST,
      status === 200 ? { data: page as never } : {},
      { status, headers: etag ? { [HTTP_HEADERS.STANDARD.ETAG]: etag } : {} },
    );

  it('sends the last ETag, and keeps the shown page on a 304', async () => {
    const list = mockList(304);

    await expect(fetchClusterInsights({ page: 1, pageSize: 1 }, 'tag-1')).resolves.toEqual({
      kind: 'not-modified',
    });
    expect(list.calls[0].headers.get(HTTP_HEADERS.STANDARD.IF_NONE_MATCH)).toBe('tag-1');
  });

  it('reads a 503 as an index that is still loading', async () => {
    mockList(503);

    await expect(fetchClusterInsights({ page: 1, pageSize: 1 }, '')).resolves.toEqual({
      kind: 'not-ready',
    });
  });

  it('returns the page and its ETag, and joins array filters', async () => {
    const list = mockList(200, 'tag-2');

    const read = await fetchClusterInsights(
      { page: 2, pageSize: 10, severity: ['critical', 'info'], app: ['payments/checkout'] },
      '',
    );

    expect(read).toEqual({ kind: 'page', page, etag: 'tag-2' });
    const params = list.calls[0].url.searchParams;
    expect(params.get('severity')).toBe('critical,info');
    expect(params.get('app')).toBe('payments/checkout');
    expect(params.get('page')).toBe('2');
  });

  it('asks for a fresh read just after a triage in this tab', async () => {
    mockEndpoint('analyzer', Endpoints.INSIGHTS.TRIAGE(NAMESPACE, APP, 'x'), { data: {} });
    await triageInsight(NAMESPACE, APP, 'x', 'dismiss');
    const list = mockList(200);

    await fetchClusterInsights({ page: 1, pageSize: 1 }, '');

    expect(list.calls[0].url.searchParams.get('fresh')).toBe('true');
    expect(Number(sessionStorage.getItem(CLUSTER_INSIGHTS.WROTE_AT_STORAGE_KEY))).toBeGreaterThan(
      0,
    );
  });
});

import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { ANALYZER_API, DISCOVERY_API, Endpoints } from '../../constants';
import { CATEGORIES_CONSTANTS } from '../../features/access-and-permissions/categories/constants';
import type {
  AnalyzerRuntime,
  AppInsights,
  ClusterInsightsPage,
  InsightRow,
} from '../../features/insights/models';
import { mockEmptyLists, mockEndpoint } from '../api';
import { buildClusterPage, buildRuntime } from '../factories/insights';
import { server } from '../server';
import { mockEventStream } from './eventStream';

interface InsightsApiOptions {
  rows?: InsightRow[];
  page?: ClusterInsightsPage;
  /** Stored documents, keyed `namespace/app`. */
  documents?: Record<string, AppInsights>;
  runtime?: AnalyzerRuntime;
  namespaces?: string[];
}

/** The Insights API a page reads: list, namespaces, documents, runtime and the event stream. */
export const mockInsightsApi = ({
  rows = [],
  page = buildClusterPage(rows),
  documents = {},
  runtime = buildRuntime(),
  namespaces = ['payments'],
}: InsightsApiOptions = {}) => {
  mockEmptyLists('exporter', [
    Endpoints.CATEGORIES.GET_BY_SCOPE(CATEGORIES_CONSTANTS.SCOPES.PLAN_ENVIRONMENTS),
  ]);
  mockEndpoint('discovery', Endpoints.NAMESPACES.GET, { data: namespaces });
  mockEndpoint('analyzer', Endpoints.INSIGHTS.RUNTIME, { data: runtime as never });
  return {
    list: mockEndpoint('discovery', Endpoints.INSIGHTS.LIST, { data: page as never }),
    documents: mockEndpoint('discovery', Endpoints.INSIGHTS.GET_APPLICATIONS, {
      data: { results: documents, pending: [] } as never,
    }),
    stream: mockEventStream(`${ANALYZER_API.BASE_URL}/${Endpoints.INSIGHTS.EVENTS.path}`),
  };
};

/** Answers the page's one-row lookup by `id` only; every other list read keeps its own mock. */
export const mockInsightLookup = (found?: InsightRow): void => {
  server.use(
    http.get(`${DISCOVERY_API.BASE_URL}/${Endpoints.INSIGHTS.LIST.path}`, ({ request }) => {
      if (!new URL(request.url).searchParams.has('id')) return undefined;
      return HttpResponse.json({ data: buildClusterPage(found ? [found] : []) as never });
    }),
  );
};

type InsightsStream = ReturnType<typeof mockEventStream>;

/** Waits until the page has opened the event stream, then pushes one named event down it. */
export const pushInsightEvent = async (stream: InsightsStream, name: string, data: unknown) => {
  await waitFor(() => {
    if (stream.connections() === 0) throw new Error('The event stream is not open yet');
  });
  stream.send(`event: ${name}\ndata: ${JSON.stringify(data)}\n\n`);
};

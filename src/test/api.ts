import { http, HttpResponse, type JsonBodyType } from 'msw';
import { ANALYZER_API, AUTH_API, DISCOVERY_API, EXPORTER_API } from '../constants';
import { server } from './server';

const SERVICES = {
  exporter: EXPORTER_API,
  discovery: DISCOVERY_API,
  auth: AUTH_API,
  analyzer: ANALYZER_API,
} as const;

export type ServiceName = keyof typeof SERVICES;

/** Matches every entry of `Endpoints`, so tests name the same endpoint the code calls. */
export interface EndpointRef {
  path: string;
  method: string;
}

interface RecordedCall<TBody> {
  body: TBody;
  url: URL;
  headers: Headers;
}

export interface EndpointMock<TBody> {
  calls: RecordedCall<TBody>[];
}

interface MockResponseOptions {
  status?: number;
  headers?: Record<string, string>;
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const urlFor = (service: ServiceName, endpoint: EndpointRef): string => {
  // MSW matches on the path only and ignores handlers declared with a query string.
  const [path] = endpoint.path.split('?');
  return `${SERVICES[service].BASE_URL}/${path}`;
};

const parseBody = async <TBody>(request: Request): Promise<TBody> => {
  const text = await request.text();
  return (text ? JSON.parse(text) : undefined) as TBody;
};

const handle = <TBody>(
  service: ServiceName,
  endpoint: EndpointRef,
  respond: () => Response | Promise<Response>,
): EndpointMock<TBody> => {
  const mock: EndpointMock<TBody> = { calls: [] };
  const method = endpoint.method.toLowerCase() as HttpMethod;
  server.use(
    http[method](urlFor(service, endpoint), async ({ request }) => {
      mock.calls.push({
        body: await parseBody<TBody>(request.clone()),
        url: new URL(request.url),
        headers: request.headers,
      });
      return respond();
    }),
  );
  return mock;
};

/** Answers one endpoint and records every call. The latest mock of an endpoint wins. */
export const mockEndpoint = <TBody = unknown>(
  service: ServiceName,
  endpoint: EndpointRef,
  response: JsonBodyType,
  options: MockResponseOptions = {},
): EndpointMock<TBody> =>
  handle<TBody>(service, endpoint, () => HttpResponse.json(response, options));

/** Answers one endpoint with an empty body, as the delete routes do. */
export const mockEmptyEndpoint = <TBody = unknown>(
  service: ServiceName,
  endpoint: EndpointRef,
  status = 204,
): EndpointMock<TBody> =>
  handle<TBody>(service, endpoint, () => new HttpResponse(null, { status }));

/** Fails one endpoint at the network level, as an unreachable service does. */
export const mockNetworkError = <TBody = unknown>(
  service: ServiceName,
  endpoint: EndpointRef,
): EndpointMock<TBody> => handle<TBody>(service, endpoint, () => HttpResponse.error());

/** Never answers one endpoint, to see what a page shows while a request is in flight. */
export const mockPendingEndpoint = <TBody = unknown>(
  service: ServiceName,
  endpoint: EndpointRef,
): EndpointMock<TBody> =>
  handle<TBody>(service, endpoint, () => new Promise<Response>(() => undefined));

/** The empty answer of a list endpoint. */
export const EMPTY_LIST_BODY = { data: { items: [] } };

/** Answers a list endpoint with these records. */
export const mockList = <TBody = unknown>(
  service: ServiceName,
  endpoint: EndpointRef,
  items: readonly unknown[],
): EndpointMock<TBody> =>
  mockEndpoint<TBody>(service, endpoint, { data: { items } } as JsonBodyType);

/** Answers each endpoint with an empty list, for the side requests a page makes. */
export const mockEmptyLists = (service: ServiceName, endpoints: readonly EndpointRef[]): void => {
  for (const endpoint of endpoints) mockEndpoint(service, endpoint, EMPTY_LIST_BODY);
};

/** Fails one endpoint with a 500, optionally with the server's error body. */
export const mockServerError = <TBody = unknown>(
  service: ServiceName,
  endpoint: EndpointRef,
  body: JsonBodyType = {},
): EndpointMock<TBody> => mockEndpoint<TBody>(service, endpoint, body, { status: 500 });

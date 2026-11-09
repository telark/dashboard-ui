import type { JsonBodyType } from 'msw';
import { describe, expect, it } from 'vitest';
import { mockEndpoint, mockServerError, type EndpointRef, type ServiceName } from '../api';

interface ClientCase {
  name: string;
  service: ServiceName;
  endpoint: EndpointRef;
  call: () => Promise<unknown>;
  /** What the server answers. */
  response?: JsonBodyType;
  /** Request body the client must send. */
  body?: unknown;
  /** What the client must resolve to, when it isn't the response as is. */
  expected?: unknown;
}

/** The failure half of every client contract. */
export const itRejectsOnServerError = (client: {
  service: ServiceName;
  endpoint: EndpointRef;
  call: () => Promise<unknown>;
}): void => {
  it('rejects when the server fails', async () => {
    mockServerError(client.service, client.endpoint);

    await expect(client.call()).rejects.toThrow();
  });
};

/** One table per client file: the method, URL, body, returned data and failure of each call. */
export const describeClients = (feature: string, cases: readonly ClientCase[]): void => {
  describe.each(cases)(`${feature} client: $name`, (client) => {
    const response = client.response ?? { ok: true };

    it('sends the request and returns the data', async () => {
      const mock = mockEndpoint(client.service, client.endpoint, response);

      const result = await client.call();

      expect(mock.calls).toHaveLength(1);
      if (client.body !== undefined) expect(mock.calls[0].body).toEqual(client.body);
      expect(result).toEqual(client.expected ?? response);
    });

    itRejectsOnServerError(client);
  });
};

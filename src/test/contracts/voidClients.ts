import { describe, expect, it } from 'vitest';
import { mockEmptyEndpoint, type EndpointRef, type ServiceName } from '../api';
import { itRejectsOnServerError } from './clients';

interface VoidClientCase {
  name: string;
  service: ServiceName;
  endpoint: EndpointRef;
  call: () => Promise<unknown>;
  /** Request body the client must send. */
  body?: unknown;
}

/** describeClients' companion for clients that resolve with nothing. */
export const describeVoidClients = (feature: string, cases: readonly VoidClientCase[]): void => {
  describe.each(cases)(`${feature} client: $name`, (client) => {
    it('sends the request and resolves with nothing', async () => {
      const mock = mockEmptyEndpoint(client.service, client.endpoint);

      await expect(client.call()).resolves.toBeUndefined();

      expect(mock.calls).toHaveLength(1);
      if (client.body !== undefined) expect(mock.calls[0].body).toEqual(client.body);
    });

    itRejectsOnServerError(client);
  });
};

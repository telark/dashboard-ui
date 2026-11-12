import { describe, expect, it, vi } from 'vitest';
import { HEADER_VALUES, HTTP_HEADERS } from '../../constants';
import logger from '../../logging';
import { mockEndpoint, mockNetworkError, type EndpointRef } from '../api';

interface SilentClientCase {
  name: string;
  endpoint: EndpointRef;
  call: () => Promise<unknown>;
}

/** Background reads of the exporter: a `silent` call says so and keeps its failure out of the log. */
export const describeSilentClients = (
  feature: string,
  cases: readonly SilentClientCase[],
): void => {
  describe.each(cases)(`${feature} client: $name (silent)`, ({ endpoint, call }) => {
    it('marks the request silent', async () => {
      const mock = mockEndpoint('exporter', endpoint, {});

      await call();

      expect(mock.calls[0].headers.get(HTTP_HEADERS.CUSTOM.SILENT_NETWORK)).toBe(
        HEADER_VALUES.SILENT_NETWORK,
      );
    });

    it('rejects without logging when the server is out of reach', async () => {
      mockNetworkError('exporter', endpoint);
      const logged = vi.spyOn(logger, 'error');

      await expect(call()).rejects.toThrow('Network Error');

      expect(logged).not.toHaveBeenCalled();
    });
  });
};

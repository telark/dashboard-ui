import { keepEventStream } from '../../../api/client/eventStream';
import { ANALYZER_API, Endpoints } from '../../../constants';
import type { InsightEvent } from '../models';

// Keeps the app's insights stream open until signal aborts; onConnected(true) follows every
// (re)connect, where the caller refetches what it missed.
export const keepInsightsStream = (
  apps: string[],
  onEvent: (e: InsightEvent) => void,
  onConnected: (connected: boolean) => void,
  signal: AbortSignal,
): Promise<void> => {
  const query = new URLSearchParams({ apps: apps.join(',') });
  return keepEventStream(
    `${ANALYZER_API.BASE_URL}/${Endpoints.INSIGHTS.EVENTS.path}?${query}`,
    {
      onEvent: (name, data) => onEvent({ name, data: JSON.parse(data) as unknown } as InsightEvent),
      onConnected,
    },
    signal,
  );
};

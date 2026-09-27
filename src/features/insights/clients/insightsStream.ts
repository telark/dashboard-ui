import { ANALYZER_API, Endpoints, HTTP_HEADERS } from '../../../constants';
import { getSessionToken } from '../../auth/utils';
import logger from '../../../logging';
import { INSIGHTS_ERROR_MESSAGES } from '../constants/errors';
import { SSE_BACKOFF_MS } from '../constants/insights';
import type { InsightEvent } from '../models';

const FIELD_EVENT = 'event:';
const FIELD_DATA = 'data:';

const dispatchBlock = (block: string, onEvent: (e: InsightEvent) => void): void => {
  let name = '';
  const data: string[] = [];
  for (const line of block.split('\n')) {
    if (line.startsWith(FIELD_EVENT)) name = line.slice(FIELD_EVENT.length).trim();
    else if (line.startsWith(FIELD_DATA)) data.push(line.slice(FIELD_DATA.length).trim());
  }
  if (!name || data.length === 0) return;
  onEvent({ name, data: JSON.parse(data.join('\n')) as unknown } as InsightEvent);
};

// fetch, not EventSource: the session token must travel in a header, never in the URL.
const openInsightsStream = async (
  apps: string[],
  onEvent: (e: InsightEvent) => void,
  signal: AbortSignal,
  onOpen?: () => void,
): Promise<void> => {
  const query = new URLSearchParams({ apps: apps.join(',') });
  const headers: Record<string, string> = {};
  const sessionToken = getSessionToken();
  if (sessionToken) headers[HTTP_HEADERS.CUSTOM.SESSION_TOKEN] = sessionToken;
  const res = await fetch(`${ANALYZER_API.BASE_URL}/${Endpoints.INSIGHTS.EVENTS.path}?${query}`, {
    headers,
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`${INSIGHTS_ERROR_MESSAGES.CLIENT.INSIGHTS_STREAM_FAILED}: ${res.status}`);
  }
  onOpen?.();
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
    let end = buffer.indexOf('\n\n');
    while (end !== -1) {
      dispatchBlock(buffer.slice(0, end), onEvent);
      buffer = buffer.slice(end + 2);
      end = buffer.indexOf('\n\n');
    }
  }
};

const sleep = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

// Keeps one stream open until signal aborts: reconnects with a doubling backoff
// and calls onOpen on every (re)connect, where the caller refetches what it missed.
export const keepInsightsStream = async (
  apps: string[],
  onEvent: (e: InsightEvent) => void,
  onConnected: (connected: boolean) => void,
  signal: AbortSignal,
): Promise<void> => {
  let backoff: number = SSE_BACKOFF_MS.min;
  while (!signal.aborted) {
    try {
      await openInsightsStream(apps, onEvent, signal, () => {
        backoff = SSE_BACKOFF_MS.min;
        onConnected(true);
      });
    } catch (error) {
      if (signal.aborted) return;
      logger.warn(INSIGHTS_ERROR_MESSAGES.CLIENT.INSIGHTS_STREAM_FAILED, error);
    }
    onConnected(false);
    await sleep(backoff, signal);
    backoff = Math.min(backoff * 2, SSE_BACKOFF_MS.max);
  }
};

import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SESSION_CHECK_EVENT,
  SSE_BACKOFF_JITTER,
  SSE_BACKOFF_MS,
  SSE_STABLE_MS,
  SSE_WATCHDOG_MS,
} from '../../constants';
import logger from '../../logging';

const FIELD_EVENT = 'event:';
const FIELD_DATA = 'data:';
const COMMENT_CONNECTED = ': connected';
const BLOCK_END = '\n\n';

// A retry can't fix these: the session is gone or refused, and the app's session check runs at once.
const FINAL_STATUSES: readonly number[] = [HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN];

export interface EventStreamHandlers {
  onEvent: (name: string, data: string) => void;
  onConnected: (connected: boolean) => void;
}

const dispatchBlock = (block: string, onEvent: EventStreamHandlers['onEvent']): void => {
  let name = '';
  const data: string[] = [];
  for (const line of block.split('\n')) {
    if (line.startsWith(FIELD_EVENT)) name = line.slice(FIELD_EVENT.length).trim();
    else if (line.startsWith(FIELD_DATA)) data.push(line.slice(FIELD_DATA.length).trim());
  }
  if (name && data.length > 0) onEvent(name, data.join('\n'));
};

// fetch rather than EventSource, for the watchdog and the refused status; the session cookie goes along. Resolves
// with the status of a refused open, or nothing once the stream ends; 35 s without a byte aborts it.
const openEventStream = async (
  url: string,
  onEvent: EventStreamHandlers['onEvent'],
  onOpen: () => void,
  signal: AbortSignal,
): Promise<number | undefined> => {
  const attempt = new AbortController();
  const abort = () => attempt.abort();
  signal.addEventListener('abort', abort, { once: true });
  let watchdog = setTimeout(abort, SSE_WATCHDOG_MS);
  try {
    const res = await fetch(url, { credentials: 'include', signal: attempt.signal });
    if (!res.ok || !res.body) return res.status;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return undefined;
      clearTimeout(watchdog);
      watchdog = setTimeout(abort, SSE_WATCHDOG_MS);
      // Normalized after appending, so a CRLF split across two chunks still joins.
      buffer = (buffer + decoder.decode(value, { stream: true })).replaceAll('\r\n', '\n');
      let end = buffer.indexOf(BLOCK_END);
      while (end !== -1) {
        const block = buffer.slice(0, end);
        if (block.startsWith(COMMENT_CONNECTED)) onOpen();
        else dispatchBlock(block, onEvent);
        buffer = buffer.slice(end + BLOCK_END.length);
        end = buffer.indexOf(BLOCK_END);
      }
    }
  } finally {
    clearTimeout(watchdog);
    signal.removeEventListener('abort', abort);
    // Closes the response however the attempt ended (a refused status, a throwing handler), so it
    // never counts against the server's per-user or the browser's per-origin limit beside the next one.
    attempt.abort();
  }
};

// One attempt: resolves with the status that refused it, or nothing once it ended or failed.
const attemptStream = async (
  url: string,
  onEvent: EventStreamHandlers['onEvent'],
  onOpen: () => void,
  signal: AbortSignal,
): Promise<number | undefined> => {
  try {
    const status = await openEventStream(url, onEvent, onOpen, signal);
    if (status !== undefined) logger.warn(ERROR_MESSAGES.API.EVENT_STREAM_FAILED, url, status);
    return status;
  } catch (error) {
    if (!signal.aborted) logger.warn(ERROR_MESSAGES.API.EVENT_STREAM_FAILED, url, error);
    return undefined;
  }
};

const sleep = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve) => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onAbort = (): void => {
      clearTimeout(timer);
      resolve();
    };
    timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal.addEventListener('abort', onAbort, { once: true });
  });

const jittered = (ms: number): number =>
  ms * (1 - SSE_BACKOFF_JITTER + Math.random() * 2 * SSE_BACKOFF_JITTER);

// Keeps one stream open until signal aborts, reconnecting with a jittered doubling backoff. It counts
// as connected only once the server's ": connected" arrives, where the caller refetches what it missed.
export const keepEventStream = async (
  url: string,
  { onEvent, onConnected }: EventStreamHandlers,
  signal: AbortSignal,
): Promise<void> => {
  let backoff: number = SSE_BACKOFF_MS.min;
  let openedAt: number | undefined;
  const onOpen = () => {
    openedAt = performance.now();
    onConnected(true);
  };
  while (!signal.aborted) {
    openedAt = undefined;
    const status = await attemptStream(url, onEvent, onOpen, signal);
    if (signal.aborted) return;
    onConnected(false);
    if (status !== undefined && FINAL_STATUSES.includes(status)) {
      globalThis.dispatchEvent(new Event(SESSION_CHECK_EVENT));
      return;
    }
    if (openedAt !== undefined && performance.now() - openedAt >= SSE_STABLE_MS) {
      backoff = SSE_BACKOFF_MS.min;
    }
    await sleep(jittered(backoff), signal);
    backoff = Math.min(backoff * 2, SSE_BACKOFF_MS.max);
  }
};

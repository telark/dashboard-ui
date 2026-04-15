import store from '../../../store';
import { RETRY_DEFAULTS, RETRY_STATUS } from './constants';
import {
  removeRetryState,
  RetryStateEntry,
  RetryStatus,
  upsertRetryState,
} from './store/retrySlice';

interface RetryExecutorConfig {
  key: string;
  execute: () => Promise<boolean>;
  isContextActive: () => boolean;
  maxAttempts?: number;
  backoffIntervalsMs?: readonly number[];
  onAttemptFailed?: (attempt: number, error: unknown, nextDelayMs: number) => void;
}

const nowMs = (): number => Date.now();

const getStateForKey = (key: string): RetryStateEntry | undefined => {
  return store.getState().retry.byKey[key];
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const pauseUntilContextIsActive = async (isContextActive: () => boolean): Promise<void> => {
  while (!isContextActive()) {
    await sleep(RETRY_DEFAULTS.PAUSE_CHECK_INTERVAL_MS);
  }
};

const waitUntilNextAttempt = async (
  entry: RetryStateEntry,
  isContextActive: () => boolean,
): Promise<void> => {
  while (entry.nextAttemptAt > nowMs()) {
    if (!isContextActive()) {
      await pauseUntilContextIsActive(isContextActive);
      continue;
    }
    const remaining = entry.nextAttemptAt - nowMs();
    await sleep(Math.min(remaining, RETRY_DEFAULTS.PAUSE_CHECK_INTERVAL_MS));
  }
};

const upsertState = (
  key: string,
  attempt: number,
  status: RetryStatus,
  nextDelayMs: number,
  lastAttemptAt: number,
) => {
  const nextAttemptAt = nextDelayMs > 0 ? lastAttemptAt + nextDelayMs : 0;
  store.dispatch(
    upsertRetryState({
      key,
      attempt,
      lastAttemptAt,
      nextAttemptAt,
      status,
    }),
  );
};

const notifyAttemptFailed = (
  onAttemptFailed: RetryExecutorConfig['onAttemptFailed'],
  attempt: number,
  error: unknown,
  nextDelayMs: number,
) => {
  if (!onAttemptFailed) return;
  try {
    onAttemptFailed(attempt, error, nextDelayMs);
  } catch {
    return;
  }
};

export const executeRetryWithBackoff = async ({
  key,
  execute,
  isContextActive,
  maxAttempts = RETRY_DEFAULTS.MAX_ATTEMPTS,
  backoffIntervalsMs = RETRY_DEFAULTS.BACKOFF_INTERVALS_MS,
  onAttemptFailed,
}: RetryExecutorConfig): Promise<boolean> => {
  const persisted = getStateForKey(key);
  let attempt = persisted?.attempt ?? 0;

  while (attempt < maxAttempts) {
    await pauseUntilContextIsActive(isContextActive);

    const persistedCurrent = getStateForKey(key);
    if (persistedCurrent && persistedCurrent.nextAttemptAt > nowMs()) {
      await waitUntilNextAttempt(persistedCurrent, isContextActive);
    }

    const lastAttemptAt = nowMs();
    const nextDelayMs =
      backoffIntervalsMs[Math.min(attempt, backoffIntervalsMs.length - 1)] ??
      backoffIntervalsMs[backoffIntervalsMs.length - 1];
    const attemptNumber = attempt + 1;

    upsertState(key, attemptNumber, RETRY_STATUS.RETRYING, nextDelayMs, lastAttemptAt);

    try {
      const success = await execute();
      if (success) {
        store.dispatch(removeRetryState(key));
        return true;
      }
      notifyAttemptFailed(
        onAttemptFailed,
        attemptNumber,
        new Error('retry attempt returned unsuccessful result'),
        nextDelayMs,
      );
    } catch (error) {
      notifyAttemptFailed(onAttemptFailed, attemptNumber, error, nextDelayMs);
    }

    attempt = attemptNumber;
    if (attempt >= maxAttempts) {
      store.dispatch(removeRetryState(key));
      return false;
    }
  }

  store.dispatch(removeRetryState(key));
  return false;
};

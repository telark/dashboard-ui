import store from '../../../../../store';
import { APPLICATIONS_SYNC_RETRY_INTERVAL_MS } from '../../constants';
import { retryFailedSyncApplication } from './sync';

const retryTimers = new Map<string, ReturnType<typeof setInterval>>();

function stopFailedSyncRetry(name: string): void {
  const timer = retryTimers.get(name);
  if (!timer) return;
  clearInterval(timer);
  retryTimers.delete(name);
}

function keepRetrying(name: string): boolean {
  const status = store.getState().applications.syncStatus?.[name];
  return status === 'failed';
}

function scheduleFailedSyncRetry(name: string): void {
  if (!name || retryTimers.has(name)) return;

  const timer = setInterval(() => {
    if (!keepRetrying(name)) {
      stopFailedSyncRetry(name);
      return;
    }
    void retryFailedSyncApplication(name);
  }, APPLICATIONS_SYNC_RETRY_INTERVAL_MS);

  retryTimers.set(name, timer);
  void retryFailedSyncApplication(name);
}

export function syncRetryFromState(): void {
  const syncStatus = store.getState().applications.syncStatus || {};
  for (const name of Object.keys(syncStatus)) {
    if (syncStatus[name] === 'failed') {
      scheduleFailedSyncRetry(name);
      continue;
    }
    stopFailedSyncRetry(name);
  }
}

export function stopAllSyncRetries(): void {
  for (const name of retryTimers.keys()) {
    stopFailedSyncRetry(name);
  }
}

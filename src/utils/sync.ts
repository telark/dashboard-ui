import { App as AntdApp } from 'antd';
import { triggerSingleGrouperSync } from '../clients/sync-manager';
import { SYNC_MESSAGES } from '../constants/modes';
import { GROUPER_CARD_TEXTS } from '../constants/cards';
import { SYNC_CONSTANTS } from '../constants/sync';
import store, { AppDispatch, RootState } from '../store';
import { fetchAllGroupersThunk } from '../store/slices/grouperSlice';
import { startSync, endSync } from '../store/slices/grouperSlice';

interface SyncGrouperParams {
  name: string;
  syncName?: string;
  message: ReturnType<typeof AntdApp.useApp>['message'];
  setSyncing: (syncing: boolean) => void;
}

/**
 * Handles the sync process for a grouper
 * @param params - The sync parameters
 */
export const syncGrouper = async ({
  name,
  syncName,
  message,
  setSyncing,
}: SyncGrouperParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = syncName || name;
    (store.dispatch as AppDispatch)(startSync(name));

    const key = `${SYNC_CONSTANTS.MESSAGE_KEY_PREFIX}${apiName}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${apiName}…`,
      key,
      duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleGrouperSync(apiName);
    const effect = res?.data?.syncEffect ?? SYNC_CONSTANTS.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      name,
      key,
      message,
    });
  } catch (err: any) {
    handleSyncError(err, message);
  } finally {
    setSyncing(false);
    (store.dispatch as AppDispatch)(endSync(name));
  }
};

/**
 * Handles the sync effect after a successful sync
 */
const handleSyncEffect = async ({
  effect,
  name,
  key,
  message,
}: {
  effect: string;
  name: string;
  key: string;
  message: ReturnType<typeof AntdApp.useApp>['message'];
}): Promise<void> => {
  // If the item should disappear, keep loading toast and poll until state updates
  if (SYNC_CONSTANTS.POLLING_EFFECTS.includes(effect as 'Deleted' | 'NotFound')) {
    // Kick a refresh immediately
    (store.dispatch as AppDispatch)(fetchAllGroupersThunk());

    // Poll local state briefly until this card is gone, then show success
    const start = Date.now();
    const waitMs = SYNC_CONSTANTS.POLLING.MAX_WAIT_MS;

    const interval = setInterval(() => {
      const state: RootState = store.getState();
      const stillThere = state.grouper.groupers.some((g: any) => g.name === name);

      if (!stillThere || Date.now() - start > waitMs) {
        clearInterval(interval);
        const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
        message.open({
          type: 'success',
          content: friendly,
          key,
          duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.SUCCESS,
        });
      }
    }, SYNC_CONSTANTS.POLLING.INTERVAL_MS);
  } else {
    const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
    message.open({
      type: 'success',
      content: friendly,
      key,
      duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.SUCCESS,
    });
  }
};

/**
 * Handles sync errors and displays appropriate messages
 */
const handleSyncError = (err: any, message: ReturnType<typeof AntdApp.useApp>['message']): void => {
  const meta = err?.normalized as { isTimeout?: boolean } | undefined;
  const phase = err?.response?.data?.data?.phase as string | undefined;
  const effect = err?.response?.data?.data?.syncEffect as string | undefined;
  const friendlyTimeout = GROUPER_CARD_TEXTS.SYNC.TIMEOUT_MESSAGE;

  const friendly = meta?.isTimeout
    ? friendlyTimeout
    : (phase && SYNC_MESSAGES.byPhase[phase]) ||
      (effect && SYNC_MESSAGES.byEffect[effect!]) ||
      SYNC_MESSAGES.byPhase.Failed;

  message.open({
    type: 'error',
    content: friendly,
    key: SYNC_CONSTANTS.ERROR_KEY,
    duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.ERROR,
  });
};

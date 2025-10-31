import { App as AntdApp } from 'antd';
import { triggerSingleGrouperSync } from '../../clients/sync-manager';
import { SYNC_MESSAGES } from '../../constants/modes';
import { GROUPER_DETAILS_CONSTANTS } from '../../constants/pages/grouper-details';
import { SYNC_CONSTANTS } from '../../constants/sync';
import { GROUPER_CARD_TEXTS } from '../../constants/cards';
import store, { AppDispatch, RootState } from '../../store';
import { fetchAllGroupersThunk, fetchGrouperDetailsThunk } from '../../store/slices/grouperSlice';
import { startSync, endSync } from '../../store/slices/grouperSlice';

interface GrouperDetailsSyncParams {
  grouperDetails: any;
  setSyncing: (syncing: boolean) => void;
  message: ReturnType<typeof AntdApp.useApp>['message'];
}

interface SyncGrouperParams {
  name: string;
  syncName?: string;
  message: ReturnType<typeof AntdApp.useApp>['message'];
  setSyncing: (syncing: boolean) => void;
}

export const syncGrouperDetails = async ({
  grouperDetails,
  setSyncing,
  message,
}: GrouperDetailsSyncParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = grouperDetails?.syncName || grouperDetails.name;
    (store.dispatch as AppDispatch)(startSync(grouperDetails.name));

    const key = `${GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_KEY_PREFIX}${apiName}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${apiName}…`,
      key,
      duration: GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleGrouperSync(apiName);
    const effect = res?.data?.syncEffect ?? GROUPER_DETAILS_CONSTANTS.SYNC.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      grouperDetails,
      key,
      message,
    });
  } catch (err: any) {
    handleSyncError(err, message, true);
  } finally {
    setSyncing(false);
    (store.dispatch as AppDispatch)(endSync(grouperDetails.name));
  }
};

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
    handleSyncError(err, message, false);
  } finally {
    setSyncing(false);
    (store.dispatch as AppDispatch)(endSync(name));
  }
};

const handleSyncEffect = async ({
  effect,
  grouperDetails,
  name,
  key,
  message,
}: {
  effect: string;
  grouperDetails?: any;
  name?: string;
  key: string;
  message: ReturnType<typeof AntdApp.useApp>['message'];
}): Promise<void> => {
  const grouperName = grouperDetails?.name || name;
  const isDetailsSync = !!grouperDetails;
  
  const pollingEffects = isDetailsSync 
    ? GROUPER_DETAILS_CONSTANTS.SYNC.POLLING_EFFECTS 
    : SYNC_CONSTANTS.POLLING_EFFECTS;
  
  if (pollingEffects.includes(effect as 'Deleted' | 'NotFound')) {
    (store.dispatch as AppDispatch)(fetchAllGroupersThunk());

    const start = Date.now();
    const waitMs = isDetailsSync 
      ? GROUPER_DETAILS_CONSTANTS.SYNC.POLLING.MAX_WAIT_MS
      : SYNC_CONSTANTS.POLLING.MAX_WAIT_MS;

    const interval = setInterval(() => {
      const state: RootState = store.getState();
      const stillThere = state.grouper.groupers.some((g: any) => g.name === grouperName);

      if (!stillThere || Date.now() - start > waitMs) {
        clearInterval(interval);
        const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
        const duration = isDetailsSync 
          ? GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.SUCCESS
          : SYNC_CONSTANTS.MESSAGE_DURATIONS.SUCCESS;
        message.open({
          type: 'success',
          content: friendly,
          key,
          duration,
        });
      }
    }, isDetailsSync 
      ? GROUPER_DETAILS_CONSTANTS.SYNC.POLLING.INTERVAL_MS
      : SYNC_CONSTANTS.POLLING.INTERVAL_MS);
  } else {
    // Refresh data for Changed, NewlyCreated, and NoUpdate effects
    // This will update both details (if in details view) and the grouper in the list (if in card view)
    if (grouperName) {
      await (store.dispatch as AppDispatch)(fetchGrouperDetailsThunk(grouperName));
    }

    const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
    const duration = isDetailsSync 
      ? GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.SUCCESS
      : SYNC_CONSTANTS.MESSAGE_DURATIONS.SUCCESS;
    message.open({
      type: 'success',
      content: friendly,
      key,
      duration,
    });
  }
};

const handleSyncError = (err: any, message: ReturnType<typeof AntdApp.useApp>['message'], isDetailsSync: boolean = true): void => {
  const meta = err?.normalized as { isTimeout?: boolean } | undefined;
  const phase = err?.response?.data?.data?.phase as string | undefined;
  const effect = err?.response?.data?.data?.syncEffect as string | undefined;
  const friendlyTimeout = isDetailsSync 
    ? GROUPER_DETAILS_CONSTANTS.SYNC.TIMEOUT_MESSAGE
    : GROUPER_CARD_TEXTS.SYNC.TIMEOUT_MESSAGE;

  const friendly = meta?.isTimeout
    ? friendlyTimeout
    : (phase && SYNC_MESSAGES.byPhase[phase]) ||
      (effect && SYNC_MESSAGES.byEffect[effect!]) ||
      SYNC_MESSAGES.byPhase.Failed;

  const errorKey = isDetailsSync 
    ? GROUPER_DETAILS_CONSTANTS.SYNC.ERROR_KEY
    : SYNC_CONSTANTS.ERROR_KEY;
  const duration = isDetailsSync 
    ? GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.ERROR
    : SYNC_CONSTANTS.MESSAGE_DURATIONS.ERROR;

  message.open({
    type: 'error',
    content: friendly,
    key: errorKey,
    duration,
  });
};

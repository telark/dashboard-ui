import { App as AntdApp } from 'antd';
import { triggerSingleBridgeSync } from '../../clients/sync-manager';
import { SYNC_MESSAGES } from '../../constants/modes';
import { BRIDGE_DETAILS_CONSTANTS } from '../../constants/pages/bridge-details';
import { SYNC_CONSTANTS } from '../../constants/sync';
import { BRIDGE_CARD_TEXTS } from '../../constants/cards';
import store, { AppDispatch, RootState } from '../../store';
import {
  fetchAllBridgesThunk,
  fetchBridgeDetailsThunk,
} from '../../store/bridges/slices/bridgeSlice';
import { startSync, endSync } from '../../store/bridges/slices/bridgeSlice';

interface BridgeDetailsSyncParams {
  bridgeDetails: any;
  setSyncing: (syncing: boolean) => void;
  message: ReturnType<typeof AntdApp.useApp>['message'];
}

interface SyncBridgeParams {
  name: string;
  syncName?: string;
  message: ReturnType<typeof AntdApp.useApp>['message'];
  setSyncing: (syncing: boolean) => void;
}

export const syncBridgeDetails = async ({
  bridgeDetails,
  setSyncing,
  message,
}: BridgeDetailsSyncParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = bridgeDetails?.syncName || bridgeDetails.name;
    (store.dispatch as AppDispatch)(startSync(bridgeDetails.name));

    const key = `${BRIDGE_DETAILS_CONSTANTS.SYNC.MESSAGE_KEY_PREFIX}${apiName}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${apiName}…`,
      key,
      duration: BRIDGE_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleBridgeSync(apiName);
    const effect = res?.data?.syncEffect ?? BRIDGE_DETAILS_CONSTANTS.SYNC.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      bridgeDetails,
      key,
      message,
    });
  } catch (err: any) {
    handleSyncError(err, message, true);
  } finally {
    setSyncing(false);
    (store.dispatch as AppDispatch)(endSync(bridgeDetails.name));
  }
};

export const syncBridge = async ({
  name,
  syncName,
  message,
  setSyncing,
}: SyncBridgeParams): Promise<void> => {
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

    const res = await triggerSingleBridgeSync(apiName);
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
  bridgeDetails,
  name,
  key,
  message,
}: {
  effect: string;
  bridgeDetails?: any;
  name?: string;
  key: string;
  message: ReturnType<typeof AntdApp.useApp>['message'];
}): Promise<void> => {
  const bridgeName = bridgeDetails?.name || name;
  const isDetailsSync = !!bridgeDetails;

  const pollingEffects = isDetailsSync
    ? BRIDGE_DETAILS_CONSTANTS.SYNC.POLLING_EFFECTS
    : SYNC_CONSTANTS.POLLING_EFFECTS;

  if (pollingEffects.includes(effect as 'Deleted' | 'NotFound')) {
    (store.dispatch as AppDispatch)(fetchAllBridgesThunk());

    const start = Date.now();
    const waitMs = isDetailsSync
      ? BRIDGE_DETAILS_CONSTANTS.SYNC.POLLING.MAX_WAIT_MS
      : SYNC_CONSTANTS.POLLING.MAX_WAIT_MS;

    const interval = setInterval(
      () => {
        const state: RootState = store.getState();
        const stillThere = state.bridge.bridges.some((b: any) => b.name === bridgeName);

        if (!stillThere || Date.now() - start > waitMs) {
          clearInterval(interval);
          const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
          const duration = isDetailsSync
            ? BRIDGE_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.SUCCESS
            : SYNC_CONSTANTS.MESSAGE_DURATIONS.SUCCESS;
          message.open({
            type: 'success',
            content: friendly,
            key,
            duration,
          });
        }
      },
      isDetailsSync
        ? BRIDGE_DETAILS_CONSTANTS.SYNC.POLLING.INTERVAL_MS
        : SYNC_CONSTANTS.POLLING.INTERVAL_MS,
    );
  } else {
    // Refresh data for Changed, NewlyCreated, and NoUpdate effects
    if (bridgeName) {
      await (store.dispatch as AppDispatch)(fetchBridgeDetailsThunk(bridgeName));
    }

    const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
    const duration = isDetailsSync
      ? BRIDGE_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.SUCCESS
      : SYNC_CONSTANTS.MESSAGE_DURATIONS.SUCCESS;
    message.open({
      type: 'success',
      content: friendly,
      key,
      duration,
    });
  }
};

const handleSyncError = (
  err: any,
  message: ReturnType<typeof AntdApp.useApp>['message'],
  isDetailsSync: boolean = true,
): void => {
  const meta = err?.normalized as { isTimeout?: boolean } | undefined;
  const phase = err?.response?.data?.data?.phase as string | undefined;
  const effect = err?.response?.data?.data?.syncEffect as string | undefined;
  const friendlyTimeout = isDetailsSync
    ? BRIDGE_DETAILS_CONSTANTS.SYNC.TIMEOUT_MESSAGE
    : BRIDGE_CARD_TEXTS.SYNC.TIMEOUT_MESSAGE;

  const friendly = meta?.isTimeout
    ? friendlyTimeout
    : (phase && SYNC_MESSAGES.byPhase[phase]) ||
      (effect && SYNC_MESSAGES.byEffect[effect!]) ||
      SYNC_MESSAGES.byPhase.Failed;

  const errorKey = isDetailsSync
    ? BRIDGE_DETAILS_CONSTANTS.SYNC.ERROR_KEY
    : SYNC_CONSTANTS.ERROR_KEY;
  const duration = isDetailsSync
    ? BRIDGE_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.ERROR
    : SYNC_CONSTANTS.MESSAGE_DURATIONS.ERROR;

  message.open({
    type: 'error',
    content: friendly,
    key: errorKey,
    duration,
  });
};


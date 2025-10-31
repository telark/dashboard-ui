import { App as AntdApp } from 'antd';
import { triggerSingleAppSync } from '../../clients/sync-manager';
import { SYNC_MESSAGES } from '../../constants/modes';
import { SYNC_CONSTANTS } from '../../constants/sync';
import store, { AppDispatch, RootState } from '../../store';
import { fetchAllAppsWorkloadsThunk, fetchAppWorkloadDetailsThunk } from '../../store/slices/workloadSlice';
import { startSync, endSync } from '../../store/slices/workloadSlice';

interface AppWorkloadDetailsSyncParams {
  workloadDetails: any;
  setSyncing: (syncing: boolean) => void;
  message: ReturnType<typeof AntdApp.useApp>['message'];
}

interface SyncAppWorkloadParams {
  name: string;
  syncName?: string;
  message: ReturnType<typeof AntdApp.useApp>['message'];
  setSyncing: (syncing: boolean) => void;
}

export const syncAppWorkloadDetails = async ({
  workloadDetails,
  setSyncing,
  message,
}: AppWorkloadDetailsSyncParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = workloadDetails?.fasid?.name || workloadDetails?.name;
    if (!apiName) {
      throw new Error('Workload name is required');
    }
    (store.dispatch as AppDispatch)(startSync(apiName));

    const key = `sync-app-${apiName}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${apiName}…`,
      key,
      duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleAppSync(apiName);
    const effect = res?.data?.syncEffect ?? SYNC_CONSTANTS.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      workloadDetails,
      key,
      message,
    });
  } catch (err: any) {
    handleSyncError(err, message, true);
  } finally {
    const apiName = workloadDetails?.fasid?.name || workloadDetails?.name;
    if (apiName) {
      setSyncing(false);
      (store.dispatch as AppDispatch)(endSync(apiName));
    }
  }
};

export const syncAppWorkload = async ({
  name,
  message,
  setSyncing,
}: SyncAppWorkloadParams): Promise<void> => {
  try {
    setSyncing(true);
    (store.dispatch as AppDispatch)(startSync(name));

    const key = `${SYNC_CONSTANTS.MESSAGE_KEY_PREFIX}${name}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${name}…`,
      key,
      duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleAppSync(name);
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
  workloadDetails,
  name,
  key,
  message,
}: {
  effect: string;
  workloadDetails?: any;
  name?: string;
  key: string;
  message: ReturnType<typeof AntdApp.useApp>['message'];
}): Promise<void> => {
  const workloadName = workloadDetails?.fasid?.name || workloadDetails?.name || name;
  const isDetailsSync = !!workloadDetails;
  
  const pollingEffects = SYNC_CONSTANTS.POLLING_EFFECTS;
  
  if (pollingEffects.includes(effect as 'Deleted' | 'NotFound')) {
    (store.dispatch as AppDispatch)(fetchAllAppsWorkloadsThunk());

    const start = Date.now();
    const waitMs = SYNC_CONSTANTS.POLLING.MAX_WAIT_MS;

    const interval = setInterval(() => {
      const state: RootState = store.getState();
      const stillThere = state.workload.apps.some((app: any) => app.name === workloadName);

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
    // Refresh data for Changed, NewlyCreated, and NoUpdate effects
    // This will update both details (if in details view) and the workload in the list (if in card view)
    if (workloadName) {
      await (store.dispatch as AppDispatch)(fetchAppWorkloadDetailsThunk(workloadName));
    }

    const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
    const duration = SYNC_CONSTANTS.MESSAGE_DURATIONS.SUCCESS;
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
  const friendlyTimeout = 'Taking a bit longer than usual. Please try again in a moment.';

  const friendly = meta?.isTimeout
    ? friendlyTimeout
    : (phase && SYNC_MESSAGES.byPhase[phase]) ||
      (effect && SYNC_MESSAGES.byEffect[effect!]) ||
      SYNC_MESSAGES.byPhase.Failed;

  const errorKey = SYNC_CONSTANTS.ERROR_KEY;
  const duration = SYNC_CONSTANTS.MESSAGE_DURATIONS.ERROR;

  message.open({
    type: 'error',
    content: friendly,
    key: errorKey,
    duration,
  });
};


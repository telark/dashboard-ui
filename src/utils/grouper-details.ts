import { App as AntdApp } from 'antd';
import { triggerSingleGrouperSync } from '../clients/sync-manager';
import { SYNC_MESSAGES } from '../constants/modes';
import { GROUPER_DETAILS_CONSTANTS } from '../constants/pages/grouper-details';
import store, { AppDispatch, RootState } from '../store';
import { fetchAllGroupersThunk } from '../store/slices/grouperSlice';
import { startSync, endSync } from '../store/slices/grouperSlice';

interface GrouperDetailsSyncParams {
  grouperDetails: any;
  setSyncing: (syncing: boolean) => void;
  message: ReturnType<typeof AntdApp.useApp>['message'];
}

/**
 * Handles the sync process for a grouper details page
 */
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
    handleSyncError(err, message);
  } finally {
    setSyncing(false);
    (store.dispatch as AppDispatch)(endSync(grouperDetails.name));
  }
};

/**
 * Handles the sync effect after a successful sync
 */
const handleSyncEffect = async ({
  effect,
  grouperDetails,
  key,
  message,
}: {
  effect: string;
  grouperDetails: any;
  key: string;
  message: ReturnType<typeof AntdApp.useApp>['message'];
}): Promise<void> => {
  if (GROUPER_DETAILS_CONSTANTS.SYNC.POLLING_EFFECTS.includes(effect as 'Deleted' | 'NotFound')) {
    (store.dispatch as AppDispatch)(fetchAllGroupersThunk());
    
    const start = Date.now();
    const waitMs = GROUPER_DETAILS_CONSTANTS.SYNC.POLLING.MAX_WAIT_MS;
    
    const interval = setInterval(() => {
      const state: RootState = store.getState();
      const stillThere = state.grouper.groupers.some(
        (g: any) => g.name === grouperDetails.name,
      );
      
      if (!stillThere || Date.now() - start > waitMs) {
        clearInterval(interval);
        const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
        message.open({ 
          type: 'success', 
          content: friendly, 
          key, 
          duration: GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.SUCCESS 
        });
      }
    }, GROUPER_DETAILS_CONSTANTS.SYNC.POLLING.INTERVAL_MS);
  } else {
    const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
    message.open({ 
      type: 'success', 
      content: friendly, 
      key, 
      duration: GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.SUCCESS 
    });
  }
};

/**
 * Handles sync errors and displays appropriate messages
 */
const handleSyncError = (
  err: any,
  message: ReturnType<typeof AntdApp.useApp>['message']
): void => {
  const meta = err?.normalized as { isTimeout?: boolean } | undefined;
  const phase = err?.response?.data?.data?.phase as string | undefined;
  const effect = err?.response?.data?.data?.syncEffect as string | undefined;
  const friendlyTimeout = GROUPER_DETAILS_CONSTANTS.SYNC.TIMEOUT_MESSAGE;
  
  const friendly = meta?.isTimeout
    ? friendlyTimeout
    : (phase && SYNC_MESSAGES.byPhase[phase]) ||
      (effect && SYNC_MESSAGES.byEffect[effect!]) ||
      SYNC_MESSAGES.byPhase.Failed;
      
  message.open({ 
    type: 'error', 
    content: friendly, 
    key: GROUPER_DETAILS_CONSTANTS.SYNC.ERROR_KEY, 
    duration: GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.ERROR 
  });
};

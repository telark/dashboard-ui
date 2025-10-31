import { SYNC_MESSAGES } from '../../constants/modes';
import store, { AppDispatch, RootState } from '../../store';
import { HandleSyncEffectParams, HandleSyncErrorParams, SyncConfig } from '../../interfaces/sync';

const getPollingEffects = (config: SyncConfig, isDetailsSync: boolean): readonly string[] => {
  return isDetailsSync
    ? config.detailsConstants?.SYNC.POLLING_EFFECTS || config.cardConstants.POLLING_EFFECTS
    : config.cardConstants.POLLING_EFFECTS;
};

const getPollingInterval = (config: SyncConfig, isDetailsSync: boolean): number => {
  return isDetailsSync
    ? config.detailsConstants?.SYNC.POLLING.INTERVAL_MS || config.cardConstants.POLLING.INTERVAL_MS
    : config.cardConstants.POLLING.INTERVAL_MS;
};

const getPollingMaxWait = (config: SyncConfig, isDetailsSync: boolean): number => {
  return isDetailsSync
    ? config.detailsConstants?.SYNC.POLLING.MAX_WAIT_MS || config.cardConstants.POLLING.MAX_WAIT_MS
    : config.cardConstants.POLLING.MAX_WAIT_MS;
};

const getSuccessDuration = (config: SyncConfig, isDetailsSync: boolean): number => {
  return isDetailsSync
    ? config.detailsConstants?.SYNC.MESSAGE_DURATIONS.SUCCESS ||
        config.cardConstants.MESSAGE_DURATIONS.SUCCESS
    : config.cardConstants.MESSAGE_DURATIONS.SUCCESS;
};

const getMessageForEffect = (effect: string): string => {
  return SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
};

const isResourceStillPresent = (
  resourceName: string,
  resourceList: any[],
  getNameFromResource: (resource: any) => string,
): boolean => {
  return resourceList.some((resource: any) => getNameFromResource(resource) === resourceName);
};

// Handle polling for deletion effects (Deleted, NotFound)
const handleDeletionPolling = (
  resourceName: string,
  effect: string,
  key: string,
  config: SyncConfig,
  isDetailsSync: boolean,
  message: HandleSyncEffectParams['message'],
): void => {
  (store.dispatch as AppDispatch)(config.fetchAllResourcesThunk());

  const start = Date.now();
  const waitMs = getPollingMaxWait(config, isDetailsSync);
  const intervalMs = getPollingInterval(config, isDetailsSync);
  const duration = getSuccessDuration(config, isDetailsSync);
  const friendlyMessage = getMessageForEffect(effect);

  const interval = setInterval(() => {
    const state: RootState = store.getState();
    const resourceList = config.getResourceList(state);
    const stillThere = isResourceStillPresent(
      resourceName,
      resourceList,
      config.getNameFromResource,
    );

    if (!stillThere || Date.now() - start > waitMs) {
      clearInterval(interval);
      message.open({
        type: 'success',
        content: friendlyMessage,
        key,
        duration,
      });
    }
  }, intervalMs);
};

// Handle refresh for non-deletion effects (Changed, NewlyCreated, NoUpdate)
const handleRefreshEffect = async (
  resourceName: string | undefined,
  effect: string,
  key: string,
  config: SyncConfig,
  isDetailsSync: boolean,
  message: HandleSyncEffectParams['message'],
): Promise<void> => {
  if (resourceName) {
    await (store.dispatch as AppDispatch)(config.fetchResourceDetailsThunk(resourceName));
  }

  const duration = getSuccessDuration(config, isDetailsSync);
  const friendlyMessage = getMessageForEffect(effect);

  message.open({
    type: 'success',
    content: friendlyMessage,
    key,
    duration,
  });
};

// Main handler - orchestrates the sync effect logic
export const handleSyncEffect = async ({
  effect,
  resourceDetails,
  name,
  key,
  message,
  config,
}: HandleSyncEffectParams): Promise<void> => {
  const resourceName = config.getNameFromResource(resourceDetails) || name || '';
  const isDetailsSync = !!resourceDetails;
  const pollingEffects = getPollingEffects(config, isDetailsSync);

  if (pollingEffects.includes(effect)) {
    if (!resourceName) {
      // If no resource name, fall back to refresh logic
      await handleRefreshEffect(undefined, effect, key, config, isDetailsSync, message);
      return;
    }
    handleDeletionPolling(resourceName, effect, key, config, isDetailsSync, message);
  } else {
    await handleRefreshEffect(
      resourceName || undefined,
      effect,
      key,
      config,
      isDetailsSync,
      message,
    );
  }
};

// Helper functions for error handling
const getTimeoutMessage = (config: SyncConfig, isDetailsSync: boolean): string => {
  return isDetailsSync
    ? config.detailsConstants?.SYNC.TIMEOUT_MESSAGE || config.cardTimeoutMessage
    : config.cardTimeoutMessage;
};

const getErrorKey = (config: SyncConfig, isDetailsSync: boolean): string => {
  return isDetailsSync
    ? config.detailsConstants?.SYNC.ERROR_KEY || config.cardConstants.ERROR_KEY
    : config.cardConstants.ERROR_KEY;
};

const getErrorDuration = (config: SyncConfig, isDetailsSync: boolean): number => {
  return isDetailsSync
    ? config.detailsConstants?.SYNC.MESSAGE_DURATIONS.ERROR ||
        config.cardConstants.MESSAGE_DURATIONS.ERROR
    : config.cardConstants.MESSAGE_DURATIONS.ERROR;
};

const getErrorMessage = (err: any, config: SyncConfig, isDetailsSync: boolean): string => {
  const meta = err?.normalized as { isTimeout?: boolean } | undefined;
  const phase = err?.response?.data?.data?.phase as string | undefined;
  const effect = err?.response?.data?.data?.syncEffect as string | undefined;

  if (meta?.isTimeout) {
    return getTimeoutMessage(config, isDetailsSync);
  }

  if (phase && SYNC_MESSAGES.byPhase[phase]) {
    return SYNC_MESSAGES.byPhase[phase];
  }

  if (effect && SYNC_MESSAGES.byEffect[effect]) {
    return SYNC_MESSAGES.byEffect[effect];
  }

  return SYNC_MESSAGES.byPhase.Failed;
};

export const handleSyncError = ({
  err,
  message,
  isDetailsSync,
  config,
}: HandleSyncErrorParams): void => {
  const friendly = getErrorMessage(err, config, isDetailsSync);
  const errorKey = getErrorKey(config, isDetailsSync);
  const duration = getErrorDuration(config, isDetailsSync);

  message.open({
    type: 'error',
    content: friendly,
    key: errorKey,
    duration,
  });
};
